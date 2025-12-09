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

    const prompt = `
      Create a detailed lesson plan (WAEC/GES curriculum):
      - School: ${schoolName}
      - Class: ${classLevel}
      - Subject: ${subject}
      - Topic: ${topic}
      - Sub-topic: ${subTopic}
      - Date: ${date}
      - Week/Term: ${weekTerm}
      - Duration: ${duration}

      IMPORTANT FORMATTING INSTRUCTIONS:
      - For text fields (rpk, starter, development, reflection), use \\n for line breaks between sentences or points
      - Use \\n\\n for paragraph breaks
      - Write in clear, well-structured paragraphs
      - Each stage should have multiple paragraphs with proper spacing

      Return ONLY valid JSON:
      {
        "objectives": ["objective 1", "objective 2", ...],
        "rpk": "Previous knowledge text with proper\\n\\nline breaks between paragraphs",
        "materials": ["material 1", "material 2", ...],
        "stages": {
          "starter": "Introduction text with\\n\\nproper paragraph breaks",
          "development": "Main lesson content with\\n\\nmultiple paragraphs\\n\\nand clear structure",
          "reflection": "Reflection text with\\n\\nproper formatting"
        },
        "corePoints": ["point 1", "point 2", ...],
        "evaluation": ["question 1", "question 2", ...]
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
