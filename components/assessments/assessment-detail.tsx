"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CalendarPlus,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  MoreVertical,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  DocumentActionBar,
  DocumentHeader,
  DocumentMeta,
  DocumentPaper,
  DocumentSection,
} from "@/components/document-view";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { AddToCalendarModal } from "@/components/calendar/add-to-calendar-modal";
import { Assessment, deleteAssessment, updateAssessment } from "@/actions/assessments";
import { useTeacherBrand } from "@/hooks/use-teacher-brand";
import { buildPalette } from "@/lib/brand";
import { GenerationFeedback } from "@/components/feedback/generation-feedback";

interface AssessmentDetailProps {
  assessment: Assessment;
}

interface Question {
  id?: number;
  type: "objective" | "subjective";
  question: string;
  options?: string[];
  answer: string;
}

export function AssessmentDetail({ assessment }: AssessmentDetailProps) {
  const router = useRouter();
  const { brand } = useTeacherBrand();
  const palette = buildPalette(brand?.schoolColor, brand?.personalColor);
  const [isEditing, setIsEditing] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<Assessment>(assessment);

  function reset() {
    setIsEditing(false);
    setData(assessment);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateAssessment(data.id, {
        title: data.title,
        questions: data.questions,
      });
      setIsEditing(false);
      router.refresh();
      toast.success("Assessment saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this assessment? This cannot be undone.")) return;
    try {
      await deleteAssessment(data.id);
      toast.success("Assessment deleted");
      router.push("/assessments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }

  function updateQuestion(index: number, field: keyof Question, value: any) {
    const next = [...data.questions];
    next[index] = { ...next[index], [field]: value };
    setData({ ...data, questions: next });
  }

  function updateOption(qIndex: number, optIndex: number, value: string) {
    const next = [...data.questions];
    const options = [...(next[qIndex].options ?? [])];
    options[optIndex] = value;
    next[qIndex] = { ...next[qIndex], options };
    setData({ ...data, questions: next });
  }

  function moveQuestion(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === data.questions.length - 1)
    )
      return;
    const next = [...data.questions];
    const target = direction === "up" ? index - 1 : index + 1;
    [next[index], next[target]] = [next[target], next[index]];
    setData({ ...data, questions: next });
  }

  function addQuestion() {
    const next: Question = { type: "objective", question: "", options: ["", "", "", ""], answer: "" };
    setData({ ...data, questions: [...data.questions, next] });
  }

  function removeQuestion(index: number) {
    const next = [...data.questions];
    next.splice(index, 1);
    setData({ ...data, questions: next });
  }

  return (
    <>
      <DocumentActionBar
        eyebrow="Assessment"
        meta={`${data.questions.length} questions`}
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
              <Button variant="ghost" size="sm" onClick={() => router.push("/assessments")}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-1.5 h-4 w-4" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAnswers((v) => !v)}>
                {showAnswers ? <EyeOff className="mr-1.5 h-4 w-4" /> : <Eye className="mr-1.5 h-4 w-4" />}
                {showAnswers ? "Hide answers" : "Show answers"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsCalendarOpen(true)}>
                <CalendarPlus className="mr-1.5 h-4 w-4" /> Schedule
              </Button>
              <PdfDownloadButton
                input={{
                  kind: "assessment",
                  data: {
                    title: data.title,
                    class_level: data.class_level,
                    topic: data.topic,
                    questions: data.questions,
                  },
                  includeAnswers: showAnswers,
                }}
                label="PDF"
              />
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

      <DocumentPaper palette={palette}>
        <DocumentHeader
          title={data.title}
          subtitle={
            <span className="inline-flex items-center gap-2">
              {data.class_level && <Badge variant="secondary">{data.class_level}</Badge>}
              {data.topic && <span>{data.topic}</span>}
            </span>
          }
          editing={isEditing}
          onTitleChange={(v) => setData({ ...data, title: v })}
        />

        <DocumentMeta
          fields={[
            { label: "Class",     value: data.class_level },
            { label: "Topic",     value: data.topic },
            { label: "Questions", value: String(data.questions.length) },
          ]}
        />

        <DocumentSection
          label="Questions"
          actions={
            isEditing && (
              <Button variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add question
              </Button>
            )
          }
        >
          <ol className="space-y-5">
            {data.questions.map((q, index) => (
              <QuestionCard
                key={index}
                q={q as Question}
                index={index}
                total={data.questions.length}
                editing={isEditing}
                showAnswer={showAnswers}
                onChange={(field, value) => updateQuestion(index, field, value)}
                onOptionChange={(optIndex, value) => updateOption(index, optIndex, value)}
                onMove={(dir) => moveQuestion(index, dir)}
                onRemove={() => removeQuestion(index)}
              />
            ))}
          </ol>
        </DocumentSection>
      </DocumentPaper>

      <div className="max-w-4xl mx-auto mt-6">
        <GenerationFeedback
          type="assessment"
          generationId={data.id}
          context={{
            class_level: data.class_level,
            topic: data.topic,
            question_count: data.questions.length,
          }}
        />
      </div>

      <AddToCalendarModal
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        defaultTitle={`Assessment: ${assessment.title}`}
        description={`Assessment for ${assessment.topic}.`}
        relatedId={assessment.id}
        relatedType="assessment"
      />
    </>
  );
}

interface QuestionCardProps {
  q: Question;
  index: number;
  total: number;
  editing: boolean;
  showAnswer: boolean;
  onChange: (field: keyof Question, value: any) => void;
  onOptionChange: (optIndex: number, value: string) => void;
  onMove: (dir: "up" | "down") => void;
  onRemove: () => void;
}

function QuestionCard({
  q,
  index,
  total,
  editing,
  showAnswer,
  onChange,
  onOptionChange,
  onMove,
  onRemove,
}: QuestionCardProps) {
  return (
    <li className="rounded-xl border bg-background/40 p-4 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <div className="flex flex-col items-center gap-2 pt-0.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {index + 1}
          </span>
          {editing && (
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={() => onMove("up")}>
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === total - 1} onClick={() => onMove("down")}>
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={onRemove}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {editing ? (
            <Textarea
              value={q.question}
              onChange={(e) => onChange("question", e.target.value)}
              className="border-2 border-dashed min-h-[60px]"
              placeholder="Question text"
            />
          ) : (
            <p className="text-base font-medium leading-relaxed">{q.question}</p>
          )}

          {q.type === "objective" && q.options && (
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
                >
                  <span className="text-sm font-semibold text-muted-foreground w-5 shrink-0">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {editing ? (
                    <Input
                      value={opt}
                      onChange={(e) => onOptionChange(i, e.target.value)}
                      className="h-8 border-2 border-dashed"
                    />
                  ) : (
                    <span className="text-sm">{opt}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {showAnswer && (
            <div className="rounded-lg border border-primary/30 bg-primary/[0.06] p-3">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">Answer</div>
              {editing ? (
                <Input
                  value={q.answer}
                  onChange={(e) => onChange("answer", e.target.value)}
                  className="mt-1 border-2 border-dashed bg-background"
                />
              ) : (
                <p className="mt-1 text-sm">{q.answer}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
