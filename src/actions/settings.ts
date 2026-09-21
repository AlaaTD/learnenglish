"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { AUDIO_PROVIDERS, DEFAULT_AUDIO_PROVIDER } from "@/lib/audio-provider";

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  dailyTarget: z.number().int().min(10).max(100),
  autoplayAudio: z.boolean(),
  audioSpeed: z.enum(["slow", "normal"]),
  audioProvider: z.enum(AUDIO_PROVIDERS),
});

export async function updateSettingsAction(input: {
  theme?: string;
  dailyTarget?: number;
  autoplayAudio?: boolean;
  audioSpeed?: string;
  audioProvider?: string;
  name?: string;
}): Promise<{ error?: string }> {
  const user = await requireUser();
  const current = await db.userSettings.findUnique({ where: { userId: user.id } });
  const parsed = settingsSchema.safeParse({
    theme: input.theme ?? current?.theme ?? "system",
    dailyTarget: input.dailyTarget ?? current?.dailyTarget ?? 50,
    autoplayAudio: input.autoplayAudio ?? current?.autoplayAudio ?? false,
    audioSpeed: input.audioSpeed ?? current?.audioSpeed ?? "normal",
    audioProvider: input.audioProvider ?? current?.audioProvider ?? DEFAULT_AUDIO_PROVIDER,
  });
  if (!parsed.success) return { error: "Those settings are not valid." };
  await db.userSettings.upsert({
    where: { userId: user.id },
    update: parsed.data,
    create: { userId: user.id, ...parsed.data },
  });
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name || name.length > 80) return { error: "Please enter a valid name." };
    await db.user.update({ where: { id: user.id }, data: { name } });
  }
  revalidatePath("/", "layout");
  return {};
}
