import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const prisma = new PrismaClient();

const MERGE_SPECS = {
  3: {
    title: "There is / There are & Prepositions of Place",
    titleArabic: "قواعد المكان: التعبير عن الوجود (There is / There are) وحروف الجر المكانية",
    explanation: "We use 'There is' (singular/uncountable) and 'There are' (plural) to express the existence of items, combined with prepositions of place (in, on, under, behind, next to, between) to specify their exact locations in a room or home.",
    explanationArabic: "نستخدم 'There is' (مع المفرد وغير المعدود) و'There are' (مع الجمع) للتعبير عن وجود الأشياء، ونقرنها بحروف جر المكان (in, on, under, behind, next to, between) لتحديد موقعها الدقيق داخل الغرفة أو المنزل.",
  },
  4: {
    title: "Have / Has & Possessive Adjectives",
    titleArabic: "قواعد الملكية: أفعال التملك (Have / Has) وصفات الملكية (my, your, his, her...)",
    explanation: "We use 'have' and 'has' to talk about the possessions and attributes people have, and possessive adjectives (my, your, his, her, its, our, their) placed directly before nouns to show ownership clearly.",
    explanationArabic: "نستخدم الفعلين have و has للتعبير عما يملكه الأشخاص من أغراض وسمات، ونستخدم صفات الملكية (my, your, his, her, its, our, their) قبل الأسماء مباشرة لبيان صاحب الشيء بدقة.",
  },
  15: {
    title: "Quantities: How much / How many & Much / Many",
    titleArabic: "قواعد الكميات والأعداد: السؤال بـ How much و How many واستخدام Much و Many",
    explanation: "We ask about amounts using 'How much' with uncountable nouns and 'How many' with plural countable nouns. In negative statements and questions, 'much' refers to uncountable quantities and 'many' refers to countable numbers.",
    explanationArabic: "نسأل عن الكميات باستخدام 'How much' مع الأسماء غير المعدودة و'How many' مع أسماء الجمع المعدودة. وفي الجمل المنفية والاستفهامية، نستخدم 'much' للكميات غير المعدودة و'many' للأعداد المعدودة.",
  },
  19: {
    title: "Polite Social English: Would like & Requests with Could",
    titleArabic: "الأسلوب الاجتماعي اللبق: التعبير عن الرغبة بـ Would like والطلبات المهذبة بـ Could",
    explanation: "We use 'would like' as a polite alternative to 'want' for making offers and expressing preferences, and the modal 'could' to formulate courteous, gentle requests and ask for permission gracefully.",
    explanationArabic: "نستخدم 'would like' كبديل راقٍ ولبق للفعل 'want' لتقديم العروض والتعبير عن الرغبات، ونستخدم الفعل الناقص 'could' لصياغة طلبات مهذبة ورقيقة وطلب الإذن بأسلوب رفيع.",
  },
  27: {
    title: "Directions & Movement: Imperatives & Prepositions of Movement",
    titleArabic: "التوجيهات والحركة: صيغة الأمر (Imperatives) وحروف جر الحركة والاتجاه",
    explanation: "We use imperative verbs to give clear directions, instructions, and navigation steps, paired with prepositions of movement (into, out of, through, across, along) to describe routes and movement through spaces.",
    explanationArabic: "نستخدم صيغة الأمر (Imperatives) لإعطاء التوجيهات والتعليمات وخطوات السير، مقترنة بحروف جر الحركة (into, out of, through, across, along) لوصف مسارات التنقل واجتياز الأماكن بدقة.",
  },
  43: {
    title: "Character & Advice: Personality Comparatives & Ought to / Had better",
    titleArabic: "وصف الشخصية والنصائح: صيغ المقارنة و Ought to و Had better",
    explanation: "We use comparative adjectives to evaluate and contrast people's personality traits, and modal structures 'ought to' (moral and sensible advice) and 'had better' (urgent advice with warnings) to recommend sound courses of action.",
    explanationArabic: "نستخدم صفات المقارنة للمفاضلة بين سمات الشخصيات وطباع الأفراد، ونستخدم التركيبين 'ought to' (لتقديم النصح الأخلاقي والمبدئي) و'had better' (للنصيحة العاجلة والتحذير من عواقب وخيمة) لتوجيه السلوك بحكمة.",
  },
};

console.log("Merging multi-lesson days into unified, single-lesson days in content files...");

for (const [dayStr, spec] of Object.entries(MERGE_SPECS)) {
  const day = parseInt(dayStr, 10);
  const pad = String(day).padStart(2, "0");
  const filePath = join(contentDir, `day-${pad}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf8"));

  if (data.grammar && data.grammar.length > 1) {
    const g1 = data.grammar[0];
    const g2 = data.grammar[1];

    const mergedStructures = [...(g1.structures || []), ...(g2.structures || [])];
    const mergedExamples = [...(g1.examples || []), ...(g2.examples || [])];
    const mergedMistakes = [...(g1.commonMistakes || []), ...(g2.commonMistakes || [])];
    const mergedUsage = [...(g1.commonUsage || []), ...(g2.commonUsage || [])];

    const unifiedLesson = {
      title: spec.title,
      titleArabic: spec.titleArabic,
      explanation: spec.explanation,
      explanationArabic: spec.explanationArabic,
      structures: mergedStructures,
      examples: mergedExamples,
      commonUsage: mergedUsage,
      commonMistakes: mergedMistakes,
    };

    data.grammar = [unifiedLesson];
    writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`✅ Day ${day} successfully merged into 1 unified master lesson!`);
  }
}

console.log("\nSynchronizing merged lessons into database...");
// Remove old second-order lessons (order = 2) for these days
for (const dayStr of Object.keys(MERGE_SPECS)) {
  const day = parseInt(dayStr, 10);
  await prisma.grammarLesson.deleteMany({
    where: { dayNumber: day, order: { gt: 1 } },
  });
}

// Update order = 1 with the merged data
for (const [dayStr, spec] of Object.entries(MERGE_SPECS)) {
  const day = parseInt(dayStr, 10);
  const pad = String(day).padStart(2, "0");
  const filePath = join(contentDir, `day-${pad}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  const g = data.grammar[0];

  const id = `g_d${day}_1`;
  const payload = {
    dayNumber: day,
    order: 1,
    title: g.title,
    titleArabic: g.titleArabic,
    explanation: g.explanation,
    explanationArabic: g.explanationArabic,
    structures: JSON.stringify(g.structures ?? []),
    examples: JSON.stringify(g.examples ?? []),
    commonUsage: JSON.stringify(g.commonUsage ?? []),
    commonMistakes: JSON.stringify(g.commonMistakes ?? []),
  };

  await prisma.grammarLesson.upsert({
    where: { dayNumber_order: { dayNumber: day, order: 1 } },
    update: payload,
    create: { id, ...payload },
  });
}

const finalCount = await prisma.grammarLesson.count();
console.log(`\n🎉 Consolidation complete! Total grammar lessons in DB: ${finalCount} (Exactly 1 lesson per day for Days 1 to 50)`);

await prisma.$disconnect();
