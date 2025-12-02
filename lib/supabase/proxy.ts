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
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    console.log("PROXY: Setting cookies:", cookiesToSet.map(c => `${c.name}=${c.value.substring(0, 10)}...`).join(", "));
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value),
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    );
                },
            },
            cookieOptions: {
                secure: false, // FORCE FALSE FOR DEBUGGING
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: "lax",
            },
        },
    );

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    const { data: { user } } = await supabase.auth.getUser();

    return response;
}
