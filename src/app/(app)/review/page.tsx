import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getReviewWords } from "@/lib/queries";
import { AudioButton } from "@/components/audio-button";
import { WordActions } from "@/components/word-actions";
import { Card, EmptyState, PageHeader, Tag } from "@/components/ui";
import { VocabularyState } from "@/lib/states";

export const metadata = { title: "Review" };

export default async function ReviewPage() {
  const user = await requireUser();
  const [words, settings] = await Promise.all([
    getReviewWords(user.id),
    db.userSettings.findUnique({ where: { userId: user.id } }),
  ]);
  const audioRate = settings?.audioSpeed === "slow" ? 0.8 : 1;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Personal Review"
        description="Organize and revisit words you marked for review. No quizzes, tests, or timers — you control your own pace."
        actions={
          words.length > 0 ? (
            <Tag tone="accent">
              {words.length} {words.length === 1 ? "word" : "words"} in review
            </Tag>
          ) : null
        }
      />

      {words.length === 0 ? (
        <EmptyState title="Your review list is empty" action={{ href: "/vocabulary", label: "Browse vocabulary" }}>
          When you want to revisit a word later, click &ldquo;Add to Review&rdquo; on any vocabulary card.
        </EmptyState>
      ) : (
        <div className="grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <Card key={word.id} className="flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/vocabulary/${word.id}`}
                      className="break-words text-lg font-semibold tracking-tight text-zinc-900 hover:text-indigo-700 hover:underline dark:text-zinc-50 dark:hover:text-indigo-300"
                    >
                      {word.headword}
                    </Link>
                    {word.pronunciation && (
                      <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">{word.pronunciation}</p>
                    )}
                  </div>
                  <AudioButton text={word.headword} rate={audioRate} small />
                </div>

                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{word.definition}</p>

                <p className="mt-2 border-s-2 border-indigo-200 ps-3 text-sm leading-relaxed text-zinc-600 dark:border-indigo-800 dark:text-zinc-400">
                  &ldquo;{word.example}&rdquo;
                </p>
              </div>

              <div className="space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <div className="flex items-center justify-between text-xs">
                  <Link
                    href={`/day/${word.dayNumber}`}
                    className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    Day {word.dayNumber}
                  </Link>
                  <Link
                    href={`/vocabulary/${word.id}`}
                    className="font-medium text-indigo-700 hover:underline dark:text-indigo-300"
                  >
                    History →
                  </Link>
                </div>
                <WordActions
                  vocabularyId={word.id}
                  dayNumber={word.dayNumber}
                  initialState={{
                    state: VocabularyState.REVIEW,
                    usedInConversation: false,
                  }}
                  compact
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
