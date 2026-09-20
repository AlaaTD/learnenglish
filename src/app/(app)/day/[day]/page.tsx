import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getDayFull, getDayVocabularyWithState } from "@/lib/queries";
import { getDayProgressView } from "@/services/day-progress";
import { DayTabs, type DayTab } from "@/components/day-tabs";
import { VocabularyCard } from "@/components/vocabulary-card";
import { AudioButton } from "@/components/audio-button";
import {
  CompleteDayButton,
  FinishVocabularyButton,
  GrammarViewedButton,
  MarkReadButton,
} from "@/components/day-buttons";
import { Badge, EmptyState, ProgressBar } from "@/components/ui";
import { VocabularyState, VocabularyStateLabel, VocabularyStateStyle } from "@/lib/states";

export const metadata = { title: "Day" };

const VALID_TABS: DayTab[] = ["vocabulary", "grammar", "conversations", "paragraphs", "words"];

export default async function DayPage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireUser();
  const { day: dayParam } = await params;
  const { tab: tabParam } = await searchParams;
  const dayNumber = Number(dayParam);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 90) notFound();

  const day = await getDayFull(dayNumber);
  if (!day) notFound();

  const tab = (VALID_TABS.includes(tabParam as DayTab) ? tabParam : "vocabulary") as DayTab;
  const [vocabulary, progress] = await Promise.all([
    getDayVocabularyWithState(user.id, dayNumber),
    getDayProgressView(user.id, dayNumber),
  ]);

  const learnedCount = vocabulary.filter(
    (v) => v.state !== VocabularyState.UNLEARNED,
  ).length;
  const usedCount = vocabulary.filter((v) => v.usedInConversation).length;
  const ready =
    progress.grammarViewed && progress.allConversationsViewed && progress.allParagraphsViewed;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          {dayNumber > 1 && (
            <Link
              href={`/day/${dayNumber - 1}`}
              className="rounded-lg border border-zinc-200 px-2.5 py-1 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
              aria-label={`Go to Day ${dayNumber - 1}`}
            >
              ← Day {dayNumber - 1}
            </Link>
          )}
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            DAY {String(dayNumber).padStart(2, "0")} / 90
          </span>
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-500 dark:text-zinc-400">{day.stage}</span>
          {dayNumber < 90 && (
            <Link
              href={`/day/${dayNumber + 1}`}
              className="ml-auto rounded-lg border border-zinc-200 px-2.5 py-1 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
              aria-label={`Go to Day ${dayNumber + 1}`}
            >
              Day {dayNumber + 1} →
            </Link>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{day.title}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-300">{day.topic}</p>
          <p className="mt-2 max-w-3xl text-sm text-zinc-500 dark:text-zinc-400">{day.focus}</p>
        </div>

        <div className="max-w-xl">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Day progress</span>
            <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
              {learnedCount} / 50 vocabulary items learned
            </span>
          </div>
          <ProgressBar value={learnedCount} max={50} label="Day vocabulary learned" />
        </div>
      </header>

      <DayTabs day={dayNumber} active={tab} />

      {tab === "vocabulary" && (
        <section aria-label="Today's vocabulary" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Open a word to count it as viewed. {50 - progress.vocabularyViewedCount} of today&apos;s
              words are still unopened.
            </p>
            <FinishVocabularyButton
              dayNumber={dayNumber}
              remaining={50 - progress.vocabularyViewedCount}
            />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {vocabulary.map((word) => (
              <VocabularyCard key={word.id} word={word} trackDay={dayNumber} />
            ))}
          </div>
        </section>
      )}

      {tab === "grammar" && (
        <section aria-label="Today's grammar" className="space-y-6">
          <GrammarViewedButton dayNumber={dayNumber} viewed={progress.grammarViewed} />
          {day.grammarLessons.map((lesson) => (
            <article
              key={lesson.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{lesson.title}</h2>
              <p className="mt-2 max-w-3xl text-zinc-700 dark:text-zinc-200">{lesson.explanation}</p>

              {lesson.structures.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Structure
                  </h3>
                  <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {lesson.structures.map((s, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <span className="mr-2 rounded bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {s.label}
                        </span>
                        <code className="text-zinc-800 dark:text-zinc-200">{s.pattern}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Examples — using today&apos;s vocabulary
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {lesson.examples.map((ex, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-zinc-800 dark:text-zinc-200">
                        {ex.sentence}
                        {ex.usesVocabulary?.length > 0 && (
                          <span className="ml-2 text-xs text-indigo-500 dark:text-indigo-400">
                            ({ex.usesVocabulary.join(", ")})
                          </span>
                        )}
                      </span>
                      <AudioButton text={ex.sentence} small label="Listen to example" />
                    </li>
                  ))}
                </ul>
              </div>

              {lesson.commonUsage.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Common Usage
                  </h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {lesson.commonUsage.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}

              {lesson.commonMistakes.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Common Mistakes
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {lesson.commonMistakes.map((m, i) => (
                      <li key={i} className="text-sm">
                        <span className="text-red-600 line-through decoration-red-300 dark:text-red-400">
                          {m.wrong}
                        </span>
                        <span className="mx-2 text-zinc-400">→</span>
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">{m.right}</span>
                        <span className="ml-2 text-zinc-500 dark:text-zinc-400">— {m.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {tab === "conversations" && (
        <section aria-label="Today's conversations" className="space-y-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            These conversations use today&apos;s vocabulary naturally. Words you already know from
            earlier days appear here again — that&apos;s how they stick.
          </p>
          {day.conversations.map((conversation) => {
            const viewed = progress.conversationsViewedIds.has(conversation.id);
            return (
              <article
                key={conversation.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {conversation.title}
                    </h2>
                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{conversation.setting}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AudioButton text={conversation.lines.map((l) => `${l.speaker}. ${l.text}`).join(" ")} label="Listen to the whole conversation" />
                    <MarkReadButton kind="conversation" dayNumber={dayNumber} id={conversation.id} viewed={viewed} />
                  </div>
                </div>
                <ol className="mt-4 space-y-2.5">
                  {conversation.lines.map((line, i) => (
                    <li key={i} className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {line.speaker}:
                        </span>{" "}
                        {line.text}
                      </p>
                      <AudioButton text={line.text} small label={`Listen to ${line.speaker}`} />
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </section>
      )}

      {tab === "paragraphs" && (
        <section aria-label="Today's paragraphs" className="space-y-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Read each paragraph carefully. Listen along if it helps.
          </p>
          {day.paragraphs.map((paragraph) => {
            const viewed = progress.paragraphsViewedIds.has(paragraph.id);
            return (
              <article
                key={paragraph.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {paragraph.title}
                    </h2>
                    <p className="mt-0.5 text-sm capitalize text-zinc-500 dark:text-zinc-400">{paragraph.kind}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AudioButton text={paragraph.text} label="Listen to the paragraph" />
                    <MarkReadButton kind="paragraph" dayNumber={dayNumber} id={paragraph.id} viewed={viewed} />
                  </div>
                </div>
                <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-800 dark:text-zinc-200">
                  {paragraph.text}
                </p>
              </article>
            );
          })}
        </section>
      )}

      {tab === "words" && (
        <section aria-label="My words for today" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Today&apos;s 50</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">50</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Learned</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{learnedCount}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Used in conversation</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{usedCount}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Not used yet</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{50 - usedCount}</p>
            </div>
          </div>

          {vocabulary.filter((v) => v.state !== "UNLEARNED" || v.usedInConversation).length === 0 ? (
            <EmptyState title="No words from today yet.">
              Learn words from the Vocabulary tab and they will collect here — your personal record
              of today&apos;s work.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {vocabulary
                .filter((v) => v.state !== "UNLEARNED" || v.usedInConversation)
                .map((word) => (
                  <li key={word.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/vocabulary/${word.id}`}
                        className="font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
                      >
                        {word.headword}
                      </Link>
                      <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">{word.definition}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={VocabularyStateStyle[word.state as VocabularyState]}>
                        {VocabularyStateLabel[word.state as VocabularyState]}
                      </Badge>
                      {word.usedInConversation && (
                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Used
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

      <footer className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <CompleteDayButton
          dayNumber={dayNumber}
          ready={ready}
          completed={progress.status === "COMPLETED"}
          nextDay={dayNumber < 90 ? dayNumber + 1 : null}
        />
      </footer>
    </div>
  );
}
