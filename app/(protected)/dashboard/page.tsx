// app/dashboard/page.tsx
import { Plus } from "lucide-react";
import { getAssessments } from "@/actions/assessments";
import { getLessonPlans } from "@/actions/lesson-plans";
import { AssessmentList } from "@/components/assessments/assessment-list";
import { LessonPlanList } from "@/components/lesson-plan-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Revalidate removed to prevent caching user data
// export const revalidate = 60;

export default async function DashboardPage() {
    const [{ data: assessments, count: assessmentsCount }, { data: lessonPlans, count: lessonPlansCount }] = await Promise.all([
        getAssessments(1, 6),
        getLessonPlans(1, 6),
    ]);

    return (
        <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your assessments and lesson plans.
                    </p>
                </div>

                <Button asChild className="gap-2 bg-gradient-to-r from-primary to-purple-600">
                    <Link href="/generator">
                        <Plus className="h-4 w-4" />
                        Create New
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                        Total Assessments
                    </h3>
                    <div className="text-2xl font-bold mt-2">{assessmentsCount}</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                        Total Lesson Plans
                    </h3>
                    <div className="text-2xl font-bold mt-2">{lessonPlansCount}</div>
                </div>
            </div>

            {/* Assessments */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Assessments</h2>
                    <div className="flex items-center gap-4">
                        <Button variant="link" asChild>
                            <Link href="/assessments">View All</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/generator/assessment">Create New</Link>
                        </Button>
                    </div>
                </div>
                <AssessmentList assessments={assessments} />
            </div>

            {/* Lesson Plans */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Lesson Plans</h2>
                    <div className="flex items-center gap-4">
                        <Button variant="link" asChild>
                            <Link href="/lesson-plans">View All</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/generator/lesson-plan">Create New</Link>
                        </Button>
                    </div>
                </div>
                <LessonPlanList lessonPlans={lessonPlans} />
            </div>
        </div>
    );
}
