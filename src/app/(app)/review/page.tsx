import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getReviewWords } from "@/lib/queries";
import { AudioButton } from "@/components/audio-button";
import { WordActions } from "@/components/word-actions";
import { EmptyState } from "@/components/ui";
import { VocabularyState } from "@/lib/states";

export const metadata = { title: "Review" };

export default async function ReviewPage() {
  const user = await requireUser();
  const words = await getReviewWords(user.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Personal Review
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Organize and revisit words you marked for review. No quizzes, tests, or timers — you control your own pace.
        </p>
      </header>

      {words.length === 0 ? (
        <EmptyState
          title="Your review list is empty"
          action={{ href: "/vocabulary", label: "Browse vocabulary" }}
        >
          When you want to revisit a word later, click &ldquo;Add to Review&rdquo; on any vocabulary card.
        </EmptyState>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>{words.length} words currently in review</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {words.map((word) => (
              <div
                key={word.id}
                className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/vocabulary/${word.id}`}
                        className="text-lg font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
                      >
                        {word.headword}
                      </Link>
                      {word.pronunciation && (
                        <p className="font-mono text-xs text-zinc-400">{word.pronunciation}</p>
                      )}
                    </div>
                    <AudioButton text={word.headword} small />
                  </div>

                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{word.definition}</p>

                  <p className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-400">
                    &ldquo;{word.example}&rdquo;
                  </p>
                </div>

                <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
                    <Link
                      href={`/day/${word.dayNumber}`}
                      className="hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      Day {word.dayNumber}
                    </Link>
                    <Link
                      href={`/vocabulary/${word.id}`}
                      className="text-indigo-600 hover:underline dark:text-indigo-400"
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
