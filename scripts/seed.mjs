#!/usr/bin/env node
// Ingests content/day-XX.json into SQLite via Prisma (idempotent, deterministic IDs).
// Run validation first: npm run content:validate
// Usage: node scripts/seed.mjs [--hard]   (--hard wipes content + user data, dev only)
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const prisma = new PrismaClient();

const hard = process.argv.includes("--hard");
const plan = JSON.parse(readFileSync(join(contentDir, "curriculum-plan.json"), "utf8"));
const planByDay = new Map(plan.days.map((d) => [d.day, d]));

const files = readdirSync(contentDir).filter((f) => /^day-\d{2}\.json$/.test(f)).sort();
console.log(`Found ${files.length} detailed day file(s) to seed.`);

function vocabId(headword) {
  return "w_" + String(headword).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function j(x) { return JSON.stringify(x ?? []); }
function escRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Load all days in ascending order (needed for reinforcement matching against earlier days).
const days = files.map((f) => JSON.parse(readFileSync(join(contentDir, f), "utf8")));
days.sort((a, b) => a.day - b.day);

if (hard) {
  console.log("Hard reset: deleting all user and content data...");
  await prisma.vocabularyHistory.deleteMany();
  await prisma.userVocabulary.deleteMany();
  await prisma.dayProgress.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.conversationVocabulary.deleteMany();
  await prisma.paragraphVocabulary.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.paragraph.deleteMany();
  await prisma.grammarLesson.deleteMany();
  await prisma.vocabularyItem.deleteMany();
  await prisma.day.deleteMany();
}

const globalVocab = new Map(); // headword(lower) -> { id, day }
let vocabCount = 0, convCount = 0, paraCount = 0, linkCount = 0, reinforceCount = 0;

console.log("Upserting all 90 curriculum days...");
for (const p of plan.days) {
  await prisma.day.upsert({
    where: { dayNumber: p.day },
    update: {
      title: p.title,
      topic: p.topic,
      description: p.description,
      stage: p.stage,
      focus: `Master vocabulary, grammar, and expressions for "${p.topic}".`,
    },
    create: {
      dayNumber: p.day,
      title: p.title,
      topic: p.topic,
      description: p.description,
      stage: p.stage,
      focus: `Master vocabulary, grammar, and expressions for "${p.topic}".`,
    },
  });
}

console.log(`Ingesting ${days.length} detailed day(s)...`);
for (const data of days) {
  const day = data.day;
  const p = planByDay.get(day);
  if (!p) { console.error(`FATAL: day ${day} missing from curriculum-plan.json`); process.exit(1); }

  await prisma.day.upsert({
    where: { dayNumber: day },
    update: { title: data.title, topic: data.topic, description: data.description, stage: data.stage, focus: data.focus },
    create: { dayNumber: day, title: data.title, topic: data.topic, description: data.description, stage: data.stage, focus: data.focus },
  });

  // ---- vocabulary (exactly 50, deterministic ids) ----
  let order = 0;
  for (const v of data.vocabulary) {
    order += 1;
    const id = vocabId(v.headword);
    const payload = {
      headword: v.headword,
      pronunciation: v.pronunciation ?? null,
      partOfSpeech: v.partOfSpeech ?? null,
      definition: v.definition,
      example: v.example,
      verbForms: v.verbForms ? JSON.stringify(v.verbForms) : null,
      relatedForms: j(v.relatedForms),
      collocations: j(v.collocations),
      synonyms: j(v.synonyms),
      antonyms: j(v.antonyms),
      tags: j(v.tags),
      dayNumber: day,
      order,
    };
    await prisma.vocabularyItem.upsert({ where: { id }, update: payload, create: { id, ...payload } });
    globalVocab.set(v.headword.trim().toLowerCase(), { id, day });
    vocabCount++;
  }

  // ---- grammar ----
  let gOrder = 0;
  for (const g of data.grammar) {
    gOrder += 1;
    const id = `g_d${day}_${gOrder}`;
    const payload = {
      dayNumber: day, order: gOrder, title: g.title, explanation: g.explanation,
      structures: j(g.structures), examples: j(g.examples),
      commonUsage: j(g.commonUsage), commonMistakes: j(g.commonMistakes),
    };
    await prisma.grammarLesson.upsert({ where: { id }, update: payload, create: { id, ...payload } });
  }

  // ---- conversations ----
  // candidate headwords from earlier days for reinforcement matching
  const earlier = [...globalVocab.entries()].filter(([, v]) => v.day < day);
  function findReinforcement(text) {
    const lower = " " + text.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ") + " ";
    const found = [];
    for (const [hw, meta] of earlier) {
      if (!lower.includes(hw)) continue;
      const re = new RegExp(`(?<![a-z0-9])${escRegex(hw)}(?![a-z0-9])`);
      if (re.test(lower)) found.push(meta);
    }
    return found;
  }

  let cOrder = 0;
  for (const c of data.conversations) {
    cOrder += 1;
    const id = `c_d${day}_${cOrder}`;
    const text = c.lines.map((l) => l.text).join(" ");
    const payload = { dayNumber: day, order: cOrder, title: c.title, setting: c.setting, lines: j(c.lines) };
    const conv = await prisma.conversation.upsert({ where: { id }, update: payload, create: { id, ...payload } });
    convCount++;

    const linkPairs = new Map();
    for (const w of c.vocabularyUsed ?? []) {
      const meta = globalVocab.get(w.trim().toLowerCase());
      if (!meta) { console.error(`FATAL: day ${day} conversation "${c.title}" references unknown word "${w}"`); process.exit(1); }
      linkPairs.set(meta.id, false);
    }
    for (const meta of findReinforcement(text)) linkPairs.set(meta.id, true);
    await prisma.conversationVocabulary.deleteMany({ where: { conversationId: conv.id } });
    for (const [vocabularyId, isReinforcement] of linkPairs) {
      await prisma.conversationVocabulary.create({ data: { conversationId: conv.id, vocabularyId, isReinforcement } });
      linkCount++; if (isReinforcement) reinforceCount++;
    }
  }

  // ---- paragraphs ----
  let pOrder = 0;
  for (const pa of data.paragraphs) {
    pOrder += 1;
    const id = `p_d${day}_${pOrder}`;
    const payload = { dayNumber: day, order: pOrder, title: pa.title, kind: pa.kind ?? "reading", text: pa.text };
    const para = await prisma.paragraph.upsert({ where: { id }, update: payload, create: { id, ...payload } });
    paraCount++;

    const linkPairs = new Map();
    for (const w of pa.vocabularyUsed ?? []) {
      const meta = globalVocab.get(w.trim().toLowerCase());
      if (!meta) { console.error(`FATAL: day ${day} paragraph "${pa.title}" references unknown word "${w}"`); process.exit(1); }
      linkPairs.set(meta.id, false);
    }
    for (const meta of findReinforcement(pa.text)) linkPairs.set(meta.id, true);
    await prisma.paragraphVocabulary.deleteMany({ where: { paragraphId: para.id } });
    for (const [vocabularyId, isReinforcement] of linkPairs) {
      await prisma.paragraphVocabulary.create({ data: { paragraphId: para.id, vocabularyId, isReinforcement } });
      linkCount++; if (isReinforcement) reinforceCount++;
    }
  }
  process.stdout.write(`  day ${day}: ok\n`);
}

console.log(`\nSeed complete: ${vocabCount} vocabulary items, ${convCount} conversations, ${paraCount} paragraphs, ${linkCount} vocabulary links (${reinforceCount} reinforcement links).`);
await prisma.$disconnect();
