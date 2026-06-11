import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { isMigratedAvailable } from "@/shared/lib/migrated/content";
import { WpPilotStyles } from "@/shared/ui/WpPilotStyles";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import "@/shared/design/thegem/index.css";
import "./globals.css";

function pilotCssEnabled(): boolean {
  if (process.env.HEADLESS_PILOT_CSS === "true") return true;
  if (process.env.HEADLESS_PILOT_CSS === "false") return false;
  return !isMigratedAvailable();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dame Luthas",
  description: "Technology consulting & digital transformation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const migrated = isMigratedAvailable();
  const pilotCss = pilotCssEnabled();

  const bodyClass = [
    "min-h-full flex flex-col",
    pilotCss
      ? "wp-pilot-theme wp-theme-thegem-elementor thegem-elementor elementor-default"
      : null,
    migrated && !pilotCss
      ? "bg-[var(--dl-bg)] text-zinc-100"
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased${
        pilotCss ? " wp-pilot-theme" : ""
      }`}
    >
      <body className={bodyClass}>
        {pilotCss ? <WpPilotStyles /> : null}
        {migrated ? <Header /> : null}
        {children}
        {migrated ? <Footer /> : null}
      </body>
    </html>
  );
}
