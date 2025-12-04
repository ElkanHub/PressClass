"use server";

import { createClient } from "@/lib/supabase/server";

export type LessonPlan = {
    id: string;
    user_id: string;
    title: string;
    subject: string;
    class_level: string;
    topic: string | null;
    sub_topic: string | null;
    duration: string | null;
    week_term: string | null;
    date: string | null;
    content: any; // JSON structure for the lesson plan sections
    created_at: string;
    updated_at: string;
};

//
// -------------------------
// GET ALL LESSON PLANS
// -------------------------
//
export async function getLessonPlans(page: number = 1, limit: number = 10) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: [], count: 0 };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
        .from("lesson_plans")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching lesson plans:", error);
        return { data: [], count: 0 };
    }

    return { data: data as LessonPlan[], count: count || 0 };
}

//
// -------------------------
// GET SINGLE LESSON PLAN
// -------------------------
//
export async function getLessonPlan(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from("lesson_plans")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Error fetching lesson plan:", error);
        return null;
    }

    return data as LessonPlan;
}

//
// -------------------------
// CREATE LESSON PLAN
// -------------------------
//
export async function createLessonPlan(form: {
    title: string;
    subject: string;
    class_level: string;
    topic?: string;
    sub_topic?: string;
    duration?: string;
    week_term?: string;
    date?: string;
    content: any;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const { data: lessonPlan, error } = await supabase
        .from("lesson_plans")
        .insert({
            user_id: user.id,
            title: form.title,
            subject: form.subject,
            class_level: form.class_level,
            topic: form.topic || null,
            sub_topic: form.sub_topic || null,
            duration: form.duration || null,
            week_term: form.week_term || null,
            date: form.date || null,
            content: form.content,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating lesson plan:", error);
        return { success: false, error: error.message };
    }

    return {
        success: true,
        lessonPlan,
    };
}

//
// -------------------------
// UPDATE LESSON PLAN
// -------------------------
//
export async function updateLessonPlan(id: string, data: Partial<LessonPlan>) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("lesson_plans")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating lesson plan:", error);
        return { error: error.message };
    }

    return { success: true };
}

//
// -------------------------
// DELETE LESSON PLAN
// -------------------------
//
export async function deleteLessonPlan(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("lesson_plans")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting lesson plan:", error);
        return { error: error.message };
    }

    return { success: true };
}
