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
    Layout,
    Loader2,
    School,
    Edit2,
    Trash2,
    Save,
    X,
    MoreVertical,
    Plus,
    Minus,
    Lightbulb,
    List,
    HelpCircle,
    Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note, updateNote, deleteNote } from "@/actions/notes";
import { createAssessment } from "@/actions/assessments";

interface NoteDetailProps {
    note: Note;
}

interface NoteContent {
    summary?: string;
    keyPoints?: string[];
    examples?: string[];
    questions?: string[];
    resources?: string[];
}

export function NoteDetail({ note }: NoteDetailProps) {
    const router = useRouter();
    const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState(note);
    const [content, setContent] = useState(note.content as NoteContent);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateNote(data.id, {
                title: data.title,
                school: data.school,
                class_level: data.class_level,
                subject: data.subject,
                strand: data.strand,
                sub_strand: data.sub_strand,
                duration: data.duration,
                week_term: data.week_term,
                date: data.date,
                content: content,
            });
            setIsEditing(false);
            router.refresh();
            toast.success("Notes saved successfully");
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete these notes? This action cannot be undone.")) {
            try {
                await deleteNote(data.id);
                toast.success("Notes deleted");
                router.push("/notes");
            } catch (error) {
                console.error("Failed to delete:", error);
                toast.error("Failed to delete notes");
            }
        }
    };

    const handleListChange = (field: keyof NoteContent, index: number, value: string) => {
        const list = content[field] as string[] || [];
        const newList = [...list];
        newList[index] = value;
        setContent({ ...content, [field]: newList });
    };

    const addListItem = (field: keyof NoteContent) => {
        const list = content[field] as string[] || [];
        setContent({ ...content, [field]: [...list, ""] });
    };

    const removeListItem = (field: keyof NoteContent, index: number) => {
        const list = content[field] as string[] || [];
        const newList = [...list];
        newList.splice(index, 1);
        setContent({ ...content, [field]: newList });
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById("note-content");
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
            pdf.save(`${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`);
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
            // 1. Generate assessment content via API using note context
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: note.subject,
                    strand: note.strand,
                    subStrand: note.sub_strand || "",
                    classLevel: note.class_level,
                    questionType: "mixed",
                    quantity: 10,
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
                title: `Assessment: ${note.title}`,
                class_level: note.class_level,
                topic: note.strand,
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
                            <Button variant="outline" onClick={() => { setIsEditing(false); setData(note); setContent(note.content as NoteContent); }}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </>
                    ) : (
                        <>
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
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit Notes
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

            {/* Note Content */}
            <div id="note-content" className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto space-y-8">
                {/* 1. Administrative Details */}
                <section className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b pb-6">
                    <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">School</h3>
                        {isEditing ? (
                            <Input value={data.school || ""} onChange={(e) => setData({ ...data, school: e.target.value })} className="h-8" />
                        ) : (
                            <p className="font-medium">{data.school || "N/A"}</p>
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
                            <p className="font-medium">
                                {data.date && !isNaN(new Date(data.date).getTime())
                                    ? format(new Date(data.date), "PPP")
                                    : data.date || "N/A"}
                            </p>
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
                                    <span className="font-semibold">Strand (Topic):</span>
                                    <Input value={data.strand || ""} onChange={(e) => setData({ ...data, strand: e.target.value })} className="mt-1" />
                                </div>
                                <div>
                                    <span className="font-semibold">Sub-strand (Sub-topic):</span>
                                    <Input value={data.sub_strand || ""} onChange={(e) => setData({ ...data, sub_strand: e.target.value })} className="mt-1" />
                                </div>
                            </>
                        ) : (
                            <>
                                <p><span className="font-semibold">Strand:</span> {data.strand}</p>
                                <p><span className="font-semibold">Sub-strand:</span> {data.sub_strand}</p>
                            </>
                        )}
                    </div>
                </section>

                {/* 3. Lesson Summary */}
                <section>
                    <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Lesson Summary / Explanation
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                        {isEditing ? (
                            <Textarea value={content.summary || ""} onChange={(e) => setContent({ ...content, summary: e.target.value })} className="min-h-[150px]" />
                        ) : (
                            <p className="whitespace-pre-wrap">{content.summary}</p>
                        )}
                    </div>
                </section>

                {/* 4. Key Points */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <List className="h-5 w-5" />
                            Key Points / Core Concepts
                        </h2>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={() => addListItem('keyPoints')}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.keyPoints?.map((point: string, i: number) => (
                            <li key={i} className="flex gap-2 items-center">
                                {isEditing ? (
                                    <>
                                        <Input value={point} onChange={(e) => handleListChange('keyPoints', i, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeListItem('keyPoints', i)}>
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

                {/* 5. Examples */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <Lightbulb className="h-5 w-5" />
                            Examples or Illustrations
                        </h2>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={() => addListItem('examples')}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.examples?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-2 items-center">
                                {isEditing ? (
                                    <>
                                        <Input value={item} onChange={(e) => handleListChange('examples', i, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeListItem('examples', i)}>
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

                {/* 6. Questions */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Short Activity / Quick Check
                        </h2>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={() => addListItem('questions')}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                    <ul className="list-decimal list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.questions?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-2 items-center">
                                {isEditing ? (
                                    <>
                                        <Input value={item} onChange={(e) => handleListChange('questions', i, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeListItem('questions', i)}>
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

                {/* 7. Resources */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <LinkIcon className="h-5 w-5" />
                            Extra Reading / More Resources
                        </h2>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={() => addListItem('resources')}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        )}
                    </div>
                    <ul className="list-disc list-inside space-y-2 bg-gray-50 p-4 rounded-md">
                        {content.resources?.map((item: string, i: number) => (
                            <li key={i} className="flex gap-2 items-center">
                                {isEditing ? (
                                    <>
                                        <Input value={item} onChange={(e) => handleListChange('resources', i, e.target.value)} />
                                        <Button size="icon" variant="ghost" onClick={() => removeListItem('resources', i)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </>
                                ) : (
                                    <a href="#" className="text-blue-600 hover:underline">{item}</a>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
