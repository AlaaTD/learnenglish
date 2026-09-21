import Link from "next/link";
import { buttonClass } from "./ui";

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
        <Link href={href(page - 1)} className={buttonClass("secondary", "md", "px-3.5")}>
          Previous
        </Link>
      ) : null}
      {visible.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - visible[i - 1] > 1 && (
            <span aria-hidden="true" className="px-1 text-sm text-zinc-500 dark:text-zinc-400">
              …
            </span>
          )}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={buttonClass(p === page ? "primary" : "secondary", "md", "min-w-10 px-3 tabular-nums")}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pageCount ? (
        <Link href={href(page + 1)} className={buttonClass("secondary", "md", "px-3.5")}>
          Next
        </Link>
      ) : null}
    </nav>
  );
}
