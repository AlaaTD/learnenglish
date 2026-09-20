import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDaySummaries } from "@/lib/queries";

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
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Curriculum Administration
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Content verification and curriculum overview for all 90 days.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Admin Access
          </span>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">Curriculum Days</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{days.length} / 90</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">Total Vocabulary</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalVocab} / 4,500</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">Grammar Lessons</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalGrammar}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">Conversations</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalConv}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">Paragraphs</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalParas}</p>
        </div>
      </div>

      {/* Days Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Title</th>
              <th className="hidden px-4 py-3 sm:table-cell">Stage</th>
              <th className="px-4 py-3 text-right">Preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {days.map((d) => (
              <tr key={d.dayNumber} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-4 py-3 font-mono font-medium text-zinc-500">
                  Day {String(d.dayNumber).padStart(2, "0")}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{d.title}</span>
                  <span className="block text-xs text-zinc-400">{d.topic}</span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-zinc-500 sm:table-cell">{d.stage}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/day/${d.dayNumber}`}
                    className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Open Lesson →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
