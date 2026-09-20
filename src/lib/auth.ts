import { db } from "@/lib/db";

// No accounts, no sign-in: the site opens straight into the journey.
// Progress persists for a single implicit local learner stored in the database.

const DEFAULT_USER_ID = "local-learner";
const DEFAULT_EMAIL = "learner@english90.local";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function getOrCreateDefaultUser(): Promise<SessionUser> {
  const existing = await db.user.findUnique({
    where: { id: DEFAULT_USER_ID },
    select: { id: true, email: true, name: true, role: true },
  });
  if (existing) return existing;
  const created = await db.user.upsert({
    where: { email: DEFAULT_EMAIL },
    update: { id: DEFAULT_USER_ID },
    create: {
      id: DEFAULT_USER_ID,
      email: DEFAULT_EMAIL,
      name: "Learner",
      role: "ADMIN",
      passwordHash: "local-no-auth",
    },
    select: { id: true, email: true, name: true, role: true },
  });
  await db.userSettings.upsert({
    where: { userId: created.id },
    update: {},
    create: { userId: created.id },
  });
  return created;
}

export const requireUser = getOrCreateDefaultUser;
export const getCurrentUser = getOrCreateDefaultUser;
