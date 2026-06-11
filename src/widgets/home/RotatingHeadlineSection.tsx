"use client";

import { useEffect, useState } from "react";

import type { RotatingPhrase } from "@/content/types";

interface RotatingHeadlineSectionProps {
  phrases: readonly RotatingPhrase[];
}

export function RotatingHeadlineSection({ phrases }: RotatingHeadlineSectionProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [phrases.length]);

  if (phrases.length === 0) return null;

  const active = phrases[index] ?? phrases[0];

  return (
    <section className="mx-auto max-w-3xl px-6 py-8 text-center">
      <p className="thegem-heading thegem-heading-rotating text-2xl font-semibold text-[var(--dl-accent)] md:text-3xl">
        <span className="thegem-heading-word inline-block transition-opacity duration-500">
          {active.text}
        </span>
      </p>
    </section>
  );
}
