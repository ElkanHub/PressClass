"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Printer, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { saveNote } from "@/actions/notes";
import jsPDF from "jspdf";
import { format } from "date-fns";

export default function NotesResultPage() {
    const router = useRouter();
    const [notes, setNotes] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const storedNotes = localStorage.getItem("generatedNotes");
        if (storedNotes) {
            setNotes(JSON.parse(storedNotes));
        } else {
            router.push("/generator/notes");
        }
    }, [router]);

    const handleSave = async () => {
        if (!notes) return;
        setIsSaving(true);
        try {
            const result = await saveNote(notes);
            if (result.success) {
                toast.success("Notes saved to dashboard!");
                // Optionally redirect to the saved note view or dashboard
                // router.push("/dashboard"); 
            } else {
                toast.error(`Failed to save notes: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        if (!notes) return;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text(notes.topic || "Lesson Notes", 10, 20);

        doc.setFontSize(12);
        doc.text(`Subject: ${notes.administrativeDetails?.subject || "N/A"}`, 10, 30);
        doc.text(`Class: ${notes.administrativeDetails?.class || "N/A"}`, 10, 40);
        doc.text(`Date: ${notes.administrativeDetails?.date || "N/A"}`, 10, 50);

        let y = 60;

        doc.setFontSize(14);
        doc.text("Lesson Summary", 10, y);
        y += 10;
        doc.setFontSize(12);
        const summaryLines = doc.splitTextToSize(notes.lessonSummary, 180);
        doc.text(summaryLines, 10, y);
        y += summaryLines.length * 7 + 10;

        doc.setFontSize(14);
        doc.text("Key Points", 10, y);
        y += 10;
        doc.setFontSize(12);
        if (notes.keyPoints && notes.keyPoints.length > 0) {
            notes.keyPoints.forEach((point: string) => {
                const pointLines = doc.splitTextToSize(`• ${point}`, 180);
                doc.text(pointLines, 10, y);
                y += pointLines.length * 7;
            });
        }
        y += 10;

        // Add new page if content overflows (simplified check)
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(14);
        doc.text("Activity", 10, y);
        y += 10;
        doc.setFontSize(12);
        const activityLines = doc.splitTextToSize(notes.activity, 180);
        doc.text(activityLines, 10, y);

        doc.save(`${notes.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`);
    };

    if (!notes) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-8 space-y-6">
            <div className="flex justify-between items-center print:hidden">
                <h1 className="text-3xl font-bold">Generated Notes</h1>
                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save to Dashboard
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardHeader className="border-b bg-muted/50 print:bg-transparent print:border-none">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">School:</span> {notes.administrativeDetails?.school || "N/A"}
                        </div>
                        <div>
                            <span className="font-semibold">Class:</span> {notes.administrativeDetails?.class || "N/A"}
                        </div>
                        <div>
                            <span className="font-semibold">Subject:</span> {notes.administrativeDetails?.subject || "N/A"}
                        </div>
                        <div>
                            <span className="font-semibold">Date:</span> {notes.administrativeDetails?.date ? format(new Date(notes.administrativeDetails.date), "PPP") : "N/A"}
                        </div>
                        <div>
                            <span className="font-semibold">Duration:</span> {notes.administrativeDetails?.duration || "N/A"}
                        </div>
                        <div>
                            <span className="font-semibold">Week/Term:</span> {notes.administrativeDetails?.weekTerm || "N/A"}
                        </div>
                    </div>
                    <CardTitle className="mt-4 text-2xl text-center">{notes.topic || "Lesson Notes"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <section>
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <FileText className="mr-2 h-5 w-5" /> Lesson Summary
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {notes.lessonSummary}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-2">Key Points</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {notes.keyPoints && notes.keyPoints.length > 0 ? (
                                notes.keyPoints.map((point: string, index: number) => (
                                    <li key={index}>{point}</li>
                                ))
                            ) : (
                                <li>No key points available</li>
                            )}
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-2">Examples</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {notes.examples && notes.examples.length > 0 ? (
                                notes.examples.map((example: string, index: number) => (
                                    <li key={index}>{example}</li>
                                ))
                            ) : (
                                <li>No examples available</li>
                            )}
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-2">Activity</h3>
                        <p className="text-muted-foreground">{notes.activity || "No activity specified"}</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-2">Resources</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {notes.resources && notes.resources.length > 0 ? (
                                notes.resources.map((resource: string, index: number) => (
                                    <li key={index}>
                                        <a href={resource} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {resource}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li>No resources available</li>
                            )}
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
