"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type Assessment = {
    id: string;
    user_id: string;
    title: string;
    class_level: string | null;
    topic: string | null;
    questions: any[]; // Using any[] for flexibility with jsonb, but ideally should be typed
    created_at: string;
    updated_at: string;
};

export async function getAssessments() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
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

export async function getAssessment(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

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

export async function createAssessment(data: {
    title: string;
    class_level?: string;
    topic?: string;
    questions: any[];
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data: assessment, error } = await supabase
        .from("assessments")
        .insert({
            user_id: user.id,
            title: data.title,
            class_level: data.class_level,
            topic: data.topic,
            questions: data.questions,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating assessment:", error);
        throw new Error(`Failed to create assessment: ${error.message}`);
    }

    revalidatePath("/dashboard");
    return assessment;
}

export async function updateAssessment(id: string, data: Partial<Assessment>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
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
        throw new Error("Failed to update assessment");
    }

    revalidatePath(`/assessments/${id}`);
    revalidatePath("/dashboard");
}

export async function deleteAssessment(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting assessment:", error);
        throw new Error("Failed to delete assessment");
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
