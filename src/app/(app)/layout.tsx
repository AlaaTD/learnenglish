import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { getCurrentDay } from "@/services/stats";
import { Nav } from "@/components/nav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const currentDay = await getCurrentDay(user.id);
  return (
    <>
      <Nav userName={user.name} isAdmin={user.role === "ADMIN"} currentDay={currentDay} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      {/* Bottom padding clears the fixed phone tab bar (incl. iOS safe area) */}
      <footer className="border-t border-zinc-200 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-6 text-center text-xs text-zinc-500 lg:pb-8 dark:border-zinc-800 dark:text-zinc-400">
        English90 · One day = one complete learning unit · 90 days × 50 words = 4,500 words
      </footer>
    </>
  );
}
