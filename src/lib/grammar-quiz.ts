// Comprehensive Grammar Quiz Generator for English90 Academy
import type { GrammarAcademyLesson } from "./queries";

export type QuizQuestion = {
  id: string;
  lessonId: string;
  dayNumber: number;
  lessonTitle: string;
  type: "error_correction" | "gap_fill" | "structure_check" | "rule_comprehension";
  typeLabel: string;
  typeLabelArabic: string;
  prompt: string;
  promptArabic: string;
  sentenceSnippet?: string;
  translation?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationArabic: string;
};

function shuffle<T>(arr: T[]): { items: T[]; getNewIndex: (oldIdx: number) => number } {
  const indexed = arr.map((item, index) => ({ item, originalIndex: index }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    items: indexed.map((x) => x.item),
    getNewIndex: (oldIdx: number) => indexed.findIndex((x) => x.originalIndex === oldIdx),
  };
}

const COMMON_GRAMMAR_TOKENS = [
  "although", "however", "because", "when", "while", "since", "until", "unless",
  "doesn't", "don't", "didn't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't",
  "does", "do", "did", "have", "has", "had", "will", "would", "can", "could", "should", "must",
  "is", "are", "am", "was", "were", "been", "being",
  "much", "many", "a lot of", "too", "enough", "fewer", "less",
  "which", "who", "that", "whose", "where", "when",
  "always", "usually", "often", "sometimes", "never",
  "as well as", "in spite of", "despite", "therefore", "furthermore",
];

const GRAMMAR_DISTRACTOR_GROUPS: Record<string, string[]> = {
  be: ["am", "is", "are", "was", "were", "been", "being"],
  do: ["do", "does", "did", "doing", "done"],
  have: ["have", "has", "had", "having"],
  modals: ["can", "could", "should", "would", "must", "might", "may"],
  relatives: ["who", "which", "that", "whose", "where", "when"],
  prepositions: ["at", "on", "in", "to", "for", "with", "from", "by", "into", "through"],
  quantifiers: ["a few", "a little", "much", "many", "a lot of", "several", "enough", "too"],
  connectors: ["although", "however", "because", "since", "while", "so", "unless", "until"],
  negatives: ["doesn't", "don't", "didn't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't"],
  frequency: ["always", "usually", "often", "sometimes", "rarely", "never"],
};

function getSmartGrammarDistractors(target: string): string[] {
  const clean = target.toLowerCase();

  for (const group of Object.values(GRAMMAR_DISTRACTOR_GROUPS)) {
    if (group.includes(clean)) {
      return group.filter((w) => w !== clean);
    }
  }

  // Verb morphology heuristics
  if (clean.endsWith("ing") && clean.length > 4) {
    const base = clean.replace(/ing$/, "");
    return [base, base + "s", base + "ed", base + "es"].filter((w) => w !== clean);
  }
  if (clean.endsWith("ed") && clean.length > 3) {
    const base = clean.replace(/ed$/, "");
    return [base, base + "s", base + "ing"].filter((w) => w !== clean);
  }
  if (clean.endsWith("s") && clean.length > 3) {
    const base = clean.replace(/s$/, "");
    return [base, base + "ing", base + "ed"].filter((w) => w !== clean);
  }

  return COMMON_GRAMMAR_TOKENS.filter((t) => t !== clean);
}

export function generateLessonQuiz(lesson: GrammarAcademyLesson): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  let qCounter = 1;

  // 1. Error Correction Questions (from commonMistakes)
  for (const mistake of lesson.commonMistakes) {
    if (!mistake.right || !mistake.wrong) continue;

    // Generate plausible distractors based on the mistake
    const rawOptions = [
      mistake.right,
      mistake.wrong,
      mistake.wrong.replace(/\b(\w+)s\b/g, "$1ing"), // variation 1
      mistake.wrong.toLowerCase().includes("not")
        ? mistake.wrong.replace(/\bnot\b/gi, "never")
        : mistake.wrong + " too", // variation 2
    ];

    // Ensure unique options
    const uniqueOptions = Array.from(new Set(rawOptions));
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(`It is ${mistake.right.toLowerCase()}`);
    }

    const { items: shuffledOptions, getNewIndex } = shuffle(uniqueOptions.slice(0, 4));
    const correctIndex = getNewIndex(0);

    questions.push({
      id: `q_${lesson.id}_err_${qCounter++}`,
      lessonId: lesson.id,
      dayNumber: lesson.dayNumber,
      lessonTitle: lesson.title,
      type: "error_correction",
      typeLabel: "Error Detection",
      typeLabelArabic: "اكتشاف وتصحيح الخطأ",
      prompt: "Which of the following sentences is grammatically CORRECT?",
      promptArabic: "أي الجمل التالية صحيحة من الناحية النحوية والقواعدية؟",
      sentenceSnippet: mistake.wrong,
      options: shuffledOptions,
      correctIndex,
      explanation: mistake.note || `"${mistake.right}" is correct according to the rules of ${lesson.title}.`,
      explanationArabic:
        mistake.noteArabic ||
        `الجملة الصحيحة هي "${mistake.right}". السبب: ${mistake.note || "تطبيق مباشر لقواعد الدرس"}`,
    });
  }

  // 2. Gap-Fill Questions (from examples)
  for (const ex of lesson.examples) {
    if (!ex.sentence) continue;
    const words = ex.sentence.split(/\s+/);

    // Find if any target grammar token exists in this example
    let targetWord = "";
    let targetIndex = -1;

    for (let i = 0; i < words.length; i++) {
      const cleanWord = words[i].toLowerCase().replace(/[^a-z']/g, "");
      if (COMMON_GRAMMAR_TOKENS.includes(cleanWord)) {
        targetWord = cleanWord;
        targetIndex = i;
        break;
      }
    }

    // If no specific token found, use 2nd or 3rd word
    if (targetIndex === -1 && words.length >= 4) {
      targetIndex = 1;
      targetWord = words[1].toLowerCase().replace(/[^a-z']/g, "");
    }

    if (targetIndex !== -1 && targetWord) {
      const maskedSentence = words
        .map((w, i) => (i === targetIndex ? "________" : w))
        .join(" ");

      // Intelligent grammatical distractors
      const pool = getSmartGrammarDistractors(targetWord);
      const chosenDistractors = shuffle(pool).items.slice(0, 3);
      const rawOptions = [targetWord, ...chosenDistractors];
      const { items: shuffledOptions, getNewIndex } = shuffle(rawOptions);
      const correctIndex = getNewIndex(0);

      questions.push({
        id: `q_${lesson.id}_gap_${qCounter++}`,
        lessonId: lesson.id,
        dayNumber: lesson.dayNumber,
        lessonTitle: lesson.title,
        type: "gap_fill",
        typeLabel: "Fill in the Blank",
        typeLabelArabic: "إكمال الفراغ بالصيغة المناسبة",
        prompt: "Choose the correct word or phrase to complete the sentence accurately:",
        promptArabic: "اختر الكلمة أو الصيغة النحوية الصحيحة لإكمال الجملة بدقة:",
        sentenceSnippet: maskedSentence,
        translation: ex.translation,
        options: shuffledOptions,
        correctIndex,
        explanation: `In this context, "${targetWord}" correctly fits the grammatical structure of "${lesson.title}".`,
        explanationArabic: ex.translation
          ? `الخيار الصحيح هو "${targetWord}". معنى الجملة: "${ex.translation}".`
          : `الخيار الصحيح هو "${targetWord}" ليتوافق التركيب النحوي مع سياق الجملة وقاعدة الدرس.`,
      });
    }
  }

  // 3. Structural Formula Check Questions (from structures)
  for (const st of lesson.structures) {
    if (!st.pattern || !st.label) continue;

    // Distractors by altering the pattern
    const distractor1 = st.pattern.replace(/\+/g, "then").replace(/\b(verb|V1|V2|V3)\b/gi, "noun");
    const distractor2 = st.pattern.replace(/\b(do|does|did|have|has|is|are)\b/gi, "will be");
    const distractor3 = st.pattern.replace(/\s+/g, " ");

    const rawOptions = [st.pattern, distractor1, distractor2, `${st.pattern} + always`];
    const uniqueOptions = Array.from(new Set(rawOptions));
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(`Subject + ${st.label.toLowerCase()} + Object`);
    }

    const { items: shuffledOptions, getNewIndex } = shuffle(uniqueOptions.slice(0, 4));
    const correctIndex = getNewIndex(0);

    questions.push({
      id: `q_${lesson.id}_str_${qCounter++}`,
      lessonId: lesson.id,
      dayNumber: lesson.dayNumber,
      lessonTitle: lesson.title,
      type: "structure_check",
      typeLabel: "Formula Blueprint",
      typeLabelArabic: "صيغة وتركيب القاعدة",
      prompt: `Which structural formula correctly represents the "${st.label}" pattern in ${lesson.title}?`,
      promptArabic: `ما هي الصيغة التركيبية الصحيحة لنمط "${st.label}" في قاعدة ${lesson.titleArabic || lesson.title}؟`,
      options: shuffledOptions,
      correctIndex,
      explanation: `The accurate formula is: ${st.pattern}. ${st.explanation || ""}`,
      explanationArabic: `الصيغة الصحيحة والمعتمدة هي: ${st.pattern}. ${st.explanationArabic || ""}`,
    });
  }

  // 4. Conceptual Rule Comprehension Question (from explanation)
  if (lesson.explanation && questions.length < 5) {
    const rawOptions = [
      `It is used for: ${lesson.explanation.slice(0, 90)}...`,
      `It is strictly used only with past tense irregular verbs.`,
      `It requires using passive voice without a subject.`,
      `It is only applied in formal poetry and academic essays.`,
    ];
    const { items: shuffledOptions, getNewIndex } = shuffle(rawOptions);
    const correctIndex = getNewIndex(0);

    questions.push({
      id: `q_${lesson.id}_rule_${qCounter++}`,
      lessonId: lesson.id,
      dayNumber: lesson.dayNumber,
      lessonTitle: lesson.title,
      type: "rule_comprehension",
      typeLabel: "Concept & Usage",
      typeLabelArabic: "مفهوم واستخدام القاعدة",
      prompt: `What is the core purpose or usage of "${lesson.title}"?`,
      promptArabic: `ما هو الاستخدام الأساسي والوظيفة النحوية لقاعدة "${lesson.titleArabic || lesson.title}"؟`,
      options: shuffledOptions,
      correctIndex,
      explanation: lesson.explanation,
      explanationArabic: lesson.explanationArabic || lesson.explanation,
    });
  }

  return questions;
}

