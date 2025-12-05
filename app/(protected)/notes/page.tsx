import { getNotes, deleteNote } from "@/actions/notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Calendar, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function NotesPage() {
    const notes = await getNotes();

    // Group notes by subject
    const notesBySubject = notes?.reduce((acc: any, note: any) => {
        const subject = note.subject || "Uncategorized";
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(note);
        return acc;
    }, {});

    return (
        <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            <Breadcrumb items={[{ label: "Notes" }]} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all your generated notes.
                    </p>
                </div>

                <Button asChild className="gap-2 bg-gradient-to-r from-primary to-purple-600">
                    <Link href="/generator/notes">
                        <Plus className="h-4 w-4" />
                        Create New
                    </Link>
                </Button>
            </div>

            {(!notes || notes.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No notes found. Start by creating one!</p>
                </div>
            )}

            {Object.entries(notesBySubject || {}).map(([subject, subjectNotes]: [string, any]) => (
                <div key={subject} className="space-y-4">
                    <h2 className="text-2xl font-semibold border-b pb-2">{subject}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjectNotes.map((note: any) => (
                            <Card key={note.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg line-clamp-1">{note.strand} - {note.sub_strand}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {note.date}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4" />
                                            {note.duration}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold mr-2">Class:</span> {note.class_level}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Link href={`/notes/${note.id}`} className="w-full mr-2">
                                            <Button variant="outline" className="w-full">
                                                <FileText className="mr-2 h-4 w-4" /> View
                                            </Button>
                                        </Link>
                                        <form action={async () => {
                                            "use server";
                                            await deleteNote(note.id);
                                        }}>
                                            <Button variant="destructive" size="icon" type="submit">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
