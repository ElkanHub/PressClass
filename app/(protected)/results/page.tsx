"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { QuestionDisplay } from "@/components/question-display";
import { createAssessment } from "@/actions/assessments";
import { PageShell } from "@/components/ui/page-shell";
import { PdfDownloadButton } from "@/components/pdf-download-button";

interface AssessmentData {
  title: string;
  classLevel: string;
  topic: string;
  questions: any[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<AssessmentData | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("generatedAssessment");
    if (stored) setData(JSON.parse(stored));
    else router.push("/generator");
  }, [router]);

  if (!data) return null;

  async function handleSave() {
    if (!data) return;
    setIsSaving(true);
    try {
      const result = await createAssessment({
        title: data.title,
        class_level: data.classLevel,
        topic: data.topic,
        questions: data.questions,
      });
      if (!result.success) throw new Error(result.error || "Save failed");
      toast.success("Saved to your assessments");
      router.push(`/assessments/${result.assessment?.id ?? ""}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageShell
      title={data.title || "Generated assessment"}
      description={[data.classLevel, data.topic].filter(Boolean).join(" • ")}
      actions={
        <>
          <Button variant="ghost" onClick={() => router.push("/generator")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
          <Button variant="outline" onClick={() => setShowAnswers((v) => !v)}>
            {showAnswers ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showAnswers ? "Hide answers" : "Show answers"}
          </Button>
          <PdfDownloadButton
            input={{
              kind: "assessment",
              data: {
                title: data.title || "Assessment",
                class_level: data.classLevel,
                topic: data.topic,
                questions: data.questions,
              },
              includeAnswers: showAnswers,
            }}
          />
        </>
      }
    >
      <QuestionDisplay questions={data.questions} showAnswers={showAnswers} />
    </PageShell>
  );
}
