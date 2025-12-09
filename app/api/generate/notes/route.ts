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
      Create detailed curriculum-aligned lesson notes for students personal study:

      - School: ${schoolName || "N/A"}
      - Class: ${classLevel}
      - Subject: ${subject}
      - Strand: ${strand}
      - Sub-strand: ${subStrand}
      - Date: ${date}
      - Week/Term: ${weekTerm}
      - Duration: ${duration}

      Return ONLY valid JSON with this EXACT structure:
      {
        "administrativeDetails": {
          "school": "${schoolName || "N/A"}",
          "class": "${classLevel}",
          "subject": "${subject}",
          "date": "${date}",
          "duration": "${duration}",
          "weekTerm": "${weekTerm}"
        },
        "topic": "Main topic title here",
        "lessonSummary": "Comprehensive lesson summary here",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
        "examples": ["Example 1", "Example 2"],
        "activity": "Student activity description here",
        "resources": ["Resource 1", "Resource 2"]
      }

      IMPORTANT:
      - administrativeDetails must contain all fields: school, class, subject, date, duration, weekTerm
      - topic should be a clear, concise title for the lesson
      - lessonSummary should be a detailed paragraph explaining the lesson
      - keyPoints should be an array of 3-5 important points
      - examples should be an array of practical examples
      - activity should describe a learning activity for students
      - resources should be an array of helpful learning resources
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
