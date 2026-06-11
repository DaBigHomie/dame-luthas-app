import Image from "next/image";

import type { ClientLogo } from "@/content/types";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

interface ClientLogosSectionProps {
  logos: readonly ClientLogo[];
}

export function ClientLogosSection({ logos }: ClientLogosSectionProps) {
  if (logos.length === 0) return null;

  return (
    <section className="border-t border-white/10 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedHeading
          as="h2"
          text="Trusted by global organizations"
          variant="fade-simple"
          className="mb-10 text-center text-sm uppercase tracking-[0.2em] text-zinc-400"
        />
        <div className="gem-client flex flex-wrap items-center justify-center gap-10 md:gap-14">
          {logos.map((logo) => (
            <div key={logo.src} className="gem-client-item relative h-12 w-28 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
                sizes="112px"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
