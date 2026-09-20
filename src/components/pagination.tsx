import Link from "next/link";

export function Pagination({
  page,
  pageCount,
  baseParams,
}: {
  page: number;
  pageCount: number;
  baseParams: URLSearchParams;
}) {
  if (pageCount <= 1) return null;

  function href(target: number) {
    const params = new URLSearchParams(baseParams.toString());
    params.set("page", String(target));
    return `?${params.toString()}`;
  }

  const pages: number[] = [];
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || Math.abs(p - page) <= 2) pages.push(p);
  }
  const visible = pages.filter((p, i) => i === 0 || p - pages[i - 1] <= 3);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Previous
        </Link>
      ) : null}
      {visible.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - visible[i - 1] > 1 && (
            <span className="px-1 text-sm text-zinc-400">…</span>
          )}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              p === page
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }`}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pageCount ? (
        <Link
          href={href(page + 1)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
