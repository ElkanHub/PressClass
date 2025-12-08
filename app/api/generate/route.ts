//api/generate/route.ts
//depending on the AI_API_Switch.ts file, it will use the active provider
import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/AI_API_Switch";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type = "assessment", ...params } = body;

    let prompt = "";

    if (type === "notes") {
      const { subject, strand, subStrand, classLevel, duration, weekTerm } = params;

      prompt = `
        You are an expert teacher for the Ghanaian curriculum (WAEC/GES standards).
        Create detailed, structured lesson notes for:
        - Subject: ${subject}
        - Strand: ${strand}
        - Sub-Strand: ${subStrand}
        - Class Level: ${classLevel}
        - Duration: ${duration}
        - Week/Term: ${weekTerm}

        Return ONLY valid JSON:
        {
            "summary": "",
            "keyPoints": [],
            "examples": [],
            "questions": [],
            "resources": []
        }
      `;
    } else {
      const {
        strand,
        subStrand,
        classLevel,
        questionType,
        quantity,
        subject,
        difficulty,
        difficultyConfig
      } = params;

      let difficultyInstructions = "";

      if (difficulty === "mixed" && difficultyConfig) {
        const easy = Math.round((difficultyConfig.easy / 100) * quantity);
        const normal = Math.round((difficultyConfig.normal / 100) * quantity);
        const hard = quantity - easy - normal;

        difficultyInstructions = `
          - Difficulty Distribution:
            - Easy: ${easy}
            - Normal: ${normal}
            - Hard: ${hard}
        `;
      } else {
        difficultyInstructions = `- Difficulty: ${difficulty}`;
      }

      prompt = `
        You are an expert teacher and assessment creator for the Ghanaian curriculum.
        Create an assessment for:
        - Subject: ${subject}
        - Strand: ${strand}
        - Sub-strand: ${subStrand}
        - Class Level: ${classLevel}
        - Question Type: ${questionType}
        - Quantity: ${quantity}
        ${difficultyInstructions}

        Return ONLY valid JSON:
        {
          "title": "",
          "classLevel": "${classLevel}",
          "topic": "${strand} - ${subStrand}",
          "questions": []
        }
      `;
    }

    const ai = getAIClient();
    const content = await ai.send(prompt);

    let jsonResponse;

    try {
      jsonResponse = JSON.parse(content);
    } catch (e) {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Failed to parse AI output");
      jsonResponse = JSON.parse(match[0]);
    }

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
