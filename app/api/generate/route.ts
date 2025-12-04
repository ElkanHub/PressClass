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
        const { type = "assessment", ...params } = body;

        let prompt = "";

        if (type === "notes") {
            const { subject, strand, subStrand, classLevel, duration, weekTerm } = params;
            prompt = `
            You are an expert teacher for the Ghanaian curriculum (WAEC/GES standards).
            Create detailed, structured lesson notes for:
            - Subject: ${subject}
            - Strand (Main Topic): ${strand}
            - Sub-Strand (Subtopic): ${subStrand}
            - Class Level: ${classLevel}
            - Duration: ${duration}
            - Week/Term: ${weekTerm}

            Requirements:
            1. Content must be age-appropriate and strictly follow the curriculum for ${classLevel}.
            2. The tone should be educational, clear, and engaging for students.
            3. Return the output ONLY as a valid JSON object with the following structure:
            {
                "summary": "Clear explanation of the topic in a student-friendly structure (definitions -> examples -> explanations)",
                "keyPoints": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
                "examples": ["Practical example 1", "Solved problem or scenario"],
                "questions": ["Short activity or quick check question 1", "Question 2"],
                "resources": ["Website URL or description", "YouTube video title/link"]
            }
            Do not include any markdown formatting (like \`\`\`json), just the raw JSON string.
            `;
        } else {
            // Default to assessment generation
            const { strand, subStrand, classLevel, questionType, quantity, subject, difficulty, difficultyConfig } = params;

            let difficultyInstructions = "";
            if (difficulty === "mixed" && difficultyConfig) {
                const easyCount = Math.round((difficultyConfig.easy / 100) * quantity);
                const normalCount = Math.round((difficultyConfig.normal / 100) * quantity);
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

            prompt = `
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
        }

        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile", // Using a strong model for better reasoning
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
            { error: "Failed to generate content" },
            { status: 500 }
        );
    }
}
