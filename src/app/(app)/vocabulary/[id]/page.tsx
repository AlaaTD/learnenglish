import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWordDetail } from "@/lib/queries";
import { AudioButton } from "@/components/audio-button";
import { DifficultToggleButton } from "@/components/difficult-toggle-button";
import { Badge, Card, SectionHeading, SmallLabel, Tag } from "@/components/ui";
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

  const verbCells = item.verbForms
    ? [
        { key: "V1 · Base / Present", ar: "المصدر / المضارع", value: item.verbForms.v1 },
        { key: "V2 · Past Simple", ar: "الماضي البسيط", value: item.verbForms.v2 },
        { key: "V3 · Past Participle", ar: "التصريف الثالث (التام)", value: item.verbForms.v3 },
      ]
    : [];

  return (
    <div className="space-y-5">
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400"
      >
        <Link href="/vocabulary" className="shrink-0 hover:text-brand-700 hover:underline dark:hover:text-brand-300">
          Vocabulary Library
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/day/${item.dayNumber}`}
          className="truncate hover:text-brand-700 hover:underline dark:hover:text-brand-300"
        >
          Day {item.dayNumber} ({day?.title})
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate font-medium text-zinc-900 dark:text-zinc-100" aria-current="page">
          {item.headword}
        </span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* ─── Main column: the word, then where it appears ─── */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-6 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="break-words text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                    {item.headword}
                  </h1>
                  <AudioButton text={item.headword} rate={audioRate} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  {item.pronunciation && (
                    <span className="font-mono text-zinc-600 dark:text-zinc-400">{item.pronunciation}</span>
                  )}
                  {item.partOfSpeech && <Tag className="italic">{item.partOfSpeech}</Tag>}
                  <Link
                    href={`/day/${item.dayNumber}`}
                    className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-800 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-200 dark:hover:bg-brand-900"
                  >
                    Day {item.dayNumber} · {day?.title}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <DifficultToggleButton
                  vocabularyId={item.id}
                  dayNumber={item.dayNumber}
                  initialIsDifficult={item.isDifficult}
                  showLabel
                />
              </div>
            </div>

            <div className="space-y-4 border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <div>
                <SmallLabel>Definition</SmallLabel>
                <p className="mt-1 text-lg leading-relaxed text-zinc-900 dark:text-zinc-100">{item.definition}</p>
              </div>

              <div className="border-s-2 border-brand-200 ps-3 dark:border-brand-800">
                <SmallLabel>Example sentence</SmallLabel>
                <div className="mt-1 flex items-start gap-2">
                  <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
                    &ldquo;{item.example}&rdquo;
                  </p>
                  <AudioButton text={item.example} rate={audioRate} small />
                </div>
              </div>
            </div>

            {item.verbForms && (
              <div>
                <SmallLabel className="mb-1.5">Verb conjugations · تصريفات الفعل الثلاثة</SmallLabel>
                <div className="grid grid-cols-1 divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50">
                  {verbCells.map((cell) => (
                    <div key={cell.key} className="px-3 py-3">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{cell.key}</p>
                      <p className="mt-0.5 break-words font-mono text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {cell.value}
                      </p>
                      <p dir="rtl" className="text-xs text-zinc-500 dark:text-zinc-400">
                        {cell.ar}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-zinc-100 pt-5 sm:grid-cols-2 dark:border-zinc-800">
              {item.collocations.length > 0 && (
                <div>
                  <SmallLabel className="mb-1.5">Common collocations</SmallLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {item.collocations.map((c, i) => (
                      <Tag key={i}>{c}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {item.relatedForms.length > 0 && (
                <div>
                  <SmallLabel className="mb-1.5">Related forms</SmallLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {item.relatedForms.map((r, i) => (
                      <Tag key={i} className="font-mono">
                        {r}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {item.synonyms.length > 0 && (
                <div>
                  <SmallLabel className="mb-1.5">Synonyms</SmallLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {item.synonyms.map((s, i) => (
                      <Tag key={i} tone="success">
                        {s}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {item.antonyms.length > 0 && (
                <div>
                  <SmallLabel className="mb-1.5">Antonyms</SmallLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {item.antonyms.map((a, i) => (
                      <Tag key={i} tone="danger">
                        {a}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {item.tags.length > 0 && (
                <div className="sm:col-span-2">
                  <SmallLabel className="mb-1.5">Topic tags</SmallLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, i) => (
                      <Tag key={i} tone="accent">
                        #{tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <div>
                <SmallLabel className="mb-1">الكلمات الصعبة · Difficult words</SmallLabel>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  احفظ هذه الكلمة لتظهر في قسم الكلمات الصعبة لمراجعتها بسهولة في أي وقت.
                </p>
              </div>
              <DifficultToggleButton
                vocabularyId={item.id}
                dayNumber={item.dayNumber}
                initialIsDifficult={item.isDifficult}
                showLabel
              />
            </div>
          </Card>

          <section aria-label="Contextual appearances" className="space-y-3">
            <SectionHeading title="Contextual Appearances" description="Where this word shows up in the curriculum." />

            {grammarExamples.length > 0 && (
              <Card className="space-y-3">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Grammar lesson examples</h3>
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {grammarExamples.map((ex, i) => (
                    <li
                      key={i}
                      className="flex flex-col gap-1 py-2.5 text-sm first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                    >
                      <span className="text-zinc-800 dark:text-zinc-200">&ldquo;{ex.sentence}&rdquo;</span>
                      <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                        Lesson: {ex.lessonTitle}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <Card className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Conversations using this word ({conversations.length})
              </h3>
              {conversations.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Not featured in conversation dialogues yet.
                </p>
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {conversations.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-col gap-1 py-2.5 text-sm first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">{c.title}</span>
                      <Link
                        href={`/day/${c.dayNumber}?tab=conversations`}
                        className="shrink-0 text-xs font-medium text-brand-700 hover:underline dark:text-brand-300"
                      >
                        Go to Day {c.dayNumber} Conversation →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="space-y-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Readings &amp; paragraphs ({paragraphs.length})
              </h3>
              {paragraphs.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Not featured in reading paragraphs yet.</p>
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {paragraphs.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-col gap-1 py-2.5 text-sm first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">{p.title}</span>
                      <Link
                        href={`/day/${p.dayNumber}?tab=paragraphs`}
                        className="shrink-0 text-xs font-medium text-brand-700 hover:underline dark:text-brand-300"
                      >
                        Go to Day {p.dayNumber} Paragraph →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        </div>

        {/* ─── Side column: learning history ─── */}
        <aside aria-label="Learning history">
          <Card className="space-y-3">
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Learning history</h2>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                Complete chronological record of your study actions for this word.
              </p>
            </div>

            {history.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No actions recorded yet. Start studying on Day {item.dayNumber}!
              </p>
            ) : (
              <ol className="relative ms-1.5 space-y-4 border-s border-zinc-200 ps-4 dark:border-zinc-700">
                {history.map((h) => (
                  <li key={h.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -start-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-600 dark:border-zinc-900 dark:bg-brand-400"
                    />
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{h.event}</p>
                    <time className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(h.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    {h.detail && <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{h.detail}</p>}
                    {h.dayNumber && (
                      <p className="mt-0.5 text-xs text-brand-700 dark:text-brand-300">During Day {h.dayNumber}</p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
