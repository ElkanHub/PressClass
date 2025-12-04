import { NotesForm } from "@/components/notes-form";

export default function NotesGeneratorPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Notes Generator</h1>
                <p className="text-muted-foreground">
                    Create structured, curriculum-aligned lesson notes in seconds.
                </p>
            </div>
            <NotesForm />
        </div>
    );
}
