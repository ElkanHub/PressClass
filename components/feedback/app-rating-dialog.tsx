"use client";

// components/feedback/app-rating-dialog.tsx
// 1-5 stars + reason chips per rating + optional note.

import { useState, useTransition } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitAppRating } from "@/actions/feedback";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const REASONS_BY_RATING: Record<number, string[]> = {
  1: ["Generations are poor", "Hard to use", "Too expensive", "Doesn't fit my curriculum", "Other"],
  2: ["Generations need work", "Missing features", "Confusing UI", "Other"],
  3: ["It's okay", "Some output is great, some isn't", "Could be faster", "Other"],
  4: ["Mostly great", "Saves me time", "Some rough edges", "Other"],
  5: ["Saves me hours every week", "Great quality", "Easy to use", "Will recommend", "Other"],
};

export function AppRatingDialog({ open, onOpenChange }: Props) {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const display = hover ?? rating ?? 0;

  function toggleReason(r: string) {
    setReasons((rs) => (rs.includes(r) ? rs.filter((x) => x !== r) : [...rs, r]));
  }

  function send() {
    if (!rating) {
      toast.error("Pick a rating first");
      return;
    }
    startTransition(async () => {
      try {
        await submitAppRating({
          rating,
          reasons,
          note: note.trim() || undefined,
        });
        toast.success("Thanks for rating PressClass");
        onOpenChange(false);
        setRating(null);
        setReasons([]);
        setNote("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't send");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How's PressClass treating you?</DialogTitle>
          <DialogDescription>
            Your rating helps us focus on what matters. Takes 10 seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-1.5 py-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => { setRating(n as any); setReasons([]); }}
              className="p-1 transition-transform [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-90"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  n <= display
                    ? "fill-amber-400 stroke-amber-500"
                    : "stroke-muted-foreground/40 fill-transparent"
                )}
              />
            </button>
          ))}
        </div>

        {rating && (
          <div className="space-y-3">
            <div>
              <div className="text-xs text-muted-foreground mb-2">What's the main reason?</div>
              <div className="flex flex-wrap gap-2">
                {(REASONS_BY_RATING[rating] ?? []).map((r) => {
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

            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell us more (optional)"
              rows={3}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={pending}>
            Not now
          </Button>
          <Button onClick={send} disabled={pending || !rating}>
            {pending ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Sending</> : "Send rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
