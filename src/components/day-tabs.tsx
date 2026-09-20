import Link from "next/link";

const tabs = [
  { key: "vocabulary", label: "Vocabulary" },
  { key: "grammar", label: "Grammar" },
  { key: "conversations", label: "Conversations" },
  { key: "paragraphs", label: "Paragraphs" },
  { key: "words", label: "My Words" },
] as const;

export type DayTab = (typeof tabs)[number]["key"];

export function DayTabs({ day, active }: { day: number; active: DayTab }) {
  return (
    <nav aria-label="Day sections" className="border-b border-zinc-200 dark:border-zinc-800">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.key}>
              <Link
                href={`/day/${day}?tab=${tab.key}`}
                aria-current={isActive ? "page" : undefined}
                className={`block whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
