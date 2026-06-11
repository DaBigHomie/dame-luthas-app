"use client";

import { useEffect } from "react";

/**
 * Marks document as animation-capable after hydration.
 * Until then, headings/buttons stay visible (progressive enhancement).
 */
export function TheGemMotionRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("thegem-motion-ready");
    return () => {
      document.documentElement.classList.remove("thegem-motion-ready");
    };
  }, []);

  return children;
}
