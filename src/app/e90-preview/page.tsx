// TEMPORARY verification harness for the vocabulary card redesign (session SESSION-20260921-090842).
// Static data only, cards are opened via `defaultOpen`, so no server action runs and no learner
// progress is touched. This whole folder is deleted as soon as the check is done.
import { VocabularyCard, type VocabularyCardWord } from "@/components/vocabulary-card";

const base: VocabularyCardWord = {
  id: "p0",
  headword: "routine",
  pronunciation: "/ruːˈtiːn/",
  partOfSpeech: "noun",
  definition: "A regular set of things you do every day, usually in the same order.",
  example: "My morning routine starts at six o'clock.",
  translation: "روتين",
  exampleArabic: "يبدأ روتيني الصباحي في تمام الساعة السادسة.",
  verbForms: null,
  relatedForms: [],
  collocations: [],
  synonyms: [],
  antonyms: [],
  tags: [],
  dayNumber: 1,
  state: "UNLEARNED",
  usedInConversation: false,
  inConversationCount: 0,
  inParagraphCount: 0,
};

const words: { word: VocabularyCardWord; open: boolean }[] = [
  { word: { ...base, id: "p1" }, open: false },
  {
    word: {
      ...base,
      id: "p2",
      headword: "alarm",
      pronunciation: "/əˈlɑːrm/",
      definition: "A device that makes a loud sound to wake you up.",
      translation: "منبّه",
      state: "LEARNING",
    },
    open: false,
  },
  {
    word: {
      ...base,
      id: "p3",
      headword: "take something for granted",
      pronunciation: "/teɪk ˈsʌmθɪŋ fər ˈɡræntɪd/",
      partOfSpeech: "phrase",
      definition:
        "To expect something to always be there and to forget to be grateful for it, even when it took a lot of effort from someone else.",
      translation: "يعتبر الشيء أمراً مسلّماً به",
      state: "REVIEW",
    },
    open: false,
  },
  {
    word: { ...base, id: "p4", headword: "shower", pronunciation: "/ˈʃaʊər/", translation: "دُش", state: "MASTERED" },
    open: false,
  },
  {
    word: {
      ...base,
      id: "p5",
      headword: "wake up",
      pronunciation: "/weɪk ʌp/",
      partOfSpeech: "verb",
      definition: "To stop sleeping and become conscious.",
      example: "I wake up at six every morning.",
      translation: "يستيقظ",
      exampleArabic: "أستيقظ في السادسة كل صباح.",
      verbForms: { v1: "wake up", v2: "woke up", v3: "woken up" },
      relatedForms: ["waking", "wake-up call"],
      collocations: ["wake up early", "wake up late", "wake up to the sound of"],
      synonyms: ["rise", "get up"],
      antonyms: ["fall asleep", "go to bed"],
      state: "LEARNING",
      inConversationCount: 2,
      inParagraphCount: 1,
    },
    open: true,
  },
  {
    word: {
      ...base,
      id: "p6",
      headword: "get dressed",
      pronunciation: null,
      partOfSpeech: null,
      translation: null,
      exampleArabic: null,
      example: "She gets dressed quickly.",
      state: "UNLEARNED",
    },
    open: true,
  },
  {
    word: {
      ...base,
      id: "p7",
      headword: "misunderstand",
      pronunciation: "/ˌmɪsʌndərˈstænd/",
      partOfSpeech: "verb",
      definition: "To get the wrong idea about what someone means, or about how something works.",
      example: "Please do not misunderstand me; I am only trying to help you with the homework.",
      translation: "يسيء الفهم",
      exampleArabic: "من فضلك لا تسئ فهمي؛ أنا أحاول فقط مساعدتك في الواجب المنزلي.",
      verbForms: { v1: "misunderstand", v2: "misunderstood", v3: "misunderstood" },
      relatedForms: ["misunderstanding", "misunderstood", "understand", "understanding", "understandable"],
      collocations: [
        "completely misunderstand",
        "easily misunderstood",
        "a common misunderstanding",
        "clear up a misunderstanding",
        "misunderstand the question",
        "misunderstand the instructions",
      ],
      synonyms: ["misread", "misinterpret", "mistake"],
      antonyms: ["understand", "grasp", "comprehend"],
      state: "REVIEW",
      usedInConversation: true,
      inConversationCount: 3,
      inParagraphCount: 2,
      dayNumber: 12,
    },
    open: true,
  },
  {
    word: { ...base, id: "p8", headword: "mastered word", pronunciation: "/ˈmæstərd/", state: "MASTERED", translation: "متقن" },
    open: true,
  },
];

export default function E90PreviewPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Reading variant: the actual Day-page memorization layout (single column, hairline dividers) */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          variant=&quot;reading&quot; (Day page)
        </h2>
        <div className="mx-auto w-full max-w-[70ch] divide-y divide-zinc-200 dark:divide-zinc-800">
          {words.map(({ word, open }) => (
            <VocabularyCard key={word.id} word={word} defaultOpen={open} variant="reading" />
          ))}
        </div>
      </section>

      {/* Grid variant: Library / Difficult Words browsing layout */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          variant=&quot;grid&quot; (Library / Difficult Words)
        </h2>
        <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map(({ word, open }) => (
            <VocabularyCard key={word.id} word={word} defaultOpen={open} variant="grid" />
          ))}
        </div>
      </section>
    </main>
  );
}
