import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsForm } from "@/components/settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const settings = await db.userSettings.findUnique({
    where: { userId: user.id },
  });

  const initial = {
    theme: settings?.theme ?? "system",
    dailyTarget: settings?.dailyTarget ?? 50,
    autoplayAudio: settings?.autoplayAudio ?? false,
    audioSpeed: settings?.audioSpeed ?? "normal",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Preferences &amp; Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Customize your audio speed, theme, and learning environment.
        </p>
      </header>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <SettingsForm initialSettings={initial} userName={user.name} />
      </div>
    </div>
  );
}
