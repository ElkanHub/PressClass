// app/(protected)/layout.tsx
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PwaPrompts } from "@/components/pwa-prompts";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile && !profile.onboarding_completed) {
    return redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <Header />
      <main className="md:ml-64 px-4 sm:px-6 py-4 sm:py-6 pb-28 md:pb-8">
        <div className="max-w-6xl mx-auto space-y-6 overflow-x-hidden">{children}</div>
      </main>
      <BottomNav />
      <PwaPrompts />
    </div>
  );
}
