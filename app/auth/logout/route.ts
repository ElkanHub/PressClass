import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    // Check if a user's logged in
    // const {
    //     data: { user },
    // } = await supabase.auth.getUser();

    // if (user) {
    //     await supabase.auth.signOut();
    // }

    // revalidatePath("/", "layout"); ..
    return NextResponse.redirect("/auth/login", {
        status: 302,
    });
}
