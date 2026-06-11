import { listPilotStylesheets } from "@/shared/lib/headless/wp-content-paths";

export function WpPilotStyles() {
  const sheets = listPilotStylesheets();

  return (
    <>
      {sheets.map((relPath) => (
        <link key={relPath} rel="stylesheet" href={`/wp-content/${relPath}`} />
      ))}
    </>
  );
}
