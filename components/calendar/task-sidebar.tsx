"use client";

import { useState } from "react";
import { Task, updateTask } from "@/actions/tasks";
import { CheckCircle2, Circle, Clock, MoreVertical, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CalendarEvent } from "@/actions/calendar";
import { WeeklyAnalytics } from "./weekly-analytics";
import { EditTaskModal } from "./edit-task-modal";

interface TaskSidebarProps {
    tasks: Task[];
    events: CalendarEvent[];
    onAddClick: () => void;
}

export function TaskSidebar({ tasks, events, onAddClick }: TaskSidebarProps) {
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="w-80 border-l bg-background flex flex-col h-full">
            <div className="p-4 border-b">
                <WeeklyAnalytics events={events} tasks={tasks} />
                <div className="flex items-center justify-between mt-4">
                    <h3 className="font-semibold">Tasks</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onAddClick}>
                        +
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
                {/* Today's Focus */}
                <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Today</h4>
                    <div className="space-y-2">
                        {tasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                onEdit={() => {
                                    setEditingTask(task);
                                    setIsEditModalOpen(true);
                                }}
                            />
                        ))}
                        {tasks.filter(t => t.status !== 'completed').length === 0 && (
                            <div className="text-sm text-muted-foreground italic">No tasks for today</div>
                        )}
                    </div>
                </div>

                {/* Upcoming */}
                <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Upcoming</h4>
                    <div className="space-y-2">
                        {tasks.filter(t => t.status !== 'completed').slice(3).map(task => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                onEdit={() => {
                                    setEditingTask(task);
                                    setIsEditModalOpen(true);
                                }}
                            />
                        ))}
                        {tasks.filter(t => t.status !== 'completed').length <= 3 && (
                            <div className="text-sm text-muted-foreground italic">No upcoming tasks</div>
                        )}
                    </div>
                </div>

                {/* Completed */}
                <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Completed</h4>
                    <div className="space-y-2 opacity-60">
                        {tasks.filter(t => t.status === 'completed').map(task => (
                            <TaskItem 
                                key={task.id} 
                                task={task} 
                                onEdit={() => {
                                    setEditingTask(task);
                                    setIsEditModalOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <EditTaskModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                task={editingTask}
            />
        </div>
    );
}

function TaskItem({ task, onEdit }: { task: Task; onEdit: () => void }) {
    const isCompleted = task.status === 'completed';

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening modal when clicking checkout
        const newStatus = isCompleted ? 'not_started' : 'completed';
        try {
            await updateTask(task.id, { status: newStatus });
            toast.success(isCompleted ? "Task marked as incomplete" : "Task completed");
        } catch (error) {
            toast.error("Failed to update task");
        }
    };

    return (
        <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 group border border-transparent hover:border-border transition-colors">
            <button
                onClick={handleToggle}
                className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                role="checkbox"
                aria-checked={isCompleted}
            >
                {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                    <Circle className="h-4 w-4" />
                )}
            </button>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
                <div className={cn("text-sm font-medium truncate", isCompleted && "line-through text-muted-foreground")}>
                    {task.title}
                </div>
                {task.description && (
                    <div className="text-xs text-muted-foreground truncate">{task.description}</div>
                )}
                <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full border",
                        task.priority === 'high' && "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
                        task.priority === 'medium' && "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
                        task.priority === 'low' && "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
                    )}>
                        {task.priority}
                    </span>
                    {task.due_date && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                            <Pencil className="mr-2 h-3 w-3" /> Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
