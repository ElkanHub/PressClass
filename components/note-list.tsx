"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Trash2, FileText, Calendar, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { deleteNote, Note } from "@/actions/notes";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NoteListProps {
    notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete these notes?")) {
            setIsDeleting(id);
            try {
                await deleteNote(id);
                router.refresh();
            } catch (error) {
                console.error("Failed to delete notes:", error);
                alert("Failed to delete notes");
            } finally {
                setIsDeleting(null);
            }
        }
    };

    if (notes.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                <div className="bg-blue-500/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Generate your first set of notes to get started.
                </p>
                <Button asChild>
                    <Link href="/generator/notes">Create Notes</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
                <Card key={note.id} className="group hover:shadow-md transition-all duration-200 border-border/50">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold line-clamp-1">
                                    <Link href={`/notes/${note.id}`} className="hover:underline">
                                        {note.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                                </CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-4 w-4" />
                                        <span className="sr-only">Menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/notes/${note.id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDelete(note.id)}
                                        disabled={isDeleting === note.id}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                            {note.class_level && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/5 text-blue-600 text-xs font-medium">
                                    <GraduationCap className="h-3 w-3" />
                                    {note.class_level}
                                </div>
                            )}
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                                <FileText className="h-3 w-3" />
                                {note.subject}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary" asChild>
                            <Link href={`/notes/${note.id}`}>
                                View Notes
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
