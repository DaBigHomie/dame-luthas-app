import { existsSync } from "node:fs";
import path from "node:path";

import { isMigratedAvailable } from "@/shared/lib/migrated/content";

/** Native TheGem shell + codegen homepage (does not require data/migrated/content.json). */
export function isNativeSiteShellEnabled(): boolean {
  if (isMigratedAvailable()) return true;
  return existsSync(path.join(process.cwd(), "src/content/service-blocks.ts"));
}
