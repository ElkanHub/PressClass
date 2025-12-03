// app/dashboard/page.tsx
import { Plus } from "lucide-react";
import { getAssessments } from "@/actions/assessments";
import { AssessmentList } from "@/components/assessments/assessment-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function DashboardPage() {
    const assessments = await getAssessments();

    return (
        <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your assessments and classes.
                    </p>
                </div>

                <Button asChild className="gap-2">
                    <Link href="/generator">
                        <Plus className="h-4 w-4" />
                        New Assessment
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                        Total Assessments
                    </h3>
                    <div className="text-2xl font-bold mt-2">{assessments.length}</div>
                </div>
            </div>

            {/* Assessments */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Recent Assessments</h2>
                <AssessmentList assessments={assessments} />
            </div>
        </div>
    );
}
