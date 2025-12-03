"use server";

import { createClient } from "@/lib/supabase/server";

export type Assessment = {
    id: string;
    user_id: string;
    title: string;
    class_level: string | null;
    topic: string | null;
    questions: any[];
    created_at: string;
    updated_at: string;
};


//
// -------------------------
// GET ALL ASSESSMENTS
// -------------------------
//
export async function getAssessments() {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user) {
        console.error("getAssessments: No user");
        return [];
    }

    const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching assessments:", error);
        return [];
    }

    return data as Assessment[];
}


//
// -------------------------
// GET SINGLE ASSESSMENT
// -------------------------
//
export async function getAssessment(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Error fetching assessment:", error);
        return null;
    }

    return data as Assessment;
}


//
// -------------------------
// CREATE ASSESSMENT
// -------------------------
//
export async function createAssessment(form: {
    title: string;
    class_level?: string;
    topic?: string;
    questions: any[];
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data: assessment, error } = await supabase
        .from("assessments")
        .insert({
            user_id: user.id,
            title: form.title,
            class_level: form.class_level || null,
            topic: form.topic || null,
            questions: form.questions,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating assessment:", error);
        return { error: error.message };
    }

    // No revalidatePath here — client handles refresh.
    return {
        success: true,
        assessment,
    };
}


//
// -------------------------
// UPDATE ASSESSMENT
// -------------------------
//
export async function updateAssessment(id: string, data: Partial<Assessment>) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("assessments")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating assessment:", error);
        return { error: error.message };
    }

    return { success: true };
}


//
// -------------------------
// DELETE ASSESSMENT
// -------------------------
//
export async function deleteAssessment(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting assessment:", error);
        return { error: error.message };
    }

    return { success: true };
}
