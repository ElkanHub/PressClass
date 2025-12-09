// lib/AI_API_Switch.ts
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type AIProvider = "groq" | "gemini";

export const ACTIVE_PROVIDER: AIProvider = "groq";
// Change to "gemini" anytime you want

export function getAIClient() {
    if (ACTIVE_PROVIDER === "groq") {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) throw new Error("Missing GROQ_API_KEY");

        const client = new OpenAI({
            apiKey,
            baseURL: "https://api.groq.com/openai/v1",
        });

        return {
            provider: "groq" as const,
            client,
            model: "openai/gpt-oss-120b",
            send: async (prompt: string): Promise<string> => {
                const completion = await client.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "openai/gpt-oss-120b",
                    temperature: 0.5,
                });

                const content = completion.choices[0]?.message?.content;
                if (!content) {
                    throw new Error("No content generated from GROQ API");
                }
                return content;
            }
        };
    }

    // GEMINI CLIENT
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    return {
        provider: "gemini" as const,
        client: model,
        model: "gemini-2.5-flash-lite",
        send: async (prompt: string): Promise<string> => {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            if (!text) {
                throw new Error("No content generated from Gemini API");
            }
            return text;
        }
    };
}
