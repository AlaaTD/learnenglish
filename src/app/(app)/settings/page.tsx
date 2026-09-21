import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizeAudioProvider } from "@/lib/audio-provider";
import { SettingsForm } from "@/components/settings-form";
import { PageHeader } from "@/components/ui";

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
    audioProvider: normalizeAudioProvider(settings?.audioProvider),
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title="Preferences & Settings"
        description="Customize your audio voice and speed, theme, and learning environment."
      />
      <SettingsForm initialSettings={initial} userName={user.name} />
    </div>
  );
}
