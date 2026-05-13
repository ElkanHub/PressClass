"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell, Section } from "@/components/ui/page-shell";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { saveNote } from "@/actions/notes";

export default function NotesResultPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("generatedNotes");
    if (stored) setNotes(JSON.parse(stored));
    else router.push("/generator/notes");
  }, [router]);

  if (!notes) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const result = await saveNote(notes);
      if (result.success) {
        toast.success("Notes saved");
        router.push("/notes");
      } else {
        toast.error(`Save failed: ${result.error}`);
      }
    } finally {
      setIsSaving(false);
    }
  }

  const admin = notes.administrativeDetails ?? {};

  return (
    <PageShell
      title={notes.topic || "Generated notes"}
      description={[admin.subject, admin.class].filter(Boolean).join(" • ")}
      actions={
        <>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
          <PdfDownloadButton
            input={{
              kind: "notes",
              data: {
                title: notes.topic || "Notes",
                school: admin.school,
                class_level: admin.class,
                subject: admin.subject,
                strand: admin.strand,
                sub_strand: admin.subStrand,
                date: admin.date,
                duration: admin.duration,
                week_term: admin.weekTerm,
                content: {
                  topic: notes.topic,
                  lessonSummary: notes.lessonSummary,
                  keyPoints: notes.keyPoints,
                  examples: notes.examples,
                  activity: notes.activity,
                  resources: notes.resources,
                },
              },
            }}
          />
        </>
      }
    >
      <Card className="p-6 sm:p-8 space-y-8">
        <header className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
          <Detail label="School" value={admin.school} />
          <Detail label="Class" value={admin.class} />
          <Detail label="Subject" value={admin.subject} />
          <Detail label="Date" value={admin.date && safeFormat(admin.date)} />
          <Detail label="Duration" value={admin.duration} />
          <Detail label="Week / Term" value={admin.weekTerm} />
        </header>

        <Section title="Lesson summary">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{notes.lessonSummary}</p>
        </Section>

        {notes.keyPoints?.length > 0 && (
          <Section title="Key points">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {notes.keyPoints.map((p: string, i: number) => <li key={i}>{p}</li>)}
            </ul>
          </Section>
        )}

        {notes.examples?.length > 0 && (
          <Section title="Examples">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {notes.examples.map((e: string, i: number) => <li key={i}>{e}</li>)}
            </ul>
          </Section>
        )}

        {notes.activity && (
          <Section title="Activity">
            <p className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm leading-relaxed">
              {notes.activity}
            </p>
          </Section>
        )}

        {notes.resources?.length > 0 && (
          <Section title="Resources">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {notes.resources.map((r: string, i: number) => (
                <li key={i}>
                  <a href={r} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{r}</a>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </Card>
    </PageShell>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
}

function safeFormat(date: string): string {
  try {
    return format(new Date(date), "PPP");
  } catch {
    return date;
  }
}
