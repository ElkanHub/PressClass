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
import { AddToCalendarModal } from "@/components/calendar/add-to-calendar-modal";
import {
  LessonPlan,
  deleteLessonPlan,
  updateLessonPlan,
} from "@/actions/lesson-plans";
import { createAssessment } from "@/actions/assessments";
import { callGenerate, reportGenerateError } from "@/lib/api/generate-client";

interface LessonPlanContent {
  schoolName?: string;
  objectives?: string[];
  rpk?: string;
  materials?: string[];
  stages?: { starter?: string; development?: string; reflection?: string };
  corePoints?: string[];
  evaluation?: string[];
}

interface LessonPlanDetailProps {
  lessonPlan: LessonPlan;
}

export function LessonPlanDetail({ lessonPlan }: LessonPlanDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [data, setData] = useState(lessonPlan);
  const [content, setContent] = useState<LessonPlanContent>(
    lessonPlan.content as LessonPlanContent
  );

  function reset() {
    setIsEditing(false);
    setData(lessonPlan);
    setContent(lessonPlan.content as LessonPlanContent);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateLessonPlan(data.id, {
        title: data.title,
        subject: data.subject,
        class_level: data.class_level,
        topic: data.topic,
        sub_topic: data.sub_topic,
        duration: data.duration,
        week_term: data.week_term,
        date: data.date,
        content,
      });
      setIsEditing(false);
      router.refresh();
      toast.success("Lesson plan saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this lesson plan? This cannot be undone.")) return;
    try {
      await deleteLessonPlan(data.id);
      toast.success("Lesson plan deleted");
      router.push("/lesson-plans");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }

  async function handleGenerateAssessment() {
    setIsGeneratingAssessment(true);
    try {
      const generated = await callGenerate<any>("/api/generate", {
        subject: data.subject,
        strand: data.topic,
        subStrand: data.sub_topic || "",
        classLevel: data.class_level,
        questionType: "mixed",
        quantity: 10,
        difficulty: "mixed",
        difficultyConfig: { easy: 30, normal: 40, hard: 30 },
      });
      const result = await createAssessment({
        title: `Assessment: ${data.title}`,
        class_level: data.class_level,
        topic: data.topic,
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

  const createdAt = (() => {
    if (!data.created_at) return null;
    const d = new Date(data.created_at);
    return isNaN(d.getTime()) ? null : format(d, "PPP");
  })();

  return (
    <>
      <DocumentActionBar
        eyebrow="Lesson plan"
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
              <Button variant="ghost" size="sm" onClick={() => router.push("/lesson-plans")}>
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
                  kind: "lesson_plan",
                  data: {
                    title: data.title,
                    subject: data.subject,
                    class_level: data.class_level,
                    topic: data.topic,
                    sub_topic: data.sub_topic,
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
          onChange={(field, value) => {
            if (field === "schoolName") {
              setContent({ ...content, schoolName: value });
            } else {
              setData({ ...data, [field]: value });
            }
          }}
          fields={[
            { label: "School",     value: content.schoolName, field: "schoolName",  editable: true },
            { label: "Class",      value: data.class_level,    field: "class_level", editable: true },
            { label: "Subject",    value: data.subject,        field: "subject",     editable: true },
            { label: "Topic",      value: data.topic,          field: "topic",       editable: true },
            { label: "Sub-topic",  value: data.sub_topic,      field: "sub_topic",   editable: true },
            { label: "Date",       value: data.date,           field: "date",        editable: true },
            { label: "Duration",   value: data.duration,       field: "duration",    editable: true },
            { label: "Week / Term",value: data.week_term,      field: "week_term",   editable: true },
          ]}
        />

        <DocumentSection label="Learning objectives">
          <DocumentBulletList
            items={content.objectives}
            editing={isEditing}
            onChange={(items) => setContent({ ...content, objectives: items })}
          />
        </DocumentSection>

        <DocumentSection label="Relevant previous knowledge">
          <DocumentParagraph
            value={content.rpk}
            editing={isEditing}
            minRows={4}
            onChange={(v) => setContent({ ...content, rpk: v })}
          />
        </DocumentSection>

        <DocumentSection label="Materials">
          <DocumentBulletList
            items={content.materials}
            editing={isEditing}
            onChange={(items) => setContent({ ...content, materials: items })}
          />
        </DocumentSection>

        <DocumentSection label="Lesson stages">
          <div className="space-y-4">
            <DocumentCallout
              tone="primary"
              label="Starter / Introduction"
              value={content.stages?.starter}
              editing={isEditing}
              onChange={(v) =>
                setContent({ ...content, stages: { ...content.stages, starter: v } })
              }
              minRows={4}
            />
            <DocumentCallout
              tone="accent"
              label="Main development"
              value={content.stages?.development}
              editing={isEditing}
              onChange={(v) =>
                setContent({ ...content, stages: { ...content.stages, development: v } })
              }
              minRows={8}
            />
            <DocumentCallout
              tone="primary"
              label="Reflection / Plenary"
              value={content.stages?.reflection}
              editing={isEditing}
              onChange={(v) =>
                setContent({ ...content, stages: { ...content.stages, reflection: v } })
              }
              minRows={4}
            />
          </div>
        </DocumentSection>

        <DocumentSection label="Core points">
          <DocumentBulletList
            items={content.corePoints}
            editing={isEditing}
            onChange={(items) => setContent({ ...content, corePoints: items })}
          />
        </DocumentSection>

        <DocumentSection label="Evaluation">
          <DocumentBulletList
            items={content.evaluation}
            editing={isEditing}
            onChange={(items) => setContent({ ...content, evaluation: items })}
          />
        </DocumentSection>
      </DocumentPaper>

      <AddToCalendarModal
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        defaultTitle={`Lesson: ${lessonPlan.title}`}
        description={`Teach ${lessonPlan.subject} (${lessonPlan.class_level}) — ${lessonPlan.topic}.`}
        relatedId={lessonPlan.id}
        relatedType="lesson_plan"
      />
    </>
  );
}
