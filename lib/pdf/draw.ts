// lib/pdf/draw.ts — low-level jsPDF helpers shared by every template.
// All measurements in millimeters. Coordinate origin is top-left.

import { jsPDF } from "jspdf";
import { BrandPalette } from "@/lib/brand";

export interface PageContext {
  doc: jsPDF;
  palette: BrandPalette;
  branded: boolean;
  pageWidth: number;
  pageHeight: number;
  marginX: number;
  marginTop: number;
  marginBottom: number;
  /** Mutable cursor for the next render call. */
  y: number;
  /** Footer line text (e.g. teacher name + school). */
  footerLeft?: string;
  footerRight?: string;
  /** Document title for headers on subsequent pages. */
  docTitle?: string;
}

export function createPageContext(opts: {
  palette: BrandPalette;
  branded: boolean;
  footerLeft?: string;
  footerRight?: string;
  docTitle?: string;
}): PageContext {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const ctx: PageContext = {
    doc,
    palette: opts.palette,
    branded: opts.branded,
    pageWidth: doc.internal.pageSize.getWidth(),
    pageHeight: doc.internal.pageSize.getHeight(),
    marginX: 18,
    marginTop: opts.branded ? 28 : 22,
    marginBottom: opts.branded ? 18 : 14,
    y: opts.branded ? 28 : 22,
    footerLeft: opts.footerLeft,
    footerRight: opts.footerRight,
    docTitle: opts.docTitle,
  };
  drawChrome(ctx, 1);
  return ctx;
}

function setFillFromHex(ctx: PageContext, hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  ctx.doc.setFillColor(r, g, b);
}

function setTextFromHex(ctx: PageContext, hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  ctx.doc.setTextColor(r, g, b);
}

function setDrawFromHex(ctx: PageContext, hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  ctx.doc.setDrawColor(r, g, b);
}

/** Draws header bar + footer for the current page based on branded flag. */
function drawChrome(ctx: PageContext, pageNumber: number) {
  const { doc, palette, branded, pageWidth, pageHeight } = ctx;

  if (branded) {
    // Header bar
    setFillFromHex(ctx, palette.primary);
    doc.rect(0, 0, pageWidth, 12, "F");
    // Accent stripe
    setFillFromHex(ctx, palette.accent);
    doc.rect(0, 12, pageWidth, 1.5, "F");

    // Title in header (page 2+)
    if (pageNumber > 1 && ctx.docTitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(ctx.docTitle, ctx.marginX, 8);
    }
  } else {
    // Subtle line at top
    setDrawFromHex(ctx, palette.border);
    doc.setLineWidth(0.3);
    doc.line(ctx.marginX, 14, pageWidth - ctx.marginX, 14);
  }

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setTextFromHex(ctx, palette.muted);
  const footerY = pageHeight - 8;
  if (ctx.footerLeft) doc.text(ctx.footerLeft, ctx.marginX, footerY);
  if (ctx.footerRight) doc.text(ctx.footerRight, pageWidth - ctx.marginX, footerY, { align: "right" });
  doc.text(`Page ${pageNumber}`, pageWidth / 2, footerY, { align: "center" });

  if (branded) {
    setTextFromHex(ctx, palette.muted);
    doc.setFontSize(7);
    doc.text("Generated with PressClass", pageWidth / 2, pageHeight - 4, { align: "center" });
  }
}

export function ensureSpace(ctx: PageContext, needed: number) {
  if (ctx.y + needed > ctx.pageHeight - ctx.marginBottom) {
    ctx.doc.addPage();
    ctx.y = ctx.marginTop;
    drawChrome(ctx, ctx.doc.getNumberOfPages());
  }
}

export function pageWidthInner(ctx: PageContext) {
  return ctx.pageWidth - ctx.marginX * 2;
}

export function drawDocumentTitle(ctx: PageContext, title: string, subtitle?: string) {
  ensureSpace(ctx, 18);
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.setFontSize(22);
  setTextFromHex(ctx, ctx.palette.primaryInk);
  const titleLines = ctx.doc.splitTextToSize(title, pageWidthInner(ctx));
  ctx.doc.text(titleLines, ctx.marginX, ctx.y);
  ctx.y += titleLines.length * 8;

  if (subtitle) {
    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.setFontSize(11);
    setTextFromHex(ctx, ctx.palette.muted);
    ctx.doc.text(subtitle, ctx.marginX, ctx.y + 3);
    ctx.y += 8;
  }
  ctx.y += 4;
}

export function drawSectionHeading(ctx: PageContext, label: string) {
  ensureSpace(ctx, 14);
  ctx.y += 2;
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.setFontSize(12);
  setTextFromHex(ctx, ctx.palette.primary);
  ctx.doc.text(label.toUpperCase(), ctx.marginX, ctx.y);
  ctx.y += 2;
  setDrawFromHex(ctx, ctx.palette.primary);
  ctx.doc.setLineWidth(0.6);
  ctx.doc.line(ctx.marginX, ctx.y, ctx.marginX + 28, ctx.y);
  ctx.y += 6;
}

