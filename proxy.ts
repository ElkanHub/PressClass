// proxy.ts — canonical auth/onboarding middleware. Re-exported by `middleware.ts`.
import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/generator",
  "/notes",
  "/lesson-plans",
  "/assessments",
  "/study-time",
  "/whiteboard",
  "/calendar",
  "/results",
  "/credits",
  "/account",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isProtected = isProtectedPath(pathname);

  // Unauthenticated → bounce off protected routes and onboarding
  if (!user && (isProtected || isOnboarding)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated on /auth/* (except logout) → dashboard
  if (user && isAuthRoute && pathname !== "/auth/logout") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Authenticated on protected routes but onboarding incomplete → /onboarding
  if (user && isProtected) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && !profile.onboarding_completed) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Exclude static assets, image optimizer, favicon, auth callback, and API routes
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|auth/confirm|api).*)",
  ],
};
