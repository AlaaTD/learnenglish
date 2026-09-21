import { db } from "@/lib/db";
import { parseJson, parseStringArray } from "@/lib/json";

// Shared server-side read queries for curriculum content.

export type DaySummary = {
  dayNumber: number;
  title: string;
  topic: string;
  description: string;
  stage: string;
  focus: string;
};

export async function getDaySummaries(): Promise<DaySummary[]> {
  const days = await db.day.findMany({
    orderBy: { dayNumber: "asc" },
    select: { dayNumber: true, title: true, topic: true, description: true, stage: true, focus: true },
  });
  return days;
}

export type GrammarLessonData = {
  id: string;
  dayNumber: number;
  order: number;
  title: string;
  titleArabic: string | null;
  explanation: string;
  explanationArabic: string | null;
  structures: { pattern: string; label: string }[];
  examples: { sentence: string; usesVocabulary: string[]; translation?: string }[];
  commonUsage: string[];
  commonMistakes: { wrong: string; right: string; note: string }[];
};

export type ConversationData = {
  id: string;
  dayNumber: number;
  order: number;
  title: string;
  titleArabic: string | null;
  setting: string;
  settingArabic: string | null;
  lines: { speaker: string; text: string; translation?: string }[];
};

export type ParagraphData = {
  id: string;
  dayNumber: number;
  order: number;
  title: string;
  titleArabic: string | null;
  kind: string;
  text: string;
  translation: string | null;
};

export async function getDayFull(dayNumber: number) {
  const day = await db.day.findUnique({
    where: { dayNumber },
    include: {
      grammarLessons: { orderBy: { order: "asc" } },
      conversations: { orderBy: { order: "asc" } },
      paragraphs: { orderBy: { order: "asc" } },
      vocabulary: { orderBy: { order: "asc" } },
    },
  });
  if (!day) return null;
  return {
    ...day,
    grammarLessons: day.grammarLessons.map((g) => {
      const raw = g as Record<string, unknown>;
      return {
        ...g,
        titleArabic: (raw.titleArabic as string | null) ?? null,
        explanationArabic: (raw.explanationArabic as string | null) ?? null,
        structures: parseJson<{ pattern: string; label: string }[]>(g.structures, []),
        examples: parseJson<{ sentence: string; usesVocabulary: string[]; translation?: string }[]>(g.examples, []),
        commonUsage: parseStringArray(g.commonUsage),
        commonMistakes: parseJson<{ wrong: string; right: string; note: string }[]>(g.commonMistakes, []),
      };
    }) as GrammarLessonData[],
    conversations: day.conversations.map((c) => {
      const raw = c as Record<string, unknown>;
      return {
        ...c,
        titleArabic: (raw.titleArabic as string | null) ?? null,
        settingArabic: (raw.settingArabic as string | null) ?? null,
        lines: parseJson<{ speaker: string; text: string; translation?: string }[]>(c.lines, []),
      };
    }) as ConversationData[],
    paragraphs: day.paragraphs.map((p) => {
      const raw = p as Record<string, unknown>;
      return {
        ...p,
        titleArabic: (raw.titleArabic as string | null) ?? null,
        translation: (raw.translation as string | null) ?? null,
      };
    }) as ParagraphData[],
  };
}

export type VerbForms = {
  v1: string; // Base / Present
  v2: string; // Past Simple
  v3: string; // Past Participle
};

