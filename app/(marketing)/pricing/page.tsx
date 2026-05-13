import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Sparkles, Coins, ArrowRight, ShieldCheck, RotateCcw, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import { CLASSROOM_WIDE } from "@/lib/images";

export const metadata: Metadata = {
  title: "Pricing — buy credits, no subscription",
  description:
    "Pay only for what you generate. Top up from GHS 5 / NGN 500 / $0.50. 25 free credits for every new teacher. No subscription.",
  alternates: { canonical: "/pricing" },
};

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  GH: "GHS", NG: "NGN", KE: "KES", ZA: "ZAR", UG: "UGX",
  TZ: "TZS", RW: "RWF", ET: "ETB", EG: "EGP", MA: "MAD",
  CM: "XAF", CI: "XOF", SN: "XOF", ZM: "ZMW",
};

async function detectCurrency(): Promise<string> {
  // Vercel sets `x-vercel-ip-country`; Cloudflare uses `cf-ipcountry`.
  const h = await headers();
  const country =
    h.get("x-vercel-ip-country") ||
    h.get("cf-ipcountry") ||
    h.get("x-country-code") ||
    "";
  return CURRENCY_BY_COUNTRY[country.toUpperCase()] || "USD";
}

interface PackageRow {
  id: string;
  code: string;
  name: string;
  credits: number;
  bonus_credits: number;
  credit_package_prices: { currency: string; amount_minor: number }[];
}

function formatPrice(amountMinor: number, currency: string): string {
  const amount = amountMinor / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default async function PricingPage() {
  const currency = await detectCurrency();
  const supabase = createAdminClient();
  const { data: packages } = await supabase
    .from("credit_packages")
    .select("id, code, name, credits, bonus_credits, credit_package_prices(currency, amount_minor)")
    .eq("is_active", true)
    .order("sort_order");

  const list: PackageRow[] = (packages as any) || [];

  return (
    <>
      <Hero currency={currency} />
      <Packages list={list} currency={currency} />
      <Promises />
      <Faq />
      <Cta />
    </>
  );
}

function Hero({ currency }: { currency: string }) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 ambient-glow" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 text-center">
        <div className="reveal inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Pay-as-you-go
        </div>
        <h1 className="reveal reveal-delay-1 mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
          Buy credits. Spend them on
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            what you generate.
          </span>
        </h1>
        <p className="reveal reveal-delay-2 mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          No subscriptions. No expiry. Refunded when generations fail. Showing prices in{" "}
          <span className="font-semibold text-foreground">{currency}</span>.
        </p>
      </div>
      <div className="pa-stripe h-1" />
    </section>
  );
}

function Packages({ list, currency }: { list: PackageRow[]; currency: string }) {
  if (!list?.length) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-muted-foreground">
          Pricing temporarily unavailable. Please try again shortly.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((pkg) => {
            const price =
              pkg.credit_package_prices.find((p) => p.currency === currency) ??
              pkg.credit_package_prices.find((p) => p.currency === "USD");
            const total = pkg.credits + pkg.bonus_credits;
            const featured = pkg.code === "popular";

            return (
              <article
                key={pkg.id}
                className={`rounded-xl border p-6 flex flex-col ${
                  featured ? "border-primary ring-2 ring-primary/20 bg-primary/[0.02]" : "bg-card"
                }`}
              >
                {featured && (
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    Most popular
                  </span>
                )}
                <h3 className="mt-3 text-lg font-semibold">{pkg.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{total}</span>
                  <span className="text-sm text-muted-foreground">credits</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pkg.bonus_credits ? `${pkg.credits} + ${pkg.bonus_credits} bonus` : "No bonus"}
                </p>

                <div className="mt-5 text-2xl font-semibold">
                  {price ? formatPrice(price.amount_minor, price.currency) : "—"}
                </div>

                <ul className="mt-5 space-y-2 text-sm flex-1">
                  <li className="flex items-start gap-2"><Dot /> ~{Math.floor(total / 4)} assessments</li>
                  <li className="flex items-start gap-2"><Dot /> ~{Math.floor(total / 5)} lesson plans</li>
                  <li className="flex items-start gap-2"><Dot /> ~{Math.floor(total / 3)} sets of notes</li>
                </ul>

                <Button asChild className="mt-6 w-full" variant={featured ? "default" : "outline"}>
                  <Link href="/auth/signup">Get started</Link>
                </Button>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          Prices are auto-detected. Sign in to see your local currency and to buy credits.
        </p>
      </div>
    </section>
  );
}

function Promises() {
  const items = [
    { icon: ShieldCheck, title: "No subscription", copy: "You buy when you need to. Nothing renews automatically." },
    { icon: RotateCcw, title: "Refund on failure", copy: "If a generation fails or returns garbage, the credits are returned to your balance the same second." },
    { icon: Coins, title: "Credits never expire", copy: "Buy 100 today, use them next term. They stay in your account." },
    { icon: Globe, title: "Local currency support", copy: "GHS, NGN, KES, ZAR, USD and more being added." },
  ];
  return (
    <section className="py-16 border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What you can count on</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="rounded-xl border bg-background p-5">
              <it.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    { q: "How many credits do generations cost?", a: "Notes cost 3 credits, assessments cost 4, lesson plans cost 5." },
    { q: "What happens to my credits if a generation fails?", a: "They're automatically refunded — same second. You're only charged when PressClass produces real, parseable output." },
    { q: "Do credits expire?", a: "No. Your credits stay in your account until you spend them." },
    { q: "Can I get a refund on a purchase?", a: "Reach out within 7 days of purchase and we'll refund any unused credits." },
  ];
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Pricing FAQs</h2>
        <div className="mt-8 space-y-3">
          {items.map((it) => (
            <details key={it.q} className="rounded-xl border bg-card p-5 group">
              <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                {it.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[36px] border border-primary/30 shadow-2xl shadow-primary/20">
          <Image
            src={CLASSROOM_WIDE.src}
            alt={CLASSROOM_WIDE.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
          <div className="relative p-10 sm:p-16 text-center text-primary-foreground">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Start with 25 free credits.
            </h2>
            <p className="mt-4 max-w-xl mx-auto opacity-90">
              Enough for a few real lesson plans, on the house.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-7 h-12 px-7 text-base rounded-full bg-white text-primary hover:bg-white/90"
            >
              <Link href="/auth/signup">Create your account <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />;
}
