import { textBands } from "@/content/text-bands";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

export function ManifestoBand() {
  const { eyebrow, body } = textBands.manifesto;

  return (
    <section className="mx-auto max-w-[var(--dl-container-max)] px-[21px] py-16">
      <AnimatedHeading
        as="p"
        text={eyebrow}
        variant="fade-simple"
        className="mb-4 text-sm uppercase tracking-[0.25em] text-[var(--dl-accent)]"
      />
      <p className="max-w-3xl text-lg leading-relaxed text-[var(--text-muted)] md:text-xl">
        {body}
      </p>
    </section>
  );
}
