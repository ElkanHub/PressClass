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
        const { strand, subStrand, classLevel, questionType, quantity, subject, difficulty, difficultyConfig } = body;

        let difficultyInstructions = "";
        if (difficulty === "mixed" && difficultyConfig) {
            const easyCount = Math.round((difficultyConfig.easy / 100) * quantity);
            const normalCount = Math.round((difficultyConfig.normal / 100) * quantity);
            // Ensure total matches quantity by assigning remainder to hard
            const hardCount = quantity - easyCount - normalCount;

            difficultyInstructions = `
            - Difficulty Distribution:
              - Easy: ${easyCount} questions
              - Normal: ${normalCount} questions
              - Hard: ${hardCount} questions
            `;
        } else {
            difficultyInstructions = `- Difficulty: ${difficulty}`;
        }

        const prompt = `
      You are an expert teacher and assessment creator for the Ghanaian curriculum (WAEC/GES standards).
      Create a classroom assessment for:
      - Subject: ${subject}
      - Strand/Topic: ${strand}
      - Sub-strand: ${subStrand}
      - Class Level: ${classLevel}
      - Question Type: ${questionType}
      - Quantity: ${quantity} questions total
      ${difficultyInstructions}

      Requirements:
      1. Questions must be age-appropriate and strictly follow the curriculum for ${classLevel}.
      2. If "objective" or "mixed", provide 4 options (A, B, C, D) and indicate the correct answer.
      3. If "subjective" or "mixed", provide clear questions.
      4. Return the output ONLY as a valid JSON object with the following structure:
      {
        "title": "Assessment Title",
        "classLevel": "${classLevel}",
        "topic": "${strand} - ${subStrand}",
        "questions": [
          {
            "id": 1,
            "type": "objective" | "subjective",
            "question": "Question text here",
            "options": ["A", "B", "C", "D"], // Only for objective
            "answer": "Correct answer or key point"
          }
        ]
      }
      Do not include any markdown formatting (like \`\`\`json), just the raw JSON string.
    `;

        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "openai/gpt-oss-20b", // Using a strong model for better reasoning
            temperature: 0.5,
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content generated");
        }

        // Attempt to parse JSON (sometimes models add extra text)
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(content);
        } catch (e) {
            // Fallback: try to extract JSON from code blocks if present
            const match = content.match(/\{[\s\S]*\}/);
            if (match) {
                jsonResponse = JSON.parse(match[0]);
            } else {
                throw new Error("Failed to parse generated content");
            }
        }

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate assessment" },
            { status: 500 }
        );
    }
}
