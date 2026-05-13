// scripts/verify-schema.mjs — quick post-migration sanity check.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv(path) {
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}
loadEnv(resolve(".env.local"));

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.NEXT_PUBLIC_SUPABASE_ID;
const endpoint = `https://api.supabase.com/v1/projects/${ref}/database/query`;

async function q(sql) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

const tables = await q(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name;
`);
console.log("Tables in public schema:");
for (const row of tables) console.log("  -", row.table_name);

const fns = await q(`
  SELECT routine_name FROM information_schema.routines
  WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
  ORDER BY routine_name;
`);
console.log("\nFunctions in public schema:");
for (const row of fns) console.log("  -", row.routine_name);

const pkgs = await q(`SELECT code, name, credits, bonus_credits FROM credit_packages ORDER BY sort_order;`);
console.log("\nSeeded credit packages:");
console.table(pkgs);

const costs = await q(`SELECT generation_type, cost FROM generation_costs;`);
console.log("\nSeeded generation costs:");
console.table(costs);

const prices = await q(`
  SELECT cp.code, cpp.currency, cpp.amount_minor
  FROM credit_package_prices cpp
  JOIN credit_packages cp ON cp.id = cpp.package_id
  ORDER BY cp.sort_order, cpp.currency;
`);
console.log("\nSeeded prices (first 8):");
console.table(prices.slice(0, 8));
console.log(`(${prices.length} total)`);
