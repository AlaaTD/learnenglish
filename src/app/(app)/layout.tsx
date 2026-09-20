import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { Nav } from "@/components/nav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <Nav userName={user.name} isAdmin={user.role === "ADMIN"} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
        English90 · One day = one complete learning unit · 90 days × 50 words = 4,500 words
      </footer>
    </>
  );
}
