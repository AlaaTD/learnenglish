import { TabBar } from "./ui";

const tabs = [
  { key: "vocabulary", label: "Vocabulary", count: "50" },
  { key: "grammar", label: "Grammar" },
  { key: "conversations", label: "Conversations", count: "3" },
  { key: "paragraphs", label: "Paragraphs", count: "3" },
  { key: "words", label: "My Words" },
] as const;

export type DayTab = (typeof tabs)[number]["key"];

export function DayTabs({ day, active }: { day: number; active: DayTab }) {
  return (
    <TabBar
      sticky
      label="Day sections"
      items={tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        href: `/day/${day}?tab=${tab.key}`,
        active: tab.key === active,
        count: "count" in tab ? tab.count : undefined,
      }))}
    />
  );
}
