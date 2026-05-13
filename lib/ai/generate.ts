// lib/ai/generate.ts — one canonical generation pipeline.
// Auth → rate-limit → debit credits → call AI → parse → return (refund on parse-fail).

import { createClient } from "@/lib/supabase/server";
import { getAIClient } from "@/lib/AI_API_Switch";
import { ApiError } from "@/lib/errors";
import { buildPrompt, type GenerationParamsMap } from "@/lib/ai/prompts";
import {
  checkRateLimit,
  debitCredits,
  getGenerationCost,
  grantCredits,
  type GenerationType,
} from "@/lib/credits";

export interface GenerateOptions<T extends GenerationType> {
  type: T;
  params: GenerationParamsMap[T];
  /** Optional override for max requests/minute. */
  maxPerMinute?: number;
}

export interface GenerateResult<R = unknown> {
  data: R;
  creditsSpent: number;
  balanceAfter: number;
}

function tryParseJson(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new ApiError("AI_PARSE_ERROR", "AI did not return valid JSON.");
    try {
      return JSON.parse(match[0]);
    } catch {
      throw new ApiError("AI_PARSE_ERROR", "AI returned malformed JSON.");
    }
  }
}

export async function runGeneration<T extends GenerationType, R = unknown>(
  opts: GenerateOptions<T>
): Promise<GenerateResult<R>> {
  // 1. Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new ApiError("UNAUTHENTICATED", "Sign in to generate.");

  // 2. Rate limit (60s window)
  const allowed = await checkRateLimit(user.id, opts.maxPerMinute ?? 6);
  if (!allowed) {
    throw new ApiError(
      "RATE_LIMITED",
      "You're generating too quickly. Please wait a moment."
    );
  }

  // 3. Reserve credits up front
  const cost = await getGenerationCost(opts.type);
  const reference = `${opts.type}:${user.id}:${Date.now()}`;
  const balanceAfterDebit = await debitCredits(
    user.id,
    cost,
    `generation:${opts.type}`,
    reference,
    { params: opts.params }
  );

  // 4. Call AI
  let raw: string;
  try {
    const ai = getAIClient();
    const prompt = buildPrompt(opts.type, opts.params);
    raw = await ai.send(prompt);
  } catch (err) {
    // Refund on provider failure so the user isn't charged for nothing
    await grantCredits(
      user.id,
      cost,
      `refund:${opts.type}`,
      `refund:${reference}`,
      { reason: "ai_provider_error" }
    );
    const message = err instanceof Error ? err.message : "AI provider error";
    throw new ApiError("AI_PROVIDER_ERROR", message);
  }

  // 5. Parse — refund if parse fails
  let parsed: unknown;
  try {
    parsed = tryParseJson(raw);
  } catch (err) {
    await grantCredits(
      user.id,
      cost,
      `refund:${opts.type}`,
      `refund:${reference}`,
      { reason: "ai_parse_error" }
    );
    throw err;
  }

  return {
    data: parsed as R,
    creditsSpent: cost,
    balanceAfter: balanceAfterDebit,
  };
}
