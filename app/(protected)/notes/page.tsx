import Link from "next/link";
import { Plus, FileText, Calendar, Clock } from "lucide-react";
import { getNotes } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { PageShell, Section } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemCard } from "@/components/ui/item-card";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const { data: notes } = await getNotes(1, 200);
  const groups = (notes || []).reduce<Record<string, any[]>>((acc, note: any) => {
    const key = note.subject || "Other";
    (acc[key] ||= []).push(note);
    return acc;
  }, {});

  return (
    <PageShell
      title="Notes"
      description="Topic notes you can share or print for students."
      actions={
        <Button asChild>
          <Link href="/generator/notes"><Plus className="mr-2 h-4 w-4" /> Create new</Link>
        </Button>
      }
    >
      {(!notes || notes.length === 0) ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Generate clean, student-ready notes in a few seconds."
          actionLabel="Create your first set"
          actionHref="/generator/notes"
        />
      ) : (
        Object.entries(groups).map(([subject, items]) => (
          <Section key={subject} title={subject}>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.map((note: any) => (
                <ItemCard
                  key={note.id}
                  href={`/notes/${note.id}`}
                  title={note.title}
                  subtitle={[note.strand, note.sub_strand].filter(Boolean).join(" • ")}
                  badge={note.class_level}
                  meta={[
                    { icon: Calendar, label: note.date || new Date(note.created_at).toLocaleDateString() },
                    note.duration ? { icon: Clock, label: note.duration } : null,
                  ].filter(Boolean) as any}
                />
              ))}
            </div>
          </Section>
        ))
      )}
    </PageShell>
  );
}
