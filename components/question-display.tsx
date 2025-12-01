import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Question {
    id: number;
    type: "objective" | "subjective";
    question: string;
    options?: string[];
    answer?: string;
}

interface QuestionDisplayProps {
    questions: Question[];
    showAnswers: boolean;
}

export function QuestionDisplay({ questions, showAnswers }: QuestionDisplayProps) {
    return (
        <div className="space-y-6">
            {questions.map((q, index) => (
                <Card key={q.id} className="break-inside-avoid">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">
                            {index + 1}. {q.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {q.type === "objective" && q.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                {q.options.map((option, i) => (
                                    <div key={i} className="p-2 rounded border bg-secondary/20">
                                        <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === "subjective" && (
                            <div className="mt-4 h-24 border-b border-dashed border-muted-foreground/50" />
                        )}

                        {showAnswers && q.answer && (
                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-sm font-medium">
                                Answer: {q.answer}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
