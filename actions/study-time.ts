'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface StudySession {
    id: string;
    user_id: string;
    session_type: 'pomodoro' | 'countdown' | 'stopwatch';
    start_time: string;
    end_time: string | null;
    total_minutes: number;
    pause_count: number;
    subject_tag: string | null;
    notes: string | null;
    quality_rating: 'productive' | 'needs_improvement' | null;
    settings: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface StudyPause {
    id: string;
    session_id: string;
    pause_start: string;
    pause_end: string | null;
    duration_seconds: number;
    created_at: string;
}

export interface StudyAnalytics {
    totalMinutesToday: number;
    totalMinutesThisWeek: number;
    averageFocusDuration: number;
    pausesToday: number;
    longestStreak: number;
    totalSessions: number;
}

/**
 * Create a new study session
 */
export async function createStudySession(data: {
    session_type: 'pomodoro' | 'countdown' | 'stopwatch';
    start_time: string;
    settings?: Record<string, any>;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: 'Not authenticated' };
    }

    const { data: session, error } = await supabase
        .from('study_sessions')
        .insert({
            user_id: user.id,
            session_type: data.session_type,
            start_time: data.start_time,
            settings: data.settings || {},
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating study session:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/study-time');
    revalidatePath('/dashboard');
    return { data: session, error: null };
}

/**
 * Update an existing study session
 */
export async function updateStudySession(
    id: string,
    updates: {
        end_time?: string;
        total_minutes?: number;
        pause_count?: number;
        subject_tag?: string | null;
        notes?: string | null;
        quality_rating?: 'productive' | 'needs_improvement' | null;
    }
) {
    const supabase = await createClient();

    const { data: session, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating study session:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/study-time');
    revalidatePath('/dashboard');
    return { data: session, error: null };
}

/**
 * Get paginated study sessions for the current user
 */
export async function getStudySessions(page = 1, limit = 10) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: [], count: 0, error: 'Not authenticated' };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: sessions, error, count } = await supabase
        .from('study_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching study sessions:', error);
        return { data: [], count: 0, error: error.message };
    }

    return { data: sessions || [], count: count || 0, error: null };
}

/**
 * Get study analytics for the current user
 */
export async function getStudyAnalytics(): Promise<{ data: StudyAnalytics | null; error: string | null }> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { data: null, error: 'Not authenticated' };
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = tomorrow.toISOString();

    // Get this week's date range (Monday to Sunday)
    const weekStart = new Date(today);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartISO = weekStart.toISOString();

    // Fetch all sessions for calculations
    const { data: allSessions, error: allError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .not('end_time', 'is', null);

    if (allError) {
        console.error('Error fetching all sessions:', allError);
        return { data: null, error: allError.message };
    }

    // Fetch today's sessions
    const { data: todaySessions, error: todayError } = await supabase
        .from('study_sessions')
        .select('total_minutes, pause_count')
        .eq('user_id', user.id)
        .gte('start_time', todayStart)
        .lt('start_time', tomorrowStart)
        .not('end_time', 'is', null);

    if (todayError) {
        console.error('Error fetching today sessions:', todayError);
    }

    // Fetch this week's sessions
    const { data: weekSessions, error: weekError } = await supabase
        .from('study_sessions')
        .select('total_minutes')
        .eq('user_id', user.id)
        .gte('start_time', weekStartISO)
        .not('end_time', 'is', null);

    if (weekError) {
        console.error('Error fetching week sessions:', weekError);
    }

    // Calculate analytics
    const totalMinutesToday = (todaySessions || []).reduce((sum, s) => sum + (s.total_minutes || 0), 0);
    const totalMinutesThisWeek = (weekSessions || []).reduce((sum, s) => sum + (s.total_minutes || 0), 0);
    const pausesToday = (todaySessions || []).reduce((sum, s) => sum + (s.pause_count || 0), 0);

    const completedSessions = allSessions || [];
    const totalSessions = completedSessions.length;
    const averageFocusDuration = totalSessions > 0
        ? Math.round(completedSessions.reduce((sum, s) => sum + (s.total_minutes || 0), 0) / totalSessions)
        : 0;

    // Calculate longest streak (consecutive days with at least one session)
    let longestStreak = 0;
    if (completedSessions.length > 0) {
        const sessionDates = completedSessions
            .map(s => new Date(s.start_time).toDateString())
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        let currentStreak = 1;
        for (let i = 0; i < sessionDates.length - 1; i++) {
            const current = new Date(sessionDates[i]);
            const next = new Date(sessionDates[i + 1]);
            const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, currentStreak);
    }

    const analytics: StudyAnalytics = {
        totalMinutesToday,
        totalMinutesThisWeek,
        averageFocusDuration,
        pausesToday,
        longestStreak,
        totalSessions,
    };

    return { data: analytics, error: null };
}

/**
 * Delete a study session
 */
export async function deleteStudySession(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting study session:', error);
        return { error: error.message };
    }

    revalidatePath('/study-time');
    revalidatePath('/dashboard');
    return { error: null };
}

/**
 * Create a pause record
 */
export async function createPause(session_id: string, pause_start: string) {
    const supabase = await createClient();

    const { data: pause, error } = await supabase
        .from('study_pauses')
        .insert({
            session_id,
            pause_start,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating pause:', error);
        return { data: null, error: error.message };
    }

    return { data: pause, error: null };
}

/**
 * End a pause record
 */
export async function endPause(pause_id: string, pause_end: string, duration_seconds: number) {
    const supabase = await createClient();

    const { data: pause, error } = await supabase
        .from('study_pauses')
        .update({
            pause_end,
            duration_seconds,
        })
        .eq('id', pause_id)
        .select()
        .single();

    if (error) {
        console.error('Error ending pause:', error);
        return { data: null, error: error.message };
    }

    return { data: pause, error: null };
}
