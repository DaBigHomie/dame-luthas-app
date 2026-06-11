"use client";

import { useEffect, useRef } from "react";

interface ScrollParallaxProps {
  children: React.ReactNode;
  /** Pixels of vertical shift at full scroll (TheGem default ~3). */
  speed?: number;
  className?: string;
}

/** Lightweight vertical scroll parallax for TheGem styled-image widgets. */
export function ScrollParallax({
  children,
  speed = 24,
  className = "",
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        const viewH = window.innerHeight;
        if (rect.bottom < 0 || rect.top > viewH) return;
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const offset = (progress - 0.5) * speed;
        node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`dl-scroll-parallax ${className}`.trim()}>
      {children}
    </div>
  );
}
