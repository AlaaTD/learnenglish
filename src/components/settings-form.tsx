"use client";

import { useEffect, useState, useTransition, type ReactNode, type SVGProps } from "react";
import { useRouter } from "next/navigation";
import { updateSettingsAction } from "@/actions/settings";
import { normalizeAudioProvider, type AudioProvider } from "@/lib/audio-provider";
import { THEME_OPTIONS, TOTAL_VOCABULARY, type ThemeOption } from "@/lib/states";
import { IconTargetArrow } from "@/components/dashboard/icons";
import {
  Card,
  ErrorState,
  SectionHeading,
  SegmentedControl,
  Switch,
  buttonClass,
  fieldClass,
  textLinkClass,
} from "./ui";

/* ---------------------------------------------------------------------------
 * Small icon set for this screen only (24px grid, 1.8 stroke, round caps — same
 * spec as the dashboard set in `dashboard/icons.tsx`, kept local since these are
 * settings-specific and not part of that shared module).
 * ------------------------------------------------------------------------- */
type IconProps = SVGProps<SVGSVGElement>;

function IconStroke({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function IconUser(props: IconProps) {
  return (
    <IconStroke {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 4-6 7.5-6s6 2 7.5 6" />
    </IconStroke>
  );
}

function IconSun(props: IconProps) {
  return (
    <IconStroke {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </IconStroke>
  );
}

function IconMoon(props: IconProps) {
  return (
    <IconStroke {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </IconStroke>
  );
}

function IconMonitor(props: IconProps) {
  return (
    <IconStroke {...props}>
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16.5V20" />
    </IconStroke>
  );
}

function IconVolume2(props: IconProps) {
  return (
    <IconStroke {...props}>
      <path d="M4 9.5v5h4l5 4v-13l-5 4H4z" />
      <path d="M16.5 9a4.5 4.5 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" />
    </IconStroke>
  );
}

/** Tinted icon badge that sits in front of every section title on this page. */
function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-900">
      {children}
    </span>
  );
}

/** Label + control + optional hint, laid out the same way for every setting. */
function Field({
  htmlFor,
  label,
  hint,
  children,
}: {
  htmlFor?: string;
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </label>
      ) : (
        <p className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
      )}
      {children}
      {hint ? <p className="text-xs text-zinc-600 dark:text-zinc-400">{hint}</p> : null}
    </div>
  );
}

type AudioSpeed = "normal" | "slow";

type SettingsValues = {
  theme: ThemeOption;
  dailyTarget: number;
  autoplayAudio: boolean;
  audioSpeed: AudioSpeed;
  audioProvider: AudioProvider;
  name: string;
};

function normalizeTheme(value: string): ThemeOption {
  return (THEME_OPTIONS as readonly string[]).includes(value) ? (value as ThemeOption) : "system";
}

function normalizeAudioSpeed(value: string): AudioSpeed {
  return value === "slow" ? "slow" : "normal";
}

function toValues(
  initialSettings: {
    theme: string;
    dailyTarget: number;
    autoplayAudio: boolean;
    audioSpeed: string;
    audioProvider: string;
  },
  userName: string,
): SettingsValues {
  return {
    theme: normalizeTheme(initialSettings.theme),
    dailyTarget: initialSettings.dailyTarget,
    autoplayAudio: initialSettings.autoplayAudio,
    audioSpeed: normalizeAudioSpeed(initialSettings.audioSpeed),
    audioProvider: normalizeAudioProvider(initialSettings.audioProvider),
    name: userName,
  };
}

function settingsEqual(a: SettingsValues, b: SettingsValues): boolean {
  return (
    a.theme === b.theme &&
    a.dailyTarget === b.dailyTarget &&
    a.autoplayAudio === b.autoplayAudio &&
    a.audioSpeed === b.audioSpeed &&
    a.audioProvider === b.audioProvider &&
    a.name.trim() === b.name.trim()
  );
}

const DAILY_TARGET_MIN = 10;
const DAILY_TARGET_MAX = 100;
const DAILY_TARGET_STEP = 5;
const STANDARD_DAILY_TARGET = 50;

function clampDailyTarget(value: number): number {
  if (Number.isNaN(value)) return DAILY_TARGET_MIN;
  return Math.min(DAILY_TARGET_MAX, Math.max(DAILY_TARGET_MIN, value));
}

const stepperButtonClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-300 bg-white text-base font-semibold text-zinc-700 shadow-card transition hover:border-zinc-400 hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-none dark:hover:border-zinc-500 dark:hover:bg-zinc-800";

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
  const router = useRouter();
  const [confirmed, setConfirmed] = useState<SettingsValues>(() => toValues(initialSettings, userName));
  const [draft, setDraft] = useState<SettingsValues>(() => toValues(initialSettings, userName));
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = !settingsEqual(draft, confirmed);

  function setField<K extends keyof SettingsValues>(key: K, value: SettingsValues[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  // The live theme preview is entirely declarative now: whatever `draft.theme` says, the
  // document reflects — on first paint, while previewing an unsaved choice, and after
  // "Discard" puts the confirmed theme back. No DOM writes hide inside the select's onChange.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const isDark =
      draft.theme === "dark" ||
      (draft.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, [draft.theme]);

  // The success banner is a hint, not a permanent state: it fades on its own.
  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => setJustSaved(false), 4000);
    return () => clearTimeout(timer);
  }, [justSaved]);

  function handleDiscard() {
    setDraft(confirmed);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty || pending) return;
    setError(null);
    setJustSaved(false);

    startTransition(async () => {
      const res = await updateSettingsAction({
        theme: draft.theme,
        dailyTarget: draft.dailyTarget,
        autoplayAudio: draft.autoplayAudio,
        audioSpeed: draft.audioSpeed,
        audioProvider: draft.audioProvider,
        name: draft.name,
      });

      if (res.error || !res.settings) {
        setError(res.error ?? "Something went wrong. Please try again.");
        return;
      }

      // Sync straight from what the server just persisted — the fields become correct the
      // instant this promise resolves, with no dependency on the router picking up revalidated
      // data. `router.refresh()` below still runs, so the nav name, theme and audio provider
      // used elsewhere in the layout catch up too, without needing a manual hard reload.
      const nextConfirmed: SettingsValues = {
        theme: normalizeTheme(res.settings.theme),
        dailyTarget: res.settings.dailyTarget,
        autoplayAudio: res.settings.autoplayAudio,
        audioSpeed: normalizeAudioSpeed(res.settings.audioSpeed),
        audioProvider: normalizeAudioProvider(res.settings.audioProvider),
        name: res.name ?? draft.name,
      };
      setConfirmed(nextConfirmed);
      setDraft(nextConfirmed);
      setJustSaved(true);
      router.refresh();
    });
  }

  const totalDays = draft.dailyTarget > 0 ? Math.ceil(TOTAL_VOCABULARY / draft.dailyTarget) : null;
  const dailyTargetHint = `Standard curriculum pace is exactly ${STANDARD_DAILY_TARGET} words per day (${TOTAL_VOCABULARY.toLocaleString()} total over 90 days).${
    totalDays ? ` At ${draft.dailyTarget}/day, you'll cover all ${TOTAL_VOCABULARY.toLocaleString()} words in about ${totalDays} day${totalDays === 1 ? "" : "s"}.` : ""
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {justSaved && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
        >
          Preferences saved successfully.
        </div>
      )}
      {error && <ErrorState message={error} />}

      <Card className="space-y-4 sm:p-6">
        <div className="flex items-center gap-3">
          <SectionIcon>
            <IconUser className="h-[18px] w-[18px]" />
          </SectionIcon>
          <SectionHeading title="Profile" />
        </div>
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-200"
          >
            {(draft.name.trim()[0] ?? "?").toUpperCase()}
          </span>
          <Field htmlFor="name-input" label="Learner name" hint="Your display name across the platform.">
            <input
              id="name-input"
              type="text"
              required
              maxLength={80}
              value={draft.name}
              onChange={(e) => setField("name", e.target.value)}
              className={`${fieldClass} w-full max-w-md`}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4 sm:p-6">
        <div className="flex items-center gap-3">
          <SectionIcon>
            <IconMonitor className="h-[18px] w-[18px]" />
          </SectionIcon>
          <SectionHeading title="Appearance" />
        </div>
        <Field label="Interface theme">
          <SegmentedControl
            label="Interface theme"
            value={draft.theme}
            onChange={(value) => setField("theme", value)}
            options={[
              { value: "system", label: "System", icon: <IconMonitor className="h-4 w-4" /> },
              { value: "light", label: "Light", icon: <IconSun className="h-4 w-4" /> },
              { value: "dark", label: "Dark", icon: <IconMoon className="h-4 w-4" /> },
            ]}
          />
        </Field>
      </Card>

      <Card className="space-y-4 sm:p-6">
        <div className="flex items-center gap-3">
          <SectionIcon>
            <IconVolume2 className="h-[18px] w-[18px]" />
          </SectionIcon>
          <SectionHeading title="Audio" />
        </div>
        <Field
          label="Voice"
          hint="Microsoft sounds more natural but needs an internet connection. The device voice is built into your phone (Google on Android, Apple on iPhone) and works offline. If Microsoft is unreachable, the device voice is used automatically."
        >
          <SegmentedControl
            label="Voice"
            value={draft.audioProvider}
            onChange={(value) => setField("audioProvider", value)}
            options={[
              { value: "microsoft", label: "Microsoft (natural voice)" },
              { value: "google", label: "Device (works offline)" },
            ]}
          />
        </Field>

        <Field label="Pronunciation speed">
          <SegmentedControl
            label="Pronunciation speed"
            value={draft.audioSpeed}
            onChange={(value) => setField("audioSpeed", value)}
            options={[
              { value: "normal", label: "Normal (1.0x)" },
              { value: "slow", label: "Slow & Clear (0.8x)" },
            ]}
          />
        </Field>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 px-3.5 py-3 dark:border-zinc-800">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Autoplay audio</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Play pronunciation automatically when opening a new vocabulary word.
            </p>
          </div>
          <Switch
            id="autoplay"
            checked={draft.autoplayAudio}
            onChange={(checked) => setField("autoplayAudio", checked)}
            label="Autoplay audio when opening new vocabulary words"
          />
        </div>
      </Card>

      <Card className="space-y-4 sm:p-6">
        <div className="flex items-center gap-3">
          <SectionIcon>
            <IconTargetArrow className="h-[18px] w-[18px]" />
          </SectionIcon>
          <SectionHeading title="Learning" />
        </div>
        <Field htmlFor="daily-target-input" label="Daily vocabulary target" hint={dailyTargetHint}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease daily target"
              disabled={draft.dailyTarget <= DAILY_TARGET_MIN}
              onClick={() => setField("dailyTarget", clampDailyTarget(draft.dailyTarget - DAILY_TARGET_STEP))}
              className={stepperButtonClass}
            >
              −
            </button>
            <input
              id="daily-target-input"
              type="number"
              min={DAILY_TARGET_MIN}
              max={DAILY_TARGET_MAX}
              value={draft.dailyTarget}
              onChange={(e) => setField("dailyTarget", Number(e.target.value))}
              className={`${fieldClass} w-20 text-center tabular-nums`}
            />
            <button
              type="button"
              aria-label="Increase daily target"
              disabled={draft.dailyTarget >= DAILY_TARGET_MAX}
              onClick={() => setField("dailyTarget", clampDailyTarget(draft.dailyTarget + DAILY_TARGET_STEP))}
              className={stepperButtonClass}
            >
              +
            </button>
            {draft.dailyTarget !== STANDARD_DAILY_TARGET && (
              <button
                type="button"
                onClick={() => setField("dailyTarget", STANDARD_DAILY_TARGET)}
                className={textLinkClass}
              >
                Use standard pace ({STANDARD_DAILY_TARGET}/day)
              </button>
            )}
          </div>
        </Field>
      </Card>

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-sm ${
            dirty ? "font-medium text-amber-700 dark:text-amber-300" : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {dirty ? "You have unsaved changes." : justSaved ? "All changes saved." : "No changes to save."}
        </p>
        <div className="flex items-center justify-end gap-2">
          {dirty && !pending && (
            <button type="button" onClick={handleDiscard} className={buttonClass("ghost", "md")}>
              Discard
            </button>
          )}
          <button type="submit" disabled={pending || !dirty} className={buttonClass("primary", "md", "px-6")}>
            {pending ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </form>
  );
}
