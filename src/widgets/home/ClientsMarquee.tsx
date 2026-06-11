import Image from "next/image";

import { clientLogos } from "@/content/clients";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

export function ClientsMarquee() {
  const track = [...clientLogos, ...clientLogos];

  return (
    <section className="overflow-hidden border-t border-white/10 py-16">
      <div className="mx-auto max-w-[var(--dl-container-max)] px-[21px]">
        <AnimatedHeading
          as="h2"
          text="Feedback / Our Valued Clients"
          variant="fade-simple"
          className="mb-10 text-center text-sm uppercase tracking-[0.2em] text-zinc-400"
        />
        <div className="thegem-clients gem-client relative">
          <div className="dl-clients-marquee-track flex w-max gap-16">
            {track.map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className="gem-client-item relative h-12 w-32 shrink-0 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  className="object-contain"
                  sizes="128px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
