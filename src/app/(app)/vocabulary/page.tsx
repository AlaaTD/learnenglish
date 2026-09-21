import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLibrary, type LibraryParams } from "@/lib/queries";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";
import { VocabularyCard } from "@/components/vocabulary-card";
import { Card, EmptyState, PageHeader, Tag, TabBar, buttonClass, fieldClass, type TabBarItem } from "@/components/ui";

export const metadata = { title: "Vocabulary Library & Difficult Words" };

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; state?: string; day?: string; sort?: string; page?: string }>;
}) {
  const user = await requireUser();
  const { q, state, day: dayParam, sort = "headword", page: pageParam = "1" } = await searchParams;

  const page = Math.max(1, parseInt(pageParam, 10) || 1);
  const day = dayParam ? parseInt(dayParam, 10) || undefined : undefined;
  const isDifficult = state === "DIFFICULT";

  const queryParams: LibraryParams = {
    query: q,
    state,
    day,
    sort,
    page,
    pageSize: 30,
  };

  const { items, total, pageCount, difficultCount } = await getLibrary(user.id, queryParams);

  const settings = await db.userSettings.findUnique({ where: { userId: user.id } });
  const audioRate = settings?.audioSpeed === "slow" ? 0.8 : 1;
  const autoplayAudio = settings?.autoplayAudio ?? false;

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

  const tabs: TabBarItem[] = [
    {
      key: "ALL",
      label: "All Words · جميع الكلمات",
      href: tabHref(undefined),
      active: !isDifficult,
    },
    {
      key: "DIFFICULT",
      label: "Difficult Words · الكلمات الصعبة",
      href: tabHref("DIFFICULT"),
      active: isDifficult,
      count: difficultCount,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header: Title and topic */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist-500">
            <span className="rounded-full bg-brand-900/80 px-2.5 py-0.5 text-brand-300 ring-1 ring-brand-700/60">
              Vocabulary Library
            </span>
            <span className="text-mist-400">· 4,500 Words</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {isDifficult ? "الكلمات الصعبة المحفوظة" : "Master Vocabulary Library"}
          </h1>
          <p className="mt-1 text-sm text-mist-400 max-w-2xl">
            {isDifficult
              ? "الكلمات التي قمت بتمييزها ككلمات صعبة للرجوع إليها ومراجعتها في أي وقت."
              : "تصفح وابحث في كافة كلمات المنهج (4,500 كلمة) مع تصريفاتها ونطقها وأمثلتها."}
          </p>
        </div>
      </div>

      {/* Toolbar: search + day & sort filters (responsive 2-col on mobile) */}
      <Card className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-night-700/80 bg-night-900/60 shadow-lg backdrop-blur-sm">
        <div className="min-w-0 flex-1">
          <SearchInput placeholder={isDifficult ? "ابحث في كلماتك الصعبة..." : "Search word, phrase, definition, or tag..."} />
        </div>
        <form method="GET" className="grid grid-cols-2 sm:flex sm:items-center gap-2">
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
            className={`${fieldClass} w-full rounded-xl bg-night-800 border-night-700 text-mist-200 text-xs sm:text-sm py-2 px-3`}
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
            className={`${fieldClass} w-full rounded-xl bg-night-800 border-night-700 text-mist-200 text-xs sm:text-sm py-2 px-3`}
          >
            <option value="headword">A – Z</option>
            <option value="day">By Day</option>
          </select>
          <button
            type="submit"
            className="col-span-2 sm:col-auto inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-brand-500 transition-colors"
          >
            Apply
          </button>
        </form>
      </Card>

      {/* Clean 2-tab switcher: All Words vs Difficult Words */}
      <TabBar label="Vocabulary view" items={tabs} />

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-mist-400">
        <span>
          Showing <span className="font-semibold tabular-nums text-white">{items.length}</span> of{" "}
          <span className="font-semibold tabular-nums text-white">{total}</span> words
        </span>
        {day && <Tag tone="accent">Filtered to Day {day}</Tag>}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={
            isDifficult
              ? q
                ? "لا توجد كلمات صعبة مطابقة لبحثك"
                : "لم تقم بحفظ أي كلمات صعبة بعد"
              : "No words found"
          }
          action={{
            href: isDifficult ? "/vocabulary" : "/vocabulary",
            label: isDifficult ? "تصفح جميع الكلمات" : "Reset filters",
          }}
        >
          {isDifficult
            ? q
              ? `لا توجد كلمة صعبة تطابق "${q}". جرب كلمة أخرى أو أزل البحث.`
              : "أثناء دراسة كلمات أي يوم، اضغط على زر النجمة ⭐ بجانب أي كلمة لحفظها هنا ومراجعتها في أي وقت بسهولة."
            : q
            ? `No vocabulary matching "${q}". Try another search term.`
            : "No words in this category yet."}
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
