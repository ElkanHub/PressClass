"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();


  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return <Button variant="outline" className="text-center w-full rounded-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive/50" onClick={logout}>Logout</Button>;
}
