"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type GenerationType = "notes" | "lesson_plan" | "assessment";

export interface SubmitGenerationFeedbackInput {
  generationType: GenerationType;
  generationId?: string | null; // result pages don't have one yet
  rating: 1 | -1;
  reasons?: string[];
  note?: string;
  context?: Record<string, unknown>;
}

export interface SubmitFeedbackInput {
  kind: "bug" | "suggestion" | "praise" | "question" | "prompt_response";
  message: string;
  promptId?: string;       // identifies the prompt the user was responding to
  context?: Record<string, unknown>;
}

export interface SubmitAppRatingInput {
  rating: 1 | 2 | 3 | 4 | 5;
  reasons?: string[];
  note?: string;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { user, supabase };
}

/** Capture the page + UA + viewport so the user gets contextual feedback for free. */
async function pageContext() {
  const h = await headers();
  return {
    page_path: h.get("referer") ?? null, // best-effort — server actions don't see the URL directly
    user_agent: h.get("user-agent") ?? null,
  };
}

// ---------------------------------------------------------------------------
// Per-generation thumbs feedback
// ---------------------------------------------------------------------------
export async function submitGenerationFeedback(input: SubmitGenerationFeedbackInput) {
  const { user, supabase } = await requireUser();

  // Upsert keyed on (user_id, generation_id) so re-rating updates instead of duplicating.
  // For unsaved result-page generations (generation_id is null), we just insert.
  const row = {
    user_id: user.id,
    generation_type: input.generationType,
    generation_id: input.generationId ?? null,
    rating: input.rating,
    reasons: input.reasons ?? [],
    note: input.note ?? null,
    context: input.context ?? null,
  };

  if (input.generationId) {
    const { error } = await supabase
      .from("generation_feedback")
      .upsert(row as never, { onConflict: "user_id,generation_id" });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("generation_feedback").insert(row as never);
    if (error) throw new Error(error.message);
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// General feedback (bug / suggestion / praise / question / prompt_response)
// ---------------------------------------------------------------------------
export async function submitFeedback(input: SubmitFeedbackInput) {
  if (!input.message?.trim()) throw new Error("Tell us what's on your mind.");

  const { user, supabase } = await requireUser();
  const ctx = await pageContext();

  const { error } = await supabase
    .from("feedback")
    .insert({
      user_id: user.id,
      kind: input.kind,
      message: input.message.trim(),
      page_path: ctx.page_path,
      user_agent: ctx.user_agent,
      context: { ...(input.context ?? {}), ...(input.promptId ? { prompt_id: input.promptId } : {}) },
    } as never);
  if (error) throw new Error(error.message);

  return { ok: true };
}

// ---------------------------------------------------------------------------
// App rating (1-5 stars + reason chips + optional note)
// ---------------------------------------------------------------------------
export async function submitAppRating(input: SubmitAppRatingInput) {
  if (input.rating < 1 || input.rating > 5) throw new Error("Rating must be 1-5.");

  const { user, supabase } = await requireUser();
  const ctx = await pageContext();

  const { error } = await supabase
    .from("feedback")
    .insert({
      user_id: user.id,
      kind: "app_rating",
      rating: input.rating,
      reasons: input.reasons ?? [],
      message: input.note?.trim() || null,
      page_path: ctx.page_path,
      user_agent: ctx.user_agent,
    } as never);
  if (error) throw new Error(error.message);

  return { ok: true };
}
