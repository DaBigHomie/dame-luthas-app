import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";
import type { ContentSection } from "@/content/types";

interface AdvisorSectionProps {
  section: ContentSection;
}

export function AdvisorSection({ section }: AdvisorSectionProps) {
  if (!section.title) return null;

  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <AnimatedHeading
          as="h2"
          text={section.title}
          variant="fade-simple"
          className="text-2xl font-medium leading-snug text-white md:text-3xl"
        />
      </div>
    </section>
  );
}
