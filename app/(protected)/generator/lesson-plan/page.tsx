import { LessonPlanForm } from "@/components/lesson-plan-form";

import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function LessonPlanGeneratorPage() {
    return (
        <div className="container mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
                <Breadcrumb
                    items={[
                        { label: "Generator", href: "/generator" },
                        { label: "Lesson Plan" },
                    ]}
                />
            </div>
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Create Lesson Plan
                </h1>
                <p className="text-muted-foreground">
                    Provide the details below to generate a structured lesson plan.
                </p>
            </div>
            <LessonPlanForm />
        </div>
    );
}
