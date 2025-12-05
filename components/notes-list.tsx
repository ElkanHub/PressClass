"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface Note {
    id: string;
    strand: string;
    sub_strand: string;
    class_level: string;
    date: string;
    duration: string;
    subject: string;
}

interface NotesListProps {
    notes: Note[] | null;
}

export function NotesList({ notes }: NotesListProps) {
    if (!notes || notes.length === 0) {
        return (
            <div className="text-center py-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No notes found.</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/generator/notes">Create your first note</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-1">{note.strand}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-1">{note.sub_strand}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center">
                                <span className="font-semibold mr-2 w-16">Subject:</span> {note.subject}
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold mr-2 w-16">Class:</span> {note.class_level}
                            </div>
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-3 w-3" />
                                {note.date}
                            </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/notes/${note.id}`}>
                                <FileText className="mr-2 h-3 w-3" /> View Note
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
