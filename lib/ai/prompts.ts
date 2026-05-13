// lib/ai/prompts.ts — all generation prompts live here. One place to tune.

import type { GenerationType } from "@/lib/credits";

export interface NotesParams {
  schoolName?: string;
  classLevel: string;
  subject: string;
  strand: string;
  subStrand: string;
  date?: string;
  weekTerm?: string;
  duration?: string;
}

export interface LessonPlanParams {
  schoolName?: string;
  classLevel: string;
  subject: string;
  topic: string;
  subTopic: string;
  date?: string;
  weekTerm?: string;
  duration?: string;
}

export interface AssessmentParams {
  subject: string;
  strand: string;
  subStrand: string;
  classLevel: string;
  questionType: string;
  quantity: number;
  difficulty: "easy" | "normal" | "hard" | "mixed";
  difficultyConfig?: { easy: number; normal: number; hard: number };
}

export type GenerationParamsMap = {
  notes: NotesParams;
  lesson_plan: LessonPlanParams;
  assessment: AssessmentParams;
};

const CURRICULUM_PRELUDE =
  "You are an expert teacher familiar with African curricula (WAEC/GES standards, with awareness of regional variations across Ghana, Nigeria, Kenya, and other African countries).";

export function buildPrompt<T extends GenerationType>(
  type: T,
  params: GenerationParamsMap[T]
): string {
  switch (type) {
    case "notes":
      return notesPrompt(params as NotesParams);
    case "lesson_plan":
      return lessonPlanPrompt(params as LessonPlanParams);
    case "assessment":
      return assessmentPrompt(params as AssessmentParams);
  }
}

function notesPrompt(p: NotesParams): string {
  return `${CURRICULUM_PRELUDE}
Create detailed curriculum-aligned personal lesson notes for student personal study.

- School: ${p.schoolName || "N/A"}
- Class: ${p.classLevel}
- Subject: ${p.subject}
- Strand: ${p.strand}
- Sub-strand: ${p.subStrand}
- Date: ${p.date || "N/A"}
- Week/Term: ${p.weekTerm || "N/A"}
- Duration: ${p.duration || "N/A"}

Return ONLY valid JSON with this EXACT structure:
{
  "administrativeDetails": {
    "school": "${p.schoolName || "N/A"}",
    "class": "${p.classLevel}",
    "subject": "${p.subject}",
    "date": "${p.date || ""}",
    "duration": "${p.duration || ""}",
    "weekTerm": "${p.weekTerm || ""}"
  },
  "topic": "Main topic title here",
  "lessonSummary": "Three-paragraph comprehensive explanation",
  "keyPoints": ["...", "..."],
  "examples": ["...", "..."],
  "activity": "Student activity description",
  "resources": ["...", "..."]
}

REQUIREMENTS:
- lessonSummary: 3 paragraphs, this is the student's primary reference.
- keyPoints: 3-5+ important points.
- resources: external learning links where useful.`;
}

function lessonPlanPrompt(p: LessonPlanParams): string {
  return `${CURRICULUM_PRELUDE}
Create a detailed lesson plan.

- School: ${p.schoolName || "N/A"}
- Class: ${p.classLevel}
- Subject: ${p.subject}
- Topic: ${p.topic}
- Sub-topic: ${p.subTopic}
- Date: ${p.date || "N/A"}
- Week/Term: ${p.weekTerm || "N/A"}
- Duration: ${p.duration || "N/A"}

FORMATTING:
- Use \\n for line breaks, \\n\\n for paragraph breaks.
- Write multiple well-structured paragraphs per stage.

Return ONLY valid JSON:
{
  "objectives": ["...", "..."],
  "rpk": "Previous knowledge text with\\n\\nparagraph breaks",
  "materials": ["...", "..."],
  "stages": {
    "starter": "Introduction with\\n\\nparagraph breaks",
    "development": "Main lesson\\n\\nmultiple paragraphs",
    "reflection": "Reflection with\\n\\nproper formatting"
  },
  "corePoints": ["...", "..."],
  "evaluation": ["...", "..."]
}`;
}

function assessmentPrompt(p: AssessmentParams): string {
  let difficultyInstructions: string;
  if (p.difficulty === "mixed" && p.difficultyConfig) {
    const easy = Math.round((p.difficultyConfig.easy / 100) * p.quantity);
    const normal = Math.round((p.difficultyConfig.normal / 100) * p.quantity);
    const hard = p.quantity - easy - normal;
    difficultyInstructions = `- Difficulty Distribution: Easy ${easy}, Normal ${normal}, Hard ${hard}`;
  } else {
    difficultyInstructions = `- Difficulty: ${p.difficulty}`;
  }

  return `${CURRICULUM_PRELUDE}
Create an assessment for:
- Subject: ${p.subject}
- Strand: ${p.strand}
- Sub-strand: ${p.subStrand}
- Class Level: ${p.classLevel}
- Question Type: ${p.questionType}
- Quantity: ${p.quantity}
${difficultyInstructions}

Return ONLY valid JSON with this EXACT structure:
{
  "title": "Assessment title",
  "classLevel": "${p.classLevel}",
  "topic": "${p.strand} - ${p.subStrand}",
  "questions": [
    { "id": 1, "type": "objective", "question": "...", "options": ["A","B","C","D"], "answer": "..." },
    { "id": 2, "type": "subjective", "question": "...", "answer": "Expected answer / marking scheme" }
  ]
}

REQUIREMENTS:
- Each question MUST have a unique numeric "id" starting from 1.
- "type" must be "objective" or "subjective".
- Objective questions MUST include an "options" array of 4 choices.
- Every question MUST have an "answer".
- Generate exactly ${p.quantity} questions.`;
}
