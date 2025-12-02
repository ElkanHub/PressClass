import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        secure: false, // FORCE FALSE FOR DEBUGGING
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      },
    }
  );
