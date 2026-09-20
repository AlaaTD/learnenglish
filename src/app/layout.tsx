import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "English90 — Your 90-Day English Journey",
    template: "%s · English90",
  },
  description:
    "A structured 90-day English learning system: 50 new words a day, daily grammar, conversations and paragraphs — one complete learning unit at a time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
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
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
