"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Download,
    Printer,
    Eye,
    EyeOff,
    Edit2,
    Trash2,
    Save,
    X,
    ArrowUp,
    ArrowDown,
    MoreVertical,
    CalendarPlus
} from "lucide-react";
import jsPDF from "jspdf";
import { Assessment, updateAssessment, deleteAssessment } from "@/actions/assessments";
import { AddToCalendarModal } from "@/components/calendar/add-to-calendar-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AssessmentDetailProps {
    assessment: Assessment;
}

export function AssessmentDetail({ assessment }: AssessmentDetailProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);
    const [data, setData] = useState(assessment);
    const [editedTitle, setEditedTitle] = useState(assessment.title);
    const [isSaving, setIsSaving] = useState(false);

    // Sync local state if props change (though typically this is a one-time load)
    // useEffect(() => setData(assessment), [assessment]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateAssessment(data.id, {
                title: editedTitle,
                questions: data.questions,
            });
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
            try {
                await deleteAssessment(data.id);
            } catch (error) {
                console.error("Failed to delete:", error);
                alert("Failed to delete assessment.");
            }
        }
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        const newQuestions = [...data.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setData({ ...data, questions: newQuestions });
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...data.questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
        setData({ ...data, questions: newQuestions });
    };

    const moveQuestion = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === data.questions.length - 1)
        ) return;

        const newQuestions = [...data.questions];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
        setData({ ...data, questions: newQuestions });
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
        doc.text(`Class: ${data.class_level || 'N/A'}`, margin, y);
        y += 7;
        doc.text(`Topic: ${data.topic || 'N/A'}`, margin, y);
        y += 15;

        // Questions
        doc.setFontSize(11);
        data.questions.forEach((q, index) => {
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

        doc.save(`${data.title.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    {isEditing ? (
                        <Input
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="font-bold text-lg h-auto py-1 px-2"
                        />
                    ) : (
                        <div>
                            <h1 className="text-2xl font-bold">{data.title}</h1>
                            <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                                {data.class_level && <Badge variant="secondary">{data.class_level}</Badge>}
                                {data.topic && <span className="flex items-center">• {data.topic}</span>}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => { setIsEditing(false); setData(assessment); setEditedTitle(assessment.title); }}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => setIsCalendarModalOpen(true)}>
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Add to Calendar
                            </Button>
                            <Button variant="outline" onClick={() => setShowAnswers(!showAnswers)}>
                                {showAnswers ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                {showAnswers ? "Hide Answers" : "Show Answers"}
                            </Button>
                            <Button variant="outline" onClick={handleDownloadPDF}>
                                <Download className="mr-2 h-4 w-4" /> PDF
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Assessment
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

            {/* Questions List */}
            <div className="space-y-4">
                {data.questions.map((q, index) => (
                    <Card key={index} className="relative group">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center gap-1 pt-1">
                                    <span className="font-bold text-muted-foreground w-6 text-center">{index + 1}.</span>
                                    {isEditing && (
                                        <div className="flex flex-col gap-1 mt-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                disabled={index === 0}
                                                onClick={() => moveQuestion(index, 'up')}
                                            >
                                                <ArrowUp className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                disabled={index === data.questions.length - 1}
                                                onClick={() => moveQuestion(index, 'down')}
                                            >
                                                <ArrowDown className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4">
                                    {isEditing ? (
                                        <Textarea
                                            value={q.question}
                                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                            className="min-h-[60px]"
                                        />
                                    ) : (
                                        <p className="text-lg font-medium">{q.question}</p>
                                    )}

                                    {q.type === 'objective' && (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {q.options?.map((opt: string, optIndex: number) => (
                                                <div key={optIndex} className="flex items-center gap-2 p-2 rounded-md border bg-muted/30">
                                                    <span className="font-semibold text-muted-foreground text-sm">
                                                        {String.fromCharCode(65 + optIndex)}.
                                                    </span>
                                                    {isEditing ? (
                                                        <Input
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                                                            className="h-8"
                                                        />
                                                    ) : (
                                                        <span>{opt}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {showAnswers && (
                                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-900/50">
                                            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                                                Answer: {isEditing ? (
                                                    <Input
                                                        value={q.answer}
                                                        onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                                                        className="mt-1 bg-white dark:bg-black"
                                                    />
                                                ) : q.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <AddToCalendarModal
                open={isCalendarModalOpen}
                onOpenChange={setIsCalendarModalOpen}
                defaultTitle={`Assessment: ${assessment.title}`}
                description={`Assessment for ${assessment.topic}.`}
                relatedId={assessment.id}
                relatedType="assessment"
            />
        </div>
    );
}
