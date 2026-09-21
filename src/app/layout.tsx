import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Arabic translations are core content of this app; a dedicated Arabic face
// is far easier to read than whatever the OS falls back to.
const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#171716" },
  ],
};

const themeScript = `(function(){try{var p=document.documentElement.getAttribute('data-theme-pref')||'system';var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
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
      className={`${inter.variable} ${notoArabic.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
