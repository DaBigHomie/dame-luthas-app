import { textBands } from "@/content/text-bands";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

export function BigHeadingSection() {
  return (
    <section className="border-t border-white/10 py-16 md:py-20">
      <div className="mx-auto max-w-[var(--dl-container-max)] px-[21px] md:flex md:justify-end">
        <AnimatedHeading
          as="h2"
          text={textBands.bigHeading}
          variant="letters-slide-up"
          staggerMs={15}
          className="dl-typography-big-heading max-w-4xl text-right text-white"
        />
      </div>
    </section>
  );
}
