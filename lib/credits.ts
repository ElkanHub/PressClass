// lib/credits.ts — single source of truth for credit operations.
// All app code should call these; never touch credit_balances / credit_transactions directly.

import { createAdminClient } from "@/lib/supabase/admin";
import { ApiError } from "@/lib/errors";

export type GenerationType = "notes" | "lesson_plan" | "assessment";

export async function getBalance(userId: string): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("credit_balances")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new ApiError("INTERNAL", error.message);
  return data?.balance ?? 0;
}

export async function getGenerationCost(type: GenerationType): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("generation_costs")
    .select("cost")
    .eq("generation_type", type)
    .maybeSingle();
  if (error) throw new ApiError("INTERNAL", error.message);
  if (!data) throw new ApiError("INTERNAL", `No cost configured for ${type}`);
  return data.cost;
}

export async function debitCredits(
  userId: string,
  amount: number,
  reason: string,
  reference?: string,
  metadata?: Record<string, unknown>
): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("debit_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_reference: reference ?? null,
    p_metadata: metadata ?? null,
  });
  if (error) {
    if (error.message?.includes("INSUFFICIENT_CREDITS")) {
      throw new ApiError("INSUFFICIENT_CREDITS", "Not enough credits.");
    }
    throw new ApiError("INTERNAL", error.message);
  }
  return data as number;
}

export async function grantCredits(
  userId: string,
  amount: number,
  reason: string,
  reference?: string,
  metadata?: Record<string, unknown>
): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("grant_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_reference: reference ?? null,
    p_metadata: metadata ?? null,
  });
  if (error) throw new ApiError("INTERNAL", error.message);
  return data as number;
}

export async function checkRateLimit(userId: string, maxPerMinute = 6): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("check_generation_rate_limit", {
    p_user_id: userId,
    p_max_per_minute: maxPerMinute,
  });
  if (error) throw new ApiError("INTERNAL", error.message);
  return data === true;
}
