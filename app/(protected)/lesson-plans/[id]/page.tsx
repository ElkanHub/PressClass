import { getLessonPlan } from "@/actions/lesson-plans";
import { LessonPlanDetail } from "@/components/lesson-plan-detail";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function LessonPlanPage({ params }: PageProps) {
    const { id } = await params;
    const lessonPlan = await getLessonPlan(id);

    if (!lessonPlan) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <LessonPlanDetail lessonPlan={lessonPlan} />
        </div>
    );
}