export function drawParagraph(ctx: PageContext, text: string, opts?: { size?: number; bold?: boolean }) {
  if (!text) return;
  const size = opts?.size ?? 10.5;
  ctx.doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
  ctx.doc.setFontSize(size);
  setTextFromHex(ctx, ctx.palette.text);
  const lineHeight = size * 0.45;
  const paragraphs = text.split(/\n\n+/);
  for (const para of paragraphs) {
    const normalised = para.replace(/\n/g, " ").trim();
    if (!normalised) continue;
    const lines = ctx.doc.splitTextToSize(normalised, pageWidthInner(ctx));
    for (const line of lines) {
      ensureSpace(ctx, lineHeight + 1);
      ctx.doc.text(line, ctx.marginX, ctx.y);
      ctx.y += lineHeight;
    }
    ctx.y += 2;
  }
}

export function drawBulletList(ctx: PageContext, items: string[]) {
  if (!items?.length) return;
  ctx.doc.setFont("helvetica", "normal");
  ctx.doc.setFontSize(10.5);
  setTextFromHex(ctx, ctx.palette.text);
  const indent = 6;
  const lineHeight = 5.2;
  for (const item of items) {
    if (!item) continue;
    const lines = ctx.doc.splitTextToSize(item, pageWidthInner(ctx) - indent);
    ensureSpace(ctx, lineHeight * lines.length + 1);
    setTextFromHex(ctx, ctx.palette.primary);
    ctx.doc.text("•", ctx.marginX, ctx.y);
    setTextFromHex(ctx, ctx.palette.text);
    ctx.doc.text(lines, ctx.marginX + indent, ctx.y);
    ctx.y += lines.length * lineHeight + 1;
  }
}

/** Renders a key/value metadata block as a simple 2-column flow. */
export function drawMetaBlock(ctx: PageContext, entries: { label: string; value: string | undefined | null }[]) {
  const filtered = entries.filter((e) => e.value && e.value.trim());
  if (!filtered.length) return;

  const cols = 3;
  const colWidth = pageWidthInner(ctx) / cols;
  const rowHeight = 12;
  const rows = Math.ceil(filtered.length / cols);
  ensureSpace(ctx, rows * rowHeight + 4);

  filtered.forEach((entry, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = ctx.marginX + col * colWidth;
    const y = ctx.y + row * rowHeight;

    ctx.doc.setFont("helvetica", "normal");
    ctx.doc.setFontSize(7.5);
    setTextFromHex(ctx, ctx.palette.muted);
    ctx.doc.text(entry.label.toUpperCase(), x, y);

    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.setFontSize(10);
    setTextFromHex(ctx, ctx.palette.text);
    const valueLines = ctx.doc.splitTextToSize(entry.value!, colWidth - 4);
    ctx.doc.text(valueLines.slice(0, 2), x, y + 4);
  });
  ctx.y += rows * rowHeight + 2;
}

/** Tinted callout box (used for highlights and core points). */
export function drawCallout(ctx: PageContext, label: string, body: string, tone: "primary" | "accent" = "primary") {
  if (!body) return;
  const tint = tone === "primary" ? ctx.palette.primarySoft : ctx.palette.accentSoft;
  const inkHex = tone === "primary" ? ctx.palette.primary : ctx.palette.accent;
  ctx.doc.setFont("helvetica", "normal");
  ctx.doc.setFontSize(10);
  const lines = ctx.doc.splitTextToSize(body, pageWidthInner(ctx) - 6);
  const height = 8 + lines.length * 5;
  ensureSpace(ctx, height + 4);
  setFillFromHex(ctx, tint);
  ctx.doc.roundedRect(ctx.marginX, ctx.y, pageWidthInner(ctx), height, 2, 2, "F");
  ctx.doc.setFont("helvetica", "bold");
  ctx.doc.setFontSize(9);
  setTextFromHex(ctx, inkHex);
  ctx.doc.text(label.toUpperCase(), ctx.marginX + 3, ctx.y + 5);
  ctx.doc.setFont("helvetica", "normal");
  ctx.doc.setFontSize(10);
  setTextFromHex(ctx, ctx.palette.text);
  ctx.doc.text(lines, ctx.marginX + 3, ctx.y + 10);
  ctx.y += height + 3;
}

export function safeFileName(name: string, fallback = "document"): string {
  const cleaned = (name || fallback).replace(/[^a-z0-9_\- ]+/gi, "").trim().replace(/\s+/g, "_").toLowerCase();
  return cleaned || fallback;
}
