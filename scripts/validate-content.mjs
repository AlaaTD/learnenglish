#!/usr/bin/env node
// Validates content/day-XX.json files against content/FORMAT.md hard rules.
// Usage: node scripts/validate-content.mjs [--days 2-10] [--json]
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");

const args = process.argv.slice(2);
const daysArgIdx = args.indexOf("--days");
const jsonOut = args.includes("--json");
let dayFilter = null;
if (daysArgIdx !== -1 && args[daysArgIdx + 1]) {
  const [a, b] = args[daysArgIdx + 1].split("-");
  dayFilter = [parseInt(a, 10), parseInt(b ?? a, 10)];
}

const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const problems = [];
const warnings = [];

function err(day, rule, message) {
  problems.push({ day, rule, message });
}
function warn(day, rule, message) {
  warnings.push({ day, rule, message });
}

function isStr(x) { return typeof x === "string" && x.trim().length > 0; }
function isStrArr(x) { return Array.isArray(x) && x.every(isStr); }

// ---------- load plan ----------
const planPath = join(contentDir, "curriculum-plan.json");
if (!existsSync(planPath)) {
  console.error("FATAL: content/curriculum-plan.json is missing.");
  process.exit(1);
}
const plan = JSON.parse(readFileSync(planPath, "utf8"));
if (!Array.isArray(plan.days) || plan.days.length !== 90) {
  console.error("FATAL: curriculum-plan.json must contain exactly 90 days.");
  process.exit(1);
}
const planByDay = new Map(plan.days.map((d) => [d.day, d]));

// ---------- discover day files ----------
const files = readdirSync(contentDir).filter((f) => /^day-\d{2}\.json$/.test(f)).sort();
const dayData = new Map();
const allHeadwords = new Map(); // lowercase headword -> day number (first occurrence)

for (const f of files) {
  const day = parseInt(f.match(/^day-(\d{2})\.json$/)[1], 10);
  if (dayFilter && (day < dayFilter[0] || day > dayFilter[1])) continue;
  try {
    dayData.set(day, JSON.parse(readFileSync(join(contentDir, f), "utf8")));
  } catch (e) {
    err(day, "json", `Cannot parse JSON: ${e.message}`);
  }
}

function normalizeHeadword(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, " ");
}

