import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // Handle Vercel / serverless runtime read-only environment
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDb = "/tmp/dev.db";
    if (!fs.existsSync(tmpDb)) {
      const candidates = [
        path.join(process.cwd(), "dev.db"),
        path.join(process.cwd(), "prisma", "dev.db"),
      ];
      for (const p of candidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
          try {
            fs.copyFileSync(p, tmpDb);
            break;
          } catch (e) {
            console.error("Failed copying db to /tmp:", e);
          }
        }
      }
    }
    return `file:${tmpDb}`;
  }

  return envUrl || "file:./dev.db";
}

const dbUrl = resolveDatabaseUrl();
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// In development, hot reload might keep an older PrismaClient instance in globalThis.
// If the cached instance lacks newly added models (e.g. confusableGroup), discard it.
const cachedPrisma = globalForPrisma.prisma as unknown as Record<string, unknown> | undefined;
if (cachedPrisma && !("confusableGroup" in cachedPrisma)) {
  try {
    (cachedPrisma as { $disconnect?: () => void }).$disconnect?.();
  } catch {}
  delete globalForPrisma.prisma;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
