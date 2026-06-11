"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

import { useInViewTrigger } from "@/shared/lib/thegem/use-in-view-trigger";

export type ButtonAnimationVariant =
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "fade-down"
  | "fade-up"
  | "fade-right"
  | "fade-left"
  | "fade";

interface AnimatedButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonAnimationVariant;
  className?: string;
}

export function AnimatedButton({
  href,
  children,
  variant = "fade-left",
  className = "",
}: AnimatedButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useInViewTrigger(ref);

  const wrapperClass = [
    "thegem-button-animate inline-flex",
    animated ? "thegem-button-animated" : "",
    animated ? `thegem-button-animation-${variant}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={wrapperClass}>
      <Link href={href} className={`gem-button inline-flex ${className}`}>
        {children}
      </Link>
    </div>
  );
}
