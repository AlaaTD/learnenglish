"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/day/1", label: "Day 1" },
  { href: "/journey", label: "90-Day Journey" },
  { href: "/vocabulary", label: "My Vocabulary" },
  { href: "/review", label: "Review" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" },
];

export function Nav({ userName, isAdmin }: { userName: string; isAdmin: boolean }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            90
          </span>
          <span className="hidden sm:inline">English90</span>
        </Link>
        <nav aria-label="Main" className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center gap-1 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block whitespace-nowrap rounded-lg px-3 py-1.5 transition-colors ${
                    isActive(link.href)
                      ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isAdmin ? (
              <li>
                <Link
                  href="/admin"
                  className={`block whitespace-nowrap rounded-lg px-3 py-1.5 transition-colors ${
                    pathname.startsWith("/admin")
                      ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  Admin
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            title="Learner Settings"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>{userName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
