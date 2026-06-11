import { textBands } from "@/content/text-bands";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

export function BigHeadingSection() {
  return (
    <section className="border-y border-white/10 bg-[var(--dl-surface)] py-20">
      <div className="mx-auto max-w-[var(--dl-container-max)] px-[21px] text-center">
        <AnimatedHeading
          as="h2"
          text={textBands.bigHeading}
          variant="letters-slide-up"
          staggerMs={12}
          className="dl-typography-big-heading text-white"
        />
      </div>
    </section>
  );
}
