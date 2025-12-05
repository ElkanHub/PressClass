import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GROQ_API_KEY is missing in environment variables" },
                { status: 500 }
            );
        }

        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://api.groq.com/openai/v1",
        });

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
      You are an expert teacher and curriculum specialist.
      Create detailed, curriculum-aligned notes for:
      - School: ${schoolName || "N/A"}
      - Class: ${classLevel}
      - Subject: ${subject}
      - Strand (Main Topic): ${strand}
      - Sub-Strand (Subtopic): ${subStrand}
      - Date: ${date}
      - Week/Term: ${weekTerm}
      - Duration: ${duration}

      Requirements:
      1. The notes must be structured, clear, and age-appropriate.
      2. Return the output ONLY as a valid JSON object with the following structure:
      {
        "administrativeDetails": {
            "school": "${schoolName || "N/A"}",
            "class": "${classLevel}",
            "subject": "${subject}",
            "date": "${date}",
            "duration": "${duration}",
            "weekTerm": "${weekTerm}"
        },
        "topic": "${strand} - ${subStrand}",
        "lessonSummary": "Clear explanation of the topic in a student-friendly structure. Follow logical flow (definitions -> examples -> explanations -> diagrams if needed).",
        "keyPoints": ["List of most important ideas students must remember"],
        "examples": ["Practical examples, solved problems, short scenarios, or illustrations"],
        "activity": "A short formative task (MCQs, true/false, fill-in-the-blanks, or short reasoning questions) to help students review.",
        "resources": ["List of websites and youtube videos for further learning"]
      }
      Do not include any markdown formatting (like \`\`\`json), just the raw JSON string.
    `;

        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "openai/gpt-oss-120b", // Using the same model as other generators
            temperature: 0.5,
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content generated");
        }

        // Attempt to parse JSON
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(content);
        } catch (e) {
            const match = content.match(/\{[\s\S]*\}/);
            if (match) {
                jsonResponse = JSON.parse(match[0]);
            } else {
                throw new Error("Failed to parse generated content");
            }
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
