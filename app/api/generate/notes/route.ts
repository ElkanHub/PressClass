//api/generate/notes/route.ts
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
      strand,
      subStrand,
      date,
      weekTerm,
      duration,
    } = body;

    const prompt = `
      Create detailed curriculum-aligned lesson notes:

      - School: ${schoolName || "N/A"}
      - Class: ${classLevel}
      - Subject: ${subject}
      - Strand: ${strand}
      - Sub-strand: ${subStrand}
      - Date: ${date}
      - Week/Term: ${weekTerm}
      - Duration: ${duration}

      Return ONLY valid JSON:
      {
        "administrativeDetails": {},
        "topic": "",
        "lessonSummary": "",
        "keyPoints": [],
        "examples": [],
        "activity": "",
        "resources": []
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
    console.error("Notes generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate notes" },
      { status: 500 }
    );
  }
}
