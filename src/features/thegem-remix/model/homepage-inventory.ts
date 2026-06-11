/**
 * Homepage CSS & animation inventory — dameluthas.local (audit 2026-06-10).
 * Reference for @thegem-css-audit and @thegem-animation-audit agents.
 */

export const HOMEPAGE_STYLESHEET_GROUPS = {
  themeCore: [
    "themes/thegem-elementor/style.css",
    "themes/thegem-elementor/css/thegem-reset.css",
    "themes/thegem-elementor/css/thegem-grid.css",
    "themes/thegem-elementor/css/thegem-preloader.css",
    "themes/thegem-elementor/css/thegem-custom-header.css",
    "themes/thegem-elementor/css/thegem-widgets.css",
    "themes/thegem-elementor/css/thegem-new-css.css",
    "themes/thegem-elementor/css/thegem-perevazka-css.css",
    "themes/thegem-elementor/css/thegem-hovers.css",
    "themes/thegem-elementor/css/thegem-hovers-circular.css",
    "themes/thegem-elementor/css/thegem-portfolio.css",
    "themes/thegem-elementor/css/thegem-portfolio-filters-list.css",
    "themes/thegem-elementor/css/thegem-itemsAnimations.css",
    "themes/thegem-elementor/css/thegem-testimonials.css",
    "themes/thegem-elementor/css/thegem-clients.css",
    "themes/thegem-elementor/css/thegem-styledimage.css",
    "themes/thegem-elementor/css/thegem-wrapboxes.css",
    "themes/thegem-elementor/css/icons-elegant.css",
  ],
  elementor: [
    "plugins/elementor/assets/css/frontend.min.css",
    "plugins/elementor/assets/css/frontend-legacy.min.css",
    "plugins/elementor/assets/lib/animations/styles/fadeIn.min.css",
    "uploads/elementor/css/post-14.css",
    "uploads/elementor/css/post-55.css",
    "uploads/elementor/css/post-105.css",
    "uploads/elementor/css/post-375.css",
    "uploads/elementor/css/post-638.css",
    "uploads/elementor/css/post-2523.css",
    "uploads/elementor/css/post-2578.css",
  ],
  thegemPlugins: [
    "plugins/thegem-elements-elementor/inc/heading-animation/assets/css/main.css",
    "plugins/thegem-elements-elementor/inc/button-animation/assets/css/main.css",
    "plugins/thegem-elements-elementor/inc/elementor/widgets/custom-menu/assets/css/thegem-menu-custom.css",
  ],
  customGenerated: ["uploads/thegem/css/custom-DVipX1zB.css"],
} as const;

/** Live animations counted on homepage (exclude browser-agent claude-pulse). */
export const HOMEPAGE_ACTIVE_ANIMATIONS = [
  {
    name: "thegemHeadingLettersSlideUp",
    elementCount: 213,
    duration: "350ms",
    easing: "cubic-bezier(0.3, 1.7, 0.4, 1)",
    staggerMs: 15,
    source:
      "plugins/thegem-elements-elementor/inc/heading-animation/assets/css/main.css",
    widgets: ["Hero"],
  },
  {
    name: "thegemHeadingWordsSlideLeft",
    elementCount: 63,
    duration: "1200ms",
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    source:
      "plugins/thegem-elements-elementor/inc/heading-animation/assets/css/main.css",
    widgets: ["Hero"],
  },
  {
    name: "rotate",
    elementCount: 1,
    duration: "10s",
    easing: "linear",
    infinite: true,
    source: "uploads/thegem/css/custom (generated)",
    widgets: ["ContactFormBlock"],
  },
  {
    name: "fadeIn",
    elementCount: 1,
    duration: "1.25s",
    easing: "ease",
    source: "plugins/elementor/assets/lib/animations/styles/fadeIn.min.css",
    widgets: [],
  },
  {
    name: "buttonFadeLeft",
    elementCount: 1,
    duration: "0.7s",
    easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    source:
      "plugins/thegem-elements-elementor/inc/button-animation/assets/css/main.css",
    widgets: ["Header", "Hero"],
  },
] as const;

export const BUTTON_ANIMATION_KEYFRAMES = [
  "buttonSlideUp",
  "buttonSlideDown",
  "buttonSlideLeft",
  "buttonSlideRight",
  "buttonFadeDown",
  "buttonFadeUp",
  "buttonFadeRight",
  "buttonFadeLeft",
  "buttonFade",
] as const;

export const SCROLL_LOOP_ANIMATIONS = [
  {
    name: "scrollAnimation",
    duration: "1.5s",
    easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    infinite: true,
    remixClass: "dl-gem-mouse-scroll",
    source: "thegem-new-css.css",
  },
  {
    name: "scrollmove",
    duration: "1s",
    easing: "ease",
    infinite: true,
    remixClass: "dl-gem-scrolldown",
    source: "style.css",
  },
  {
    name: "skeletonloading",
    duration: "1.5s",
    infinite: true,
    remixClass: "dl-gem-skeleton",
    source: "style.css",
  },
  {
    name: "header-fadeInDownBig",
    duration: "0.3s–0.4s",
    easing: "ease",
    remixClass: "dl-gem-header-stuck",
    source: "thegem-custom-header.css",
  },
] as const;

export const PORTFOLIO_FILTER_ANIMATIONS = [
  { name: "MenuAnimIn", duration: "0.3s", className: "dl-animate-in" },
  { name: "MenuAnimOut", duration: "0.4s", className: "dl-animate-out" },
  { name: "spin", duration: "0.8s", className: "dl-gem-filter-spinner" },
] as const;

export const HOMEPAGE_ANIMATION_WIDGET_COUNTS = {
  animatedHeadings: 47,
  animatedButtons: 1,
  scrollInteractions: 15,
  itemFlipAnimations: 7,
  clientSliders: 2,
  hoverAnimations: 3,
  rotatingCircles: 1,
} as const;

export const HEADING_ANIMATION_KEYFRAMES = [
  "thegemHeadingLinesSlideUp",
  "thegemHeadingLinesSlideUpRandom",
  "thegemHeadingWordsSlideUp",
  "thegemHeadingWordsSlideLeft",
  "thegemHeadingWordsSlideRight",
  "thegemHeadingLettersSlideUp",
  "thegemHeadingTypewriter",
  "thegemHeadingLettersScaleOut",
  "thegemHeadingBackgroundSliding",
  "thegemHeadingFadeTB",
  "thegemHeadingFadeBT",
  "thegemHeadingFadeLR",
  "thegemHeadingFadeRL",
  "thegemHeadingFadeSimple",
] as const;

export const TRANSITION_HOTSPOTS = [
  { file: "thegem-hovers.css", ruleCount: 35 },
  { file: "thegem-widgets.css", ruleCount: 34 },
  { file: "style.css", ruleCount: 33 },
  { file: "thegem-hovers-circular.css", ruleCount: 32 },
  { file: "thegem-portfolio.css", ruleCount: 27 },
] as const;
