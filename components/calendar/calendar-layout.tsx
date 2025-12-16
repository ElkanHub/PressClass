"use client";

import { useState } from "react";
import { WeeklyView } from "@/components/calendar/weekly-view";
import { TaskSidebar } from "@/components/calendar/task-sidebar";
import { AddItemModal } from "@/components/calendar/add-item-modal";
import { CalendarEvent } from "@/actions/calendar";
import { Task } from "@/actions/tasks";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface CalendarLayoutProps {
    events: CalendarEvent[];
    tasks: Task[];
}

export function CalendarLayout({ events, tasks }: CalendarLayoutProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative">
            <div className="flex-1 p-4 overflow-hidden flex flex-col">
                <div className="md:hidden mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Menu className="mr-2 h-4 w-4" />
                                Tasks & Events
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-[320px] sm:w-[380px]">
                            <TaskSidebar tasks={tasks} events={events} onAddClick={() => setIsModalOpen(true)} />
                        </SheetContent>
                    </Sheet>
                </div>
                <WeeklyView events={events} onAddClick={() => setIsModalOpen(true)} />
            </div>
            <div className="hidden md:block border-l">
                <TaskSidebar tasks={tasks} events={events} onAddClick={() => setIsModalOpen(true)} />
            </div>
            <AddItemModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
}
