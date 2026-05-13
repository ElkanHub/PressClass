// app/auth/logout/route.ts — actually sign the user out, then bounce home.

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/`, { status: 302 });
}

// Some clients send POST for logout — accept both.
export const POST = GET;
