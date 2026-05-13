"use client";

// components/ui/color-picker.tsx — swatch grid + native picker fallback.

import { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { isValidHex } from "@/lib/brand";

interface ColorPickerProps {
  label: string;
  description?: string;
  value: string;
  onChange: (hex: string) => void;
  swatches: string[];
}

export function ColorPicker({ label, description, value, onChange, swatches }: ColorPickerProps) {
  const id = useId();
  const safe = isValidHex(value) ? value : swatches[0];

  return (
    <div className="space-y-3">
      <div>
        <div className="font-medium">{label}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {swatches.map((hex) => {
          const active = hex.toLowerCase() === safe.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              onClick={() => onChange(hex)}
              aria-label={`Choose ${hex}`}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition",
                active ? "ring-2 ring-offset-2 ring-foreground/40" : "hover:scale-110"
              )}
              style={{ backgroundColor: hex, borderColor: active ? hex : "transparent" }}
            >
              {active && <Check className="h-4 w-4 text-white mx-auto" strokeWidth={3} />}
            </button>
          );
        })}
        <label htmlFor={id} className="inline-flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs cursor-pointer hover:bg-muted">
          <span className="inline-block h-4 w-4 rounded" style={{ backgroundColor: safe }} />
          <span>Custom</span>
          <input
            id={id}
            type="color"
            value={safe}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