export type VocabularyCardData = {
  id: string;
  headword: string;
  pronunciation: string | null;
  partOfSpeech: string | null;
  definition: string;
  example: string;
  translation: string | null;
  exampleArabic: string | null;
  verbForms: VerbForms | null;
  relatedForms: string[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  tags: string[];
  dayNumber: number;
  state: string;
  isDifficult: boolean;
  usedInConversation: boolean;
  inConversationCount: number;
  inParagraphCount: number;
};

function toCard(
  v: {
    id: string;
    headword: string;
    pronunciation: string | null;
    partOfSpeech: string | null;
    definition: string;
    example: string;
    translation?: string | null;
    exampleArabic?: string | null;
    verbForms?: string | null;
    relatedForms: string;
    collocations: string;
    synonyms: string;
    antonyms: string;
    tags: string;
    dayNumber: number;
  },
  state: string,
  usedInConversation: boolean,
  inConversationCount: number,
  inParagraphCount: number,
  isDifficult: boolean = false,
): VocabularyCardData {
  return {
    ...v,
    translation: v.translation ?? null,
    exampleArabic: v.exampleArabic ?? null,
    verbForms: v.verbForms ? parseJson<VerbForms | null>(v.verbForms, null) : null,
    relatedForms: parseStringArray(v.relatedForms),
    collocations: parseStringArray(v.collocations),
    synonyms: parseStringArray(v.synonyms),
    antonyms: parseStringArray(v.antonyms),
    tags: parseStringArray(v.tags),
    state,
    isDifficult,
    usedInConversation,
    inConversationCount,
    inParagraphCount,
  };
}

// Day page vocabulary: the day's 50 words joined with the user's state.
export async function getDayVocabularyWithState(userId: string, dayNumber: number) {
  const items = await db.vocabularyItem.findMany({
    where: { dayNumber },
    orderBy: { order: "asc" },
    include: {
      conversationLinks: { select: { conversationId: true } },
      paragraphLinks: { select: { paragraphId: true } },
    },
  });
  const states = await db.userVocabulary.findMany({
    where: { userId, vocabularyId: { in: items.map((i) => i.id) } },
    select: { vocabularyId: true, state: true, usedInConversation: true, isDifficult: true },
  });
  const stateMap = new Map(states.map((s) => [s.vocabularyId, s]));
  return items.map((v) => {
    const s = stateMap.get(v.id);
    return toCard(
      v,
      s?.state ?? "UNLEARNED",
      s?.usedInConversation ?? false,
      v.conversationLinks.length,
      v.paragraphLinks.length,
      s?.isDifficult ?? false,
    );
  });
}

// Master library with search / filter / sort / pagination (server-side).
export type LibraryParams = {
  query?: string;
  state?: string;
  difficult?: boolean;
  day?: number;
  sort?: string; // headword | day | recent
  page?: number;
  pageSize?: number;
};

export async function getLibrary(userId: string, params: LibraryParams) {
  const { query, state, difficult, day, sort = "headword", page = 1, pageSize = 60 } = params;
  const where: {
    headword?: { contains: string };
    definition?: { contains: string };
    tags?: { contains: string };
    dayNumber?: number;
    userStates?: {
      some?: { userId: string; state?: string; usedInConversation?: boolean; isDifficult?: boolean };
      none?: { userId: string };
    };
  } = {};
  if (query && query.trim()) {
    where.headword = { contains: query.trim() };
  }
  if (day && day >= 1 && day <= 90) where.dayNumber = day;
  if (difficult || state === "DIFFICULT") {
    where.userStates = { some: { userId, isDifficult: true } };
  } else if (state === "USED") {
    where.userStates = { some: { userId, usedInConversation: true } };
  } else if (state && ["UNLEARNED", "LEARNING", "REVIEW", "MASTERED"].includes(state)) {
    where.userStates = { some: { userId, state } };
  } else if (state === "NO_STATE") {
    where.userStates = { none: { userId } };
  }

  const orderBy =
    sort === "day" ? [{ dayNumber: "asc" as const }, { order: "asc" as const }] : [{ headword: "asc" as const }];

  const [total, difficultCount, items] = await Promise.all([
    db.vocabularyItem.count({ where }),
    db.userVocabulary.count({ where: { userId, isDifficult: true } }),
    db.vocabularyItem.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        userStates: { where: { userId }, select: { state: true, usedInConversation: true, isDifficult: true } },
        _count: { select: { conversationLinks: true, paragraphLinks: true } },
      },
    }),
  ]);

  return {
    total,
    difficultCount,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    items: items.map((v) =>
      toCard(
        v,
        v.userStates[0]?.state ?? "UNLEARNED",
        v.userStates[0]?.usedInConversation ?? false,
        v._count.conversationLinks,
        v._count.paragraphLinks,
        v.userStates[0]?.isDifficult ?? false,
      ),
    ),
  };
}

