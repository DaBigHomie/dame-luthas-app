/**
 * The Gem CSS remix — 50-file pilot → native mapping (SSOT).
 * Status tracked per entry; orchestrator assigns batches by layer.
 */

export type RemixStatus = "pending" | "in_progress" | "remixed" | "verified";

export interface TheGemRemixEntry {
  id: string;
  pilotPath: string;
  remixPath: string;
  layer: "foundation" | "header" | "footer" | "buttons" | "hovers" | "portfolio" | "icons" | "elementor";
  status: RemixStatus;
  widgets: string[];
}

/** Curated 50 pilot stylesheets → native remix targets (priority order). */
export const THEGEM_REMIX_MANIFEST: TheGemRemixEntry[] = [
  { id: "01", pilotPath: "plugins/elementor/assets/css/frontend.min.css", remixPath: "remix/elementor-base.css", layer: "elementor", status: "pending", widgets: [] },
  { id: "02", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/assets/css/frontend-legacy.min.css", remixPath: "remix/elementor-legacy.css", layer: "elementor", status: "pending", widgets: [] },
  { id: "03", pilotPath: "themes/thegem-elementor/css/thegem-preloader.css", remixPath: "remix/preloader.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "04", pilotPath: "themes/thegem-elementor/css/thegem-reset.css", remixPath: "remix/reset.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "05", pilotPath: "themes/thegem-elementor/css/thegem-grid.css", remixPath: "remix/grid.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "06", pilotPath: "themes/thegem-elementor/style.css", remixPath: "remix/theme-base.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "07", pilotPath: "themes/thegem-elementor/css/thegem-header.css", remixPath: "remix/header.css", layer: "header", status: "in_progress", widgets: ["Header"] },
  { id: "08", pilotPath: "themes/thegem-elementor/css/thegem-custom-header.css", remixPath: "remix/header-custom.css", layer: "header", status: "in_progress", widgets: ["Header"] },
  { id: "09", pilotPath: "themes/thegem-elementor/css/header-custom.css", remixPath: "remix/header-layout.css", layer: "header", status: "pending", widgets: ["Header"] },
  { id: "10", pilotPath: "themes/thegem-elementor/css/thegem-layout-perspective.css", remixPath: "remix/layout.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "11", pilotPath: "themes/thegem-elementor/css/thegem-widgets.css", remixPath: "remix/widgets.css", layer: "footer", status: "pending", widgets: ["Footer"] },
  { id: "12", pilotPath: "themes/thegem-elementor/css/thegem-new-css.css", remixPath: "remix/scroll-reveal.css", layer: "foundation", status: "remixed", widgets: [] },
  { id: "13", pilotPath: "themes/thegem-elementor/css/thegem-perevazka-css.css", remixPath: "remix/theme-bridge.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "14", pilotPath: "themes/thegem-elementor/css/custom.css", remixPath: "remix/custom.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "15", pilotPath: "themes/thegem-elementor/css/thegem-hovers.css", remixPath: "remix/hovers.css", layer: "hovers", status: "remixed", widgets: ["Header", "Footer", "Hero", "PortfolioGrid"] },
  { id: "16", pilotPath: "themes/thegem-elementor/css/thegem-button.css", remixPath: "remix/buttons.css", layer: "buttons", status: "pending", widgets: ["Header", "ContactFormBlock"] },
  { id: "17", pilotPath: "themes/thegem-elementor/css/thegem-portfolio.css", remixPath: "remix/portfolio.css", layer: "portfolio", status: "remixed", widgets: ["PortfolioGrid", "GalleryGrid"] },
  { id: "18", pilotPath: "themes/thegem-elementor/css/thegem-portfolio-filters-list.css", remixPath: "remix/portfolio-filters.css", layer: "portfolio", status: "remixed", widgets: ["PortfolioGrid"] },
  { id: "19", pilotPath: "themes/thegem-elementor/css/thegem-news-grid.css", remixPath: "remix/news-grid.css", layer: "portfolio", status: "pending", widgets: [] },
  { id: "20", pilotPath: "themes/thegem-elementor/css/thegem-fullpage.css", remixPath: "remix/fullpage.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "21", pilotPath: "themes/thegem-elementor/css/icons.css", remixPath: "remix/icons.css", layer: "icons", status: "pending", widgets: ["FooterBottomBar"] },
  { id: "22", pilotPath: "themes/thegem-elementor/css/icons-elegant.css", remixPath: "remix/icons-elegant.css", layer: "icons", status: "pending", widgets: ["FooterBottomBar"] },
  { id: "23", pilotPath: "themes/thegem-elementor/css/icons-material.css", remixPath: "remix/icons-material.css", layer: "icons", status: "pending", widgets: [] },
  { id: "24", pilotPath: "themes/thegem-elementor/css/icons-fontawesome.css", remixPath: "remix/icons-fontawesome.css", layer: "icons", status: "pending", widgets: [] },
  { id: "25", pilotPath: "themes/thegem-elementor/css/icons-thegem-header.css", remixPath: "remix/icons-header.css", layer: "icons", status: "pending", widgets: ["Header"] },
  { id: "26", pilotPath: "themes/thegem-elementor/css/icons-arrows.css", remixPath: "remix/icons-arrows.css", layer: "icons", status: "pending", widgets: ["Header"] },
  { id: "27", pilotPath: "plugins/thegem-elements-elementor/inc/button-animation/assets/css/main.css", remixPath: "remix/button-animation.css", layer: "buttons", status: "remixed", widgets: ["Header", "Hero"] },
  { id: "28", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/custom-menu/assets/css/thegem-menu-custom.css", remixPath: "remix/menu.css", layer: "footer", status: "in_progress", widgets: ["FooterBottomBar", "Header"] },
  { id: "29", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/contact-form-7/assets/css/thegem-cf7.css", remixPath: "remix/forms.css", layer: "footer", status: "in_progress", widgets: ["ContactFormBlock"] },
  { id: "30", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/button/assets/css/thegem-button.css", remixPath: "remix/widget-button.css", layer: "buttons", status: "pending", widgets: [] },
  { id: "31", pilotPath: "plugins/thegem-elements-elementor/inc/heading-animation/assets/css/main.css", remixPath: "remix/heading-animations.css", layer: "elementor", status: "remixed", widgets: ["Hero"] },
  { id: "32", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/social-icons/assets/css/thegem-social-icons.css", remixPath: "remix/social.css", layer: "footer", status: "in_progress", widgets: ["FooterBottomBar"] },
  { id: "33", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/call-to-action/assets/css/thegem-cta.css", remixPath: "remix/cta.css", layer: "footer", status: "pending", widgets: [] },
  { id: "34", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/team/assets/css/thegem-team.css", remixPath: "remix/team.css", layer: "footer", status: "pending", widgets: ["ContactPage"] },
  { id: "35", pilotPath: "themes/thegem-elementor/js/fancyBox/jquery.fancybox.min.css", remixPath: "remix/fancybox.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "36", pilotPath: "themes/thegem-elementor/js/owl/owl.carousel.css", remixPath: "remix/carousel.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "37", pilotPath: "themes/thegem-elementor/js/fullpage/fullpage.min.css", remixPath: "remix/fullpage-plugin.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "38", pilotPath: "uploads/thegem/css/custom.css", remixPath: "remix/uploads-custom.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "39", pilotPath: "uploads/thegem/css/style.css", remixPath: "remix/uploads-style.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "40", pilotPath: "uploads/elementor/css/post-105.css", remixPath: "remix/footer-template.css", layer: "footer", status: "in_progress", widgets: ["Footer", "ContactFormBlock", "FooterBottomBar"] },
  { id: "41", pilotPath: "uploads/elementor/css/post-96.css", remixPath: "remix/header-template.css", layer: "header", status: "in_progress", widgets: ["Header"] },
  { id: "42", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/blog-grid/assets/css/thegem-blog-grid.css", remixPath: "remix/blog-grid.css", layer: "portfolio", status: "pending", widgets: [] },
  { id: "43", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/clients/assets/css/thegem-clients.css", remixPath: "remix/clients.css", layer: "portfolio", status: "pending", widgets: [] },
  { id: "44", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/gallery-slider/assets/css/thegem-gallery-slider.css", remixPath: "remix/gallery.css", layer: "portfolio", status: "pending", widgets: [] },
  { id: "45", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/icon/assets/css/thegem-icon.css", remixPath: "remix/icon-widget.css", layer: "icons", status: "pending", widgets: [] },
  { id: "46", pilotPath: "plugins/thegem-elements-elementor/inc/elementor/widgets/styled-image/assets/css/thegem-styled-image.css", remixPath: "remix/styled-image.css", layer: "footer", status: "verified", widgets: ["StyledImage", "ServiceBlockSection"] },
  { id: "47", pilotPath: "themes/thegem-elementor/css/thegem-woocommerce.css", remixPath: "remix/woocommerce.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "48", pilotPath: "themes/thegem-elementor/css/thegem-additional-blog.css", remixPath: "remix/blog.css", layer: "portfolio", status: "pending", widgets: [] },
  { id: "49", pilotPath: "themes/thegem-elementor/css/thegem-quickfinders.css", remixPath: "remix/quickfinders.css", layer: "foundation", status: "pending", widgets: [] },
  { id: "50", pilotPath: "themes/thegem-elementor/css/thegem-testimonials.css", remixPath: "remix/testimonials.css", layer: "foundation", status: "pending", widgets: [] },
];

export function getRemixProgress() {
  const total = THEGEM_REMIX_MANIFEST.length;
  const byStatus = (status: RemixStatus) =>
    THEGEM_REMIX_MANIFEST.filter((e) => e.status === status).length;
  return {
    total,
    pending: byStatus("pending"),
    inProgress: byStatus("in_progress"),
    remixed: byStatus("remixed"),
    verified: byStatus("verified"),
  };
}
