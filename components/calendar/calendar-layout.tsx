"use client";

import { useState } from "react";
import { WeeklyView } from "@/components/calendar/weekly-view";
import { TaskSidebar } from "@/components/calendar/task-sidebar";
import { AddItemModal } from "@/components/calendar/add-item-modal";
import { CalendarEvent } from "@/actions/calendar";
import { Task } from "@/actions/tasks";

interface CalendarLayoutProps {
    events: CalendarEvent[];
    tasks: Task[];
}

export function CalendarLayout({ events, tasks }: CalendarLayoutProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            <div className="flex-1 p-4 overflow-hidden">
                <WeeklyView events={events} onAddClick={() => setIsModalOpen(true)} />
            </div>
            <TaskSidebar tasks={tasks} onAddClick={() => setIsModalOpen(true)} />
            <AddItemModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
}
