"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveNote(noteData: any) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("notes").insert({
        user_id: user.id,
        school_name: noteData.administrativeDetails.school,
        class_level: noteData.administrativeDetails.class,
        subject: noteData.administrativeDetails.subject,
        strand: noteData.topic.split(" - ")[0], // Assuming format "Strand - Substrand"
        sub_strand: noteData.topic.split(" - ")[1] || "",
        date: noteData.administrativeDetails.date,
        week_term: noteData.administrativeDetails.weekTerm,
        duration: noteData.administrativeDetails.duration,
        content: noteData,
    });

    if (error) {
        console.error("Error saving note:", error);
        throw new Error("Failed to save note");
    }

    revalidatePath("/dashboard");
    revalidatePath("/notes");
}

export async function getNotes() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notes:", error);
        throw new Error("Failed to fetch notes");
    }

    return data;
}

export async function getNote(id: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching note:", error);
        return null;
    }

    return data;
}

export async function deleteNote(id: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
        console.error("Error deleting note:", error);
        throw new Error("Failed to delete note");
    }

    revalidatePath("/dashboard");
    revalidatePath("/notes");
}

export async function updateNote(id: string, noteData: any) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { error } = await supabase
        .from("notes")
        .update({
            school_name: noteData.administrativeDetails.school,
            class_level: noteData.administrativeDetails.class,
            subject: noteData.administrativeDetails.subject,
            strand: noteData.topic.split(" - ")[0],
            sub_strand: noteData.topic.split(" - ")[1] || "",
            date: noteData.administrativeDetails.date,
            week_term: noteData.administrativeDetails.weekTerm,
            duration: noteData.administrativeDetails.duration,
            content: noteData,
        })
        .eq("id", id);

    if (error) {
        console.error("Error updating note:", error);
        throw new Error("Failed to update note");
    }

    revalidatePath("/dashboard");
    revalidatePath("/notes");
    revalidatePath(`/notes/${id}`);
}
