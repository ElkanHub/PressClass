// lib/pdf/templates.ts — per-type render functions.

import {
  createPageContext,
  drawBulletList,
  drawCallout,
  drawDocumentTitle,
  drawMetaBlock,
  drawParagraph,
  drawSectionHeading,
  ensureSpace,
  pageWidthInner,
  safeFileName,
} from "@/lib/pdf/draw";
import type { BrandPalette } from "@/lib/brand";

interface BaseTeacher {
  fullName?: string | null;
  currentSchool?: string | null;
}

interface NotesPayload {
  title: string;
  school?: string | null;
  class_level?: string | null;
  subject?: string | null;
  strand?: string | null;
  sub_strand?: string | null;
  date?: string | null;
  duration?: string | null;
  week_term?: string | null;
  content: {
    topic?: string;
    lessonSummary?: string;
    summary?: string;
    keyPoints?: string[];
    examples?: string[];
    activity?: string;
    resources?: string[];
  };
}

interface LessonPlanPayload {
  title: string;
  subject?: string | null;
  class_level?: string | null;
  topic?: string | null;
  sub_topic?: string | null;
  date?: string | null;
  duration?: string | null;
  week_term?: string | null;
  content: {
    schoolName?: string;
    objectives?: string[];
    rpk?: string;
    materials?: string[];
    stages?: { starter?: string; development?: string; reflection?: string };
    corePoints?: string[];
    evaluation?: string[];
  };
}

interface AssessmentQuestion {
  type: "objective" | "subjective";
  question: string;
  options?: string[];
  answer?: string;
}

interface AssessmentPayload {
  title: string;
  class_level?: string | null;
  topic?: string | null;
  questions: AssessmentQuestion[];
}

interface RenderOptions {
  palette: BrandPalette;
  branded: boolean;
  teacher?: BaseTeacher;
  includeAnswers?: boolean; // assessment-only
}

