import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDaySummaries } from "@/lib/queries";
import { Badge, Card, PageHeader, StatTile } from "@/components/ui";

export const metadata = { title: "Curriculum Admin" };

export default async function AdminPage() {
  const user = await requireUser();
  if (user.role !== "ADMIN") notFound();

  const [days, totalVocab, totalGrammar, totalConv, totalParas] = await Promise.all([
    getDaySummaries(),
    db.vocabularyItem.count(),
    db.grammarLesson.count(),
    db.conversation.count(),
    db.paragraph.count(),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Curriculum Administration"
        description="Content verification and curriculum overview for all 90 days."
        actions={
          <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            Admin Access
          </Badge>
        }
      />

      <section aria-label="Curriculum totals" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Curriculum days" value={`${days.length} / 90`} />
        <StatTile label="Total vocabulary" value={`${totalVocab} / 4,500`} />
        <StatTile label="Grammar lessons" value={totalGrammar} />
        <StatTile label="Conversations" value={totalConv} />
        <StatTile label="Paragraphs" value={totalParas} />
      </section>

      <Card padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Day
                </th>
                <th scope="col" className="px-4 py-3">
                  Title
                </th>
                <th scope="col" className="hidden px-4 py-3 sm:table-cell">
                  Stage
                </th>
                <th scope="col" className="px-4 py-3 text-end">
                  Preview
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {days.map((d) => (
                <tr key={d.dayNumber} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-medium tabular-nums text-zinc-600 dark:text-zinc-400">
                    Day {String(d.dayNumber).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{d.title}</span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">{d.topic}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-zinc-600 sm:table-cell dark:text-zinc-400">
                    {d.stage}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      href={`/day/${d.dayNumber}`}
                      className="whitespace-nowrap text-xs font-medium text-brand-700 hover:underline dark:text-brand-300"
                    >
                      Open Lesson →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
