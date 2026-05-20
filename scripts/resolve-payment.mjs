// scripts/resolve-payment.mjs — manually verify a Paystack reference and grant credits.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load environment variables from .env.local
function loadEnv(path) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = val;
    }
  } catch (err) {
    console.warn(`Could not load env from ${path}:`, err.message);
  }
}
loadEnv(resolve(".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!paystackSecret) {
  console.error("Error: Missing PAYSTACK_SECRET_KEY in .env.local");
  process.exit(1);
}

const ref = process.argv[2];
if (!ref) {
  console.error("Usage: node scripts/resolve-payment.mjs <transaction_reference>");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function verifyAndGrant() {
  console.log(`[Paystack] Verifying transaction reference: ${ref}...`);

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, {
    headers: {
      Authorization: `Bearer ${paystackSecret}`,
    },
  });

  if (!response.ok) {
    console.error(`Error: Paystack API verification failed: ${response.status} ${await response.text()}`);
    process.exit(1);
  }

  const result = await response.json();
  if (!result.status || result.data.status !== "success") {
    console.error(`Error: Transaction verification returned status: "${result.data?.status || 'failed'}"`);
    process.exit(1);
  }

  const data = result.data;
  const email = data.customer?.email;
  const amountMinor = data.amount;
  const currency = data.currency;

  console.log(`[Paystack] Confirmed payment of ${(amountMinor / 100).toFixed(2)} ${currency} by user email: ${email}`);

  // 1. Find user by email
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (profileError || !profile) {
    console.error(`Error: User with email "${email}" not found in profiles:`, profileError?.message || "Not found");
    process.exit(1);
  }

  // 2. Find package by price and currency
  const { data: priceData, error: priceError } = await supabase
    .from("credit_package_prices")
    .select(`
      amount_minor,
      package_id,
      credit_packages (
        id,
        code,
        name,
        credits,
        bonus_credits
      )
    `)
    .eq("currency", currency.toUpperCase())
    .eq("amount_minor", amountMinor)
    .maybeSingle();

  if (priceError || !priceData) {
    console.error(`Error: No pricing package found matching amount ${amountMinor} and currency ${currency}:`, priceError?.message || "Not found");
    process.exit(1);
  }

  const pkgObj = priceData.credit_packages;
  const pkgData = Array.isArray(pkgObj) ? pkgObj[0] : pkgObj;
  if (!pkgData) {
    console.error("Error: Package details not found for package_id:", priceData.package_id);
    process.exit(1);
  }

  const amountToGrant = pkgData.credits + pkgData.bonus_credits;
  console.log(`[App] Found package: "${pkgData.name}" (${pkgData.code}). Total credits to award: ${amountToGrant}`);

  // 3. Record payment in database
  console.log("[DB] Logging payment record...");
  const { error: paymentError } = await supabase
    .from("payments")
    .upsert({
      user_id: profile.id,
      package_id: pkgData.id,
      provider: "paystack",
      provider_ref: ref,
      currency: currency.toUpperCase(),
      amount_minor: amountMinor,
      credits_granted: amountToGrant,
      status: "success",
      metadata: {
        gateway_response: data.gateway_response,
        channel: data.channel,
        ip_address: data.ip_address,
        paid_at: data.paid_at,
        resolved_via: "script"
      }
    }, { onConflict: "provider,provider_ref" });

  if (paymentError) {
    console.error("Error: Failed to record payment in DB:", paymentError.message);
    process.exit(1);
  }

  // 4. Grant credits via database RPC
  console.log("[DB] Crediting user account...");
  const { data: newBalance, error: grantError } = await supabase.rpc("grant_credits", {
    p_user_id: profile.id,
    p_amount: amountToGrant,
    p_reason: "purchase",
    p_reference: ref,
    p_metadata: {
      provider: "paystack",
      amount_minor: amountMinor,
      currency: currency,
      package_code: pkgData.code,
      resolved_via: "script"
    }
  });

  if (grantError) {
    console.error("Error: Failed to credit user via Supabase RPC:", grantError.message);
    process.exit(1);
  }

  console.log(`[Success] Credited ${amountToGrant} credits to user ${profile.id}. New balance is: ${newBalance}`);
}

verifyAndGrant().catch(err => {
  console.error("Unhandled execution error:", err);
  process.exit(1);
});
