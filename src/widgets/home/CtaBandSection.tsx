import { AnimatedButton } from "@/shared/ui/AnimatedButton";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";
import type { ContentSection } from "@/content/types";

interface CtaBandSectionProps {
  section: ContentSection;
}

export function CtaBandSection({ section }: CtaBandSectionProps) {
  if (!section.title) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <AnimatedHeading
        as="h2"
        text={section.title}
        variant="words-slide-up"
        className="text-2xl font-bold uppercase tracking-wide text-white md:text-3xl"
      />
      {section.bodyText ? (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">{section.bodyText}</p>
      ) : null}
      {section.cta ? (
        <div className="mt-8">
          <AnimatedButton
            href={section.cta.href}
            variant="fade-left"
            className="dl-gem-btn-hover rounded-full bg-[var(--dl-accent)] px-8 py-3 text-sm font-medium text-white"
          >
            {section.cta.label}
          </AnimatedButton>
        </div>
      ) : null}
    </section>
  );
}
