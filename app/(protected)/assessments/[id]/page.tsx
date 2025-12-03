import { getAssessment } from "@/actions/assessments";
import { AssessmentDetail } from "@/components/assessments/assessment-detail";
import { redirect, notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AssessmentPage({ params }: PageProps) {
    const { id } = await params;
    const assessment = await getAssessment(id);

    if (!assessment) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <AssessmentDetail assessment={assessment} />
        </div>
    );
}
