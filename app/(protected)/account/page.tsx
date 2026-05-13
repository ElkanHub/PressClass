import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/ui/page-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBasicForm } from "./forms/basic-form";
import { ProfileBrandForm } from "./forms/brand-form";
import { ProfileTeachingForm } from "./forms/teaching-form";
import { ProfileSecurityForm } from "./forms/security-form";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, email, phone, country_code, currency, current_school, school_color, personal_color, preferred_subjects, preferred_class_levels, teaching_experience, primary_use_case, marketing_opt_in"
    )
    .eq("id", user.id)
    .maybeSingle();

  const sp = await searchParams;
  const tab = sp.tab && ["profile", "brand", "teaching", "security"].includes(sp.tab) ? sp.tab : "profile";

  return (
    <PageShell
      title="Account"
      description="Update your profile, brand, teaching preferences, and password."
    >
      <Tabs defaultValue={tab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/40 p-1 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
          <TabsTrigger value="brand" className="rounded-lg">Brand & school</TabsTrigger>
          <TabsTrigger value="teaching" className="rounded-lg">Teaching</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="m-0">
          <ProfileBasicForm
            email={user.email ?? ""}
            initial={{
              fullName: profile?.full_name ?? "",
              countryCode: profile?.country_code ?? "",
              phone: profile?.phone ?? "",
            }}
            currency={profile?.currency ?? "USD"}
          />
        </TabsContent>

        <TabsContent value="brand" className="m-0">
          <ProfileBrandForm
            initial={{
              currentSchool: profile?.current_school ?? "",
              schoolColor: profile?.school_color ?? "#0F766E",
              personalColor: profile?.personal_color ?? "#F59E0B",
            }}
          />
        </TabsContent>

        <TabsContent value="teaching" className="m-0">
          <ProfileTeachingForm
            initial={{
              preferredSubjects: (profile?.preferred_subjects as string[]) ?? [],
              preferredClassLevels: (profile?.preferred_class_levels as string[]) ?? [],
              teachingExperience: (profile?.teaching_experience as any) ?? "",
              primaryUseCase: (profile?.primary_use_case as any) ?? "",
              marketingOptIn: profile?.marketing_opt_in ?? true,
            }}
          />
        </TabsContent>

        <TabsContent value="security" className="m-0">
          <ProfileSecurityForm email={user.email ?? ""} />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
