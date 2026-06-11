import type { Metadata } from "next";

import { cardo, outfit } from "@/app/fonts";
import { isNativeSiteShellEnabled } from "@/content/availability";
import { isMigratedAvailable } from "@/shared/lib/migrated/content";
import { TheGemMotionRoot } from "@/shared/ui/TheGemMotionRoot";
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

export const metadata: Metadata = {
  title: "Dame Luthas",
  description: "Technology consulting & digital transformation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nativeShell = isNativeSiteShellEnabled();
  const pilotCss = pilotCssEnabled() && !nativeShell;

  const bodyClass = [
    "min-h-full flex flex-col font-sans",
    pilotCss
      ? "wp-pilot-theme wp-theme-thegem-elementor thegem-elementor elementor-default"
      : "bg-[var(--dl-bg)] text-white",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cardo.variable} h-full antialiased${
        pilotCss ? " wp-pilot-theme" : ""
      }`}
    >
      <body className={bodyClass}>
        {nativeShell ? (
          <TheGemMotionRoot>
            {pilotCss ? <WpPilotStyles /> : null}
            <Header />
            {children}
            <Footer />
          </TheGemMotionRoot>
        ) : (
          <>
            {pilotCss ? <WpPilotStyles /> : null}
            {children}
          </>
        )}
      </body>
    </html>
  );
}
