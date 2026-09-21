"use client";

import { useActionState, useState, type ReactNode } from "react";
import { updateSettingsAction } from "@/actions/settings";
import { normalizeAudioProvider, type AudioProvider } from "@/lib/audio-provider";
import { Card, ErrorState, SectionHeading, buttonClass, fieldClass } from "./ui";

/** Label + control + optional hint, laid out the same way for every setting. */
function Field({
  htmlFor,
  label,
  hint,
  children,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-zinc-600 dark:text-zinc-400">{hint}</p> : null}
    </div>
  );
}

export function SettingsForm({
  initialSettings,
  userName,
}: {
  initialSettings: {
    theme: string;
    dailyTarget: number;
    autoplayAudio: boolean;
    audioSpeed: string;
    audioProvider: string;
  };
  userName: string;
}) {
  const [theme, setTheme] = useState(initialSettings.theme);
  const [dailyTarget, setDailyTarget] = useState(initialSettings.dailyTarget);
  const [autoplayAudio, setAutoplayAudio] = useState(initialSettings.autoplayAudio);
  const [audioSpeed, setAudioSpeed] = useState(initialSettings.audioSpeed);
  const [audioProvider, setAudioProvider] = useState<AudioProvider>(
    normalizeAudioProvider(initialSettings.audioProvider),
  );
  const [name, setName] = useState(userName);
  const [saved, setSaved] = useState(false);

  const [state, formAction, pending] = useActionState(
    async () => {
      setSaved(false);
      const res = await updateSettingsAction({
        theme,
        dailyTarget: Number(dailyTarget),
        autoplayAudio,
        audioSpeed,
        audioProvider,
        name,
      });
      if (!res.error) setSaved(true);
      return res;
    },
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {saved && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
        >
          Preferences saved successfully.
        </div>
      )}
      {state?.error && <ErrorState message={state.error} />}

      <Card className="space-y-4 sm:p-6">
        <SectionHeading title="Profile" />
        <Field htmlFor="name-input" label="Learner name" hint="Your display name across the platform.">
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${fieldClass} w-full max-w-md`}
          />
        </Field>
      </Card>

      <Card className="space-y-4 sm:p-6">
        <SectionHeading title="Appearance" />
        <Field htmlFor="theme-select" label="Interface theme">
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => {
              const nextTheme = e.target.value;
              setTheme(nextTheme);
              if (typeof document !== "undefined") {
                const isDark =
                  nextTheme === "dark" ||
                  (nextTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
                document.documentElement.classList.toggle("dark", isDark);
              }
            }}
            className={`${fieldClass} w-full max-w-md`}
          >
            <option value="system">System Default</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </Field>
      </Card>

      <Card className="space-y-4 sm:p-6">
        <SectionHeading title="Audio" />
        <Field
          htmlFor="audio-provider-select"
          label="Voice"
          hint="Microsoft sounds more natural but needs an internet connection. The device voice is built into your phone (Google on Android, Apple on iPhone) and works offline. If Microsoft is unreachable, the device voice is used automatically."
        >
          <select
            id="audio-provider-select"
            value={audioProvider}
            onChange={(e) => setAudioProvider(normalizeAudioProvider(e.target.value))}
            className={`${fieldClass} w-full max-w-md`}
          >
            <option value="microsoft">Microsoft (natural voice)</option>
            <option value="google">Google / device voice (works offline)</option>
          </select>
        </Field>

        <Field htmlFor="audio-speed-select" label="Pronunciation speed">
          <select
            id="audio-speed-select"
            value={audioSpeed}
            onChange={(e) => setAudioSpeed(e.target.value)}
            className={`${fieldClass} w-full max-w-md`}
          >
            <option value="normal">Normal Speed (1.0x)</option>
            <option value="slow">Slow &amp; Clear (0.8x)</option>
          </select>
        </Field>

        <label htmlFor="autoplay" className="flex min-h-10 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            id="autoplay"
            checked={autoplayAudio}
            onChange={(e) => setAutoplayAudio(e.target.checked)}
            className="h-4 w-4 shrink-0 accent-brand-600"
          />
          <span className="text-sm text-zinc-800 dark:text-zinc-200">
            Autoplay audio when opening new vocabulary words
          </span>
        </label>
      </Card>

      <Card className="space-y-4 sm:p-6">
        <SectionHeading title="Learning" />
        <Field
          htmlFor="daily-target-input"
          label="Daily vocabulary target"
          hint="Standard curriculum pace is exactly 50 words per day (4,500 total over 90 days)."
        >
          <input
            id="daily-target-input"
            type="number"
            min={10}
            max={100}
            value={dailyTarget}
            onChange={(e) => setDailyTarget(Number(e.target.value))}
            className={`${fieldClass} w-28 tabular-nums`}
          />
        </Field>
      </Card>

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className={buttonClass("primary", "md", "px-6")}>
          {pending ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </form>
  );
}
