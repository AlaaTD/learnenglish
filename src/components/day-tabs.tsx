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
    <nav aria-label="Day sections" className="rounded-2xl bg-zinc-100/80 p-1.5 backdrop-blur-sm dark:bg-zinc-900/80 ring-1 ring-zinc-950/5 dark:ring-white/10">
      <ul className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.key} className="flex-1">
              <Link
                href={`/day/${day}?tab=${tab.key}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-sm shadow-zinc-950/5 ring-1 ring-zinc-950/5 dark:bg-zinc-800 dark:text-indigo-300 dark:ring-white/10"
                    : "text-zinc-600 hover:bg-white/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
                }`}
              >
                <span className="text-base leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
                {"count" in tab && tab.count ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs font-bold leading-none ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        : "bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
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
