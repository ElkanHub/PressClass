//api/generate/lesson-plan/route.ts
//depending on the AI_API_Switch.ts file, it will use the active provider
import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/AI_API_Switch";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      schoolName,
      classLevel,
      subject,
      topic,
      subTopic,
      date,
      weekTerm,
      duration,
    } = body;

    // const prompt = `
    //   Create a detailed lesson plan (WAEC/GES curriculum):
    //   - School: ${schoolName}
    //   - Class: ${classLevel}
    //   - Subject: ${subject}
    //   - Topic: ${topic}
    //   - Sub-topic: ${subTopic}
    //   - Date: ${date}
    //   - Week/Term: ${weekTerm}
    //   - Duration: ${duration}

    //   IMPORTANT FORMATTING INSTRUCTIONS:
    //   - For text fields (rpk, starter, development, reflection), use \\n for line breaks between sentences or points
    //   - Use \\n\\n for paragraph breaks
    //   - Write in clear, well-structured paragraphs
    //   - Each stage should have multiple paragraphs with proper spacing

    //   Return ONLY valid JSON:
    //   {
    //     "objectives": ["objective 1", "objective 2", ...],
    //     "rpk": "Previous knowledge text with proper\\n\\nline breaks between paragraphs",
    //     "materials": ["material 1", "material 2", ...],
    //     "stages": {
    //       "starter": "Introduction text with\\n\\nproper paragraph breaks",
    //       "development": "Main lesson content with\\n\\nmultiple paragraphs\\n\\nand clear structure",
    //       "reflection": "Reflection text with\\n\\nproper formatting"
    //     },
    //     "corePoints": ["point 1", "point 2", ...],
    //     "evaluation": ["question 1", "question 2", ...]
    //   }
    // `;
    const prompt = `
Create a detailed, classroom-ready lesson plan strictly aligned to the WAEC / Ghana Education Service (GES) curriculum.

LESSON DETAILS:
- School: ${schoolName}
- Class: ${classLevel}
- Subject: ${subject}
- Topic: ${topic}
- Sub-topic: ${subTopic}
- Date: ${date}
- Week/Term: ${weekTerm}
- Total Duration: ${duration}

PEDAGOGICAL REQUIREMENTS:
- Objectives must be clear, measurable, and observable (e.g., identify, explain, describe, solve).
- Lesson flow must follow accepted GES standards and be suitable for supervision and inspection.
- Content must be age-appropriate for the stated class level.
- Evaluation questions must directly assess the stated objectives.
- Teaching approach must be inclusive and learner-centred.

FORMATTING RULES (MANDATORY):
- For all narrative text fields (rpk, starter, development, reflection), use \\n for line breaks between points or sentences.
- Use \\n\\n strictly for paragraph separation.
- Each narrative field must contain at least TWO well-developed paragraphs.
- Do NOT use bullet symbols, numbering, markdown, or special characters.
- Write in clear, formal, professional teaching language.

STRUCTURE OF LESSON STAGES:
For EACH stage (starter, development, reflection):
- Clearly distinguish teacher activities and learner activities within the text.
- Ensure logical lesson flow and smooth transitions.
- Align content with the total lesson duration.

JSON OUTPUT RULES (STRICT):
- Return ONLY valid JSON.
- Use double quotes for all keys and string values.
- Do NOT include trailing commas, comments, or explanatory text.
- Validate internally that the JSON is syntactically correct before outputting.

Return the lesson plan using EXACTLY the structure below:

{
  "objectives": [
    "Objective 1",
    "Objective 2",
    "Objective 3"
  ],
  "rpk": "Relevant Previous Knowledge written in paragraphs with proper\\n\\nspacing",
  "materials": [
    "Teaching material 1",
    "Teaching material 2",
    "Teaching material 3"
  ],
  "stages": {
    "starter": "Teacher activity text followed by learner activity text, written in multiple paragraphs with\\n\\nproper formatting",
    "development": "Detailed lesson content showing teacher-led instruction and learner participation, written in multiple structured paragraphs with\\n\\nclear flow",
    "reflection": "Lesson closure, learner feedback, and recap written in well-structured paragraphs with\\n\\nproper spacing"
  },
  "corePoints": [
    "Key learning point 1",
    "Key learning point 2",
    "Key learning point 3"
  ],
  "evaluation": [
    "Evaluation question 1",
    "Evaluation question 2",
    "Evaluation question 3"
  ]
}
`;

    const ai = getAIClient();
    const content = await ai.send(prompt);

    let jsonResponse;

    try {
      jsonResponse = JSON.parse(content);
    } catch (e) {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid JSON");
      jsonResponse = JSON.parse(match[0]);
    }

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Lesson plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson plan" },
      { status: 500 }
    );
  }
}
