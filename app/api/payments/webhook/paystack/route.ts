import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { grantCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const bodyText = await req.text();
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY is not defined in environment");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(bodyText)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);

    // Paystack sends 'charge.success' when a payment succeeds
    if (payload.event === "charge.success") {
      const data = payload.data;
      const email = data.customer?.email;
      const amountMinor = data.amount; // minor units (e.g. 50000 kobo = 500 NGN)
      const currency = data.currency; // e.g. "NGN", "GHS", "KES", "USD"
      const reference = data.reference;

      if (!email || !amountMinor || !currency || !reference) {
        return NextResponse.json({ error: "Incomplete payload data" }, { status: 400 });
      }

      const supabase = createAdminClient();

      // 1. Find user by email (case-insensitive)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .ilike("email", email)
        .maybeSingle();

      if (profileError || !profile) {
        console.error(`User with email ${email} not found:`, profileError);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
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
        console.error(`No pricing package matches amount ${amountMinor} ${currency}:`, priceError);
        return NextResponse.json({ error: "Package price not found" }, { status: 404 });
      }

      const pkgObj = priceData.credit_packages;
      const pkgData = Array.isArray(pkgObj) ? pkgObj[0] : pkgObj;
      if (!pkgData) {
        console.error("Package definition not found for package_id:", priceData.package_id);
        return NextResponse.json({ error: "Package definition not found" }, { status: 404 });
      }

      const amountToGrant = pkgData.credits + pkgData.bonus_credits;

      // 3. Record payment in DB (upsert is idempotent on provider, provider_ref)
      const { error: paymentError } = await supabase
        .from("payments")
        .upsert({
          user_id: profile.id,
          package_id: pkgData.id,
          provider: "paystack",
          provider_ref: reference,
          currency: currency.toUpperCase(),
          amount_minor: amountMinor,
          credits_granted: amountToGrant,
          status: "success",
          metadata: {
            gateway_response: data.gateway_response,
            channel: data.channel,
            ip_address: data.ip_address,
            paid_at: data.paid_at,
          }
        }, { onConflict: "provider,provider_ref" });

      if (paymentError) {
        console.error("Failed to record payment in DB:", paymentError);
        // We still proceed to grant credits, since they have successfully paid.
      }

      // 4. Grant credits (idempotent at DB level via grant_credits function reference check)
      const newBalance = await grantCredits(
        profile.id,
        amountToGrant,
        "purchase",
        reference,
        {
          provider: "paystack",
          amount_minor: amountMinor,
          currency: currency,
          package_code: pkgData.code,
        }
      );

      console.log(`Successfully granted ${amountToGrant} credits to user ${profile.id} for reference ${reference}. New balance: ${newBalance}`);
      return NextResponse.json({ success: true, newBalance });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
