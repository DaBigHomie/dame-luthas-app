import { AnimatedButton } from "@/shared/ui/AnimatedButton";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

interface CtaBandSectionProps {
  body: string;
  eyebrow?: string;
}

export function CtaBandSection({
  body,
  eyebrow = "START WORKING WITH ME",
}: CtaBandSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--dl-cta-mint)] py-16 md:py-20">
      <span
        className="pointer-events-none absolute left-4 top-4 text-4xl font-light text-white/40"
        aria-hidden
      >
        +
      </span>
      <span
        className="pointer-events-none absolute bottom-4 right-4 text-4xl font-light text-white/40"
        aria-hidden
      >
        +
      </span>
      <div className="mx-auto max-w-4xl px-[21px] text-center">
        <AnimatedHeading
          as="p"
          text={eyebrow}
          variant="fade-simple"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#2E2F3E]"
        />
        <AnimatedHeading
          as="h2"
          text={body}
          variant="words-slide-left"
          staggerMs={25}
          className="dl-typography-big-heading text-[#2E2F3E]"
        />
        <div className="mt-8">
          <AnimatedButton
            href="/contact"
            variant="fade-left"
            className="gem-button inline-flex rounded-[25px] border-2 border-[#2E2F3E] bg-transparent px-8 py-3 text-sm font-semibold uppercase text-[#2E2F3E] hover:bg-[#2E2F3E] hover:text-white"
          >
            Let&apos;s talk
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
