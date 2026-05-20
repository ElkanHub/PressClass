"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useRecentPurchase() {
  const [hasRecentPurchase, setHasRecentPurchase] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    let timer: NodeJS.Timeout | null = null;

    async function checkPurchase() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) {
          if (!cancelled) setLoading(false);
          return;
        }

        // Query the latest successful payment
        const { data, error } = await supabase
          .from("payments")
          .select("created_at")
          .eq("user_id", user.id)
          .eq("status", "success")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching recent payment:", error);
          if (!cancelled) setLoading(false);
          return;
        }

        if (data && data.created_at) {
          const paidAt = new Date(data.created_at).getTime();
          const ageMs = Date.now() - paidAt;
          const fiveMinutesMs = 5 * 60 * 1000;

          if (ageMs > 0 && ageMs < fiveMinutesMs) {
            if (!cancelled) setHasRecentPurchase(true);
            const remainingMs = fiveMinutesMs - ageMs;

            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
              if (!cancelled) setHasRecentPurchase(false);
            }, remainingMs);
          } else {
            if (!cancelled) setHasRecentPurchase(false);
          }
        } else {
          if (!cancelled) setHasRecentPurchase(false);
        }
      } catch (err) {
        console.error("Failed to check recent purchase:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkPurchase();

    // Recheck on window focus (e.g. returning from checkout redirect)
    const onFocus = () => {
      checkPurchase();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return { hasRecentPurchase, loading };
}
