import { getCalendarEvents } from "@/actions/calendar";
import { getTasks } from "@/actions/tasks";
import { CalendarLayout } from "@/components/calendar/calendar-layout";
import { startOfWeek, endOfWeek, parseISO } from "date-fns";

interface CalendarPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
    const params = await searchParams;
    const dateParam = typeof params.date === 'string' ? params.date : undefined;
    const currentDate = dateParam ? parseISO(dateParam) : new Date();

    const start = startOfWeek(currentDate, { weekStartsOn: 1 }).toISOString();
    const end = endOfWeek(currentDate, { weekStartsOn: 1 }).toISOString();

    const [eventsResult, tasksResult] = await Promise.all([
        getCalendarEvents(start, end),
        getTasks(),
    ]);

    const events = eventsResult.data || [];
    const tasks = tasksResult.data || [];

    return (
        <CalendarLayout events={events} tasks={tasks} />
    );
}
