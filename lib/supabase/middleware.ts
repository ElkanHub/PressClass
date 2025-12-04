import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes
    // We assume that everything NOT in /auth and NOT the root / (landing page) is protected.
    // Adjust this logic if there are other public pages.
    const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
    const isRoot = request.nextUrl.pathname === "/";
    const isPublicApi = request.nextUrl.pathname.startsWith("/api/public"); // Example

    if (!user && !isAuthRoute && !isRoot && !isPublicApi) {
        // Redirect to login if accessing protected route without user
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    if (user && isAuthRoute && request.nextUrl.pathname !== "/auth/logout") {
        // Redirect to dashboard if accessing auth routes while logged in
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard"; // Or wherever the main app is
        return NextResponse.redirect(url);
    }

    return response;
}
