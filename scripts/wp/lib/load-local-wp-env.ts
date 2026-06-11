import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/** Set LOCAL_WP_PUBLIC_PATH from scripts/wp/local-wp.config.json for Node scripts. */
export function loadLocalWpPublicPathEnv(): void {
  if (process.env.LOCAL_WP_PUBLIC_PATH?.trim()) return;

  const configPath = path.join(
    process.cwd(),
    "scripts",
    "wp",
    "local-wp.config.json",
  );
  if (!existsSync(configPath)) return;

  try {
    const config = JSON.parse(readFileSync(configPath, "utf8")) as {
      publicPath?: string;
    };
    if (config.publicPath) {
      process.env.LOCAL_WP_PUBLIC_PATH = config.publicPath;
    }
  } catch {
    // ignore malformed config
  }
}
