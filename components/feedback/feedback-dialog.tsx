"use client";

// components/feedback/feedback-dialog.tsx
// Reusable feedback form used by:
//   - the avatar-menu "Send feedback" link (kind chooser visible)
//   - the periodic-prompt manager (kind preset, optional title override)

import { useEffect, useState, useTransition } from "react";
import { Loader2, Bug, Lightbulb, Heart, MessageCircle } from "lucide-react";
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
import { submitFeedback } from "@/actions/feedback";

type Kind = "bug" | "suggestion" | "praise" | "question" | "prompt_response";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Optional preset kind (locks the chooser). */
  fixedKind?: Kind;
  /** Pre-fill the textarea (e.g. when responding to a periodic question). */
  prefill?: string;
  /** Identifies the prompt the user is responding to, if any. */
  promptId?: string;
  /** Overrides the dialog title. */
  title?: string;
  /** Overrides the dialog description. */
  description?: string;
}

const KIND_OPTIONS: { value: Kind; label: string; icon: typeof Bug; ring: string }[] = [
  { value: "bug",        label: "Bug",        icon: Bug,            ring: "ring-red-500/40 bg-red-500/5 text-red-700 dark:text-red-300" },
  { value: "suggestion", label: "Suggestion", icon: Lightbulb,      ring: "ring-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-300" },
  { value: "question",   label: "Question",   icon: MessageCircle,  ring: "ring-blue-500/40 bg-blue-500/5 text-blue-700 dark:text-blue-300" },
  { value: "praise",     label: "Praise",     icon: Heart,          ring: "ring-pink-500/40 bg-pink-500/5 text-pink-700 dark:text-pink-300" },
];

export function FeedbackDialog({
  open,
  onOpenChange,
  fixedKind,
  prefill,
  promptId,
  title,
  description,
}: Props) {
  const [kind, setKind] = useState<Kind>(fixedKind ?? "suggestion");
  const [message, setMessage] = useState(prefill ?? "");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setKind(fixedKind ?? "suggestion");
      setMessage(prefill ?? "");
    }
  }, [open, fixedKind, prefill]);

  function send() {
    if (!message.trim()) {
      toast.error("Tell us what's on your mind first.");
      return;
    }
    startTransition(async () => {
      try {
        await submitFeedback({
          kind,
          message,
          promptId,
          context: typeof window !== "undefined" ? { page: window.location.pathname } : undefined,
        });
        toast.success("Thanks — we read every message.");
        onOpenChange(false);
        setMessage("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't send");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title ?? "Send feedback"}</DialogTitle>
          <DialogDescription>
            {description ?? "Bugs, ideas, praise — anything. We read every one."}
          </DialogDescription>
        </DialogHeader>

        {!fixedKind && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {KIND_OPTIONS.map((opt) => {
              const active = kind === opt.value;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setKind(opt.value)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 justify-center",
                    active ? `ring-2 ${opt.ring}` : "border-input hover:bg-muted text-foreground/80"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            kind === "bug"
              ? "Tell us what broke and (if you can) the steps to reproduce."
              : kind === "suggestion"
              ? "What would make PressClass more useful?"
              : kind === "question"
              ? "What are you trying to figure out?"
              : "Anything you want us to know"
          }
          rows={6}
          className="resize-y"
        />

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={send} disabled={pending}>
            {pending ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Sending</> : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
