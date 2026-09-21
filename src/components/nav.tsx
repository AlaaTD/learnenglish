"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type IconName = "home" | "day" | "journey" | "words" | "review" | "progress" | "settings" | "admin";

// Simple stroke icons (one consistent style, inherit the text colour) — replaces
// the multi-coloured emoji that added visual noise and rendered differently per OS.
const iconPaths: Record<IconName, string> = {
  home: "M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z",
  day: "M8 3v3M16 3v3M4 8h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
  journey: "M5 21V4m0 0h11l-2 4 2 4H5",
  words: "M4 5.5A1.5 1.5 0 015.5 4H19v14H5.5A1.5 1.5 0 004 19.5v-14zM4 19.5A1.5 1.5 0 005.5 21H19",
  review: "M20 12a8 8 0 11-2.34-5.66M20 4v5h-5",
  progress: "M5 20V11M12 20V4M19 20v-6",
  settings: "M4 7h9m4 0h3M4 17h3m4 0h9M15 4v6M9 14v6",
  admin: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z",
};

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

type NavItem = {
  href: string;
  label: string;
  short: string;
  icon: IconName;
  match: (pathname: string) => boolean;
};

const startsWith = (prefix: string) => (pathname: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export function Nav({
  userName,
  isAdmin,
  currentDay,
}: {
  userName: string;
  isAdmin: boolean;
  currentDay: number;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Primary learning destinations — shown in the desktop header AND the phone bottom bar.
  const primary: NavItem[] = [
    { href: "/", label: "Home", short: "Home", icon: "home", match: (p) => p === "/" },
    {
      href: `/day/${currentDay}`,
      label: `Day ${currentDay}`,
      short: `Day ${currentDay}`,
      icon: "day",
      match: startsWith("/day"),
    },
    { href: "/journey", label: "Journey", short: "Journey", icon: "journey", match: startsWith("/journey") },
    { href: "/vocabulary", label: "Vocabulary", short: "Words", icon: "words", match: startsWith("/vocabulary") },
    { href: "/review", label: "Review", short: "Review", icon: "review", match: startsWith("/review") },
  ];

  // Secondary destinations — desktop header, and the phone "Menu" sheet only.
  const secondary: NavItem[] = [
    { href: "/progress", label: "Progress", short: "Progress", icon: "progress", match: startsWith("/progress") },
    { href: "/settings", label: "Settings", short: "Settings", icon: "settings", match: startsWith("/settings") },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", short: "Admin", icon: "admin" as const, match: startsWith("/admin") }]
      : []),
  ];

  // Lock page scroll and support Escape while the phone menu is open
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const initial = (userName.trim()[0] ?? "L").toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3 transition-transform active:scale-95"
            onClick={closeMenu}
          >
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full p-0.5 shadow-sm ring-2 ring-indigo-500/40 transition-all duration-300 group-hover:ring-indigo-500 group-hover:shadow-[0_0_16px_rgba(99,102,241,0.5)] dark:ring-indigo-400/50 dark:group-hover:ring-indigo-400">
              <Image
                src="/logo.png"
                alt="English90 Circular Logo"
                width={40}
                height={40}
                priority
                className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
                English<span className="text-indigo-600 dark:text-indigo-400">90</span>
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-wider text-zinc-400 sm:inline dark:text-zinc-500">
                Mastery Academy
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {[...primary, ...secondary].map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-indigo-50 font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
                      : "font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: learner chip (desktop) / menu button (phones + tablets) */}
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              title="Learner settings"
              className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white py-1 pe-3 ps-1 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 sm:flex dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-indigo-700"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {initial}
              </span>
              <span className="max-w-[110px] truncate">{userName}</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 lg:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Phone menu: secondary destinations only (primary ones live in the bottom bar) */}
      {menuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-30 bg-black/40" onClick={closeMenu} aria-hidden="true" />
          <div className="fixed inset-x-0 top-14 z-30 border-b border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{userName}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Learner profile</p>
              </div>
            </div>
            <nav aria-label="More" className="space-y-1">
              {secondary.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Phone bottom bar: the five learning destinations */}
      <nav
        aria-label="Quick navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {primary.map((item) => {
            const active = item.match(pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 pb-2 pt-2.5 text-xs transition-colors ${
                    active
                      ? "font-semibold text-indigo-800 dark:text-indigo-200"
                      : "font-medium text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-indigo-100 dark:bg-indigo-950" : ""
                    }`}
                  >
                    <Icon name={item.icon} />
                  </span>
                  <span className="max-w-full truncate px-1">{item.short}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
