import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";
import type { ContentSection } from "@/content/types";

interface ManifestoSectionProps {
  section: ContentSection;
}

export function ManifestoSection({ section }: ManifestoSectionProps) {
  if (!section.title) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <AnimatedHeading
        as="h2"
        text={section.title}
        variant="letters-slide-up"
        staggerMs={12}
        className="text-3xl font-bold text-white md:text-4xl"
      />
    </section>
  );
}
