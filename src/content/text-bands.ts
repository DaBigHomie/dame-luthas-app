/** Verified copy from WP page 375 — handoff SSOT. */
import type { TextBands } from "./types";

export const textBands = {
  unAdvisorBand:
    "Served as a trusted United Nations advisor and resource to dozens of global organizations",
  manifesto: {
    eyebrow: "Dame Luthas",
    body: "Utilizing experience and creativity to break the mold and craft digital experiences that defy the status quo. Harnessing the cutting-edge technologies of today, we disrupt, innovate and shape the behaviors of tomorrow.",
  },
  bigHeading: "I create impactful digital experiences and redefine brand identities",
  servicesCtas: {
    sections01and02:
      "If you're facing any technology-related challenges hindering your growth, let's talk.",
    section03:
      "If you're sure where or how to start, but refuse to give up, let's talk.",
  },
} as const satisfies TextBands;
