import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWordDetail } from "@/lib/queries";
import { AudioButton } from "@/components/audio-button";
import { WordActions } from "@/components/word-actions";
import { Badge } from "@/components/ui";
import { VocabularyStateLabel, VocabularyStateStyle, type VocabularyState } from "@/lib/states";

export const metadata = { title: "Word Detail" };

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const data = await getWordDetail(user.id, id);
  if (!data) notFound();

  const settings = await db.userSettings.findUnique({ where: { userId: user.id } });
  const audioRate = settings?.audioSpeed === "slow" ? 0.8 : 1;

  const { item, day, history, conversations, paragraphs, grammarExamples } = data;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Navigation breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 min-w-0">
        <Link href="/vocabulary" className="shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400">
          Vocabulary Library
        </Link>
        <span>/</span>
        <Link href={`/day/${item.dayNumber}`} className="truncate hover:text-indigo-600 dark:hover:text-indigo-400">
          Day {item.dayNumber} ({day?.title})
        </Link>
        <span>/</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.headword}</span>
      </nav>

      {/* Word Header Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight break-words text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                {item.headword}
              </h1>
              <AudioButton text={item.headword} rate={audioRate} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              {item.pronunciation && (
                <span className="font-mono text-zinc-500 dark:text-zinc-400">{item.pronunciation}</span>
              )}
              {item.partOfSpeech && (
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs italic text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {item.partOfSpeech}
                </span>
              )}
              <Link
                href={`/day/${item.dayNumber}`}
                className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
              >
                Day {item.dayNumber} · {day?.title}
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">Learning State</span>
            <Badge className={VocabularyStateStyle[item.state as VocabularyState] ?? ""}>
              {VocabularyStateLabel[item.state as VocabularyState] ?? item.state}
            </Badge>
          </div>
        </div>

        {/* Definition & Example */}
        <div className="mt-6 space-y-4 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Definition</h2>
            <p className="mt-1 text-lg text-zinc-800 dark:text-zinc-200">{item.definition}</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Example Sentence</h2>
            <div className="mt-1 flex items-start gap-2">
              <p className="text-base italic text-zinc-700 dark:text-zinc-300">&ldquo;{item.example}&rdquo;</p>
              <AudioButton text={item.example} rate={audioRate} small />
            </div>
          </div>
        </div>

        {/* Verb Conjugation Table */}
        {item.verbForms && (
          <div className="mt-6 rounded-2xl border border-indigo-100/90 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 p-5 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:via-zinc-900 dark:to-violet-950/20 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                  V
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                  Verb Conjugations · تصريفات الفعل الثلاثة
                </h3>
              </div>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                المصدر · الماضي البسيط · الماضي التام
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-zinc-200/80 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  V1 (Base / Present)
                </span>
                <span className="mt-1 block text-base font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {item.verbForms.v1}
                </span>
                <span className="block text-xs text-zinc-400 mt-0.5">المصدر / المضارع</span>
              </div>
              <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-3 dark:border-indigo-900/60 dark:bg-indigo-950/40">
                <span className="block text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  V2 (Past Simple)
                </span>
                <span className="mt-1 block text-base font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                  {item.verbForms.v2}
                </span>
                <span className="block text-xs text-indigo-500/80 mt-0.5">الماضي البسيط</span>
              </div>
              <div className="rounded-xl border border-violet-200/80 bg-violet-50/50 p-3 dark:border-violet-900/60 dark:bg-violet-950/40">
                <span className="block text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  V3 (Past Participle)
                </span>
                <span className="mt-1 block text-base font-bold text-violet-700 dark:text-violet-300 font-mono">
                  {item.verbForms.v3}
                </span>
                <span className="block text-xs text-violet-500/80 mt-0.5">التصريف الثالث (التام)</span>
              </div>
            </div>
          </div>
        )}

        {/* Word Details: Collocations, Related Forms, Synonyms, Tags */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-2 dark:border-zinc-800">
          {item.collocations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Common Collocations</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.collocations.map((c, i) => (
                  <span key={i} className="rounded-md bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.relatedForms.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Related Forms</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.relatedForms.map((r, i) => (
                  <span key={i} className="rounded-md bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.synonyms.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Synonyms</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.synonyms.map((s, i) => (
                  <span key={i} className="rounded-md bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.antonyms.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Antonyms</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.antonyms.map((a, i) => (
                  <span key={i} className="rounded-md bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.tags.length > 0 && (
            <div className="sm:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Topic Tags</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.tags.map((tag, i) => (
                  <span key={i} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Personal State Controls
          </h3>
          <WordActions
            vocabularyId={item.id}
            dayNumber={item.dayNumber}
            initialState={{
              state: item.state as VocabularyState,
              usedInConversation: item.usedInConversation,
            }}
          />
        </div>
      </div>

      {/* Context Appearances: Grammar, Conversations, Paragraphs */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Contextual Appearances
        </h2>

        {/* Grammar Examples */}
        {grammarExamples.length > 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Grammar Lesson Examples
            </h3>
            <ul className="mt-3 space-y-2">
              {grammarExamples.map((ex, i) => (
                <li key={i} className="flex items-start justify-between gap-4 text-sm">
                  <span className="italic text-zinc-800 dark:text-zinc-200">&ldquo;{ex.sentence}&rdquo;</span>
                  <span className="shrink-0 text-xs text-zinc-400">Lesson: {ex.lessonTitle}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conversations */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Conversations Using This Word ({conversations.length})
          </h3>
          {conversations.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">Not featured in conversation dialogues yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
              {conversations.map((c) => (
                <li key={c.id} className="py-2.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{c.title}</span>
                  <Link
                    href={`/day/${c.dayNumber}?tab=conversations`}
                    className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Go to Day {c.dayNumber} Conversation →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Paragraphs */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Readings &amp; Paragraphs ({paragraphs.length})
          </h3>
          {paragraphs.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-500">Not featured in reading paragraphs yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
              {paragraphs.map((p) => (
                <li key={p.id} className="py-2.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{p.title}</span>
                  <Link
                    href={`/day/${p.dayNumber}?tab=paragraphs`}
                    className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Go to Day {p.dayNumber} Paragraph →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Word History Timeline */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Learning History</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Complete chronological record of your study actions for this word.
        </p>

        {history.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No actions recorded yet. Start studying on Day {item.dayNumber}!</p>
        ) : (
          <ol className="relative mt-5 border-l border-zinc-200 pl-4 space-y-4 dark:border-zinc-700">
            {history.map((h) => (
              <li key={h.id} className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600 dark:border-zinc-900 dark:bg-indigo-400" />
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{h.event}</p>
                  <time className="text-xs text-zinc-400 dark:text-zinc-500">
                    {new Date(h.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                {h.detail && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{h.detail}</p>}
                {h.dayNumber && (
                  <span className="mt-1 inline-block text-xs text-indigo-600 dark:text-indigo-400">
                    During Day {h.dayNumber}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
