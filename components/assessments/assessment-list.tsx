"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Trash2, FileText, Calendar, GraduationCap } from "lucide-react";
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
import { deleteAssessment, Assessment } from "@/actions/assessments";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AssessmentListProps {
    assessments: Assessment[];
}

export function AssessmentList({ assessments }: AssessmentListProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this assessment?")) {
            setIsDeleting(id);
            try {
                await deleteAssessment(id);
                router.refresh();
            } catch (error) {
                console.error("Failed to delete assessment:", error);
                alert("Failed to delete assessment");
            } finally {
                setIsDeleting(null);
            }
        }
    };

    if (assessments.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No assessments yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Generate your first assessment to get started.
                </p>
                <Button asChild>
                    <Link href="/generator">Create Assessment</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assessments.map((assessment) => (
                <Card key={assessment.id} className="group hover:shadow-md transition-all duration-200 border-border/50">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold line-clamp-1">
                                    <Link href={`/assessments/${assessment.id}`} className="hover:underline">
                                        {assessment.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })}
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
                                        <Link href={`/assessments/${assessment.id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDelete(assessment.id)}
                                        disabled={isDeleting === assessment.id}
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
                            {assessment.class_level && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium">
                                    <GraduationCap className="h-3 w-3" />
                                    {assessment.class_level}
                                </div>
                            )}
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                                <FileText className="h-3 w-3" />
                                {assessment.questions?.length || 0} Questions
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary" asChild>
                            <Link href={`/assessments/${assessment.id}`}>
                                View Assessment
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
