"use client";

import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, setHours, setMinutes } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarEvent, updateCalendarEvent } from "@/actions/calendar";
import { useRouter, useSearchParams } from "next/navigation";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { DraggableEvent } from "./draggable-event";
import { toast } from "sonner";

interface WeeklyViewProps {
    events: CalendarEvent[];
    onAddClick: () => void;
}

function DroppableDay({ day, children }: { day: Date; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({
        id: day.toISOString(),
        data: { day },
    });

    return (
        <div ref={setNodeRef} className="flex-1 border-r min-w-[120px] relative">
            {children}
        </div>
    );
}

export function WeeklyView({ events, onAddClick }: WeeklyViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const dateParam = searchParams.get("date");
    const currentDate = dateParam ? parseISO(dateParam) : new Date();

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

    const updateDate = (newDate: Date) => {
        const params = new URLSearchParams(searchParams);
        params.set("date", newDate.toISOString());
        router.push(`?${params.toString()}`);
    };

    const nextWeek = () => updateDate(addDays(currentDate, 7));
    const prevWeek = () => updateDate(addDays(currentDate, -7));
    const goToToday = () => updateDate(new Date());

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (!over) return;

        const droppedEvent = active.data.current as CalendarEvent;
        const targetDayIso = over.id as string;
        const targetDay = parseISO(targetDayIso);

        // Calculate new time
        // delta.y is pixels moved. 80px = 1 hour.
        // We need to calculate the new start time based on the original start time + delta
        // OR based on the drop position relative to the container.
        // For simplicity, let's assume we snap to 15 mins (20px).

        const originalStart = new Date(droppedEvent.start_time);
        const originalEnd = new Date(droppedEvent.end_time);
        const durationMs = originalEnd.getTime() - originalStart.getTime();

        // Calculate time shift in minutes
        const minutesShift = Math.round(delta.y / 20) * 15;

        // New start time
        let newStart = new Date(targetDay);
        newStart.setHours(originalStart.getHours());
        newStart.setMinutes(originalStart.getMinutes() + minutesShift);

        // If we moved to a different day, the date part is already updated by targetDay, 
        // but we need to keep the original time-of-day + shift.
        // Actually, `targetDay` is just the day (00:00).
        // So we take `targetDay` and add the original hours/minutes + shift.

        // Wait, `targetDay` is the day column we dropped on.
        // `delta.y` is the movement relative to the START position of the drag.
        // So if I drag from 9am to 10am, delta.y is +80.
        // So newStart = originalStart + delta.y (converted to time) + (targetDay - originalDay)

        const dayDiff = targetDay.getTime() - startOfWeek(originalStart, { weekStartsOn: 1 }).getTime(); // This is wrong if weeks differ
        // Simpler:
        // 1. Get the time of day of the original start
        // 2. Add the time shift from delta.y
        // 3. Set this new time on the targetDay

        const originalHours = originalStart.getHours();
        const originalMinutes = originalStart.getMinutes();
        const totalMinutes = originalHours * 60 + originalMinutes + minutesShift;

        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;

        newStart.setHours(newHours, newMinutes, 0, 0);
        const newEnd = new Date(newStart.getTime() + durationMs);

        // Optimistic update (optional, but for now we just wait for server)
        const result = await updateCalendarEvent(droppedEvent.id, {
            start_time: newStart.toISOString(),
            end_time: newEnd.toISOString(),
        });

        if (result.success) {
            toast.success("Event rescheduled");
        } else {
            toast.error("Failed to reschedule event");
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-full bg-background border rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                        </h2>
                        <div className="flex items-center gap-1 ml-4">
                            <Button variant="outline" size="icon" onClick={prevWeek}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={goToToday}>
                                Today
                            </Button>
                            <Button variant="outline" size="icon" onClick={nextWeek}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Button onClick={onAddClick}>Add Item</Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex flex-1 overflow-auto">
                    {/* Time Labels */}
                    <div className="w-16 flex-shrink-0 border-r bg-muted/50">
                        <div className="h-10 border-b"></div> {/* Spacer for day headers */}
                        {hours.map((hour) => (
                            <div key={hour} className="h-20 border-b text-xs text-muted-foreground p-2 text-right">
                                {hour}:00
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="flex flex-1 min-w-[800px]">
                        {days.map((day) => (
                            <div key={day.toString()} className="flex-1 border-r min-w-[120px]">
                                {/* Day Header */}
                                <div className={cn(
                                    "h-10 border-b p-2 text-center text-sm font-medium sticky top-0 bg-background z-10",
                                    isSameDay(day, new Date()) && "bg-primary/10 text-primary"
                                )}>
                                    <div>{format(day, "EEE")}</div>
                                    <div className="text-xs text-muted-foreground">{format(day, "d")}</div>
                                </div>

                                {/* Time Slots */}
                                <DroppableDay day={day}>
                                    <div className="relative h-full">
                                        {hours.map((hour) => (
                                            <div key={hour} className="h-20 border-b border-dashed"></div>
                                        ))}

                                        {/* Events */}
                                        {events
                                            .filter((event) => isSameDay(new Date(event.start_time), day))
                                            .map((event) => {
                                                const start = new Date(event.start_time);
                                                const end = new Date(event.end_time);
                                                const startHour = start.getHours();
                                                const startMin = start.getMinutes();
                                                const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                                                // Simple positioning logic (relative to 7 AM start)
                                                const top = (startHour - 7) * 80 + (startMin / 60) * 80;
                                                const height = durationHours * 80;

                                                return (
                                                    <DraggableEvent
                                                        key={event.id}
                                                        event={event}
                                                        className={cn(
                                                            "absolute left-1 right-1 rounded px-2 py-1 text-xs overflow-hidden border",
                                                            event.type === 'lesson' && "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200",
                                                            event.type === 'task' && "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200",
                                                            event.type === 'assessment' && "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200",
                                                            event.type === 'event' && "bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300",
                                                        )}
                                                        style={{ top: `${top}px`, height: `${height}px` }}
                                                    >
                                                        <div className="font-semibold truncate">{event.title}</div>
                                                        <div className="truncate opacity-80">
                                                            {format(start, "h:mm a")} - {format(end, "h:mm a")}
                                                        </div>
                                                    </DraggableEvent>
                                                );
                                            })}
                                    </div>
                                </DroppableDay>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DndContext>
    );
}
