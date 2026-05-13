"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  CURATED_SCHOOL_COLORS,
  CURATED_PERSONAL_COLORS,
  buildPalette,
} from "@/lib/brand";
import { updateProfileBrand, type ProfileBrandInput } from "@/actions/profile";

interface Props {
  initial: ProfileBrandInput;
}

export function ProfileBrandForm({ initial }: Props) {
  const [form, setForm] = useState<ProfileBrandInput>(initial);
  const [pending, startTransition] = useTransition();
  const palette = buildPalette(form.schoolColor, form.personalColor);

  function save() {
    startTransition(async () => {
      try {
        await updateProfileBrand(form);
        toast.success("Brand updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't save");
      }
    });
  }

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Brand & school</h2>
        <p className="text-sm text-muted-foreground">
          These appear on PDFs you export and on the document reader inside the app.
        </p>
      </header>

      <div className="space-y-2 max-w-md">
        <Label htmlFor="school">Current school</Label>
        <Input
          id="school"
          value={form.currentSchool}
          onChange={(e) => setForm({ ...form, currentSchool: e.target.value })}
          placeholder="e.g. Accra Academy"
        />
        <p className="text-xs text-muted-foreground">
          This appears in the footer of your branded PDFs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ColorPicker
            label="School color"
            description="Usually your school's main brand color. Used as the primary accent in your PDFs."
            value={form.schoolColor}
            onChange={(v) => setForm({ ...form, schoolColor: v })}
            swatches={CURATED_SCHOOL_COLORS}
          />
          <ColorPicker
            label="Your personal color"
            description="A secondary accent. Pick something that feels like you."
            value={form.personalColor}
            onChange={(v) => setForm({ ...form, personalColor: v })}
            swatches={CURATED_PERSONAL_COLORS}
          />
        </div>

        <div className="rounded-xl border overflow-hidden">
          <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground bg-muted/40 border-b">
            Live preview
          </div>
          <div className="h-2" style={{ backgroundColor: palette.primary }} />
          <div className="h-1" style={{ backgroundColor: palette.accent }} />
          <div className="bg-white px-5 py-5 space-y-3">
            <div className="text-lg font-bold leading-tight" style={{ color: palette.primaryInk }}>
              Sample lesson plan
            </div>
            <div className="text-xs text-neutral-500">Mathematics · JHS 2 · 60 mins</div>
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: palette.primary }}>
                Objectives
              </div>
              <div className="h-[2px] w-8" style={{ backgroundColor: palette.primary }} />
            </div>
            <div className="space-y-2 text-sm text-neutral-700">
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: palette.primary }} />
                <span>Identify equivalent fractions in everyday contexts.</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: palette.primary }} />
                <span>Compare fractions using diagrams.</span>
              </div>
            </div>
            <div
              className="rounded-md p-3 mt-3"
              style={{ backgroundColor: palette.accentSoft, color: palette.text }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: palette.accent }}>
                Activity
              </div>
              <div className="text-xs mt-1">Have students cut paper strips to match each fraction shown on the board.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={pending}>
          {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save changes"}
        </Button>
      </div>
    </Card>
  );
}
