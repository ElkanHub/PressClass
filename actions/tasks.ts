"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Task = {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    status: 'not_started' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    category: 'prep' | 'marking' | 'planning' | 'admin' | 'personal' | 'other';
    related_id?: string;
    related_type?: 'lesson_plan' | 'note' | 'assessment';
    position: number;
    created_at: string;
    updated_at: string;
};

export async function createTask(data: Partial<Task>) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { data: task, error } = await supabase
        .from("tasks")
        .insert({
            ...data,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating task:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true, task };
}

export async function getTasks() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { data: [] };
    }

    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching tasks:", error);
        return { data: [] };
    }

    return { data: data as Task[] };
}

export async function updateTask(id: string, data: Partial<Task>) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("tasks")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating task:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteTask(id: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting task:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true };
}