// ---------- per-day validation ----------
for (const [day, data] of dayData) {
  const p = planByDay.get(day);
  if (!data || typeof data !== "object") { err(day, "json", "Day data must be an object"); continue; }

  if (data.day !== day) err(day, "structure", `Field "day" is ${JSON.stringify(data.day)}, expected ${day}`);
  for (const field of ["title", "topic", "description", "stage", "focus"]) {
    if (!isStr(data[field])) err(day, "structure", `Missing or empty field: "${field}"`);
  }
  if (p) {
    if (data.title && data.title.trim() !== p.title) err(day, "plan", `Title "${data.title}" does not match plan title "${p.title}"`);
    if (data.topic && data.topic.trim() !== p.topic) err(day, "plan", `Topic "${data.topic}" does not match plan topic "${p.topic}"`);
  }
  const raw = JSON.stringify(data);
  if (ARABIC.test(raw)) err(day, "english-only", "Arabic characters found in day content");

  // ----- vocabulary -----
  const vocab = Array.isArray(data.vocabulary) ? data.vocabulary : [];
  if (vocab.length !== 50) err(day, "vocab-count", `Day has ${vocab.length} vocabulary items, exactly 50 required`);
  const seen = new Map();
  for (const v of vocab) {
    if (!v || typeof v !== "object") { err(day, "vocab-shape", "Vocabulary entry is not an object"); continue; }
    if (!isStr(v.headword)) { err(day, "vocab-shape", "Vocabulary entry missing headword"); continue; }
    const key = normalizeHeadword(v.headword);
    if (seen.has(key)) err(day, "vocab-duplicate", `Duplicate headword within day: "${v.headword}"`);
    seen.set(key, true);
    if (allHeadwords.has(key)) err(day, "vocab-duplicate", `Headword "${v.headword}" already introduced on Day ${allHeadwords.get(key)} (duplicates are not allowed across days)`);
    else allHeadwords.set(key, day);
    for (const field of ["pronunciation", "partOfSpeech", "definition", "example"]) {
      if (!isStr(v[field])) err(day, "vocab-fields", `"${v.headword}" missing field "${field}"`);
    }
    if (v.pronunciation && !v.pronunciation.startsWith("/")) warn(day, "vocab-fields", `"${v.headword}" pronunciation should be IPA between slashes`);
    for (const arrField of ["relatedForms", "collocations", "synonyms", "antonyms", "tags"]) {
      if (v[arrField] !== undefined && !isStrArr(v[arrField])) err(day, "vocab-fields", `"${v.headword}" field "${arrField}" must be an array of strings`);
    }
  }
  const headwordSet = new Set(seen.keys());

  // ----- grammar -----
  const grammar = Array.isArray(data.grammar) ? data.grammar : [];
  if (grammar.length < 1) err(day, "grammar-count", "Day needs at least 1 grammar lesson");
  grammar.forEach((g, gi) => {
    if (!g || typeof g !== "object") { err(day, "grammar-shape", `Grammar lesson #${gi + 1} is not an object`); return; }
    for (const field of ["title", "explanation"]) if (!isStr(g[field])) err(day, "grammar-shape", `Grammar lesson #${gi + 1} missing "${field}"`);
    if (g.structures !== undefined) {
      if (!Array.isArray(g.structures)) err(day, "grammar-shape", `Grammar lesson #${gi + 1} structures must be an array`);
      else g.structures.forEach((s) => { if (!isStr(s?.pattern)) err(day, "grammar-shape", `Grammar lesson #${gi + 1} has a structure without a pattern`); });
    }
    if (!Array.isArray(g.examples) || g.examples.length < 3) err(day, "grammar-examples", `Grammar lesson #${gi + 1} needs at least 3 examples`);
    else {
      let usingDayVocab = 0;
      g.examples.forEach((ex) => {
        if (!isStr(ex?.sentence)) err(day, "grammar-examples", `Grammar lesson #${gi + 1} has an example without a sentence`);
        if (Array.isArray(ex?.usesVocabulary) && ex.usesVocabulary.some((w) => !headwordSet.has(normalizeHeadword(w)))) {
          err(day, "grammar-examples", `Grammar lesson #${gi + 1} example references a word not in this day's vocabulary: ${JSON.stringify(ex.usesVocabulary)}`);
        }
        if (Array.isArray(ex?.usesVocabulary) && ex.usesVocabulary.length > 0) usingDayVocab++;
      });
      if (usingDayVocab === 0) warn(day, "grammar-examples", `Grammar lesson #${gi + 1} has no examples using today's vocabulary`);
    }
    if (g.commonMistakes !== undefined) {
      if (!Array.isArray(g.commonMistakes) || g.commonMistakes.length === 0) err(day, "grammar-shape", `Grammar lesson #${gi + 1} commonMistakes must be a non-empty array when present`);
      else g.commonMistakes.forEach((m) => { if (!isStr(m?.wrong) || !isStr(m?.right)) err(day, "grammar-shape", `Grammar lesson #${gi + 1} has an incomplete common mistake`); });
    }
  });

  // ----- conversations -----
  const convs = Array.isArray(data.conversations) ? data.conversations : [];
  if (convs.length < 3) err(day, "conversation-count", `Day has ${convs.length} conversations, minimum 3`);
  const usedInContext = new Set();
  convs.forEach((c, ci) => {
    if (!c || typeof c !== "object") { err(day, "conversation-shape", `Conversation #${ci + 1} is not an object`); return; }
    for (const field of ["title", "setting"]) if (!isStr(c[field])) err(day, "conversation-shape", `Conversation #${ci + 1} missing "${field}"`);
    if (!Array.isArray(c.lines) || c.lines.length < 8) err(day, "conversation-length", `Conversation "${c.title ?? ci + 1}" needs at least 8 lines (has ${Array.isArray(c.lines) ? c.lines.length : 0})`);
    else c.lines.forEach((l, li) => { if (!isStr(l?.speaker) || !isStr(l?.text)) err(day, "conversation-shape", `Conversation #${ci + 1} line ${li + 1} needs speaker and text`); });
    if (!Array.isArray(c.vocabularyUsed) || c.vocabularyUsed.length < 5) {
      err(day, "conversation-vocab", `Conversation "${c.title ?? ci + 1}" must use at least 5 of today's vocabulary items`);
    } else {
      for (const w of c.vocabularyUsed) {
        const key = normalizeHeadword(w);
        if (!headwordSet.has(key)) err(day, "conversation-vocab", `Conversation "${c.title}" references "${w}" which is not one of today's 50 vocabulary items`);
        else usedInContext.add(key);
      }
    }
  });

  // ----- paragraphs -----
  const paras = Array.isArray(data.paragraphs) ? data.paragraphs : [];
  if (paras.length < 3) err(day, "paragraph-count", `Day has ${paras.length} paragraphs, minimum 3`);
  paras.forEach((pa, pi) => {
    if (!pa || typeof pa !== "object") { err(day, "paragraph-shape", `Paragraph #${pi + 1} is not an object`); return; }
    if (!isStr(pa.title)) err(day, "paragraph-shape", `Paragraph #${pi + 1} missing "title"`);
    if (!isStr(pa.text)) err(day, "paragraph-shape", `Paragraph #${pi + 1} missing "text"`);
    else {
      const words = pa.text.trim().split(/\s+/).length;
      if (words < 70 || words > 140) warn(day, "paragraph-length", `Paragraph "${pa.title}" has ${words} words (target 70–140)`);
    }
    if (!Array.isArray(pa.vocabularyUsed) || pa.vocabularyUsed.length < 6) {
      err(day, "paragraph-vocab", `Paragraph "${pa.title ?? pi + 1}" must use at least 6 of today's vocabulary items`);
    } else {
      for (const w of pa.vocabularyUsed) {
        const key = normalizeHeadword(w);
        if (!headwordSet.has(key)) err(day, "paragraph-vocab", `Paragraph "${pa.title}" references "${w}" which is not one of today's 50 vocabulary items`);
        else usedInContext.add(key);
      }
    }
  });

  const coverage = headwordSet.size ? Math.round((usedInContext.size / headwordSet.size) * 100) : 0;
  if (coverage < 60) err(day, "vocab-coverage", `Only ${coverage}% of today's vocabulary appears in conversations/paragraphs (minimum 60%)`);
  else if (coverage < 80) warn(day, "vocab-coverage", `Vocabulary context coverage is ${coverage}% (target ≥ 80%)`);
}

// ---------- global checks ----------
for (let d = 1; d <= 90; d++) {
  if (dayFilter && (d < dayFilter[0] || d > dayFilter[1])) continue;
  if (!dayData.has(d)) err(d, "missing-file", `content/day-${String(d).padStart(2, "0")}.json is missing`);
}

// ---------- report ----------
if (jsonOut) {
  console.log(JSON.stringify({ ok: problems.length === 0, problems, warnings, daysValidated: dayData.size }, null, 2));
} else {
  for (const w of warnings) console.log(`WARN  day ${w.day} [${w.rule}] ${w.message}`);
  for (const e of problems) console.log(`ERROR day ${e.day} [${e.rule}] ${e.message}`);
  const summary = `Validated ${dayData.size} day file(s): ${problems.length} error(s), ${warnings.length} warning(s).`;
  console.log(problems.length === 0 ? `PASS — ${summary}` : `FAIL — ${summary}`);
}
process.exit(problems.length === 0 ? 0 : 1);
