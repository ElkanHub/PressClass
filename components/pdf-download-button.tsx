"use client";

// components/pdf-download-button.tsx
// One button used by every detail page. Opens a small dialog letting the
// teacher choose branded (school + accent colors + footer) vs plain PDF.

import { useState } from "react";
import { Download, Loader2, Palette, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buildPalette } from "@/lib/brand";
import { downloadPdf, type DownloadPdfInput } from "@/lib/pdf";
import { useTeacherBrand } from "@/hooks/use-teacher-brand";

interface Props {
  input: DownloadPdfInput;
  /** Force a specific button variant — default outline. */
  variant?: "default" | "outline" | "ghost";
  /** Override the button label. Default: "Download PDF". */
  label?: string;
}

export function PdfDownloadButton({ input, variant = "outline", label = "Download PDF" }: Props) {
  const [open, setOpen] = useState(false);
  const [branded, setBranded] = useState(true);
  const [busy, setBusy] = useState(false);
  const { brand } = useTeacherBrand();

  const hasColors = !!brand?.schoolColor || !!brand?.personalColor;
  const palette = buildPalette(brand?.schoolColor, brand?.personalColor);

  async function handleDownload() {
    setBusy(true);
    try {
      await downloadPdf(input, { branded, teacher: brand ?? undefined });
      toast.success("PDF downloaded");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate PDF");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant}>
          <Download className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download as PDF</DialogTitle>
          <DialogDescription>
            Choose how you'd like this document to look.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <BrandOption
            active={branded}
            onClick={() => setBranded(true)}
            title="Branded"
            description="With your school colors, name and footer."
            previewBg={palette.primary}
            previewAccent={palette.accent}
            icon={Palette}
          />
          <BrandOption
            active={!branded}
            onClick={() => setBranded(false)}
            title="Plain"
            description="Clean black-and-white. No PressClass mark."
            previewBg="#FFFFFF"
            previewAccent="#111827"
            previewBorder
            icon={FileText}
          />
        </div>

        {branded && !hasColors && (
          <p className="text-xs text-amber-600">
            Tip: set your school + personal colors in onboarding for a richer brand.
            Using defaults for now.
          </p>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
          <Button onClick={handleDownload} disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BrandOption({
  active,
  onClick,
  title,
  description,
  previewBg,
  previewAccent,
  previewBorder,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  previewBorder?: boolean;
  icon: typeof Palette;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border-2 p-3 text-left transition ${active ? "border-primary bg-primary/5" : "border-muted hover:border-foreground/30"}`}
    >
      <div
        className="mb-3 h-16 rounded-md overflow-hidden flex flex-col"
        style={{ border: previewBorder ? "1px solid #E5E7EB" : undefined }}
      >
        <div className="h-3" style={{ backgroundColor: previewBg }} />
        <div className="h-1" style={{ backgroundColor: previewAccent }} />
        <div className="flex-1 bg-white px-2 py-1.5 space-y-1">
          <div className="h-1 w-12 bg-neutral-200 rounded" />
          <div className="h-1 w-20 bg-neutral-100 rounded" />
          <div className="h-1 w-16 bg-neutral-100 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2 font-medium">
        <Icon className="h-4 w-4" /> {title}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  );
}
