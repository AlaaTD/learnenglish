import fs from "node:fs";
import path from "node:path";

/**
 * Returns the public URL for a day's summary infographic image if it exists in public/days/,
 * or null if no image is available.
 */
export function getDayImageUrl(dayNumber: number): string | null {
  const pad = String(dayNumber).padStart(2, "0");
  const publicDaysDir = path.join(process.cwd(), "public", "days");

  const candidateExtensions = [".png", ".jpg", ".jpeg", ".webp"];
  for (const ext of candidateExtensions) {
    const filename = `day-${pad}${ext}`;
    if (fs.existsSync(path.join(publicDaysDir, filename))) {
      return `/days/${filename}`;
    }
  }

  return null;
}
