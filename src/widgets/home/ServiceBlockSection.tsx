import Image from "next/image";

import type { ServiceBlock } from "@/content/types";
import { AnimatedButton } from "@/shared/ui/AnimatedButton";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";
import { ServiceCard } from "@/widgets/home/ServiceCard";

interface ServiceBlockSectionProps {
  block: ServiceBlock;
}

export function ServiceBlockSection({ block }: ServiceBlockSectionProps) {
  return (
    <section
      className="border-t border-white/10 py-16"
      aria-labelledby={`${block.id}-heading`}
    >
      <div className="mx-auto max-w-[var(--dl-container-max)] px-[21px]">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--dl-accent)]">
          services {block.slide}
        </p>
        <AnimatedHeading
          as="h2"
          text={block.heading}
          variant="words-slide-left"
          staggerMs={20}
          className="dl-typography-category mb-8 text-white"
        />
        <div className="mb-10 overflow-hidden rounded-2xl border border-white/10">
          <div className="relative aspect-[21/9] w-full md:aspect-[3/1]">
            <Image
              src={block.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1170px) 100vw, 1170px"
              unoptimized
            />
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {block.categories.map((category) => (
            <ServiceCard key={category.id} category={category} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <AnimatedHeading
            as="p"
            text="START WORKING WITH ME"
            variant="fade-simple"
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
          />
          <p className="mx-auto mb-6 max-w-2xl text-[var(--text-muted)]">
            {block.ctaText}
          </p>
          <AnimatedButton
            href="/contact"
            variant="fade-left"
            className="gem-button dl-gem-btn-hover inline-flex rounded-[var(--radius,25px)] bg-[var(--dl-accent)] px-8 py-3 text-sm font-semibold uppercase text-white"
          >
            Let&apos;s talk
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
