"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    BookOpen,
    Calendar as CalendarIcon,
    Clock,
    Download,
    FileText,
    GraduationCap,
    Layout,
    Loader2,
    School,
    Share2,
} from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LessonPlan } from "@/actions/lesson-plans";
import { createAssessment } from "@/actions/assessments";

interface LessonPlanDetailProps {
    lessonPlan: LessonPlan;
}

interface LessonPlanContent {
    schoolName?: string;
    objectives?: string[];
    rpk?: string;
    materials?: string[];
    stages?: {
        starter?: string;
        development?: string;
        reflection?: string;
    };
    corePoints?: string[];
    evaluation?: string[];
}

export function LessonPlanDetail({ lessonPlan }: LessonPlanDetailProps) {
    const router = useRouter();
    const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);

    const content = lessonPlan.content as LessonPlanContent;

    const handleDownloadPDF = async () => {
        const element = document.getElementById("lesson-plan-content");
        if (!element) return;

        try {
            toast.loading("Generating PDF...");
            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 30;

            pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${lessonPlan.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`);
            toast.dismiss();
            toast.success("PDF downloaded successfully");
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.dismiss();
            toast.error("Failed to generate PDF");
        }
    };

    const handleGenerateAssessment = async () => {
        setIsGeneratingAssessment(true);
        try {
            // 1. Generate assessment content via API using lesson plan context
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: lessonPlan.subject,
                    strand: lessonPlan.topic,
                    subStrand: lessonPlan.sub_topic || "",
                    classLevel: lessonPlan.class_level,
                    questionType: "mixed", // Default to mixed for lesson plan assessments
                    quantity: 10, // Default quantity
                    difficulty: "mixed",
                    difficultyConfig: { easy: 30, normal: 40, hard: 30 },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate assessment");
            }

            const generatedContent = await response.json();

            // 2. Save to Database
            const result = await createAssessment({
                title: `Assessment: ${lessonPlan.title}`,
                class_level: lessonPlan.class_level,
                topic: lessonPlan.topic,
                questions: generatedContent.questions,
            });

            if (!result.success) {
                toast.error(result.error || "Failed to save assessment");
                return;
            }

            toast.success("Assessment generated successfully!");
            router.push(`/assessments/${result.assessment?.id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate assessment");
        } finally {
            setIsGeneratingAssessment(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Actions Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">{lessonPlan.title}</h1>
                    <p className="text-muted-foreground text-sm">
                        Created on {format(new Date(lessonPlan.created_at), "PPP")}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button
                        onClick={handleGenerateAssessment}
                        disabled={isGeneratingAssessment}
                        className="bg-gradient-to-r from-primary to-purple-600"
                    >
                        {isGeneratingAssessment ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <FileText className="mr-2 h-4 w-4" />
                        )}
                        Generate Assessment
                    </Button>
                </div>
            </div>

            {/* Lesson Plan Content */}
            <div id="lesson-plan-content" className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto space-y-8">
                {/* 1. Administrative Details */}
                <section className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b pb-6">
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">School</h3>
                        <p className="font-medium">{lessonPlan.content.schoolName || "N/A"}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Class</h3>
                        <p className="font-medium">{lessonPlan.class_level}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Subject</h3>
                        <p className="font-medium">{lessonPlan.subject}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Date</h3>
                        <p className="font-medium">{lessonPlan.date || "N/A"}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Duration</h3>
                        <p className="font-medium">{lessonPlan.duration || "N/A"}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Week/Term</h3>
                        <p className="font-medium">{lessonPlan.week_term || "N/A"}</p>
                    </div>
                </section>

                {/* 2. Topic / Sub-topic */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                        <Layout className="h-5 w-5" />
                        Topic & Sub-topic
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p><span className="font-semibold">Topic:</span> {lessonPlan.topic}</p>
                        <p><span className="font-semibold">Sub-topic:</span> {lessonPlan.sub_topic}</p>
                    </div>
                </section>

                {/* 3. Objectives */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Learning Objectives
                    </h2>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.objectives?.map((obj: string, i: number) => (
                            <li key={i}>{obj}</li>
                        ))}
                    </ul>
                </section>

                {/* 4. R.P.K. */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Relevant Previous Knowledge (R.P.K.)
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p>{content.rpk}</p>
                    </div>
                </section>

                {/* 5. Materials */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Teaching / Learning Materials
                    </h2>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.materials?.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </section>

                {/* 6. Lesson Stages */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                        <School className="h-5 w-5" />
                        Lesson Stages
                    </h2>
                    <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-md">
                            <h3 className="font-bold text-green-700">Starter / Introduction</h3>
                            <p className="mt-1">{content.stages?.starter}</p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-md">
                            <h3 className="font-bold text-blue-700">Main Development</h3>
                            <p className="mt-1">{content.stages?.development}</p>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded-r-md">
                            <h3 className="font-bold text-orange-700">Reflection / Plenary</h3>
                            <p className="mt-1">{content.stages?.reflection}</p>
                        </div>
                    </div>
                </section>

                {/* 7. Core Points */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3">Core Points</h2>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.corePoints?.map((point: string, i: number) => (
                            <li key={i}>{point}</li>
                        ))}
                    </ul>
                </section>

                {/* 8. Evaluation */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3">Evaluation / Assessment</h2>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.evaluation?.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
