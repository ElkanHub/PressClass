import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
// LangChain import removed as it was unused and caused module not found errors.
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OPENAI_API_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const DOCS_DIR = path.join(process.cwd(), 'DOCS', 'PRESSCLASS');
const BOT_NAMESPACE = 'pressclass_landing_bot';

// Chunking configuration
const CHUNK_SIZE = 800; // Estimated tokens (approx using characters) -> 1 token ~ 4 chars
const CHUNK_OVERLAP = 100;

// Helper to calculate cosine similarity (not needed for ingestion but good for reference)
// Ingestion only needs storage.

async function getEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' '),
    });
    return response.data[0].embedding;
}

// Simple text splitter if langchain is not available, but user requirements are specific.
// We will try to rely on a custom simple splitter to avoid install dependency issues if `langchain` isn't there.
// But wait, the prompt "Chunking rules" implies sophisticated chunking.
// Let's implement a robust Markdown-aware splitter.

function splitTextByHeaders(text: string): { content: string; header: string }[] {
    const lines = text.split('\n');
    const chunks: { content: string; header: string }[] = [];
    let currentChunk: string[] = [];
    let currentHeader = 'Introduction'; // Default header

    for (const line of lines) {
        if (line.startsWith('#')) {
            if (currentChunk.length > 0) {
                chunks.push({ content: currentChunk.join('\n'), header: currentHeader });
                currentChunk = [];
            }
            currentHeader = line.replace(/#+\s*/, '').trim();
        }
        currentChunk.push(line);
    }
    if (currentChunk.length > 0) {
        chunks.push({ content: currentChunk.join('\n'), header: currentHeader });
    }
    return chunks;
}

// Simple recursive character splitter approximate
function chunkString(str: string, size: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < str.length) {
        let end = start + size;
        // Try to break at a newline or space
        if (end < str.length) {
            const lastNewLine = str.lastIndexOf('\n', end);
            const lastSpace = str.lastIndexOf(' ', end);
            if (lastNewLine > start + size / 2) {
                end = lastNewLine;
            } else if (lastSpace > start + size / 2) {
                end = lastSpace;
            }
        }
        chunks.push(str.slice(start, end));
        start = end - overlap;
        // Avoid infinite loop if overlap >= size (shouldn't happen with correct config)
        if (start >= end) start = end;
    }
    return chunks;
}


async function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);

    console.log(`Processing: ${filename}`);

    // 1. Split by headers first to preserve structure
    const sections = splitTextByHeaders(content);

    for (const section of sections) {
        // 2. Chunk larger sections
        // 1 token approx 4 chars. 800 tokens ~= 3200 chars.
        const charLimit = CHUNK_SIZE * 4;
        const charOverlap = CHUNK_OVERLAP * 4;

        const subChunks = chunkString(section.content, charLimit, charOverlap);

        for (const chunkContent of subChunks) {
            if (chunkContent.trim().length < 20) continue; // Skip empty/tiny chunks

            const embedding = await getEmbedding(chunkContent);

            const { error } = await supabase.from('documents_embeddings').insert({
                bot_namespace: BOT_NAMESPACE,
                source_path: filePath.replace(process.cwd(), ''), // Relative path
                content: chunkContent,
                embedding,
                metadata: {
                    title: filename,
                    header: section.header,
                    last_updated: stats.mtime.toISOString(),
                },
            });

            if (error) {
                console.error(`Error inserting chunk from ${filename}:`, error);
            }
        }
    }
}

async function main() {
    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`Directory not found: ${DOCS_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));

    console.log(`Found ${files.length} markdown files.`);

    for (const file of files) {
        await processFile(path.join(DOCS_DIR, file));
    }

    console.log('Ingestion complete.');
}

main().catch(console.error);
