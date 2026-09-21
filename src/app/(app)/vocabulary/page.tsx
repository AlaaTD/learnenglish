import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLibrary, type LibraryParams } from "@/lib/queries";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";
import { VocabularyCard } from "@/components/vocabulary-card";
import { Card, EmptyState, PageHeader, Tag, TabBar, buttonClass, fieldClass } from "@/components/ui";

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

  const settings = await db.userSettings.findUnique({ where: { userId: user.id } });
  const audioRate = settings?.audioSpeed === "slow" ? 0.8 : 1;
  const autoplayAudio = settings?.autoplayAudio ?? false;

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
    <div className="space-y-5">
      <PageHeader
        title="Master Vocabulary Library"
        description="Browse, search, and manage your full 4,500-word curriculum and personal learning states."
      />

      {/* One toolbar: search on the left, day + sort filters on the right */}
      <Card className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <SearchInput placeholder="Search word, phrase, definition, or tag..." />
        </div>
        <form method="GET" className="flex flex-wrap items-center gap-2">
          {q && <input type="hidden" name="q" value={q} />}
          {state && <input type="hidden" name="state" value={state} />}
          <label htmlFor="day-select" className="sr-only">
            Filter by Day
          </label>
          <select
            id="day-select"
            name="day"
            defaultValue={day ?? ""}
            aria-label="Filter by Day"
            className={`${fieldClass} min-w-0 flex-1 sm:flex-none`}
          >
            <option value="">All Days (1–90)</option>
            {Array.from({ length: 90 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                Day {d}
              </option>
            ))}
          </select>
          <label htmlFor="sort-select" className="sr-only">
            Sort by
          </label>
          <select
            id="sort-select"
            name="sort"
            defaultValue={sort}
            aria-label="Sort by"
            className={`${fieldClass} min-w-0 flex-1 sm:flex-none`}
          >
            <option value="headword">A – Z</option>
            <option value="day">By Day</option>
          </select>
          <button type="submit" className={buttonClass("secondary")}>
            Apply
          </button>
        </form>
      </Card>

      <TabBar
        label="Vocabulary states"
        items={TABS.map((t) => ({
          key: t.key,
          label: t.label,
          href: tabHref(t.state),
          active: activeTabKey === t.key,
        }))}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <span>
          Showing <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">{items.length}</span> of{" "}
          <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">{total}</span> words
        </span>
        {day && <Tag tone="accent">Filtered to Day {day}</Tag>}
      </div>

      {items.length === 0 ? (
        <EmptyState title="No words found" action={{ href: "/vocabulary", label: "Reset filters" }}>
          {q ? `No vocabulary matching "${q}". Try another search term.` : "No words in this category yet."}
        </EmptyState>
      ) : (
        <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((word) => (
            <VocabularyCard key={word.id} word={word} audioRate={audioRate} autoplayAudio={autoplayAudio} />
          ))}
        </div>
      )}

      <div className="pt-2">
        <Pagination page={page} pageCount={pageCount} baseParams={baseParams} />
      </div>
    </div>
  );
}
