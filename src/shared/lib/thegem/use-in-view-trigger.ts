"use client";

import { useLayoutEffect, useState } from "react";

function isInViewport(node: HTMLElement, threshold = 0.2): boolean {
  const rect = node.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const ratio = visibleHeight / Math.max(rect.height, 1);
  return ratio >= threshold && rect.bottom > 0 && rect.top < windowHeight;
}

function readPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(readPrefersReducedMotion);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Mirrors TheGem's scroll trigger: add `-animated` when element enters viewport.
 * Synchronously activates above-fold content before paint to avoid opacity:0 flash.
 */
export function useInViewTrigger(
  ref: React.RefObject<HTMLElement | null>,
  options?: { threshold?: number; rootMargin?: string },
): boolean {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const threshold = options?.threshold ?? 0.15;
  const rootMargin = options?.rootMargin ?? "0px 0px 0px 0px";

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    if (isInViewport(node, threshold)) {
      queueMicrotask(() => setActive(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, reducedMotion, threshold, rootMargin]);

  return active || reducedMotion;
}
