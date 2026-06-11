import { textBands } from "@/content/text-bands";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

export function ManifestoBand() {
  const { body } = textBands.manifesto;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <p
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[clamp(3rem,12vw,9rem)] font-extrabold uppercase leading-none text-white/[0.04]"
        aria-hidden
      >
        Dame Luthas
      </p>
      <div className="relative mx-auto max-w-3xl px-[21px] md:ml-auto md:max-w-2xl md:pr-12 lg:pr-24">
        <AnimatedHeading
          as="p"
          text={body}
          variant="words-slide-left"
          staggerMs={20}
          className="text-lg leading-relaxed text-white md:text-xl"
        />
      </div>
    </section>
  );
}