function footerStrings(teacher?: BaseTeacher, branded?: boolean) {
  const left = teacher?.fullName || "";
  const right = branded ? teacher?.currentSchool || "" : "";
  return { left, right };
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export function renderNotes(data: NotesPayload, opts: RenderOptions) {
  const { left, right } = footerStrings(opts.teacher, opts.branded);
  const ctx = createPageContext({
    palette: opts.palette,
    branded: opts.branded,
    footerLeft: left,
    footerRight: right,
    docTitle: data.title,
  });

  const subtitle = [data.subject, data.class_level].filter(Boolean).join(" • ");
  drawDocumentTitle(ctx, data.title, subtitle);

  drawMetaBlock(ctx, [
    { label: "School", value: data.school ?? opts.teacher?.currentSchool },
    { label: "Class", value: data.class_level },
    { label: "Subject", value: data.subject },
    { label: "Strand", value: data.strand },
    { label: "Sub-strand", value: data.sub_strand },
    { label: "Date", value: data.date },
    { label: "Duration", value: data.duration },
    { label: "Week / Term", value: data.week_term },
  ]);

  const summary = data.content.lessonSummary || data.content.summary;
  if (data.content.topic) {
    drawSectionHeading(ctx, "Topic");
    drawParagraph(ctx, data.content.topic, { bold: true, size: 12 });
  }
  if (summary) {
    drawSectionHeading(ctx, "Lesson Summary");
    drawParagraph(ctx, summary);
  }
  if (data.content.keyPoints?.length) {
    drawSectionHeading(ctx, "Key Points");
    drawBulletList(ctx, data.content.keyPoints);
  }
  if (data.content.examples?.length) {
    drawSectionHeading(ctx, "Examples");
    drawBulletList(ctx, data.content.examples);
  }
  if (data.content.activity) {
    drawSectionHeading(ctx, "Activity");
    drawCallout(ctx, "For students", data.content.activity, "accent");
  }
  if (data.content.resources?.length) {
    drawSectionHeading(ctx, "Resources");
    drawBulletList(ctx, data.content.resources);
  }

  ctx.doc.save(`${safeFileName(data.title, "notes")}.pdf`);
}

// ---------------------------------------------------------------------------
// Lesson Plan
// ---------------------------------------------------------------------------

export function renderLessonPlan(data: LessonPlanPayload, opts: RenderOptions) {
  const { left, right } = footerStrings(opts.teacher, opts.branded);
  const ctx = createPageContext({
    palette: opts.palette,
    branded: opts.branded,
    footerLeft: left,
    footerRight: right,
    docTitle: data.title,
  });

  const subtitle = [data.subject, data.class_level].filter(Boolean).join(" • ");
  drawDocumentTitle(ctx, data.title, subtitle);

  drawMetaBlock(ctx, [
    { label: "School", value: data.content.schoolName ?? opts.teacher?.currentSchool },
    { label: "Class", value: data.class_level },
    { label: "Subject", value: data.subject },
    { label: "Topic", value: data.topic },
    { label: "Sub-topic", value: data.sub_topic },
    { label: "Date", value: data.date },
    { label: "Duration", value: data.duration },
    { label: "Week / Term", value: data.week_term },
  ]);

  if (data.content.objectives?.length) {
    drawSectionHeading(ctx, "Learning Objectives");
    drawBulletList(ctx, data.content.objectives);
  }
  if (data.content.rpk) {
    drawSectionHeading(ctx, "Relevant Previous Knowledge");
    drawParagraph(ctx, data.content.rpk);
  }
  if (data.content.materials?.length) {
    drawSectionHeading(ctx, "Teaching & Learning Materials");
    drawBulletList(ctx, data.content.materials);
  }
  if (data.content.stages) {
    drawSectionHeading(ctx, "Lesson Stages");
    if (data.content.stages.starter) {
      drawCallout(ctx, "Starter / Introduction", data.content.stages.starter, "primary");
    }
    if (data.content.stages.development) {
      drawCallout(ctx, "Main Development", data.content.stages.development, "accent");
    }
    if (data.content.stages.reflection) {
      drawCallout(ctx, "Reflection / Plenary", data.content.stages.reflection, "primary");
    }
  }
  if (data.content.corePoints?.length) {
    drawSectionHeading(ctx, "Core Points");
    drawBulletList(ctx, data.content.corePoints);
  }
  if (data.content.evaluation?.length) {
    drawSectionHeading(ctx, "Evaluation");
    drawBulletList(ctx, data.content.evaluation);
  }

  ctx.doc.save(`${safeFileName(data.title, "lesson-plan")}.pdf`);
}

// ---------------------------------------------------------------------------
// Assessment
// ---------------------------------------------------------------------------

export function renderAssessment(data: AssessmentPayload, opts: RenderOptions) {
  const { left, right } = footerStrings(opts.teacher, opts.branded);
  const ctx = createPageContext({
    palette: opts.palette,
    branded: opts.branded,
    footerLeft: left,
    footerRight: right,
    docTitle: data.title,
  });

  const subtitle = [data.topic, data.class_level].filter(Boolean).join(" • ");
  drawDocumentTitle(ctx, data.title, subtitle);

  drawMetaBlock(ctx, [
    { label: "Class", value: data.class_level },
    { label: "Topic", value: data.topic },
    { label: "Questions", value: String(data.questions.length) },
    { label: "School", value: opts.teacher?.currentSchool },
    { label: "Teacher", value: opts.teacher?.fullName },
  ]);

  drawSectionHeading(ctx, "Questions");

  data.questions.forEach((q, i) => {
    ctx.doc.setFont("helvetica", "bold");
    ctx.doc.setFontSize(10.5);
    const indexLabel = `${i + 1}.`;
    const questionLines = ctx.doc.splitTextToSize(q.question, pageWidthInner(ctx) - 8);
    ensureSpace(ctx, questionLines.length * 5 + 6);
    ctx.doc.setTextColor(17, 24, 39);
    ctx.doc.text(indexLabel, ctx.marginX, ctx.y);
    ctx.doc.text(questionLines, ctx.marginX + 8, ctx.y);
    ctx.y += questionLines.length * 5 + 1;

    if (q.type === "objective" && q.options?.length) {
      ctx.doc.setFont("helvetica", "normal");
      ctx.doc.setFontSize(10);
      q.options.forEach((opt, oi) => {
        const letter = String.fromCharCode(65 + oi);
        const optLines = ctx.doc.splitTextToSize(`${letter}.  ${opt}`, pageWidthInner(ctx) - 12);
        ensureSpace(ctx, optLines.length * 5);
        ctx.doc.setTextColor(55, 65, 81);
        ctx.doc.text(optLines, ctx.marginX + 8, ctx.y);
        ctx.y += optLines.length * 5;
      });
    } else {
      // Space for written answer
      ensureSpace(ctx, 20);
      ctx.doc.setDrawColor(229, 231, 235);
      ctx.doc.setLineWidth(0.2);
      for (let line = 0; line < 3; line++) {
        ctx.y += 5;
        ctx.doc.line(ctx.marginX + 8, ctx.y, ctx.pageWidth - ctx.marginX, ctx.y);
      }
    }
    ctx.y += 4;
  });

  if (opts.includeAnswers) {
    ctx.doc.addPage();
    ctx.y = ctx.marginTop;
    drawDocumentTitle(ctx, "Answer Key", data.title);
    data.questions.forEach((q, i) => {
      ctx.doc.setFont("helvetica", "bold");
      ctx.doc.setFontSize(10);
      ctx.doc.setTextColor(17, 24, 39);
      const answer = q.answer || "—";
      const lines = ctx.doc.splitTextToSize(`${i + 1}. ${answer}`, pageWidthInner(ctx));
      ensureSpace(ctx, lines.length * 5 + 2);
      ctx.doc.text(lines, ctx.marginX, ctx.y);
      ctx.y += lines.length * 5 + 2;
    });
  }

  ctx.doc.save(`${safeFileName(data.title, "assessment")}.pdf`);
}
