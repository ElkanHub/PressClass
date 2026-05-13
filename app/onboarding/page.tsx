import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingWizard from "./wizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, user_type, onboarding_completed, country_code")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_completed) redirect("/dashboard");

  return (
    <OnboardingWizard
      userId={user.id}
      email={user.email ?? ""}
      initialFullName={profile?.full_name ?? ""}
      userType={(profile?.user_type as "school" | "teacher" | "student" | "regular") ?? "teacher"}
      initialCountryCode={profile?.country_code ?? ""}
    />
  );
}
