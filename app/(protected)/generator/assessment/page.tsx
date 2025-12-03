import { AssessmentForm } from "@/components/assessment-form";

export default function AssessmentGeneratorPage() {
    return (
        <div className="container mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Create New Assessment
                </h1>
                <p className="text-muted-foreground">
                    Fill in the details below to generate high-quality questions.
                </p>
            </div>
            <AssessmentForm />
        </div>
    );
}
