#!/usr/bin/env node
// Creates a safe copy / backup of dev.db into dev.backup.db and prisma/dev.db
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  path.join(root, "prisma", "dev.db"),
  path.join(root, "dev.db"),
];
const dbPath = candidates.find((p) => fs.existsSync(p));
const backupsDir = path.join(root, "backups");
const backupPath = path.join(backupsDir, "dev.backup.db");
const prismaDbPath = path.join(root, "prisma", "dev.db");

if (!dbPath) {
  console.log("No dev.db found to backup in prisma/");
  process.exit(0);
}

try {
  fs.mkdirSync(backupsDir, { recursive: true });

  // 1. Copy to standard backups/dev.backup.db
  fs.copyFileSync(dbPath, backupPath);

  // 2. Ensure prisma/dev.db is also synced
  fs.mkdirSync(path.dirname(prismaDbPath), { recursive: true });
  if (dbPath !== prismaDbPath) {
    fs.copyFileSync(dbPath, prismaDbPath);
  }

  // 3. Create timestamped archive in backups/
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const archivePath = path.join(backupsDir, `dev-${timestamp}.db`);
  fs.copyFileSync(dbPath, archivePath);

  // Keep only the last 3 timestamped backups to save space
  const files = fs.readdirSync(backupsDir)
    .filter((f) => f.startsWith("dev-") && f.endsWith(".db"))
    .sort();
  while (files.length > 3) {
    const oldest = files.shift();
    if (oldest) fs.unlinkSync(path.join(backupsDir, oldest));
  }

  console.log(`✓ Database successfully backed up to:`);
  console.log(`  - ${path.relative(root, backupPath)}`);
  console.log(`  - ${path.relative(root, prismaDbPath)}`);
  console.log(`  - ${path.relative(root, archivePath)}`);
} catch (err) {
  console.error("Database backup failed:", err);
  process.exit(1);
}
