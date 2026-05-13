// lib/supabase/server.ts
// Server-side Supabase client using the modern getAll/setAll cookie API.
// The older get/set/remove API was removed in recent @supabase/ssr releases.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Setting cookies from a Server Component is a no-op — the middleware
            // refreshes the session for us. Safe to swallow.
          }
        },
      },
    }
  );
}
