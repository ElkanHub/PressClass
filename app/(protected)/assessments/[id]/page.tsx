// /assessments/[id]/page.tsx
import { getAssessment } from "@/actions/assessments";
import { AssessmentDetail } from "@/components/assessments/assessment-detail";
import { notFound } from "next/navigation";

// Revalidate removed to prevent caching user data
// export const revalidate = 60; // <<— Option A: revalidate this page every 60 seconds

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AssessmentPage({ params }: PageProps) {
    const { id } = await params;

    // This will be cached + revalidated automatically by Next.js
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
