import { textBands } from "@/content/text-bands";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

export function AdvisorSection() {
  return (
    <section className="border-b border-white/10 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-4xl px-[21px] text-center">
        <AnimatedHeading
          as="h2"
          text={textBands.unAdvisorBand}
          variant="fade-simple"
          className="text-xl font-medium leading-snug text-white md:text-2xl"
        />
      </div>
    </section>
  );
}
