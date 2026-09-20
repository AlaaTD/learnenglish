import { cookies } from "next/headers";
import { db } from "@/lib/db";

// No accounts, no password, no barrier:
// Each visitor has their own persistent anonymous profile isolated via cookies.
// Every user's progress, saved words, and completed days are strictly separated!

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function getCurrentUser(): Promise<SessionUser> {
  let userId = "local-learner";
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("e90_user_id")?.value;
    if (cookieVal) userId = cookieVal;
  } catch {
    // If running in a context where cookies are not available
  }

  const existing = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });
  if (existing) return existing;

  const email = `${userId}@english90.local`;
  const created = await db.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email,
      name: "Learner",
      role: "USER",
      passwordHash: "anon-no-auth",
    },
    select: { id: true, email: true, name: true, role: true },
  });

  await db.userSettings.upsert({
    where: { userId: created.id },
    update: {},
    create: { userId: created.id },
  }).catch(() => {});

  return created;
}

export const requireUser = getCurrentUser;
export const getOrCreateDefaultUser = getCurrentUser;
