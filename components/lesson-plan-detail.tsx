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
    Edit2,
    Trash2,
    Save,
    X,
    MoreVertical,
    Plus,
    Minus
} from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LessonPlan, updateLessonPlan, deleteLessonPlan } from "@/actions/lesson-plans";
import { createAssessment } from "@/actions/assessments";
import { AddToCalendarModal } from "@/components/calendar/add-to-calendar-modal";

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
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState(lessonPlan);
    const [content, setContent] = useState(lessonPlan.content as LessonPlanContent);

    // Helper function to format text with proper line breaks and paragraphs
    const formatText = (text: string | undefined) => {
        if (!text) return null;

        // Split by double line breaks for paragraphs, or single line breaks
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

        return paragraphs.map((para, idx) => {
            // Split each paragraph by single line breaks
            const lines = para.split(/\n/).filter(l => l.trim());
            return (
                <p key={idx} className="mb-3 last:mb-0">
                    {lines.map((line, lineIdx) => (
                        <span key={lineIdx}>
                            {line}
                            {lineIdx < lines.length - 1 && <br />}
                        </span>
                    ))}
                </p>
            );
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateLessonPlan(data.id, {
                title: data.title,
                subject: data.subject,
                class_level: data.class_level,
                topic: data.topic,
                sub_topic: data.sub_topic,
                duration: data.duration,
                week_term: data.week_term,
                date: data.date,
                content: content,
            });
            setIsEditing(false);
            router.refresh();
            toast.success("Lesson plan saved successfully");
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this lesson plan? This action cannot be undone.")) {
            try {
                await deleteLessonPlan(data.id);
                toast.success("Lesson plan deleted");
                router.push("/lesson-plans");
            } catch (error) {
                console.error("Failed to delete:", error);
                toast.error("Failed to delete lesson plan");
            }
        }
    };

    const handleContentChange = (field: keyof LessonPlanContent, value: any) => {
        setContent({ ...content, [field]: value });
    };

    const handleStageChange = (stage: keyof NonNullable<LessonPlanContent['stages']>, value: string) => {
        setContent({
            ...content,
            stages: { ...content.stages, [stage]: value }
        });
    };

    const handleListChange = (field: 'objectives' | 'materials' | 'corePoints' | 'evaluation', index: number, value: string) => {
        const newList = [...(content[field] || [])];
        newList[index] = value;
        setContent({ ...content, [field]: newList });
    };

    const addListItem = (field: 'objectives' | 'materials' | 'corePoints' | 'evaluation') => {
        setContent({ ...content, [field]: [...(content[field] || []), ""] });
    };

    const removeListItem = (field: 'objectives' | 'materials' | 'corePoints' | 'evaluation', index: number) => {
        const newList = [...(content[field] || [])];
        newList.splice(index, 1);
        setContent({ ...content, [field]: newList });
    };

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
                <div className="w-full md:w-auto flex-1">
                    {isEditing ? (
                        <Input
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            className="font-bold text-xl mb-2"
                        />
                    ) : (
                        <h1 className="text-2xl font-bold">{data.title}</h1>
                    )}
                    <p className="text-muted-foreground text-sm">
                        Created on {format(new Date(data.created_at), "PPP")}
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => { setIsEditing(false); setData(lessonPlan); setContent(lessonPlan.content as LessonPlanContent); }}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setIsCalendarModalOpen(true)}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Add to Calendar
                            </Button>
                            <Button variant="outline" onClick={handleDownloadPDF}>
                                <Download className="mr-2 h-4 w-4" />
                                PDF
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Lesson Plan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            {/* Lesson Plan Content */}
            <div id="lesson-plan-content" className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto space-y-8">
                {/* 1. Administrative Details */}
                <section className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b pb-6">
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">School</h3>
                        {isEditing ? (
                            <Input value={content.schoolName || ""} onChange={(e) => handleContentChange('schoolName', e.target.value)} className="h-8" />
                        ) : (
                            <p className="font-medium">{content.schoolName || "N/A"}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Class</h3>
                        {isEditing ? (
                            <Input value={data.class_level} onChange={(e) => setData({ ...data, class_level: e.target.value })} className="h-8" />
                        ) : (
                            <p className="font-medium">{data.class_level}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Subject</h3>
                        {isEditing ? (
                            <Input value={data.subject} onChange={(e) => setData({ ...data, subject: e.target.value })} className="h-8" />
                        ) : (
                            <p className="font-medium">{data.subject}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Date</h3>
                        {isEditing ? (
                            <Input value={data.date || ""} onChange={(e) => setData({ ...data, date: e.target.value })} className="h-8" />
                        ) : (
                            <p className="font-medium">{data.date || "N/A"}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Duration</h3>
                        {isEditing ? (
                            <Input value={data.duration || ""} onChange={(e) => setData({ ...data, duration: e.target.value })} className="h-8" />
                        ) : (
                            <p className="font-medium">{data.duration || "N/A"}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Week/Term</h3>
                        {isEditing ? (
                            <Input value={data.week_term || ""} onChange={(e) => setData({ ...data, week_term: e.target.value })} className="h-8" />
                        ) : (
                            <p className="font-medium">{data.week_term || "N/A"}</p>
                        )}
                    </div>
                </section>

                {/* 2. Topic / Sub-topic */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                        <Layout className="h-5 w-5" />
                        Topic & Sub-topic
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md space-y-2">
                        {isEditing ? (
                            <>
                                <div>
                                    <span className="font-semibold">Topic:</span>
                                    <Input value={data.topic || ""} onChange={(e) => setData({ ...data, topic: e.target.value })} className="mt-1" />
                                </div>
                                <div>
                                    <span className="font-semibold">Sub-topic:</span>
                                    <Input value={data.sub_topic || ""} onChange={(e) => setData({ ...data, sub_topic: e.target.value })} className="mt-1" />
                                </div>
                            </>
                        ) : (
                            <>
                                <p><span className="font-semibold">Topic:</span> {data.topic}</p>
                                <p><span className="font-semibold">Sub-topic:</span> {data.sub_topic}</p>
                            </>
                        )}
                    </div>
                </section>

                {/* 3. Objectives */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Learning Objectives
                        </h2>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={() => addListItem('objectives')}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.objectives?.map((obj: string, i: number) => (
                            <li key={i} className="flex gap-2 items-center">
                                {isEditing ? (
                                    <>
                                        <Input value={obj} onChange={(e) => handleListChange('objectives', i, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeListItem('objectives', i)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </>
                                ) : (
                                    <span>{obj}</span>
                                )}
                            </li>
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
                        {isEditing ? (
                            <Textarea value={content.rpk || ""} onChange={(e) => handleContentChange('rpk', e.target.value)} rows={4} />
                        ) : (
                            <div className="text-gray-700 leading-relaxed">
                                {formatText(content.rpk)}
                            </div>
                        )}
                    </div>
                </section>

                {/* 5. Materials */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Teaching / Learning Materials
                        </h2>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={() => addListItem('materials')}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.materials?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-2 items-center">
                                {isEditing ? (
                                    <>
                                        <Input value={item} onChange={(e) => handleListChange('materials', i, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeListItem('materials', i)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </>
                                ) : (
                                    <span>{item}</span>
                                )}
                            </li>
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
                            {isEditing ? (
                                <Textarea value={content.stages?.starter || ""} onChange={(e) => handleStageChange('starter', e.target.value)} className="mt-1 bg-white" rows={4} />
                            ) : (
                                <div className="mt-2 text-gray-700 leading-relaxed">
                                    {formatText(content.stages?.starter)}
                                </div>
                            )}
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-md">
                            <h3 className="font-bold text-blue-700">Main Development</h3>
                            {isEditing ? (
                                <Textarea value={content.stages?.development || ""} onChange={(e) => handleStageChange('development', e.target.value)} className="mt-1 bg-white min-h-[150px]" rows={8} />
                            ) : (
                                <div className="mt-2 text-gray-700 leading-relaxed">
                                    {formatText(content.stages?.development)}
                                </div>
                            )}
                        </div>
                        <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded-r-md">
                            <h3 className="font-bold text-orange-700">Reflection / Plenary</h3>
                            {isEditing ? (
                                <Textarea value={content.stages?.reflection || ""} onChange={(e) => handleStageChange('reflection', e.target.value)} className="mt-1 bg-white" rows={4} />
                            ) : (
                                <div className="mt-2 text-gray-700 leading-relaxed">
                                    {formatText(content.stages?.reflection)}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 7. Core Points */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-primary">Core Points</h2>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={() => addListItem('corePoints')}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.corePoints?.map((point: string, i: number) => (
                            <li key={i} className="flex gap-2 items-center">
                                {isEditing ? (
                                    <>
                                        <Input value={point} onChange={(e) => handleListChange('corePoints', i, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeListItem('corePoints', i)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </>
                                ) : (
                                    <span>{point}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* 8. Evaluation */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-primary">Evaluation / Assessment</h2>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={() => addListItem('evaluation')}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.evaluation?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-2 items-center">
                                {isEditing ? (
                                    <>
                                        <Input value={item} onChange={(e) => handleListChange('evaluation', i, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeListItem('evaluation', i)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </>
                                ) : (
                                    <span>{item}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
            <AddToCalendarModal
                open={isCalendarModalOpen}
                onOpenChange={setIsCalendarModalOpen}
                defaultTitle={`Lesson: ${lessonPlan.title}`}
                description={`Teach ${lessonPlan.subject} (${lessonPlan.class_level}) - ${lessonPlan.topic}.`}
                relatedId={lessonPlan.id}
                relatedType="lesson_plan"
            />
        </div>
    );
}
