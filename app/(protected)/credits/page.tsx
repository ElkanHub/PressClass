import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Coins, TrendingUp, History } from "lucide-react";
import CreditPackages from "./packages";
import GoldSheenEffect from "@/components/gold-sheen-effect";

export const dynamic = "force-dynamic";

export default async function CreditsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: balanceRow }, { data: txs }, { data: profile }, { data: packages }] = await Promise.all([
    supabase.from("credit_balances").select("balance, lifetime_earned, lifetime_spent").eq("user_id", user.id).maybeSingle(),
    supabase.from("credit_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("profiles").select("currency, country_code").eq("id", user.id).maybeSingle(),
    supabase.from("credit_packages").select("id, code, name, credits, bonus_credits, credit_package_prices(currency, amount_minor)").eq("is_active", true).order("sort_order"),
  ]);

  const balance = balanceRow?.balance ?? 0;
  const currency = profile?.currency ?? "USD";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Credits</h1>
        <p className="text-muted-foreground">Buy credits, then spend them on AI generations. 1 generation = 3–5 credits.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 relative overflow-hidden">
          <GoldSheenEffect />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-muted-foreground"><Coins className="h-5 w-5" /> Current balance</div>
            <div className="mt-2 text-4xl font-bold">{balance}</div>
          </div>
        </Card>
        <Card className="p-6 relative overflow-hidden">
          <GoldSheenEffect />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-muted-foreground"><TrendingUp className="h-5 w-5" /> Lifetime earned</div>
            <div className="mt-2 text-4xl font-bold">{balanceRow?.lifetime_earned ?? 0}</div>
          </div>
        </Card>
        <Card className="p-6 relative overflow-hidden">
          <GoldSheenEffect />
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-muted-foreground"><History className="h-5 w-5" /> Lifetime spent</div>
            <div className="mt-2 text-4xl font-bold">{balanceRow?.lifetime_spent ?? 0}</div>
          </div>
        </Card>
      </div>


      <section>
        <h2 className="mb-4 text-xl font-semibold">Top up</h2>
        <CreditPackages packages={(packages as any) ?? []} currency={currency} userEmail={user.email} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Recent activity</h2>
        <Card className="divide-y">
          {txs && txs.length > 0 ? txs.map((tx: any) => (
            <div key={tx.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-medium">{prettifyReason(tx.reason)}</div>
                <div className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</div>
              </div>
              <div className={`font-mono ${tx.delta > 0 ? "text-green-600" : "text-foreground"}`}>
                {tx.delta > 0 ? "+" : ""}{tx.delta}
              </div>
            </div>
          )) : (
            <div className="p-6 text-center text-muted-foreground">No transactions yet.</div>
          )}
        </Card>
      </section>
    </div>
  );
}

function prettifyReason(reason: string): string {
  const map: Record<string, string> = {
    signup_bonus: "Welcome bonus 🎉",
    purchase: "Credit purchase",
    "generation:notes": "Notes generation",
    "generation:lesson_plan": "Lesson plan generation",
    "generation:assessment": "Assessment generation",
    "refund:notes": "Refund (notes)",
    "refund:lesson_plan": "Refund (lesson plan)",
    "refund:assessment": "Refund (assessment)",
    admin_grant: "Admin grant",
  };
  return map[reason] ?? reason;
}
