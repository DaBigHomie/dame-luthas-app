import type { Metadata } from "next";

import { cardo, outfit } from "@/app/fonts";
import { isNativeSiteShellEnabled } from "@/content/availability";
import { TheGemMotionRoot } from "@/shared/ui/TheGemMotionRoot";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import "@/shared/design/thegem/index.css";
import "./globals.css";

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

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cardo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--dl-bg)] font-sans text-white">
        {nativeShell ? (
          <TheGemMotionRoot>
            <Header />
            {children}
            <Footer />
          </TheGemMotionRoot>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
