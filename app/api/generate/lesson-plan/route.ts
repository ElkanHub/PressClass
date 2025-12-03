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
            topic,
            subTopic,
            date,
            weekTerm,
            duration,
        } = body;

        const prompt = `
      You are an expert teacher and lesson plan creator for the Ghanaian curriculum (WAEC/GES standards).
      Create a detailed lesson plan for:
      - School: ${schoolName || "N/A"}
      - Class: ${classLevel}
      - Subject: ${subject}
      - Topic: ${topic}
      - Sub-topic: ${subTopic}
      - Date: ${date}
      - Week/Term: ${weekTerm}
      - Duration: ${duration}

      Requirements:
      1. The lesson plan must be structured, detailed, and age-appropriate.
      2. Return the output ONLY as a valid JSON object with the following structure:
      {
        "objectives": ["List of measurable learning outcomes"],
        "rpk": "Relevant Previous Knowledge / Pre-requisites",
        "materials": ["List of teaching/learning materials"],
        "stages": {
            "starter": "Description of introduction/warm-up activities",
            "development": "Detailed description of the main teaching phase",
            "reflection": "Description of consolidation/practice activities"
        },
        "corePoints": ["List of essential ideas/facts"],
        "evaluation": ["List of assessment tasks/exercises"]
      }
      Do not include any markdown formatting (like \`\`\`json), just the raw JSON string.
    `;

        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "openai/gpt-oss-120b",
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
        console.error("Lesson plan generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate lesson plan" },
            { status: 500 }
        );
    }
}
