import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getLibrary, type LibraryParams } from "@/lib/queries";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";
import { VocabularyCard } from "@/components/vocabulary-card";
import { EmptyState } from "@/components/ui";

export const metadata = { title: "My Vocabulary" };

const TABS = [
  { key: "ALL", label: "All Words", state: undefined },
  { key: "UNLEARNED", label: "Unlearned", state: "UNLEARNED" },
  { key: "LEARNING", label: "Learning", state: "LEARNING" },
  { key: "REVIEW", label: "Review", state: "REVIEW" },
  { key: "MASTERED", label: "Mastered", state: "MASTERED" },
  { key: "USED", label: "Used in Conversation", state: "USED" },
];

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; state?: string; day?: string; sort?: string; page?: string }>;
}) {
  const user = await requireUser();
  const { q, state, day: dayParam, sort = "headword", page: pageParam = "1" } = await searchParams;

  const page = Math.max(1, parseInt(pageParam, 10) || 1);
  const day = dayParam ? parseInt(dayParam, 10) || undefined : undefined;

  const queryParams: LibraryParams = {
    query: q,
    state,
    day,
    sort,
    page,
    pageSize: 30,
  };

  const { items, total, pageCount } = await getLibrary(user.id, queryParams);

  const activeTabKey = state ?? "ALL";

  function tabHref(tabState?: string) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (tabState) p.set("state", tabState);
    if (day) p.set("day", String(day));
    if (sort !== "headword") p.set("sort", sort);
    return `?${p.toString()}`;
  }

  const baseParams = new URLSearchParams();
  if (q) baseParams.set("q", q);
  if (state) baseParams.set("state", state);
  if (day) baseParams.set("day", String(day));
  if (sort) baseParams.set("sort", sort);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Master Vocabulary Library
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Browse, search, and manage your full 4,500-word curriculum and personal learning states.
        </p>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Search word, phrase, definition, or tag..." />
        <div className="flex items-center gap-3">
          <form method="GET" className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            {q && <input type="hidden" name="q" value={q} />}
            {state && <input type="hidden" name="state" value={state} />}
            <label htmlFor="day-select" className="sr-only">Filter by Day</label>
            <select
              id="day-select"
              name="day"
              defaultValue={day ?? ""}
              aria-label="Filter by Day"
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="">All Days (1–90)</option>
              {Array.from({ length: 90 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <select
              id="sort-select"
              name="sort"
              defaultValue={sort}
              aria-label="Sort by"
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              <option value="headword">A – Z</option>
              <option value="day">By Day</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      {/* Tabs */}
      <nav aria-label="Vocabulary States" className="border-b border-zinc-200 dark:border-zinc-800">
        <ul className="-mb-px flex flex-wrap gap-2 text-sm">
          {TABS.map((t) => {
            const active = activeTabKey === t.key;
            return (
              <li key={t.key}>
                <Link
                  href={tabHref(t.state)}
                  aria-current={active ? "page" : undefined}
                  className={`inline-block border-b-2 px-3 py-2 font-medium transition-colors ${
                    active
                      ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                      : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Results header */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          Showing {items.length} of {total} words
        </span>
        {day && <span>Filtered to Day {day}</span>}
      </div>

      {/* Word Cards Grid */}
      {items.length === 0 ? (
        <EmptyState
          title="No words found"
          action={{ href: "/vocabulary", label: "Reset filters" }}
        >
          {q
            ? `No vocabulary matching "${q}". Try another search term.`
            : "No words in this category yet."}
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((word) => (
            <VocabularyCard key={word.id} word={word} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pt-4">
        <Pagination page={page} pageCount={pageCount} baseParams={baseParams} />
      </div>
    </div>
  );
}
