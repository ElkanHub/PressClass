"use client";

// components/feedback/generation-feedback.tsx
// Inline 👍/👎 widget shown on every generation result + detail page.
// Tap → reveals reason chips → optional one-line note → save.
// Saved feedback flips the widget into a "Thanks!" confirmation.

import { useState, useTransition } from "react";
import { ThumbsUp, ThumbsDown, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  submitGenerationFeedback,
  type GenerationType,
} from "@/actions/feedback";

interface Props {
  type: GenerationType;
  /** Saved-record id when known. Null for unsaved result pages. */
  generationId?: string | null;
  /** Anything we want to query against later: subject, class, etc. */
  context?: Record<string, unknown>;
  className?: string;
}

const REASONS_UP = [
  "Used as-is",
  "Used after light edits",
  "Saved me time",
  "Curriculum-aligned",
  "Good examples",
  "Right difficulty",
];

const REASONS_DOWN = [
  "Wrong curriculum",
  "Too generic",
  "Bad structure",
  "Made up facts",
  "Wrong tone",
  "Wrong difficulty",
  "Missing detail",
];

export function GenerationFeedback({ type, generationId, context, className }: Props) {
  const [rating, setRating] = useState<1 | -1 | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const reasonOptions = rating === 1 ? REASONS_UP : REASONS_DOWN;

  function toggleReason(r: string) {
    setReasons((rs) => (rs.includes(r) ? rs.filter((x) => x !== r) : [...rs, r]));
  }

  function save() {
    if (!rating) return;
    startTransition(async () => {
      try {
        await submitGenerationFeedback({
          generationType: type,
          generationId: generationId ?? null,
          rating,
          reasons,
          note: note.trim() || undefined,
          context,
        });
        setSubmitted(true);
        toast.success("Thanks for the feedback");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't save");
      }
    });
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-xl border border-primary/30 bg-primary/[0.04] px-4 py-3 flex items-center gap-2 text-sm",
          className
        )}
      >
        <Check className="h-4 w-4 text-primary" />
        <span className="text-foreground/80">Thanks — your feedback helps us improve PressClass.</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-card px-4 py-3 space-y-3",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="text-sm font-medium">Was this useful?</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setRating(1); setReasons([]); }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
              rating === 1
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-input hover:bg-muted"
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" /> Yes
          </button>
          <button
            type="button"
            onClick={() => { setRating(-1); setReasons([]); }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
              rating === -1
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-input hover:bg-muted"
            )}
          >
            <ThumbsDown className="h-3.5 w-3.5" /> No
          </button>
        </div>
      </div>

      {rating && (
        <div className="space-y-3 pt-1">
          <div>
            <div className="text-xs text-muted-foreground mb-2">
              {rating === 1 ? "What worked?" : "What went wrong?"}
            </div>
            <div className="flex flex-wrap gap-2">
              {reasonOptions.map((r) => {
                const active = reasons.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleReason(r)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-muted"
                    )}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything more specific? (optional)"
            className="h-9 text-sm"
          />

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setRating(null)}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={pending}>
              {pending ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Sending</> : "Send feedback"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
