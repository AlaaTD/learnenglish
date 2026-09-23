import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const prisma = new PrismaClient();

const files = readdirSync(contentDir).filter((f) => /^day-\d{2}\.json$/.test(f)).sort();
console.log(`Syncing grammar lessons from ${files.length} JSON files into SQLite database...`);

let syncedLessons = 0;

for (const file of files) {
  const data = JSON.parse(readFileSync(join(contentDir, file), "utf8"));
  const day = data.day;

  let gOrder = 0;
  for (const g of data.grammar || []) {
    gOrder += 1;
    const id = `g_d${day}_${gOrder}`;
    const payload = {
      dayNumber: day,
      order: gOrder,
      title: g.title,
      titleArabic: g.titleArabic ?? null,
      explanation: g.explanation,
      explanationArabic: g.explanationArabic ?? null,
      structures: JSON.stringify(g.structures ?? []),
      examples: JSON.stringify(g.examples ?? []),
      commonUsage: JSON.stringify(g.commonUsage ?? []),
      commonMistakes: JSON.stringify(g.commonMistakes ?? []),
    };

    await prisma.grammarLesson.upsert({
      where: { dayNumber_order: { dayNumber: day, order: gOrder } },
      update: payload,
      create: { id, ...payload },
    });
    syncedLessons++;
  }
}

console.log(`✅ Successfully synced ${syncedLessons} grammar lessons into database!`);

const audit = await prisma.grammarLesson.findMany();
let missingTitle = 0;
let missingExp = 0;
let emptyUsage = 0;
for (const a of audit) {
  if (!a.titleArabic) missingTitle++;
  if (!a.explanationArabic) missingExp++;
  const u = JSON.parse(a.commonUsage || "[]");
  if (u.length === 0) emptyUsage++;
}

console.log("Post-sync Database Audit:", {
  totalInDb: audit.length,
  missingTitleArabic: missingTitle,
  missingExplanationArabic: missingExp,
  emptyCommonUsage: emptyUsage,
});

await prisma.$disconnect();
