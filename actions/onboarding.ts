"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { grantCredits } from "@/lib/credits";
import { extractClientIp, hashValue, normalizeEmail } from "@/lib/fingerprint";
import { headers } from "next/headers";
import { getCountry } from "@/lib/countries";

const SIGNUP_BONUS = 25;

export interface OnboardingPayload {
  fullName: string;
  countryCode: string;
  phone?: string;
  currentSchool: string;
  schoolColor: string;
  personalColor: string;
  preferredSubjects: string[];
  preferredClassLevels: string[];
  teachingExperience: "less_than_1" | "1_3" | "3_7" | "7_plus" | "";
  primaryUseCase: "lesson_plans" | "notes" | "assessments" | "all" | "";
  referralSource?: string;
  marketingOptIn: boolean;
  deviceHash?: string;
}

export interface OnboardingResult {
  ok: true;
  creditsGranted: number;
  duplicateFingerprint: boolean;
}

/**
 * Persists onboarding answers, records signup fingerprint, and grants the
 * signup bonus iff the fingerprint isn't a known duplicate. Idempotent on
 * the per-user signup_bonus grant.
 */
export async function completeOnboarding(
  payload: OnboardingPayload
): Promise<OnboardingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const admin = createAdminClient();
  const country = getCountry(payload.countryCode);

  const hexOrNull = (v: string) => (/^#[0-9A-Fa-f]{6}$/.test(v) ? v : null);

  // 1. Update profile with onboarding data
  const { error: profileErr } = await admin
    .from("profiles")
    .update({
      full_name: payload.fullName,
      country_code: payload.countryCode,
      country_name: country?.name ?? null,
      currency: country?.currency ?? "USD",
      phone: payload.phone || null,
      current_school: payload.currentSchool || null,
      school_color: hexOrNull(payload.schoolColor),
      personal_color: hexOrNull(payload.personalColor),
      preferred_subjects: payload.preferredSubjects,
      preferred_class_levels: payload.preferredClassLevels,
      teaching_experience: payload.teachingExperience || null,
      primary_use_case: payload.primaryUseCase || null,
      referral_source: payload.referralSource || null,
      marketing_opt_in: payload.marketingOptIn,
      onboarding_completed: true,
      onboarding_step: 999,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (profileErr) throw new Error(profileErr.message);

  // 2. Record fingerprint
  const hdrs = await headers();
  const ip = extractClientIp(hdrs);
  const ua = hdrs.get("user-agent") || null;
  const emailNorm = user.email ? normalizeEmail(user.email) : null;
  const ipHash = ip ? hashValue(ip) : null;

  // 3. Detect duplicate fingerprint to suppress bonus
  let duplicate = false;
  if (emailNorm || ipHash || payload.deviceHash) {
    const filters: string[] = [];
    if (emailNorm) filters.push(`email_normalized.eq.${emailNorm}`);
    if (ipHash) filters.push(`ip_hash.eq.${ipHash}`);
    if (payload.deviceHash) filters.push(`device_hash.eq.${payload.deviceHash}`);
    const { data: existing } = await admin
      .from("signup_fingerprints")
      .select("user_id, signup_bonus_granted")
      .or(filters.join(","))
      .neq("user_id", user.id)
      .limit(1);
    duplicate = Array.isArray(existing) && existing.length > 0;
  }

  await admin.from("signup_fingerprints").insert({
    user_id: user.id,
    email: user.email,
    email_normalized: emailNorm,
    ip_hash: ipHash,
    user_agent: ua,
    device_hash: payload.deviceHash || null,
    country_code: payload.countryCode,
    signup_bonus_granted: !duplicate,
  });

  // 4. Grant signup bonus (idempotent on user_id reference)
  let creditsGranted = 0;
  if (!duplicate) {
    await grantCredits(user.id, SIGNUP_BONUS, "signup_bonus", user.id, {
      country: payload.countryCode,
    });
    creditsGranted = SIGNUP_BONUS;
  }

  return { ok: true, creditsGranted, duplicateFingerprint: duplicate };
}
