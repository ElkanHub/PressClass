import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase client
// Note: We use the SERVICE_ROLE_KEY to assume unrestricted access for the server-side logic
// But for security, ensure this is only used in safe server contexts.
// Actually, for a public landing page bot, using a service role to query our specific embeddings is fine
// as long as we hardcode the namespace filter.
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const currentMessage = messages[messages.length - 1].content;

        if (!currentMessage) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Generate Embedding for the query
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: currentMessage.replace(/\n/g, ' '),
        });
        const embedding = embeddingResponse.data[0].embedding;

        // 2. Query Supabase for relevant documents
        const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.3, // Adjust based on testing
            match_count: 5,
            filter_namespace: 'pressclass_landing_bot',
        });

        if (searchError) {
            console.error('Supabase search error:', searchError);
            return NextResponse.json({ error: 'Search failed' }, { status: 500 });
        }

        // 3. Construct Context
        let contextText = '';
        if (documents && documents.length > 0) {
            contextText = documents.map((doc: any) => doc.content).join('\n---\n');
        } else {
            // Fallback if no documents found (handled by prompt instructions)
            // contextText = "No specific documentation found for this query.";
        }

        // 4. System Prompt
        const systemPrompt = `
You are a senior AI engineer building a Retrieval-Augmented Generation (RAG) chatbot for the PressClass landing page.
Your role is to help visitors understand what PressClass is, how it works, and why it matters.

CORE OBJECTIVE:
- Answer questions ONLY about PressClass.
- Use the provided CONTEXT from official documentation as the SINGLE SOURCE OF TRUTH.
- Never pull from external knowledge or prioritize training data over the context.
- If the answer is not in the context, say: "I don't have that information yet, but I can explain what PressClass currently offers."

BEHAVIOR:
- Be concise, confident, and helpful.
- Tone: Professional but friendly, clear and persuasive. No hype, no fluff.
- No markdown dumps. Use markdown for structure (lists, bold) but avoid code blocks unless necessary for technical examples.
- No mention of embeddings, vectors, or databases.
- If the question is unrelated to PressClass, politely redirect.

CONTEXT:
${contextText}
    `;

        // 5. Call Groq
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: 'openai/gpt-oss-120b',
            temperature: 0.5,
            max_tokens: 1024,
            stream: true,
        });

        // 6. Stream Response
        // We need to convert Groq stream to a ReadableStream for Next.js
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
