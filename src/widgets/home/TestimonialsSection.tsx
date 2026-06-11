import type { Testimonial } from "@/content/types";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

interface TestimonialsSectionProps {
  items: readonly Testimonial[];
}

export function TestimonialsSection({ items }: TestimonialsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <AnimatedHeading
        as="h2"
        text="Feedback from our clients"
        variant="words-slide-left"
        className="mb-10 text-2xl font-semibold text-white md:text-3xl"
      />
      <div className="gem-testimonials grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <blockquote
            key={`${item.author}-${item.quote.slice(0, 24)}`}
            className="gem-testimonial-item rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="post-content styled-subtitle text-sm leading-relaxed text-zinc-300">
              {item.quote}
            </p>
            <footer className="thegem-te-post-title mt-4">
              <cite className="post-title styled-subtitle not-italic text-white">
                {item.author}
              </cite>
              {item.role ? (
                <span className="meta ml-2 text-xs uppercase tracking-wide text-[var(--dl-accent)]">
                  {item.role}
                </span>
              ) : null}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
