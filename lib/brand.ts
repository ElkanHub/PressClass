// lib/brand.ts — derive a PDF-ready palette from a teacher's chosen colors.
// The school color is treated as primary identity; personal color as accent.

export interface Rgb { r: number; g: number; b: number; }
export interface BrandPalette {
  primary: string;        // school color
  primarySoft: string;    // light tint for backgrounds
  primaryInk: string;     // dark variant for headings
  accent: string;         // personal color
  accentSoft: string;
  text: string;           // body text
  muted: string;          // captions / labels
  border: string;
  paper: string;
  primaryRgb: Rgb;
  accentRgb: Rgb;
}

const HEX = /^#([0-9a-f]{6})$/i;

export function isValidHex(value: string | null | undefined): value is string {
  return typeof value === "string" && HEX.test(value);
}

export function hexToRgb(hex: string): Rgb {
  if (!isValidHex(hex)) return { r: 15, g: 118, b: 110 };
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return { r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t };
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

/** Build a complete PDF palette from a school + personal color. Falls back to defaults if either is missing or invalid. */
export function buildPalette(schoolColor?: string | null, personalColor?: string | null): BrandPalette {
  const primaryHex = isValidHex(schoolColor) ? schoolColor : "#0F766E";
  const accentHex = isValidHex(personalColor) ? personalColor : "#F59E0B";
  const primary = hexToRgb(primaryHex);
  const accent = hexToRgb(accentHex);

  return {
    primary: primaryHex,
    primarySoft: rgbToHex(mix(primary, WHITE, 0.88)),
    primaryInk: rgbToHex(mix(primary, BLACK, 0.25)),
    accent: accentHex,
    accentSoft: rgbToHex(mix(accent, WHITE, 0.9)),
    text: "#111827",
    muted: "#6B7280",
    border: "#E5E7EB",
    paper: "#FFFFFF",
    primaryRgb: primary,
    accentRgb: accent,
  };
}

/** Curated swatches surfaced in the onboarding color pickers.
 *  Ordered to favour the African-school palette (deep greens, blues, ochres). */
export const CURATED_SCHOOL_COLORS = [
  "#0F766E", // teal-700 (PressClass primary)
  "#15803D", // green-700 (Ghana / Nigeria green)
  "#1E40AF", // blue-800
  "#9F1239", // rose-800
  "#854D0E", // amber-800 (clay)
  "#7C2D12", // orange-900 (terracotta)
  "#0E7490", // cyan-700
  "#3F3F46", // zinc-700 (slate)
  "#1F2937", // gray-800
  "#365314", // lime-900
];

export const CURATED_PERSONAL_COLORS = [
  "#F59E0B", // amber-500 (sunset)
  "#DC2626", // red-600
  "#16A34A", // green-600
  "#EAB308", // yellow-500 (gold)
  "#2563EB", // blue-600
  "#0EA5E9", // sky-500
  "#EC4899", // pink-500
  "#A16207", // amber-700
  "#059669", // emerald-600
  "#7C3AED", // violet-600
];
