"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export default function CreditsPill({ className }: Props) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("credit_balances")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) setBalance(data?.balance ?? 0);
    }
    load();

    // Refresh on tab focus — generations may have changed the balance
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const low = balance !== null && balance < 5;

  return (
    <Link
      href="/credits"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
        low
          ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-200"
          : "border-input bg-muted/50 hover:bg-muted",
        className
      )}
      title={low ? "Low credits — top up to keep generating" : "Your credit balance"}
    >
      <Coins className="h-4 w-4" />
      <span>{balance ?? "—"}</span>
    </Link>
  );
}
