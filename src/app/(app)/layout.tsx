import type { ReactNode } from "react";
import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { getCurrentDay } from "@/services/stats";
import { Nav } from "@/components/nav";
import { AudioConfig } from "@/components/audio-config";
import { db } from "@/lib/db";
import { normalizeAudioProvider } from "@/lib/audio-provider";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const [currentDay, settings] = await Promise.all([
    getCurrentDay(user.id),
    db.userSettings.findUnique({ where: { userId: user.id }, select: { audioProvider: true } }),
  ]);
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-night-950">
      <AudioConfig provider={normalizeAudioProvider(settings?.audioProvider)} />
      <Nav userName={user.name} isAdmin={user.role === "ADMIN"} currentDay={currentDay} />
      {/* No shell font class here on purpose: this is reading content, and the page default
          (Lexend + Readex — see globals.css `--font-sans`) is the correct face for it. Only
          the chrome around it (Nav, footer below) opts into `.e90-chrome` (Inter). */}
      <main className="mx-auto w-full max-w-[1548px] flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pb-12 sm:pt-7">{children}</main>
      {/* Bottom padding clears the fixed phone tab bar (incl. iOS safe area) */}
      <footer className="e90-chrome border-t border-zinc-200 dark:border-night-700">
        <div className="mx-auto flex w-full max-w-[1548px] flex-col gap-3 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-5 text-[13.5px] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:pb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-[30px] w-[30px] shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-brand-500/50">
              <Image
                src="/logo.png"
                alt="English90 Logo"
                width={30}
                height={30}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-zinc-500 dark:text-mist-600">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">English90</span>
              <span aria-hidden="true" className="px-2.5">
                ·
              </span>
              One day → one complete learning unit
              <span aria-hidden="true" className="px-2.5">
                ·
              </span>
              90 days x 50 words = 4,500 words
            </p>
          </div>
          <p className="flex items-center gap-4 italic text-zinc-500">
            <span aria-hidden="true" className="hidden h-px w-14 bg-zinc-300 dark:bg-zinc-700 sm:block" />
            Small steps. Big results.
          </p>
        </div>
      </footer>
    </div>
  );
}
