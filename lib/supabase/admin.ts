// lib/supabase/admin.ts
// Service-role Supabase client for server-only use. Required for calling
// SECURITY DEFINER functions like debit_credits / grant_credits, and for
// fingerprint / payment writes. NEVER import this from client components.
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// We don't generate typed schemas, so the admin client is intentionally untyped.
// Callers should treat .from().select() results loosely.
type AnyDb = any;
let cached: SupabaseClient<AnyDb> | null = null;

export function createAdminClient(): SupabaseClient<AnyDb> {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin client"
    );
  }
  cached = createClient<AnyDb>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
