"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCountry } from "@/lib/countries";

const HEX = /^#[0-9A-Fa-f]{6}$/;

export interface ProfileBasicInput {
  fullName: string;
  countryCode: string;
  phone?: string;
}

export interface ProfileBrandInput {
  currentSchool: string;
  schoolColor: string;
  personalColor: string;
}

export interface ProfileTeachingInput {
  preferredSubjects: string[];
  preferredClassLevels: string[];
  teachingExperience: "less_than_1" | "1_3" | "3_7" | "7_plus" | "";
  primaryUseCase: "lesson_plans" | "notes" | "assessments" | "all" | "";
  marketingOptIn: boolean;
}

// We use the user-scoped Supabase client throughout — RLS already allows users
// to update their own profiles row (see migration 01_base_users_profiles_schools).
// This avoids depending on SUPABASE_SERVICE_ROLE_KEY being set in production.
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { user, supabase };
}

export async function updateProfileBasic(input: ProfileBasicInput) {
  const { user, supabase } = await requireUser();
  const country = getCountry(input.countryCode);

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName.trim() || null,
      country_code: input.countryCode || null,
      country_name: country?.name ?? null,
      currency: country?.currency ?? "USD",
      phone: input.phone?.trim() || null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/account");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateProfileBrand(input: ProfileBrandInput) {
  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      current_school: input.currentSchool.trim() || null,
      school_color: HEX.test(input.schoolColor) ? input.schoolColor : null,
      personal_color: HEX.test(input.personalColor) ? input.personalColor : null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/account");
  revalidatePath("/notes/[id]", "page");
  revalidatePath("/lesson-plans/[id]", "page");
  revalidatePath("/assessments/[id]", "page");
  return { ok: true };
}

export async function updateProfileTeaching(input: ProfileTeachingInput) {
  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      preferred_subjects: input.preferredSubjects,
      preferred_class_levels: input.preferredClassLevels,
      teaching_experience: input.teachingExperience || null,
      primary_use_case: input.primaryUseCase || null,
      marketing_opt_in: input.marketingOptIn,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/account");
  return { ok: true };
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");

  const { user, supabase } = await requireUser();
  if (!user.email) throw new Error("Account has no email.");

  // Re-authenticate first so a stolen session can't silently rotate the password.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) throw new Error("Current password is incorrect.");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);

  return { ok: true };
}
