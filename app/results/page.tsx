"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Printer, ArrowLeft, Eye, EyeOff } from "lucide-react";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { QuestionDisplay } from "@/components/question-display";

interface AssessmentData {
    title: string;
    classLevel: string;
    topic: string;
    questions: any[];
}

export default function ResultsPage() {
    const router = useRouter();
    const [data, setData] = useState<AssessmentData | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem("generatedAssessment");
        if (storedData) {
            setData(JSON.parse(storedData));
        } else {
            router.push("/generator");
        }
    }, [router]);

    if (!data) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        // Title
        doc.setFontSize(18);
        doc.text(data.title || "Classroom Assessment", margin, y);
        y += 10;

        // Details
        doc.setFontSize(12);
        doc.text(`Class: ${data.classLevel}`, margin, y);
        y += 7;
        doc.text(`Topic: ${data.topic}`, margin, y);
        y += 15;

        // Questions
        doc.setFontSize(11);
        data.questions.forEach((q, index) => {
            // Check for page break
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            const questionText = `${index + 1}. ${q.question}`;
            const splitQuestion = doc.splitTextToSize(questionText, 170);
            doc.text(splitQuestion, margin, y);
            y += splitQuestion.length * 7;

            if (q.type === "objective" && q.options) {
                q.options.forEach((opt: string, i: number) => {
                    if (y > 280) {
                        doc.addPage();
                        y = 20;
                    }
                    const optionText = `${String.fromCharCode(65 + i)}. ${opt}`;
                    doc.text(optionText, margin + 10, y);
                    y += 6;
                });
                y += 5;
            } else {
                y += 15; // Space for written answer
            }
        });

        // Answers Page
        if (showAnswers) {
            doc.addPage();
            y = 20;
            doc.setFontSize(16);
            doc.text("Answer Key", margin, y);
            y += 15;
            doc.setFontSize(11);

            data.questions.forEach((q, index) => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(`${index + 1}. ${q.answer}`, margin, y);
                y += 7;
            });
        }

        doc.save("assessment.pdf");
    };

    return (
        <div className="container mx-auto py-10 px-4 print:p-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
                <div>
                    <Button variant="ghost" onClick={() => router.push("/generator")} className="mb-2 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Generator
                    </Button>
                    <h1 className="text-3xl font-bold">{data.title || "Generated Assessment"}</h1>
                    <p className="text-muted-foreground">
                        {data.classLevel} • {data.topic}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
                        {showAnswers ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showAnswers ? "Hide Answers" : "Show Answers"}
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Print Header */}
            <div className="hidden print:block mb-8 text-center">
                <h1 className="text-2xl font-bold">{data.title || "Classroom Assessment"}</h1>
                <p className="text-sm text-gray-600">
                    {data.classLevel} • {data.topic}
                </p>
            </div>

            <QuestionDisplay questions={data.questions} showAnswers={showAnswers} />
        </div>
    );
}
