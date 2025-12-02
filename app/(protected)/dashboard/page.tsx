import { InfoIcon, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAssessments } from "@/actions/assessments";
import { AssessmentList } from "@/components/assessments/assessment-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Auth check is handled by the layout
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) return redirect("/auth/login");

    const assessments = await getAssessments();

    return (
        <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
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

            {/* Stats Overview (Optional - can be expanded later) */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Assessments</h3>
                    </div>
                    <div className="text-2xl font-bold">{assessments.length}</div>
                </div>
                {/* Add more stats here if needed */}
            </div>

            {/* Recent Assessments */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Assessments</h2>
                </div>
                <AssessmentList assessments={assessments} />
            </div>
        </div>
    );
}
