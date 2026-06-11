"use client";

import { useEffect, useState } from "react";

import { testimonials } from "@/content/testimonials";
import { AnimatedHeading } from "@/shared/ui/AnimatedHeading";

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const active = testimonials[index] ?? testimonials[0];

  return (
    <section className="mx-auto max-w-[var(--dl-container-max)] px-[21px] py-16">
      <AnimatedHeading
        as="h2"
        text="Feedback From Our Clients"
        variant="words-slide-left"
        className="mb-10 text-2xl font-semibold text-white md:text-3xl"
      />
      <div className="gem-testimonials relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
        <blockquote className="gem-testimonial-item">
          <p className="post-content styled-subtitle text-lg leading-relaxed text-zinc-300">
            {active.quote}
          </p>
          <footer className="thegem-te-post-title mt-6 flex flex-wrap items-baseline gap-2">
            <cite className="post-title styled-subtitle text-lg font-semibold not-italic text-white">
              {active.author}
            </cite>
            {active.role ? (
              <span className="meta text-xs uppercase tracking-wide text-[var(--dl-accent)]">
                {active.role}
              </span>
            ) : null}
          </footer>
        </blockquote>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((item, i) => (
            <button
              key={item.author}
              type="button"
              aria-label={`Show testimonial from ${item.author}`}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-[var(--dl-accent)]" : "bg-white/30"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
