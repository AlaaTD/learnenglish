import Link from "next/link";

const tabs = [
  { key: "vocabulary", label: "Vocabulary", icon: "📚", count: "50" },
  { key: "grammar", label: "Grammar", icon: "🧩" },
  { key: "conversations", label: "Conversations", icon: "💬", count: "3" },
  { key: "paragraphs", label: "Paragraphs", icon: "📖", count: "3" },
  { key: "words", label: "My Words", icon: "🔖" },
] as const;

export type DayTab = (typeof tabs)[number]["key"];

export function DayTabs({ day, active }: { day: number; active: DayTab }) {
  return (
    <nav
      aria-label="Day sections"
      className="sticky top-14 z-30 rounded-2xl bg-white/90 p-1.5 backdrop-blur-md dark:bg-zinc-900/90 ring-1 ring-zinc-950/5 dark:ring-white/10 shadow-xs"
    >
      <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-0.5 scroll-smooth">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.key} className="shrink-0 sm:flex-1">
              <Link
                href={`/day/${day}?tab=${tab.key}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500"
                    : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                }`}
              >
                <span className="text-sm sm:text-base leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
                {"count" in tab && tab.count ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] sm:text-xs font-bold leading-none ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
