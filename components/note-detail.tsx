"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Edit2,
  FileText,
  Loader2,
  MoreVertical,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DocumentActionBar,
  DocumentBulletList,
  DocumentCallout,
  DocumentHeader,
  DocumentMeta,
  DocumentPaper,
  DocumentParagraph,
  DocumentSection,
} from "@/components/document-view";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { AddItemModal } from "@/components/calendar/add-item-modal";
import { Note, deleteNote, updateNote } from "@/actions/notes";
import { createAssessment } from "@/actions/assessments";
import { callGenerate, reportGenerateError } from "@/lib/api/generate-client";

interface NoteContent {
  summary?: string;
  lessonSummary?: string;
  keyPoints?: string[];
  examples?: string[];
  questions?: string[];
  activity?: string;
  resources?: string[];
}

interface NoteDetailProps {
  note: Note;
}

export function NoteDetail({ note }: NoteDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [data, setData] = useState(note);
  const [content, setContent] = useState<NoteContent>(note.content as NoteContent);

  function reset() {
    setIsEditing(false);
    setData(note);
    setContent(note.content as NoteContent);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateNote(data.id, {
        title: data.title,
        school: data.school,
        class_level: data.class_level,
        subject: data.subject,
        strand: data.strand,
        sub_strand: data.sub_strand,
        duration: data.duration,
        week_term: data.week_term,
        date: data.date,
        content,
      });
      setIsEditing(false);
      router.refresh();
      toast.success("Notes saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete these notes? This cannot be undone.")) return;
    try {
      await deleteNote(data.id);
      toast.success("Notes deleted");
      router.push("/notes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }

  async function handleGenerateAssessment() {
    setIsGeneratingAssessment(true);
    try {
      const generated = await callGenerate<any>("/api/generate", {
        subject: data.subject,
        strand: data.strand,
        subStrand: data.sub_strand || "",
        classLevel: data.class_level,
        questionType: "mixed",
        quantity: 10,
        difficulty: "mixed",
        difficultyConfig: { easy: 30, normal: 40, hard: 30 },
      });
      const result = await createAssessment({
        title: `Assessment: ${data.title}`,
        class_level: data.class_level,
        topic: data.strand,
        questions: generated.questions,
      });
      if (!result.success) {
        toast.error(result.error || "Couldn't save assessment");
        return;
      }
      toast.success("Assessment generated");
      router.push(`/assessments/${result.assessment?.id}`);
    } catch (err) {
      reportGenerateError(err);
    } finally {
      setIsGeneratingAssessment(false);
    }
  }

  const summary = content.lessonSummary ?? content.summary;
  const formattedDate = (() => {
    if (!data.date) return "—";
    const d = new Date(data.date);
    return isNaN(d.getTime()) ? data.date : format(d, "PPP");
  })();
  const createdAt = (() => {
    if (!data.created_at) return null;
    const d = new Date(data.created_at);
    return isNaN(d.getTime()) ? null : format(d, "PPP");
  })();

  return (
    <>
      <DocumentActionBar
        eyebrow="Notes"
        meta={createdAt ? `Created ${createdAt}` : undefined}
        actions={
          isEditing ? (
            <>
              <Button variant="ghost" onClick={reset} disabled={isSaving}>
                <X className="mr-1.5 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/notes")}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-1.5 h-4 w-4" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsCalendarOpen(true)}>
                <CalendarIcon className="mr-1.5 h-4 w-4" /> Schedule
              </Button>
              <PdfDownloadButton
                input={{
                  kind: "notes",
                  data: {
                    title: data.title,
                    school: data.school,
                    class_level: data.class_level,
                    subject: data.subject,
                    strand: data.strand,
                    sub_strand: data.sub_strand,
                    date: data.date,
                    duration: data.duration,
                    week_term: data.week_term,
                    content,
                  },
                }}
                label="PDF"
              />
              <Button
                size="sm"
                onClick={handleGenerateAssessment}
                disabled={isGeneratingAssessment}
              >
                {isGeneratingAssessment ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileText className="mr-1.5 h-4 w-4" />}
                Assessment
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )
        }
      />

      <DocumentPaper>
        <DocumentHeader
          title={data.title}
          subtitle={[data.subject, data.class_level].filter(Boolean).join(" · ")}
          editing={isEditing}
          onTitleChange={(v) => setData({ ...data, title: v })}
        />

        <DocumentMeta
          editing={isEditing}
          onChange={(field, value) => setData({ ...data, [field]: value })}
          fields={[
            { label: "School",     value: data.school,      field: "school",       editable: true },
            { label: "Class",      value: data.class_level, field: "class_level",  editable: true },
            { label: "Subject",    value: data.subject,     field: "subject",      editable: true },
            { label: "Strand",     value: data.strand,      field: "strand",       editable: true },
            { label: "Sub-strand", value: data.sub_strand,  field: "sub_strand",   editable: true },
            { label: "Date",       value: isEditing ? data.date : formattedDate, field: "date", editable: true },
            { label: "Duration",   value: data.duration,    field: "duration",     editable: true },
            { label: "Week / Term",value: data.week_term,   field: "week_term",    editable: true },
          ]}
        />

        <DocumentSection label="Lesson summary">
          <DocumentParagraph
            value={summary}
            editing={isEditing}
            minRows={6}
            placeholder="Add the lesson summary."
            onChange={(v) => setContent({ ...content, lessonSummary: v, summary: v })}
          />
        </DocumentSection>

        <DocumentSection label="Key points">
          <DocumentBulletList
            items={content.keyPoints}
            editing={isEditing}
            onChange={(items) => setContent({ ...content, keyPoints: items })}
            placeholder="No key points yet."
          />
        </DocumentSection>

        <DocumentSection label="Examples">
          <DocumentBulletList
            items={content.examples}
            editing={isEditing}
            onChange={(items) => setContent({ ...content, examples: items })}
            placeholder="No examples yet."
          />
        </DocumentSection>

        {(content.activity || isEditing) && (
          <DocumentSection label="Activity">
            <DocumentCallout
              tone="accent"
              label="For students"
              value={content.activity}
              editing={isEditing}
              onChange={(v) => setContent({ ...content, activity: v })}
              minRows={3}
              placeholder="Describe an activity students can do after the lesson."
            />
          </DocumentSection>
        )}

        <DocumentSection label="Resources">
          <DocumentBulletList
            items={content.resources}
            editing={isEditing}
            onChange={(items) => setContent({ ...content, resources: items })}
            placeholder="No external resources yet."
          />
        </DocumentSection>
      </DocumentPaper>

      <AddItemModal
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        defaultTitle={data.title}
        defaultType="lesson"
        defaultDescription={`Review notes for ${data.subject}: ${data.strand}`}
      />
    </>
  );
}
