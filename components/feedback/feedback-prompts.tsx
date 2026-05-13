"use client";

// components/feedback/feedback-prompts.tsx
// Periodically surfaces a soft prompt asking the teacher to share thoughts.
// Two prompt families, rotated:
//   1. Contextual question  → opens <FeedbackDialog> pre-filled
//   2. App rating           → opens <AppRatingDialog>
//
// Rules (kept conservative — better to under-prompt than nag):
//   - Wait ≥ 60s after page load before showing anything
//   - Min 5 days between any prompts
//   - Min 14 days between app-rating prompts
//   - Track recent dismissals in localStorage; back off after 2 dismissals
//   - Never show on marketing routes (FeedbackPrompts is only mounted in
//     the protected layout, so this is enforced by mount point)

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Star, MessageCircle, X } from "lucide-react";
import { FeedbackDialog } from "./feedback-dialog";
import { AppRatingDialog } from "./app-rating-dialog";

interface Question {
  id: string;
  prompt: string;     // toast headline
  description: string; // toast body
  prefill?: string;    // textarea pre-fill
}

const QUESTIONS: Question[] = [
  {
    id: "what-improve",
    prompt: "Quick question",
    description: "What's the one thing you'd improve about PressClass?",
    prefill: "One thing I'd improve:\n",
  },
  {
    id: "missing-feature",
    prompt: "Wish-list",
    description: "Any feature you wish PressClass had?",
    prefill: "I wish PressClass could:\n",
  },
  {
    id: "any-bugs",
    prompt: "Spotted anything broken?",
    description: "Bugs help us a lot — even small ones.",
    prefill: "I noticed:\n",
  },
  {
    id: "generation-quality",
    prompt: "How are the generations?",
    description: "Lesson plans, notes, assessments — anything to fix?",
    prefill: "About the generations:\n",
  },
];

// localStorage keys
const K_LAST_PROMPT  = "pc_fb_last_prompt_at";
const K_LAST_RATING  = "pc_fb_last_rating_at";
const K_DISMISSALS   = "pc_fb_dismissal_count";
const K_SEEN         = "pc_fb_seen_questions";

const DAY  = 24 * 60 * 60 * 1000;
const GAP_PROMPT  = 5  * DAY;
const GAP_RATING  = 14 * DAY;
const INITIAL_DELAY_MS = 60 * 1000;
const BACK_OFF_AFTER_DISMISSALS = 2;
const BACK_OFF_FOR = 14 * DAY;

function readNum(key: string): number {
  if (typeof window === "undefined") return 0;
  const v = Number(localStorage.getItem(key));
  return Number.isFinite(v) ? v : 0;
}
function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function FeedbackPrompts() {
  const fired = useRef(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [ratingOpen, setRatingOpen] = useState(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const t = window.setTimeout(maybePrompt, INITIAL_DELAY_MS);
    return () => window.clearTimeout(t);

    function maybePrompt() {
      const now = Date.now();
      const lastPrompt = readNum(K_LAST_PROMPT);
      const lastRating = readNum(K_LAST_RATING);
      const dismissals = readNum(K_DISMISSALS);
      const lastDismissAt = readNum(K_DISMISSALS + "_at");

      // Back off after a few dismissals
      if (dismissals >= BACK_OFF_AFTER_DISMISSALS && now - lastDismissAt < BACK_OFF_FOR) return;
      // Min gap between any prompts
      if (lastPrompt && now - lastPrompt < GAP_PROMPT) return;

      // Pick: rating if it's been long enough, otherwise a question
      const ratingDue = !lastRating || now - lastRating > GAP_RATING;
      if (ratingDue && Math.random() < 0.4) {
        showRatingToast();
      } else {
        showQuestionToast();
      }
    }

    function showRatingToast() {
      toast(
        "How's PressClass treating you?",
        {
          duration: 12000,
          icon: <Star className="h-4 w-4 text-amber-500" />,
          description: "Rate your experience so far — takes 10 seconds.",
          action: {
            label: "Rate",
            onClick: () => {
              setRatingOpen(true);
              localStorage.setItem(K_LAST_PROMPT, String(Date.now()));
              localStorage.setItem(K_LAST_RATING, String(Date.now()));
            },
          },
          onDismiss: registerDismissal,
          onAutoClose: registerDismissal,
        }
      );
    }

    function showQuestionToast() {
      const seen = readJson<string[]>(K_SEEN, []);
      const pool = QUESTIONS.filter((q) => !seen.includes(q.id));
      const candidates = pool.length > 0 ? pool : QUESTIONS;
      const q = candidates[Math.floor(Math.random() * candidates.length)];

      toast(
        q.prompt,
        {
          duration: 12000,
          icon: <MessageCircle className="h-4 w-4 text-primary" />,
          description: q.description,
          action: {
            label: "Share",
            onClick: () => {
              setQuestion(q);
              localStorage.setItem(K_LAST_PROMPT, String(Date.now()));
              const nextSeen = Array.from(new Set([...seen, q.id]));
              localStorage.setItem(K_SEEN, JSON.stringify(nextSeen));
            },
          },
          onDismiss: registerDismissal,
          onAutoClose: registerDismissal,
        }
      );
    }

    function registerDismissal() {
      const n = readNum(K_DISMISSALS) + 1;
      localStorage.setItem(K_DISMISSALS, String(n));
      localStorage.setItem(K_DISMISSALS + "_at", String(Date.now()));
      // Still cool down for at least one full gap window
      localStorage.setItem(K_LAST_PROMPT, String(Date.now()));
    }
  }, []);

  return (
    <>
      {question && (
        <FeedbackDialog
          open={!!question}
          onOpenChange={(v) => !v && setQuestion(null)}
          fixedKind="prompt_response"
          promptId={question.id}
          title={question.prompt}
          description={question.description}
          prefill={question.prefill}
        />
      )}
      <AppRatingDialog open={ratingOpen} onOpenChange={setRatingOpen} />
    </>
  );
}
