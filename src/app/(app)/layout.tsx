import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { Nav } from "@/components/nav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <Nav userName={user.name} isAdmin={user.role === "ADMIN"} />
      {/* Extra bottom clearance so the mobile bottom tab bar never covers content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 sm:px-6 py-5 sm:py-8 pb-24 lg:pb-8">{children}</main>
      <footer className="border-t border-zinc-200 py-6 mb-16 lg:mb-0 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
        English90 · One day = one complete learning unit · 90 days × 50 words = 4,500 words
      </footer>
    </>
  );
}
