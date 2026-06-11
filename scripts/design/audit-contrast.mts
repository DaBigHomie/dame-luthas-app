/**
 * WCAG contrast audit for the proposed "Luthas Enterprise" palette.
 * Deterministic verification of every ratio asserted in
 * docs/design/DESIGN-SYSTEM-RECOMMENDATION.md.
 *
 * Run: npx tsx scripts/design/audit-contrast.mts
 */

type HSL = readonly [h: number, s: number, l: number];

function hslToRgb([h, s, l]: HSL): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

const toHex = (rgb: [number, number, number]) =>
  "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");

function luminance([r, g, b]: [number, number, number]): number {
  const chan = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

function contrast(a: HSL, b: HSL): number {
  const la = luminance(hslToRgb(a));
  const lb = luminance(hslToRgb(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const T = {
  background: [222, 47, 6],
  surface: [222, 47, 8],
  elevated: [222, 47, 10],
  foreground: [0, 0, 100],
  mutedForeground: [222, 14, 70],
  border: [222, 18, 46],
  borderSubtle: [222, 30, 18],
  primary: [217, 91, 60],
  primaryForeground: [222, 47, 6],
  primarySoft: [217, 50, 16],
  accent: [187, 100, 42],
  success: [142, 71, 45],
  warning: [38, 92, 50],
  error: [0, 91, 71],
  info: [199, 92, 60],
  white: [0, 0, 100],
} satisfies Record<string, HSL>;

type Check = {
  label: string;
  fg: keyof typeof T;
  bg: keyof typeof T;
  min: number; // WCAG threshold
  kind: string;
};

const checks: Check[] = [
  { label: "foreground on background", fg: "foreground", bg: "background", min: 4.5, kind: "body text" },
  { label: "muted-foreground on background", fg: "mutedForeground", bg: "background", min: 4.5, kind: "body text" },
  { label: "muted-foreground on surface", fg: "mutedForeground", bg: "surface", min: 4.5, kind: "body text" },
  { label: "primary (accent text) on background", fg: "primary", bg: "background", min: 4.5, kind: "small text" },
  { label: "primary-foreground on primary (BUTTON TEXT)", fg: "primaryForeground", bg: "primary", min: 4.5, kind: "button text" },
  { label: "white on primary (the rejected combo)", fg: "white", bg: "primary", min: 4.5, kind: "should FAIL" },
  { label: "white on primary-soft (active pill text)", fg: "white", bg: "primarySoft", min: 4.5, kind: "pill text" },
  { label: "border on background", fg: "border", bg: "background", min: 3.0, kind: "UI 1.4.11" },
  { label: "border on surface", fg: "border", bg: "surface", min: 3.0, kind: "UI 1.4.11" },
  { label: "border-subtle on background (decorative)", fg: "borderSubtle", bg: "background", min: 3.0, kind: "decorative-exempt" },
  { label: "accent (cyan) on background", fg: "accent", bg: "background", min: 4.5, kind: ">=18px ok at 3.0" },
  { label: "success on background", fg: "success", bg: "background", min: 4.5, kind: "status text" },
  { label: "warning on background", fg: "warning", bg: "background", min: 4.5, kind: "status text" },
  { label: "error on background", fg: "error", bg: "background", min: 4.5, kind: "status text" },
  { label: "info on background", fg: "info", bg: "background", min: 4.5, kind: "status text" },
  { label: "ring/primary on surface (focus 2px)", fg: "primary", bg: "surface", min: 3.0, kind: "focus 2.4.11" },
];

console.log("\nHEX of proposed tokens:");
for (const [k, v] of Object.entries(T)) {
  console.log(`  ${k.padEnd(18)} ${toHex(hslToRgb(v as HSL))}  hsl(${(v as HSL).join(" ")})`);
}

console.log("\nWCAG checks (ratio / min / verdict):");
let fails = 0;
for (const c of checks) {
  const r = contrast(T[c.fg], T[c.bg]);
  const pass = r >= c.min;
  const required = c.kind !== "should FAIL" && c.kind !== "decorative-exempt";
  const verdict = pass ? "PASS" : "FAIL";
  const flag = !pass && required ? "  <-- PROBLEM" : "";
  if (!pass && required) fails++;
  console.log(
    `  ${r.toFixed(2).padStart(6)} / ${c.min.toFixed(1)}  ${verdict.padEnd(4)} [${c.kind}] ${c.label}${flag}`,
  );
}
console.log(`\n${fails === 0 ? "ALL REQUIRED CHECKS PASS" : `${fails} REQUIRED CHECK(S) FAILED`}\n`);
