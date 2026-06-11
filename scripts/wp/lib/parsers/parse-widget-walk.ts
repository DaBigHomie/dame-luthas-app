import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";

export interface WalkedWidget {
  widgetType: string;
  elementId: string;
  settings: Record<string, unknown>;
  index: number;
}

function parseDataSettings(raw: string | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw.replace(/&quot;/g, '"')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** DOM-order census of Elementor widgets (`data-widget_type` ground truth). */
export function walkWidgets($: CheerioAPI): WalkedWidget[] {
  const widgets: WalkedWidget[] = [];
  $("[data-widget_type]").each((index, el) => {
    const $el = $(el);
    widgets.push({
      widgetType: $el.attr("data-widget_type") ?? "",
      elementId: $el.attr("data-id") ?? "",
      settings: parseDataSettings($el.attr("data-settings")),
      index,
    });
  });
  return widgets;
}

export function findWidgetElements(
  $: CheerioAPI,
  widgetType: string,
): Element[] {
  return $(`[data-widget_type="${widgetType}"]`).toArray();
}
