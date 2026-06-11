import { THEGEM_REMIX_MANIFEST, type TheGemRemixEntry } from "../model/manifest";

export function getEntryByPilotPath(pilotPath: string): TheGemRemixEntry | undefined {
  return THEGEM_REMIX_MANIFEST.find((e) => e.pilotPath === pilotPath);
}

export function listEntriesByLayer(
  layer: TheGemRemixEntry["layer"],
): TheGemRemixEntry[] {
  return THEGEM_REMIX_MANIFEST.filter((e) => e.layer === layer);
}

export function listEntriesForWidget(widget: string): TheGemRemixEntry[] {
  return THEGEM_REMIX_MANIFEST.filter((e) => e.widgets.includes(widget));
}

export function listPendingEntries(): TheGemRemixEntry[] {
  return THEGEM_REMIX_MANIFEST.filter((e) => e.status === "pending");
}

/** Resolve native import path for a remix module (used by widgets). */
export function remixImportPath(remixPath: string): string {
  return `@/shared/design/thegem/${remixPath}`;
}
