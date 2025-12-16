"use client";

import { CalendarEvent } from "@/actions/calendar";
import { Task } from "@/actions/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Calendar as CalendarIcon, Activity } from "lucide-react";

interface WeeklyAnalyticsProps {
    events: CalendarEvent[];
    tasks: Task[];
}

export function WeeklyAnalytics({ events, tasks }: WeeklyAnalyticsProps) {
    const totalEvents = events.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Simple stress/workload heuristic
    // Assume 1 event = 1 point, 1 task = 0.5 points
    const workloadScore = totalEvents + (totalTasks * 0.5);
    let workloadLabel = "Low";
    if (workloadScore > 10) workloadLabel = "Moderate";
    if (workloadScore > 20) workloadLabel = "High";
    if (workloadScore > 30) workloadLabel = "Overload";

    // Workload percentage (capped at 100 for visual)
    const workloadPercentage = Math.min((workloadScore / 30) * 100, 100);

    return (
        <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Weekly Overview</h3>

            <div className="grid grid-cols-2 gap-2">
                <Card className="shadow-none border bg-muted/20">
                    <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                        <CalendarIcon className="h-4 w-4 text-primary mb-1" />
                        <span className="text-2xl font-bold">{totalEvents}</span>
                        <span className="text-[10px] text-muted-foreground">Events</span>
                    </CardContent>
                </Card>
                <Card className="shadow-none border bg-muted/20">
                    <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mb-1" />
                        <span className="text-2xl font-bold">{completedTasks}/{totalTasks}</span>
                        <span className="text-[10px] text-muted-foreground">Tasks Done</span>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                        <Activity className="h-3 w-3" /> Workload: {workloadLabel}
                    </span>
                    <span className="font-medium">{Math.round(workloadPercentage)}%</span>
                </div>
                <Progress value={workloadPercentage} className="h-1.5" />
            </div>
        </div>
    );
}
