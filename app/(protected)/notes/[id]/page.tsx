import { getNote } from "@/actions/notes";
import { NoteDetail } from "@/components/note-detail";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: PageProps) {
    const { id } = await params;
    const { success, note } = await getNote(id);

    if (!success || !note) {
        notFound();
    }

    return <NoteDetail note={note} />;
}
