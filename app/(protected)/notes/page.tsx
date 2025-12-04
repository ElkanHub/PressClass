import { getNotes } from "@/actions/notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function NotesPage() {
    const { data: notes } = await getNotes();

    // Group notes by subject
    const notesBySubject = notes.reduce((acc, note) => {
        const subject = note.subject;
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(note);
        return acc;
    }, {} as Record<string, typeof notes>);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Notes</h1>
                    <p className="text-muted-foreground">
                        Manage and organize your generated lesson notes
                    </p>
                </div>
                <Link href="/generator/notes">
                    <Button className="bg-gradient-to-r from-primary to-purple-600">
                        <Plus className="mr-2 h-4 w-4" /> Generate New Notes
                    </Button>
                </Link>
            </div>

            {notes.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent className="space-y-4">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">No notes yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            Get started by generating your first set of lesson notes using our AI-powered tool.
                        </p>
                        <Link href="/generator/notes">
                            <Button>Generate Notes</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {Object.entries(notesBySubject).map(([subject, subjectNotes]) => (
                        <div key={subject} className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                {subject}
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    ({subjectNotes.length} {subjectNotes.length === 1 ? 'note' : 'notes'})
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subjectNotes.map((note) => (
                                    <Link key={note.id} href={`/notes/${note.id}`}>
                                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="outline" className="mb-2">
                                                        {note.class_level}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(note.created_at), "MMM d, yyyy")}
                                                    </span>
                                                </div>
                                                <CardTitle className="line-clamp-2 text-lg">
                                                    {note.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{note.week_term}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{note.duration}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { Badge } from "@/components/ui/badge";
