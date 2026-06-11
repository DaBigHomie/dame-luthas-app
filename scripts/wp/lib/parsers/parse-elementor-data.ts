/** Walk Elementor `_elementor_data` JSON tree for widget settings. */

export interface ElementorNode {
  id?: string;
  elType?: string;
  widgetType?: string;
  settings?: Record<string, unknown>;
  elements?: ElementorNode[];
}

export function parseElementorJson(raw: string | null | undefined): ElementorNode[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ElementorNode[] | ElementorNode;
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

export function walkElementorWidgets(
  nodes: ElementorNode[],
  widgetType?: string,
): Array<{ widgetType: string; settings: Record<string, unknown> }> {
  const found: Array<{ widgetType: string; settings: Record<string, unknown> }> = [];

  function visit(node: ElementorNode): void {
    if (node.elType === "widget" && node.widgetType) {
      if (!widgetType || node.widgetType === widgetType) {
        found.push({
          widgetType: node.widgetType,
          settings: node.settings ?? {},
        });
      }
    }
    node.elements?.forEach(visit);
  }

  nodes.forEach(visit);
  return found;
}

/** Extract plain text fields from elementor settings (testimonial body, etc.). */
export function extractTextFields(
  settings: Record<string, unknown>,
): string[] {
  const texts: string[] = [];
  for (const value of Object.values(settings)) {
    if (typeof value === "string" && value.trim().length > 20) {
      texts.push(value.trim());
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      texts.push(...extractTextFields(value as Record<string, unknown>));
    }
  }
  return texts;
}
