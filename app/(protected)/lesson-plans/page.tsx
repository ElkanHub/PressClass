import { getLessonPlans } from "@/actions/lesson-plans";
import { LessonPlanList } from "@/components/lesson-plan-list";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function LessonPlansPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = 10;

    const { data: lessonPlans, count } = await getLessonPlans(page, limit);
    const totalPages = Math.ceil(count / limit);

    return (
        <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            <Breadcrumb items={[{ label: "Lesson Plans" }]} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lesson Plans</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all your lesson plans.
                    </p>
                </div>

                <Button asChild className="gap-2 bg-gradient-to-r from-primary to-purple-600">
                    <Link href="/generator/lesson-plan">
                        <Plus className="h-4 w-4" />
                        Create New
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                <LessonPlanList lessonPlans={lessonPlans} />
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl="/lesson-plans"
                />
            </div>
        </div>
    );
}
