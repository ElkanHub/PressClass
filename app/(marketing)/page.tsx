import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  FileText,
  ClipboardCheck,
  Sparkles,
  Clock,
  Globe,
  ShieldCheck,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "PressClass — AI lesson plans, notes, and assessments for African teachers",
  description:
    "Plan lessons, generate notes, and build assessments in seconds. Curriculum-aware AI built for teachers across Africa. No subscription — pay only when you generate.",
  alternates: { canonical: "/" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PressClass",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "AI productivity toolkit for African teachers — generate lesson plans, study notes, and assessments aligned to African curricula.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "25 free credits on signup. Pay-as-you-go after that.",
  },
  audience: { "@type": "EducationalAudience", educationalRole: "teacher" },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <Hero />
      <Trust />
      <Features />
      <HowItWorks />
      <CurriculumNote />
      <PricingTeaser />
      <Faq />
      <FinalCta />
    </>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built for African teachers
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Plan lessons. Generate notes. Build assessments.
              <span className="block text-primary">In seconds.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              PressClass is the AI productivity toolkit built for teachers across Africa.
              Curriculum-aware. Branded PDFs. No subscription — pay only when you generate.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link href="/auth/signup">Get 25 free credits <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                <Link href="/features">See how it works</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card. 90-second setup.
            </p>
          </div>

          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2 border-b bg-muted/40">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-muted-foreground">pressclass.app/generator</span>
        </div>
        <div className="p-6 space-y-4 bg-background">
          <div className="text-sm text-muted-foreground">Creating a lesson plan</div>
          <div className="text-2xl font-semibold leading-tight">
            Photosynthesis — JHS 2 Science
          </div>
          <div className="space-y-2">
            <RowSkeleton width="w-3/4" />
            <RowSkeleton width="w-full" />
            <RowSkeleton width="w-5/6" />
            <RowSkeleton width="w-2/3" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Chip label="Objectives" />
            <Chip label="Starter" tone="accent" />
            <Chip label="Evaluation" />
          </div>
          <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Powered by PressClass AI
            </span>
            <span>~12 seconds</span>
          </div>
        </div>
      </div>
      <div className="hidden lg:block absolute -bottom-6 -left-6 rounded-lg border bg-background shadow-md px-3 py-2 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Coins className="h-3.5 w-3.5 text-primary" /> 5 credits used
        </span>
      </div>
    </div>
  );
}

function RowSkeleton({ width }: { width: string }) {
  return <div className={`h-2 rounded-full bg-muted ${width}`} />;
}

