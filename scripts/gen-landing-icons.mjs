// Generates components/landing/icons.tsx from Iconify, using the exact icon IDs
// the Figma layers are named after (e.g. layer "iconoir:developer").
import { writeFileSync } from "node:fs";

const ICONS = [
  // page 1 — solution grid
  "iconoir:developer",
  "iconoir:axes",
  "iconoir:chat-lines",
  "iconoir:task-list",
  "iconoir:calendar-rotate",
  "iconoir:clock-rotate-right",
  // page 2 — solution grid
  "iconoir:laptop-dev-mode",
  "iconoir:time-zone",
  "hugeicons:text-check",
  "iconoir:scale-frame-enlarge",
  // page 2 — available roles
  "hugeicons:database-setting",
  "hugeicons:web-design-01",
  "hugeicons:web-design-02",
  "hugeicons:mobile-programming-01",
  "hugeicons:computer-check",
  "hugeicons:source-code-square",
  "hugeicons:dashboard-square-edit",
  "hugeicons:job-search",
  // page 3 — solution grid
  "iconoir:puzzle",
  "iconoir:agile",
  "iconoir:refresh",
  "hugeicons:system-update-01",
  "iconoir:secure-window",
  // page 3 — what we can build
  "hugeicons:job-link",
  "hugeicons:computer-user",
  "hugeicons:flow",
  "hugeicons:api-gateway",
  // hero stat pills
  "hugeicons:refresh-04",
  "hugeicons:dashboard-square-03",
  "hugeicons:piggy-bank",
  // form + misc
  "hugeicons:user",
  "hugeicons:mail-01",
  "hugeicons:building-03",
  "hugeicons:license",
  "hugeicons:user-group",
  "hugeicons:tick-02",
  "hugeicons:play",
];

const ATTR = {
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-opacity": "strokeOpacity",
  "fill-rule": "fillRule",
  "fill-opacity": "fillOpacity",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "vector-effect": "vectorEffect",
  "color-interpolation-filters": "colorInterpolationFilters",
};

function toJsx(body) {
  let out = body;
  for (const [kebab, camel] of Object.entries(ATTR)) {
    out = out.replaceAll(`${kebab}=`, `${camel}=`);
  }
  // self-close void-ish SVG tags React needs closed
  out = out.replace(/<(path|circle|ellipse|rect|line|polyline|polygon|use|stop)\b([^>]*?)(?<!\/)>/g, "<$1$2 />");
  return out;
}

function pascal(id) {
  return (
    id
      .replace(/[:\-_]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (_, c) => c.toUpperCase()) + "Icon"
  );
}

const parts = [];
const missing = [];

for (const id of ICONS) {
  const [set, name] = id.split(":");
  const res = await fetch(`https://api.iconify.design/${set}.json?icons=${name}`);
  const json = await res.json();
  const icon = json.icons?.[name];
  if (!icon) {
    missing.push(id);
    continue;
  }
  const w = icon.width ?? json.width ?? 24;
  const h = icon.height ?? json.height ?? 24;
  parts.push(
    `/** ${id} */\nexport function ${pascal(id)}(props: IconProps) {\n` +
      `  return (\n    <svg viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true" {...props}>\n` +
      `      ${toJsx(icon.body)}\n    </svg>\n  );\n}`
  );
}

if (missing.length) {
  console.error("MISSING:", missing.join(", "));
  process.exit(1);
}

const header = `// AUTO-GENERATED from Iconify (iconoir / hugeicons) — the icon sets the Figma
// design references by layer name (e.g. "iconoir:developer"). Inlined rather than
// fetched so the landing pages issue zero extra network requests for iconography.
// Regenerate with scripts/gen-landing-icons.mjs.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
`;

writeFileSync(
  new URL("../components/landing/icons.tsx", import.meta.url),
  header + "\n" + parts.join("\n\n") + "\n"
);
console.log(`Wrote ${parts.length} icons`);
