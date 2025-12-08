"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CalendarEvent = {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    type: 'lesson' | 'task' | 'event' | 'assessment';
    start_time: string;
    end_time: string;
    all_day: boolean;
    related_id?: string;
    related_type?: 'lesson_plan' | 'note' | 'assessment';
    metadata?: any;
    created_at: string;
    updated_at: string;
};

export async function createCalendarEvent(data: Partial<CalendarEvent>) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { data: event, error } = await supabase
        .from("calendar_events")
        .insert({
            ...data,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating calendar event:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true, event };
}

export async function getCalendarEvents(start: string, end: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { data: [] };
    }

    const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .gte("start_time", start)
        .lte("end_time", end)
        .order("start_time", { ascending: true });

    if (error) {
        console.error("Error fetching calendar events:", error);
        return { data: [] };
    }

    return { data: data as CalendarEvent[] };
}

export async function updateCalendarEvent(id: string, data: Partial<CalendarEvent>) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("calendar_events")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error updating calendar event:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteCalendarEvent(id: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting calendar event:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/calendar");
    revalidatePath("/dashboard");
    return { success: true };
}
