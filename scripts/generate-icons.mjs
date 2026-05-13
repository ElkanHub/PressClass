// scripts/generate-icons.mjs
// One-shot script: renders the PressClass brand mark into every PWA-required
// icon size and writes them to public/icons/. Re-run whenever the brand
// changes. Outputs are committed to the repo so production never needs sharp.

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const PRIMARY = "#0F766E";   // teal-700 (matches CSS --primary)
const ACCENT = "#F59E0B";    // amber-500 (matches CSS --accent)
const BG = "#FFFFFF";        // light background for any-purpose icons

const OUT = resolve("public/icons");
await mkdir(OUT, { recursive: true });

/** Brand mark — primary tile, "PC" wordmark, accent corner. */
function brandSvg(size, { maskable = false } = {}) {
  // Maskable icons need a safe zone: keep visible content inside the inner 80%.
  // We oversize the background tile by 20% so the OS mask can crop freely.
  const padding = maskable ? size * 0.1 : 0;
  const inner = size - padding * 2;
  const radius = maskable ? 0 : size * 0.22;
  const corner = inner * 0.18;
  const fontSize = inner * 0.42;
  const baselineY = padding + inner * 0.66;

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="${PRIMARY}" />
      <stop offset="100%" stop-color="#0E5F58" />
    </linearGradient>
  </defs>
  <rect x="${maskable ? 0 : padding}" y="${maskable ? 0 : padding}" width="${maskable ? size : inner}" height="${maskable ? size : inner}" rx="${radius}" fill="${maskable ? PRIMARY : "url(#g)"}" />
  <path d="M ${padding + inner - corner} ${padding} L ${padding + inner} ${padding} L ${padding + inner} ${padding + corner} Z" fill="${ACCENT}" />
  <text
    x="50%"
    y="${baselineY}"
    text-anchor="middle"
    font-family="-apple-system, system-ui, 'Segoe UI', sans-serif"
    font-weight="800"
    font-size="${fontSize}"
    fill="#FFFFFF"
    letter-spacing="-${fontSize * 0.04}"
  >PC</text>
</svg>
  `);
}

/** Apple touch icon — no transparency, opaque background, no rounded corners
 *  (iOS rounds itself). */
function appleSvg(size) {
  const fontSize = size * 0.38;
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${PRIMARY}" />
  <path d="M ${size * 0.78} 0 L ${size} 0 L ${size} ${size * 0.22} Z" fill="${ACCENT}" />
  <text
    x="50%"
    y="${size * 0.62}"
    text-anchor="middle"
    font-family="-apple-system, system-ui, 'Segoe UI', sans-serif"
    font-weight="800"
    font-size="${fontSize}"
    fill="#FFFFFF"
  >PC</text>
</svg>
  `);
}

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

console.log("Generating standard icons…");
for (const size of SIZES) {
  const out = resolve(OUT, `icon-${size}x${size}.png`);
  await sharp(brandSvg(size)).png().toFile(out);
  console.log(`  ✓ icon-${size}x${size}.png`);
}

console.log("Generating maskable icons…");
for (const size of [192, 512]) {
  const out = resolve(OUT, `icon-maskable-${size}x${size}.png`);
  await sharp(brandSvg(size, { maskable: true })).png().toFile(out);
  console.log(`  ✓ icon-maskable-${size}x${size}.png`);
}

console.log("Generating apple-touch-icon (180x180)…");
await sharp(appleSvg(180)).png().toFile(resolve(OUT, "apple-touch-icon.png"));
console.log("  ✓ apple-touch-icon.png");

console.log("Generating favicon.ico fallback (32x32 PNG, ICO is optional)…");
await sharp(brandSvg(32)).png().toFile(resolve("public/favicon-32x32.png"));
console.log("  ✓ favicon-32x32.png");

// --- iOS splash screens (apple-touch-startup-image) ----------------------
// Brand mark centred on a primary-color canvas. Generated at common iPhone /
// iPad portrait sizes so iOS can pick the matching one.

function splashSvg(width, height) {
  const longSide = Math.min(width, height);
  const markSize = longSide * 0.35;
  const cx = width / 2;
  const cy = height / 2 - markSize * 0.15;
  const radius = markSize * 0.22;
  const fontSize = markSize * 0.42;

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${PRIMARY}" />
  <g transform="translate(${cx - markSize / 2}, ${cy - markSize / 2})">
    <rect width="${markSize}" height="${markSize}" rx="${radius}" fill="rgba(255,255,255,0.12)" />
    <path d="M ${markSize - markSize * 0.18} 0 L ${markSize} 0 L ${markSize} ${markSize * 0.18} Z" fill="${ACCENT}" />
    <text
      x="50%" y="66%" text-anchor="middle"
      font-family="-apple-system, system-ui, 'Segoe UI', sans-serif"
      font-weight="800"
      font-size="${fontSize}"
      fill="#FFFFFF"
    >PC</text>
  </g>
  <text
    x="50%"
    y="${cy + markSize * 0.85}"
    text-anchor="middle"
    font-family="-apple-system, system-ui, 'Segoe UI', sans-serif"
    font-weight="700"
    font-size="${longSide * 0.05}"
    fill="#FFFFFF"
    letter-spacing="${longSide * 0.001}"
  >PressClass</text>
</svg>
  `);
}

const SPLASH_SIZES = [
  // iPhone (portrait)
  [1290, 2796], // 14 Pro Max
  [1179, 2556], // 14 Pro
  [1170, 2532], // 14 / 13 / 12
  [1242, 2688], // 11 Pro Max / Xs Max
  [1125, 2436], // 11 Pro / Xs / X
  [828, 1792],  // 11 / XR
  [750, 1334],  // SE / 8 / 7 / 6
  // iPad (portrait)
  [2048, 2732], // Pro 12.9"
  [1668, 2388], // Pro 11"
  [1640, 2360], // Air
  [1536, 2048], // basic iPad
];

console.log("\nGenerating iOS splash screens…");
const SPLASH_DIR = resolve(OUT, "splash");
await mkdir(SPLASH_DIR, { recursive: true });
for (const [w, h] of SPLASH_SIZES) {
  const out = resolve(SPLASH_DIR, `apple-splash-${w}-${h}.png`);
  await sharp(splashSvg(w, h)).png({ quality: 90 }).toFile(out);
  console.log(`  ✓ apple-splash-${w}-${h}.png`);
}

console.log("\nAll icons + splash screens written. Done.");
