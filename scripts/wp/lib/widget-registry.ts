/**
 * Widget-type census guardrail — every data-widget_type on a migrated page
 * must map to a React component or an explicit skip (component: null).
 *
 * Used by: audit-wp-source.mts, verify-widget-census.mts
 */

export interface WidgetRegistryEntry {
  /** React component name in src/widgets, or null = intentional skip (chrome/templates). */
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
  "thegem-animated-heading.default": {
    component: "AnimatedHeading",
    source: "thegem",
  },
  "thegem-styledimage.default": {
    component: "StyledImage",
    source: "thegem",
    note: "Service stagger cards — partial via ServiceBlockSection banner",
  },
  "thegem-styledbutton.default": {
    component: "AnimatedButton",
    source: "thegem",
  },
  "thegem-custom-menu.default": {
    component: "ServiceCard",
    source: "thegem",
    note: "Vertical service menus via HTML parse, not runtime widget walk",
  },
  "thegem-clients.default": {
    component: "LogoMarquee",
    source: "thegem",
  },
  "thegem-testimonials.default": {
    component: "TestimonialsCarousel",
    source: "thegem",
    note: "Quotes truncated until _elementor_data GraphQL exposure",
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
    note: "Header/footer chrome — partial (LinkedIn only)",
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
  "heading.default": {
    component: "AnimatedHeading",
    source: "elementor",
  },
  "text-editor.default": {
    component: null,
    source: "elementor",
    note: "Legacy core widget — skip unless encountered on homepage",
  },
  "image.default": {
    component: "StyledImage",
    source: "elementor",
  },
  "button.default": {
    component: "AnimatedButton",
    source: "elementor",
  },
};

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
