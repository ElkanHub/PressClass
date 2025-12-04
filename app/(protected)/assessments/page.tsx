import { getAssessments } from "@/actions/assessments";
import { AssessmentList } from "@/components/assessments/assessment-list";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AssessmentsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = 10;

    const { data: assessments, count } = await getAssessments(page, limit);
    const totalPages = Math.ceil(count / limit);

    return (
        <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all your assessments.
                    </p>
                </div>

                <Button asChild className="gap-2 bg-gradient-to-r from-primary to-purple-600">
                    <Link href="/generator/assessment">
                        <Plus className="h-4 w-4" />
                        Create New
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                <AssessmentList assessments={assessments} />
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl="/assessments"
                />
            </div>
        </div>
    );
}
