"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconChevronDown } from "@/components/dashboard/icons";

type IconName = "home" | "day" | "journey" | "words" | "review" | "progress" | "settings" | "admin" | "difficult" | "grammar";

// Simple stroke icons (one consistent style, inherit the text colour) — replaces
// the multi-coloured emoji that added visual noise and rendered differently per OS.
const iconPaths: Record<IconName, string> = {
  home: "M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z",
  day: "M8 3v3M16 3v3M4 8h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
  grammar: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  journey: "M5 21V4m0 0h11l-2 4 2 4H5",
  words: "M4 5.5A1.5 1.5 0 015.5 4H19v14H5.5A1.5 1.5 0 004 19.5v-14zM4 19.5A1.5 1.5 0 005.5 21H19",
  review: "M20 12a8 8 0 11-2.34-5.66M20 4v5h-5",
  difficult: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
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
    { href: "/grammar", label: "Grammar", short: "Grammar", icon: "grammar", match: startsWith("/grammar") },
    { href: "/journey", label: "Journey", short: "Journey", icon: "journey", match: startsWith("/journey") },
    { href: "/review", label: "Difficult Words", short: "Difficult", icon: "difficult", match: startsWith("/review") },
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
  const settingsActive = startsWith("/settings")(pathname);

  return (
    <>
      {/* Floating Island Header Container */}
      <header className="sticky top-0 z-40 w-full px-3 pt-2.5 pb-1 sm:px-6 transition-all duration-300">
        <div className="relative mx-auto flex h-[68px] sm:h-[72px] w-full max-w-[1548px] items-center justify-between rounded-2xl lg:rounded-full border border-night-700/80 bg-night-950/85 px-3.5 sm:px-5 shadow-[0_12px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
          
          {/* Left: Brand Identity Pod */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3 transition-transform duration-200 active:scale-95"
              onClick={closeMenu}
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ring-[2px] ring-brand-500/40 bg-night-900 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:ring-brand-400">
                <Image
                  src="/logo.png"
                  alt="English90 Logo"
                  width={44}
                  height={44}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[19px] font-bold leading-none tracking-tight text-white">
                    English<span className="text-clay-300">90</span>
                  </span>
                  <span className="hidden xl:inline-flex items-center rounded-full bg-brand-900/80 px-2 py-0.5 text-[9.5px] font-semibold tracking-wide text-brand-300 ring-1 ring-brand-700/60">
                    ACADEMY
                  </span>
                </div>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-mist-500">
                  90-Day System
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Segmented Floating Navigation Dock (Desktop) */}
          <nav
            aria-label="Main"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-night-700/70 bg-night-900/75 p-1 shadow-inner backdrop-blur-md lg:flex"
          >
            {[...primary, ...secondary.filter((item) => item.href !== "/settings")].map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13.5px] transition-all duration-200 ${
                    active
                      ? "bg-brand-600 font-semibold text-white shadow-[0_2px_10px_rgba(63,82,163,0.45)] ring-1 ring-white/15"
                      : "font-medium text-mist-400 hover:bg-white/[0.05] hover:text-mist-100"
                  }`}
                >
                  <Icon name={item.icon} className={`h-4 w-4 ${active ? "text-white" : "text-mist-400"}`} />
                  <span>{item.label}</span>
                  {item.href.startsWith("/day") && (
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-night-800 text-brand-300 ring-1 ring-brand-600/30"
                      }`}
                    >
                      {currentDay}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: User Status & Action Pill */}
          <div className="flex items-center gap-2.5">
            {/* Live Progress Pill (Desktop XL) */}
            <Link
              href={`/day/${currentDay}`}
              title="Today's learning unit"
              className="hidden xl:flex items-center gap-2 rounded-full border border-night-700/80 bg-night-900/60 px-3 py-1.5 text-xs transition-colors hover:border-brand-600/60 hover:bg-night-800/80"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-semibold text-mist-200">Day {currentDay}</span>
              <span className="text-mist-500">/ 90</span>
            </Link>

            {/* Learner Profile Capsule */}
            <Link
              href="/settings"
              title="Learner profile & settings"
              aria-current={settingsActive ? "page" : undefined}
              className={`hidden sm:flex items-center gap-2.5 rounded-full border p-1 pe-3.5 transition-all duration-200 ${
                settingsActive
                  ? "border-brand-500 bg-brand-900/50 shadow-[0_0_12px_rgba(63,82,163,0.35)]"
                  : "border-night-700/80 bg-night-900/60 hover:border-brand-600/60 hover:bg-night-800/80"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white shadow-sm ring-1 ring-white/15">
                {initial}
              </span>
              <div className="flex flex-col text-left">
                <span className="max-w-[100px] truncate text-xs font-semibold leading-tight text-zinc-100">{userName}</span>
                <span className="text-[10px] leading-tight text-mist-500">{isAdmin ? "Admin" : "Learner"}</span>
              </div>
              <IconChevronDown className="h-3.5 w-3.5 text-mist-400 transition-transform duration-200" />
            </Link>

            {/* Mobile Unified Menu & Profile Pill (Clean, uncluttered single button) */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex sm:hidden items-center gap-2 rounded-full border border-night-700/80 bg-night-900/90 py-1 pe-2.5 ps-1 text-mist-200 shadow-sm transition-all duration-200 active:scale-95 hover:bg-night-800 hover:border-brand-600/50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white ring-1 ring-white/15">
                {initial}
              </span>
              <svg
                className="h-4 w-4 text-mist-300"
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

            {/* Tablet-only Menu Toggle Button (between sm and lg) */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="hidden sm:flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-night-700/80 bg-night-900/80 text-mist-200 transition-colors hover:bg-night-800 hover:text-white"
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

      {/* Floating Mobile Glass Sheet Menu */}
      {menuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[4px]" onClick={closeMenu} aria-hidden="true" />
          <div className="fixed inset-x-3 top-[76px] z-50 mx-auto max-w-lg rounded-2xl border border-night-700/90 bg-night-900/95 p-3.5 shadow-2xl backdrop-blur-2xl animate-reveal">
            {/* User Info Header Card */}
            <div className="mb-3 flex items-center justify-between rounded-xl bg-night-800/80 p-3 ring-1 ring-inset ring-night-700/80">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white shadow-sm ring-1 ring-white/10">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-mist-100">{userName}</p>
                  <p className="text-xs text-mist-400">{isAdmin ? "System Administrator" : "Daily Learner"}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-night-950 px-2.5 py-1 text-xs font-semibold text-mist-200 ring-1 ring-night-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Day {currentDay}
              </span>
            </div>

            {/* Destinations */}
            <nav aria-label="More" className="space-y-1">
              {secondary.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-800/60 font-semibold text-white shadow-sm ring-1 ring-brand-500/30"
                        : "text-zinc-200 hover:bg-night-800/80 hover:text-white"
                    }`}
                  >
                    <Icon name={item.icon} className="h-4 w-4 text-mist-400" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Phone Bottom Navigation Bar — Solid, clear contrast, prominent active indicators */}
      <nav
        aria-label="Quick navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-night-700 bg-night-900/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.7)] backdrop-blur-2xl lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5 px-1 py-1.5">
          {primary.map((item) => {
            const active = item.match(pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center gap-1 py-1 transition-transform duration-150 active:scale-90"
                >
                  <span
                    className={`flex h-7.5 w-12 sm:w-14 items-center justify-center rounded-full transition-all duration-200 ${
                      active
                        ? "bg-brand-600 text-white shadow-[0_2px_12px_rgba(63,82,163,0.6)] ring-1 ring-white/20"
                        : "text-mist-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <Icon name={item.icon} className={`h-5 w-5 ${active ? "text-white" : "text-mist-300"}`} />
                  </span>
                  <span
                    className={`max-w-full truncate px-0.5 text-[11px] leading-tight ${
                      active ? "font-bold text-white tracking-wide" : "font-medium text-mist-400"
                    }`}
                  >
                    {item.short}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
