"use client";

import { useRef } from "react";

import { useInViewTrigger } from "@/shared/lib/thegem/use-in-view-trigger";

export type HeadingAnimationVariant =
  | "letters-slide-up"
  | "words-slide-left"
  | "words-slide-up"
  | "words-slide-right"
  | "fade-simple"
  | "fade-tb"
  | "fade-bt"
  | "fade-lr"
  | "fade-rl"
  | "background-sliding";

interface AnimatedHeadingProps {
  as?: "h1" | "h2" | "h3" | "p";
  text: string;
  variant?: HeadingAnimationVariant;
  /** Per-letter or per-word stagger in ms (WP default: 15). */
  staggerMs?: number;
  className?: string;
}

function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

export function AnimatedHeading({
  as: Tag = "h1",
  text,
  variant = "letters-slide-up",
  staggerMs = 15,
  className = "",
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useInViewTrigger(ref);

  const headingClass = [
    "thegem-heading",
    variant,
    "thegem-heading-animate",
    animated ? "thegem-heading-animated" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  let content: React.ReactNode;

  if (variant === "letters-slide-up") {
    const tokens = splitWords(text);
    let delayIndex = 0;

    content = (
      <span className="thegem-heading-line-wrap">
        {tokens.map((token, tokenIndex) => {
          if (/^\s+$/.test(token)) {
            return <span key={`space-${tokenIndex}`}>{token}</span>;
          }

          return (
            <span key={`word-${tokenIndex}`} className="thegem-heading-word-wrap">
              <span className="thegem-heading-word">
                {[...token].map((char, charIndex) => {
                  const style = animated
                    ? { animationDelay: `${delayIndex++ * staggerMs}ms` }
                    : undefined;
                  return (
                    <span
                      key={`${tokenIndex}-${charIndex}`}
                      className="thegem-heading-letter-wrap"
                    >
                      <span className="thegem-heading-letter" style={style}>
                        {char}
                      </span>
                    </span>
                  );
                })}
              </span>
            </span>
          );
        })}
      </span>
    );
  } else if (
    variant === "words-slide-left" ||
    variant === "words-slide-up" ||
    variant === "words-slide-right"
  ) {
    const parts = splitWords(text);
    let wordIndex = 0;

    content = (
      <span className="thegem-heading-line-wrap">
        {parts.map((part, index) => {
          const isWhitespace = /^\s+$/.test(part);
          if (isWhitespace) {
            return <span key={`space-${index}`}>{part}</span>;
          }

          const style = animated
            ? { animationDelay: `${wordIndex++ * staggerMs}ms` }
            : undefined;

          return (
            <span key={`word-${index}`} className="thegem-heading-word" style={style}>
              {part}
            </span>
          );
        })}
      </span>
    );
  } else {
    content = text;
  }

  return (
    <div ref={ref}>
      <Tag className={headingClass}>{content}</Tag>
    </div>
  );
}
