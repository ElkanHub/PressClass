"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Trash2, BookOpen, Calendar, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { deleteLessonPlan, LessonPlan } from "@/actions/lesson-plans";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LessonPlanListProps {
    lessonPlans: LessonPlan[];
}

export function LessonPlanList({ lessonPlans }: LessonPlanListProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this lesson plan?")) {
            setIsDeleting(id);
            try {
                await deleteLessonPlan(id);
                router.refresh();
            } catch (error) {
                console.error("Failed to delete lesson plan:", error);
                alert("Failed to delete lesson plan");
            } finally {
                setIsDeleting(null);
            }
        }
    };

    if (lessonPlans.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                <div className="bg-purple-500/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">No lesson plans yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Generate your first lesson plan to get started.
                </p>
                <Button asChild>
                    <Link href="/generator/lesson-plan">Create Lesson Plan</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessonPlans.map((plan) => (
                <Card key={plan.id} className="group hover:shadow-md transition-all duration-200 border-border/50">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold line-clamp-1">
                                    <Link href={`/lesson-plans/${plan.id}`} className="hover:underline">
                                        {plan.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(plan.created_at), { addSuffix: true })}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/lesson-plans/${plan.id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDelete(plan.id)}
                                        disabled={isDeleting === plan.id}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                            {plan.class_level && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/5 text-purple-600 text-xs font-medium">
                                    <GraduationCap className="h-3 w-3" />
                                    {plan.class_level}
                                </div>
                            )}
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                                <BookOpen className="h-3 w-3" />
                                {plan.subject}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary" asChild>
                            <Link href={`/lesson-plans/${plan.id}`}>
                                View Lesson Plan
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
