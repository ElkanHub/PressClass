"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Note = {
    id: string;
    user_id: string;
    title: string;
    school?: string;
    class_level: string;
    subject: string;
    strand: string;
    sub_strand?: string;
    date?: string;
    duration?: string;
    week_term?: string;
    content: any; // Using any for JSONB content flexibility
    created_at: string;
    updated_at: string;
};

export async function createNote(data: Partial<Note>) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { data: note, error } = await supabase
        .from("notes")
        .insert({
            ...data,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating note:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/notes");
    revalidatePath("/dashboard");
    return { success: true, note };
}

export async function getNotes(page = 1, limit = 10) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { data: [], count: 0 };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
        .from("notes")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching notes:", error);
        return { data: [], count: 0 };
    }

    return { data: data as Note[], count: count || 0 };
}

export async function getNote(id: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Error fetching note:", error);
        return { success: false, error: "Note not found" };
    }

    return { success: true, note: data as Note };
}

export async function updateNote(id: string, data: Partial<Note>) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("notes")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating note:", error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/notes/${id}`);
    revalidatePath("/notes");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteNote(id: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting note:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/notes");
    revalidatePath("/dashboard");
    return { success: true };
}