// Word detail: item + user state + history + every conversation/paragraph it appears in.
export async function getWordDetail(userId: string, wordId: string) {
  const item = await db.vocabularyItem.findUnique({
    where: { id: wordId },
    include: {
      day: true,
      conversationLinks: { include: { conversation: true } },
      paragraphLinks: { include: { paragraph: true } },
    },
  });
  if (!item) return null;
  const [state, history, grammar] = await Promise.all([
    db.userVocabulary.findUnique({
      where: { userId_vocabularyId: { userId, vocabularyId: wordId } },
    }),
    db.vocabularyHistory.findMany({
      where: { userId, vocabularyId: wordId },
      orderBy: { createdAt: "asc" },
    }),
    db.grammarLesson.findMany({
      where: { dayNumber: item.dayNumber },
      orderBy: { order: "asc" },
      select: { id: true, title: true, examples: true },
    }),
  ]);
  const grammarExamples = grammar.flatMap((g) =>
    parseJson<{ sentence: string; usesVocabulary: string[] }[]>(g.examples, [])
      .filter((ex) => ex.usesVocabulary?.some((w) => w.toLowerCase() === item.headword.toLowerCase()))
      .map((ex) => ({ sentence: ex.sentence, lessonTitle: g.title })),
  );
  return {
    item: toCard(
      item,
      state?.state ?? "UNLEARNED",
      state?.usedInConversation ?? false,
      item.conversationLinks.length,
      item.paragraphLinks.length,
      state?.isDifficult ?? false,
    ),
    day: item.day,
    stateRow: state,
    history: history.map((h) => ({
      id: h.id,
      event: h.event,
      detail: h.detail,
      dayNumber: h.dayNumber,
      createdAt: h.createdAt,
    })),
    conversations: item.conversationLinks
      .map((l) => ({ id: l.conversation.id, title: l.conversation.title, dayNumber: l.conversation.dayNumber, order: l.conversation.order }))
      .sort((a, b) => a.dayNumber - b.dayNumber || a.order - b.order),
    paragraphs: item.paragraphLinks
      .map((l) => ({ id: l.paragraph.id, title: l.paragraph.title, dayNumber: l.paragraph.dayNumber, order: l.paragraph.order }))
      .sort((a, b) => a.dayNumber - b.dayNumber || a.order - b.order),
    grammarExamples,
  };
}

// Difficult words list: words marked as difficult by the user.
export async function getDifficultWords(userId: string) {
  const rows = await db.userVocabulary.findMany({
    where: { userId, isDifficult: true },
    orderBy: { difficultAddedAt: "desc" },
    include: {
      vocabulary: {
        include: {
          _count: { select: { conversationLinks: true, paragraphLinks: true } },
        },
      },
    },
  });
  return rows.map((r) =>
    toCard(
      r.vocabulary,
      r.state,
      r.usedInConversation,
      r.vocabulary._count.conversationLinks,
      r.vocabulary._count.paragraphLinks,
      true,
    ),
  );
}

// Review list: words in REVIEW state, grouped by due date (organizational only).
export async function getReviewWords(userId: string) {
  const rows = await db.userVocabulary.findMany({
    where: { userId, state: "REVIEW" },
    orderBy: { reviewAddedAt: "asc" },
    include: { vocabulary: { select: { id: true, headword: true, pronunciation: true, definition: true, example: true, partOfSpeech: true, dayNumber: true } } },
  });
  const now = Date.now();
  return rows.map((r) => ({
    id: r.vocabulary.id,
    headword: r.vocabulary.headword,
    pronunciation: r.vocabulary.pronunciation,
    definition: r.vocabulary.definition,
    example: r.vocabulary.example,
    partOfSpeech: r.vocabulary.partOfSpeech,
    dayNumber: r.vocabulary.dayNumber,
    reviewAddedAt: r.reviewAddedAt,
    reviewDueAt: r.reviewDueAt,
    due: r.reviewDueAt ? r.reviewDueAt.getTime() <= now : true,
  }));
}
