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

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { user, supabase };
}

// All profile saves go through UPSERT keyed on `id`, then read the resulting
// row back. That way:
//   1. If the trigger somehow missed creating the profile row at signup,
//      the upsert creates it.
//   2. We can detect a silent RLS rejection — if the read returns nothing,
//      we throw instead of pretending success.
async function upsertProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string | null,
  patch: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        email,
        ...patch,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "id" }
    )
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error(
      "Save returned no row. Your session may have expired — sign out and back in."
    );
  }
  return data;
}

export async function updateProfileBasic(input: ProfileBasicInput) {
  const { user, supabase } = await requireUser();
  const country = getCountry(input.countryCode);

  await upsertProfile(supabase, user.id, user.email ?? null, {
    full_name: input.fullName.trim() || null,
    country_code: input.countryCode || null,
    country_name: country?.name ?? null,
    currency: country?.currency ?? "USD",
    phone: input.phone?.trim() || null,
  });

  revalidatePath("/account");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateProfileBrand(input: ProfileBrandInput) {
  const { user, supabase } = await requireUser();
  await upsertProfile(supabase, user.id, user.email ?? null, {
    current_school: input.currentSchool.trim() || null,
    school_color: HEX.test(input.schoolColor) ? input.schoolColor : null,
    personal_color: HEX.test(input.personalColor) ? input.personalColor : null,
  });

  revalidatePath("/account");
  revalidatePath("/notes/[id]", "page");
  revalidatePath("/lesson-plans/[id]", "page");
  revalidatePath("/assessments/[id]", "page");
  return { ok: true };
}

export async function updateProfileTeaching(input: ProfileTeachingInput) {
  const { user, supabase } = await requireUser();
  await upsertProfile(supabase, user.id, user.email ?? null, {
    preferred_subjects: input.preferredSubjects,
    preferred_class_levels: input.preferredClassLevels,
    teaching_experience: input.teachingExperience || null,
    primary_use_case: input.primaryUseCase || null,
    marketing_opt_in: input.marketingOptIn,
  });

  revalidatePath("/account");
  return { ok: true };
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");

  const { user, supabase } = await requireUser();
  if (!user.email) throw new Error("Account has no email.");

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) throw new Error("Current password is incorrect.");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);

  return { ok: true };
}
