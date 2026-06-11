import Image from "next/image";

import { clientLogos } from "@/content/clients";

/** Client logo strip — no heading (matches WP interstitial bars). */
export function LogoMarquee() {
  const track = [...clientLogos, ...clientLogos];

  return (
    <section className="overflow-hidden border-y border-white/10 py-10">
      <div className="thegem-clients gem-client relative">
        <div className="dl-clients-marquee-track flex w-max gap-16 px-[21px]">
          {track.map((logo, index) => (
            <div
              key={`${logo.src}-${index}`}
              className="gem-client-item relative h-10 w-28 shrink-0 opacity-70 grayscale md:h-12 md:w-32"
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
    </section>
  );
}
