// lib/pdf/index.ts — public PDF API.
// Use downloadPdf() from any client component; it picks the right template,
// derives a palette from the user's brand colors, and respects the branded flag.

import { buildPalette, type BrandPalette } from "@/lib/brand";
import { renderNotes, renderLessonPlan, renderAssessment } from "@/lib/pdf/templates";

export interface TeacherBrand {
  fullName?: string | null;
  currentSchool?: string | null;
  schoolColor?: string | null;
  personalColor?: string | null;
}

interface BaseOptions {
  branded: boolean;
  teacher?: TeacherBrand;
}

export type DownloadPdfInput =
  | { kind: "notes"; data: Parameters<typeof renderNotes>[0] }
  | { kind: "lesson_plan"; data: Parameters<typeof renderLessonPlan>[0] }
  | { kind: "assessment"; data: Parameters<typeof renderAssessment>[0]; includeAnswers?: boolean };

export async function downloadPdf(input: DownloadPdfInput, opts: BaseOptions): Promise<void> {
  const palette: BrandPalette = buildPalette(
    opts.teacher?.schoolColor,
    opts.teacher?.personalColor
  );
  const renderOpts = {
    palette,
    branded: opts.branded,
    teacher: {
      fullName: opts.teacher?.fullName ?? "",
      currentSchool: opts.teacher?.currentSchool ?? "",
    },
  };

  switch (input.kind) {
    case "notes":
      renderNotes(input.data, renderOpts);
      return;
    case "lesson_plan":
      renderLessonPlan(input.data, renderOpts);
      return;
    case "assessment":
      renderAssessment(input.data, { ...renderOpts, includeAnswers: input.includeAnswers });
      return;
  }
}