function Chip({ label, tone = "primary" }: { label: string; tone?: "primary" | "accent" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium ${
        tone === "accent" ? "bg-amber-500/10 text-amber-700" : "bg-primary/10 text-primary"
      }`}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Trust strip
// ---------------------------------------------------------------------------
function Trust() {
  const items = [
    { icon: Globe, label: "Africa-first", sub: "GHS, NGN, KES, ZAR billing" },
    { icon: Clock, label: "Seconds to draft", sub: "Lesson plan in under 15s" },
    { icon: ShieldCheck, label: "Pay only for output", sub: "Credit refunded on failure" },
    { icon: Coins, label: "Starts at GHS 5", sub: "No subscription — ever" },
  ];
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {items.map((it) => (
            <div key={it.label} className="flex items-start gap-3">
              <it.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold">{it.label}</div>
                <div className="text-xs text-muted-foreground">{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------
function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "Lesson plans, complete in seconds",
      copy: "Objectives, RPK, starter, development, reflection, materials, and evaluation — all generated and editable, formatted the way GES inspectors expect.",
      bullets: ["Structured 3-stage flow", "Editable inline", "Export as branded PDF"],
    },
    {
      icon: FileText,
      title: "Notes that students actually read",
      copy: "Three-paragraph summaries with key points, examples, and an end-of-topic activity. Drop them into a class group chat or print straight from your phone.",
      bullets: ["Reading-level appropriate", "Real-world examples", "External resources included"],
    },
    {
      icon: ClipboardCheck,
      title: "Assessments with answer keys",
      copy: "Objective, subjective, or mixed. Easy / Normal / Hard distribution you control. Print-ready with a separate answer-key page.",
      bullets: ["Mixed-difficulty distribution", "Auto answer key", "Generate from a lesson plan or notes"],
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow>What you get</SectionEyebrow>
        <SectionTitle>Everything a teacher actually needs.</SectionTitle>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Three tools, each focused on doing one thing properly.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="rounded-xl border bg-card p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.copy}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------
function HowItWorks() {
  const steps = [
    { n: "01", title: "Tell us what you're teaching", copy: "Class, subject, strand or topic, duration. Half a minute." },
    { n: "02", title: "PressClass drafts it", copy: "Lesson plan, notes, or assessment. Costs 3–5 credits depending on output." },
    { n: "03", title: "Edit, brand, and export", copy: "Inline edits, then download as a PDF with your school colors and footer — or plain B&W." },
  ];

  return (
    <section className="py-20 lg:py-24 bg-muted/30 border-y">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow>How it works</SectionEyebrow>
        <SectionTitle>From blank screen to printable, in under a minute.</SectionTitle>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="text-5xl font-bold text-primary/30">{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Curriculum note
// ---------------------------------------------------------------------------
function CurriculumNote() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <SectionEyebrow>Made for the way you teach</SectionEyebrow>
        <SectionTitle>Trained on African curricula — not Silicon Valley's idea of school.</SectionTitle>
        <p className="mt-4 text-muted-foreground">
          GES Standards-Based Curriculum, WAEC, NECO, KNEC, and IGCSE references built in.
          Examples that ring true. Vocabulary that doesn't feel imported.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing teaser
// ---------------------------------------------------------------------------
function PricingTeaser() {
  return (
    <section className="py-20 lg:py-24 bg-muted/30 border-y">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <SectionEyebrow>Pricing</SectionEyebrow>
          <SectionTitle>Pay for what you generate. Nothing else.</SectionTitle>
          <p className="mt-4 text-muted-foreground">
            Credits are spent only when PressClass actually produces something. If a generation
            fails, the credits come back. No subscription, no auto-renewal, no surprise bills.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-start gap-2"><Check /> 25 free credits when you sign up</li>
            <li className="flex items-start gap-2"><Check /> Top up from GHS 5 (≈ $0.50)</li>
            <li className="flex items-start gap-2"><Check /> Local currency support (GHS, NGN, KES, ZAR…)</li>
            <li className="flex items-start gap-2"><Check /> Refund on failure — always</li>
          </ul>
          <div className="mt-8">
            <Button asChild size="lg"><Link href="/pricing">See pricing <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Generation cost</div>
          <div className="mt-3 space-y-3">
            <Cost icon={FileText} label="Notes" credits={3} />
            <Cost icon={ClipboardCheck} label="Assessment" credits={4} />
            <Cost icon={BookOpen} label="Lesson plan" credits={5} />
          </div>
          <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
            With 25 free credits you can draft ~5 to 8 outputs before spending a cedi.
          </div>
        </div>
      </div>
    </section>
  );
}

function Cost({ icon: Icon, label, credits }: { icon: any; label: string; credits: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span className="font-medium">{label}</span>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm font-medium">
        <Coins className="h-3.5 w-3.5" /> {credits} credits
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ teaser
// ---------------------------------------------------------------------------
function Faq() {
  const items = [
    { q: "How does the credit system work?", a: "You buy a pack of credits and spend them only when you generate something. A note costs 3 credits, an assessment 4, a lesson plan 5. If a generation fails for any reason, the credits go back to your balance automatically." },
    { q: "Is there a subscription?", a: "No. PressClass is pay-as-you-go. Buy credits when you need them — they don't expire." },
    { q: "Which currencies are supported?", a: "Ghanaian cedi (GHS), Nigerian naira (NGN), Kenyan shilling (KES), South African rand (ZAR), and US dollar (USD). More coming as we expand." },
    { q: "Can I download my work?", a: "Yes — every generation can be downloaded as a PDF, either branded with your school colors and name, or plain black-and-white." },
  ];
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionEyebrow>Common questions</SectionEyebrow>
        <SectionTitle>Things teachers usually ask first.</SectionTitle>
        <div className="mt-10 space-y-4">
          {items.map((it) => (
            <details key={it.q} className="group rounded-xl border bg-card p-5 open:bg-card">
              <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                {it.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild><Link href="/faqs">All FAQs</Link></Button>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Final CTA
// ---------------------------------------------------------------------------
function FinalCta() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl bg-primary text-primary-foreground p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Reclaim your evenings.
          </h2>
          <p className="mt-3 max-w-xl mx-auto opacity-90">
            Teachers using PressClass save 4–6 hours of prep every week. Start with 25 free credits — no card required.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="h-12 px-7 text-base">
              <Link href="/auth/signup">Create your account</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-12 px-7 text-base text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Tiny shared pieces
// ---------------------------------------------------------------------------
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-widest text-primary">{children}</div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{children}</h2>
  );
}

function Check() {
  return (
    <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-primary">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
        <path d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" />
      </svg>
    </span>
  );
}
