// scripts/run-migrations.mjs
// Apply SQL files in supabase/migrations/ via Supabase Management API.
// Requires SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_ID in .env.local.

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv(path) {
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

loadEnv(resolve(".env.local"));

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.NEXT_PUBLIC_SUPABASE_ID;
if (!token) throw new Error("Missing SUPABASE_ACCESS_TOKEN in .env.local");
if (!ref) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ID in .env.local");

const endpoint = `https://api.supabase.com/v1/projects/${ref}/database/query`;

async function runSql(label, sql) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`[${label}] HTTP ${res.status}: ${text}`);
  }
  return text;
}

console.log(`Project ref: ${ref}`);
console.log(`Endpoint:    ${endpoint}\n`);

// 1. Smoke test
console.log("→ smoke test: SELECT version();");
const ver = await runSql("ping", "SELECT version();");
console.log(`  ${ver.slice(0, 120)}\n`);

// 2. Discover migrations
const dir = resolve("supabase/migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

console.log(`Found ${files.length} migration file(s):`);
for (const f of files) console.log(`  - ${f}`);
console.log();

// 3. Apply in order
for (const file of files) {
  const path = resolve(dir, file);
  const sql = readFileSync(path, "utf8");
  process.stdout.write(`→ applying ${file} ... `);
  try {
    await runSql(file, sql);
    console.log("OK");
  } catch (err) {
    console.log("FAIL");
    console.error(`\n${err.message}\n`);
    process.exit(1);
  }
}

console.log("\nAll migrations applied successfully ✓");
