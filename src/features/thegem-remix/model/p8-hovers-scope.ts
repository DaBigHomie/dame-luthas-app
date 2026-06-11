/**
 * P8 hovers remix scope — what we port vs defer from WP ~80 stylesheets.
 */

export const P8_HOVERS_PORTED = [
  {
    pilotPath: "themes/thegem-elementor/css/thegem-hovers.css",
    remixPath: "remix/hovers.css",
    status: "remixed" as const,
    widgets: ["PortfolioGrid", "Header", "Hero"],
    note: "Native card + button hovers; gallery slider hovers deferred",
  },
  {
    pilotPath: "themes/thegem-elementor/css/hovers/thegem-hovers-circular.css",
    remixPath: "remix/hovers-circular.css",
    status: "remixed" as const,
    widgets: ["PortfolioGrid"],
    note: "Simplified circular overlay on portfolio cards",
  },
  {
    pilotPath: "themes/thegem-elementor/css/thegem-itemsAnimations.css",
    remixPath: "remix/item-animations.css",
    status: "remixed" as const,
    widgets: [],
    note: "CSS hooks only; TheGem itemsAnimations.js not ported",
  },
] as const;

export const P8_HOVERS_DEFERRED = [
  "css/hovers/thegem-hovers-zooming-blur.css",
  "css/hovers/thegem-hovers-gradient.css",
  "css/hovers/thegem-hovers-slide.css",
  "gem-gallery-hover-* rules in thegem-hovers.css",
  "LayerSlider / RevSlider hover layers",
] as const;

export const HEADING_PARITY_STATUS = {
  homepageUsed: [
    "letters-slide-up",
    "words-slide-left",
    "fade-simple",
    "thegem-button-animation-fade-left",
  ],
  nowPortedOptional: ["fade-tb", "fade-bt", "fade-lr", "fade-rl", "background-sliding"],
  alreadyPresent: [
    "letters-scale-out",
    "lines-slide-up",
    "lines-slide-up-random",
    "words-slide-up",
    "words-slide-right",
    "typewriter",
  ],
} as const;
