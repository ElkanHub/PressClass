"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Printer, Download, FileText, ArrowLeft, Edit } from "lucide-react";
import { toast } from "sonner";
import { getNote } from "@/actions/notes";
import jsPDF from "jspdf";
import Link from "next/link";

export default function NoteDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [note, setNote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const data = await getNote(params.id as string);
                if (!data) {
                    toast.error("Note not found");
                    router.push("/notes");
                    return;
                }
                setNote(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch note");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchNote();
        }
    }, [params.id, router]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        if (!note) return;
        const doc = new jsPDF();
        const content = note.content;

        doc.setFontSize(20);
        doc.text(content.topic, 10, 20);

        doc.setFontSize(12);
        doc.text(`Subject: ${content.administrativeDetails.subject}`, 10, 30);
        doc.text(`Class: ${content.administrativeDetails.class}`, 10, 40);
        doc.text(`Date: ${content.administrativeDetails.date}`, 10, 50);

        let y = 60;

        doc.setFontSize(14);
        doc.text("Lesson Summary", 10, y);
        y += 10;
        doc.setFontSize(12);
        const summaryLines = doc.splitTextToSize(content.lessonSummary, 180);
        doc.text(summaryLines, 10, y);
        y += summaryLines.length * 7 + 10;

        doc.setFontSize(14);
        doc.text("Key Points", 10, y);
        y += 10;
        doc.setFontSize(12);
        content.keyPoints.forEach((point: string) => {
            const pointLines = doc.splitTextToSize(`• ${point}`, 180);
            doc.text(pointLines, 10, y);
            y += pointLines.length * 7;
        });
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
        const activityLines = doc.splitTextToSize(content.activity, 180);
        doc.text(activityLines, 10, y);

        doc.save(`${content.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!note) return null;

    const content = note.content;

    return (
        <div className="container max-w-4xl py-8 space-y-6">
            <div className="flex justify-between items-center print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/notes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Note Details</h1>
                </div>
                <div className="flex gap-2">
                    <Link href={`/notes/${params.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
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
                            <span className="font-semibold">School:</span> {content.administrativeDetails.school}
                        </div>
                        <div>
                            <span className="font-semibold">Class:</span> {content.administrativeDetails.class}
                        </div>
                        <div>
                            <span className="font-semibold">Subject:</span> {content.administrativeDetails.subject}
                        </div>
                        <div>
                            <span className="font-semibold">Date:</span> {content.administrativeDetails.date}
                        </div>
                        <div>
                            <span className="font-semibold">Duration:</span> {content.administrativeDetails.duration}
                        </div>
                        <div>
                            <span className="font-semibold">Week/Term:</span> {content.administrativeDetails.weekTerm}
                        </div>
                    </div>
                    <CardTitle className="mt-4 text-2xl text-center">{content.topic}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <section>
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <FileText className="mr-2 h-5 w-5" /> Lesson Summary
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {content.lessonSummary}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-2">Key Points</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {content.keyPoints.map((point: string, index: number) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-2">Examples</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {content.examples.map((example: string, index: number) => (
                                <li key={index}>{example}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-2">Activity</h3>
                        <p className="text-muted-foreground">{content.activity}</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mb-2">Resources</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {content.resources.map((resource: string, index: number) => (
                                <li key={index}>
                                    <a href={resource} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {resource}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
