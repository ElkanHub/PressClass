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

export const DEFAULT_PALETTE: BrandPalette = buildPalette("#0F766E", "#9333EA");

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
  const accentHex = isValidHex(personalColor) ? personalColor : "#9333EA";
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

/** Curated swatches surfaced in the onboarding color pickers. */
export const CURATED_SCHOOL_COLORS = [
  "#0F766E", "#1D4ED8", "#7C3AED", "#DB2777", "#DC2626",
  "#EA580C", "#CA8A04", "#16A34A", "#0891B2", "#475569",
];

export const CURATED_PERSONAL_COLORS = [
  "#9333EA", "#F59E0B", "#EF4444", "#10B981", "#3B82F6",
  "#EC4899", "#14B8A6", "#8B5CF6", "#F97316", "#64748B",
];
