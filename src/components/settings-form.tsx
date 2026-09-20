"use client";

import { useActionState, useState } from "react";
import { updateSettingsAction } from "@/actions/settings";

export function SettingsForm({
  initialSettings,
  userName,
}: {
  initialSettings: {
    theme: string;
    dailyTarget: number;
    autoplayAudio: boolean;
    audioSpeed: string;
  };
  userName: string;
}) {
  const [theme, setTheme] = useState(initialSettings.theme);
  const [dailyTarget, setDailyTarget] = useState(initialSettings.dailyTarget);
  const [autoplayAudio, setAutoplayAudio] = useState(initialSettings.autoplayAudio);
  const [audioSpeed, setAudioSpeed] = useState(initialSettings.audioSpeed);
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
        name,
      });
      if (!res.error) setSaved(true);
      return res;
    },
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      {saved && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Preferences saved successfully.
        </div>
      )}
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}

      {/* Profile */}
      <div className="space-y-2">
        <label htmlFor="name-input" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Learner Name
        </label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <p className="text-xs text-zinc-500">Your display name across the platform.</p>
      </div>

      {/* Theme */}
      <div className="space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <label htmlFor="theme-select" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Interface Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => {
            const nextTheme = e.target.value;
            setTheme(nextTheme);
            if (typeof document !== "undefined") {
              const isDark =
                nextTheme === "dark" ||
                (nextTheme === "system" &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches);
              document.documentElement.classList.toggle("dark", isDark);
            }
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="system">System Default</option>
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>

      {/* Audio Preferences */}
      <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Audio Settings</h2>

        <div className="space-y-2">
          <label htmlFor="audio-speed-select" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Pronunciation Speed
          </label>
          <select
            id="audio-speed-select"
            value={audioSpeed}
            onChange={(e) => setAudioSpeed(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="normal">Normal Speed (1.0x)</option>
            <option value="slow">Slow &amp; Clear (0.8x)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="autoplay"
            checked={autoplayAudio}
            onChange={(e) => setAutoplayAudio(e.target.checked)}
            className="h-4 w-4 rounded-sm border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="autoplay" className="text-sm text-zinc-700 dark:text-zinc-300">
            Autoplay audio when opening new vocabulary words
          </label>
        </div>
      </div>

      {/* Curriculum Rules */}
      <div className="space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <label htmlFor="daily-target-input" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Daily Vocabulary Target
        </label>
        <input
          id="daily-target-input"
          type="number"
          min={10}
          max={100}
          value={dailyTarget}
          onChange={(e) => setDailyTarget(Number(e.target.value))}
          className="w-24 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <p className="text-xs text-zinc-500">
          Standard curriculum pace is exactly 50 words per day (4,500 total over 90 days).
        </p>
      </div>

      <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </form>
  );
}
