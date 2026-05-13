"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TeacherBrand } from "@/lib/pdf";

export function useTeacherBrand(): { brand: TeacherBrand | null; loading: boolean } {
  const [brand, setBrand] = useState<TeacherBrand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("full_name, current_school, school_color, personal_color")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      setBrand({
        fullName: data?.full_name ?? null,
        currentSchool: data?.current_school ?? null,
        schoolColor: data?.school_color ?? null,
        personalColor: data?.personal_color ?? null,
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { brand, loading };
}
