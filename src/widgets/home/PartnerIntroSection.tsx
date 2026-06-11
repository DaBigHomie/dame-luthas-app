import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";
import type { ContentSection } from "@/content/types";

interface PartnerIntroSectionProps {
  section: ContentSection;
}

export function PartnerIntroSection({ section }: PartnerIntroSectionProps) {
  if (!section.title) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 text-center">
      <AnimatedHeading
        as="p"
        text={section.title}
        variant="words-slide-left"
        staggerMs={20}
        className="text-xl leading-relaxed text-zinc-300 md:text-2xl"
      />
    </section>
  );
}
