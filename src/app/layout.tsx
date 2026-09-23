import type { Metadata, Viewport } from "next";
import { ThemeScript } from "@/components/theme-script";
import { Inter, Lexend, Readex_Pro } from "next/font/google";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

// Lexend is engineered for reading fluency (open, evenly spaced letterforms), which
// suits a learning product far better than a generic UI face.
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

// Inter carries the midnight dashboard shell (nav, footer, home) — its tighter,
// more neutral letterforms match the approved mock. Lexend remains the reading face.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Arabic translations are core content of this app. Readex Pro is Lexend's official
// Arabic companion, so both scripts share proportions and rhythm. Only the Arabic
// subset is loaded: its Latin glyphs are the same design as Lexend, which already
// covers any English word that appears inside an Arabic block.
const readex = Readex_Pro({
  variable: "--font-readex",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "English90 — Your 90-Day English Journey",
    template: "%s · English90",
  },
  description:
    "A structured 90-day English learning system: 50 new words a day, daily grammar, conversations and paragraphs — one complete learning unit at a time.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // Match the page background (zinc-50 / zinc-950 in globals.css)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#120f0d" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let theme = "system";
  try {
    const user = await getCurrentUser();
    if (user) {
      const settings = await db.userSettings.findUnique({ where: { userId: user.id } });
      if (settings?.theme) theme = settings.theme;
    }
  } catch {
    // Database may not be ready yet — fall back to the system theme.
  }

  return (
    <html
      lang="en"
      data-theme-pref={theme}
      className={`${lexend.variable} ${readex.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
