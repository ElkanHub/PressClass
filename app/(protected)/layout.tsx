import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("ProtectedLayout: Checking Auth...");
  console.log("ProtectedLayout User:", user?.id);
  console.log("ProtectedLayout Error:", error?.message);

  if (!user) {
    console.log("ProtectedLayout: No user, redirecting to login");
    return redirect("/auth/login");
  }

  // Check onboarding status
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
      <main className="md:ml-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
