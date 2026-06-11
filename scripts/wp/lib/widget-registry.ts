/**
 * Widget-type census guardrail — every data-widget_type on a migrated page
 * must map to a React component or an explicit skip (component: null).
 *
 * Site-wide scope: homepage + /contact/ + /case-studies/ + /pf/* portfolio singles.
 * Keep in sync with docs/MIGRATION-PLAYBOOK.md Phase 3 table.
 *
 * Used by: audit-wp-source.mts, verify-widget-census.mts
 */

export interface WidgetRegistryEntry {
  /** React component name in src/widgets (or shared/ui), or null = intentional skip. */
  component: string | null;
  /** Plugin/source layer for the playbook. */
  source: "thegem" | "elementor" | "elementor-pro" | "cf7" | "other";
  /** Optional note for skips or partial implementations. */
  note?: string;
}

/**
 * Ground truth map: Elementor data-widget_type → Next.js handler.
 * Add an entry BEFORE building a handler; unmapped types fail the census check.
 */
export const WIDGET_REGISTRY: Record<string, WidgetRegistryEntry> = {
  // ── Homepage ──────────────────────────────────────────────────────────────
  "thegem-animated-heading.default": {
    component: "AnimatedHeading",
    source: "thegem",
  },
  "thegem-styledimage.default": {
    component: "StyledImage",
    source: "thegem",
  },
  "thegem-styledbutton.default": {
    component: "AnimatedButton",
    source: "thegem",
  },
  "thegem-custom-menu.default": {
    component: "ServiceCard",
    source: "thegem",
  },
  "thegem-clients.default": {
    component: "LogoMarquee",
    source: "thegem",
  },
  "thegem-testimonials.default": {
    component: "TestimonialsCarousel",
    source: "thegem",
    note: "Full quotes need _elementor_data extraction",
  },
  "thegem-portfolio.default": {
    component: "PortfolioGrid",
    source: "thegem",
  },
  "thegem-contact-form7.default": {
    component: "ContactFormBlock",
    source: "cf7",
  },
  "social-icons.default": {
    component: "SocialIcons",
    source: "elementor-pro",
  },
  "divider.default": {
    component: null,
    source: "elementor",
    note: "Decorative — skip",
  },
  "thegem-template-logo.default": {
    component: "Header",
    source: "thegem",
  },
  "thegem-template-menu.default": {
    component: "Header",
    source: "thegem",
  },

  // ── /contact/ (surfaced by endpoint audit) ────────────────────────────────
  "text-editor.default": {
    component: "RichContent",
    source: "elementor",
    note: "Migrated HTML bands — RichContent / MigratedContent",
  },
  "heading.default": {
    component: "AnimatedHeading",
    source: "elementor",
  },
  "image.default": {
    component: "StyledImage",
    source: "elementor",
  },
  "icon-list.default": {
    component: "IconList",
    source: "elementor",
  },
  "html.default": {
    component: "RichContent",
    source: "elementor",
    note: "Raw HTML embeds — sanitize via RichContent",
  },
  "thegem-team.default": {
    component: "TeamMember",
    source: "thegem",
  },
  "button.default": {
    component: "AnimatedButton",
    source: "elementor",
  },

  // ── /pf/* portfolio singles ───────────────────────────────────────────────
  "spacer.default": {
    component: null,
    source: "elementor",
    note: "Layout spacer — skip",
  },
  "thegem-diagram.default": {
    component: "Diagram",
    source: "thegem",
  },
  "thegem-gallery-grid.default": {
    component: "GalleryGrid",
    source: "thegem",
  },
  "thegem-template-portfolio-info.default": {
    component: "PortfolioInfo",
    source: "thegem",
  },
  "thegem-template-portfolio-title.default": {
    component: "PortfolioTitle",
    source: "thegem",
  },
  "thegem-template-portfolio-excerpt.default": {
    component: "PortfolioExcerpt",
    source: "thegem",
  },
  "thegem-template-portfolio-content.default": {
    component: "PortfolioContent",
    source: "thegem",
  },
  "thegem-template-portfolio-navigation.default": {
    component: "PortfolioNav",
    source: "thegem",
  },

  // ── Template chrome (explicit skips) ────────────────────────────────────────
  "thegem-template-post-title.default": {
    component: null,
    source: "thegem",
    note: "Template chrome — skip",
  },
  "thegem-template-loop-post-content.default": {
    component: null,
    source: "thegem",
    note: "Template chrome — skip",
  },
  "thegem-custom-fields.default": {
    component: null,
    source: "thegem",
    note: "Template meta — skip",
  },
};

/** TheGem Elementor template CPT names (headers, footers, loops, title areas). */
export const TEMPLATE_REGISTRY = {
  header: [
    "Header-01",
    "Header 02 (Demo)",
    "Header Sticky-01",
    "Header Sticky (Demo)",
    "Mobile Nav (Demo)",
  ],
  footer: ["Footer (Demo)", "Footer 02 (Demo)"],
  single: ["Single Post 23", "Blog Post (Demo)"],
  archive: ["Portfolio Page (Demo)"],
  loop: ["Testimonials Loop Item (Demo)"],
  title: ["Title Area 01 (Demo)"],
  other: ["Digital Marketing", "Draft Template"],
} as const;

export interface WidgetCensusResult {
  unmapped: string[];
  skipped: Array<{ widgetType: string; note?: string }>;
  mapped: Array<{ widgetType: string; component: string; count: number }>;
  gaps: Array<{ widgetType: string; count: number; reason: string }>;
}

export function auditWidgetTypes(
  widgetCounts: Record<string, number>,
): WidgetCensusResult {
  const unmapped: string[] = [];
  const skipped: WidgetCensusResult["skipped"] = [];
  const mapped: WidgetCensusResult["mapped"] = [];
  const gaps: WidgetCensusResult["gaps"] = [];

  for (const [widgetType, count] of Object.entries(widgetCounts)) {
    const entry = WIDGET_REGISTRY[widgetType];
    if (!entry) {
      unmapped.push(widgetType);
      gaps.push({
        widgetType,
        count,
        reason: "No registry entry — container will drop silently during extract",
      });
      continue;
    }
    if (entry.component === null) {
      skipped.push({ widgetType, note: entry.note });
      continue;
    }
    mapped.push({ widgetType, component: entry.component, count });
  }

  return { unmapped, skipped, mapped, gaps };
}
