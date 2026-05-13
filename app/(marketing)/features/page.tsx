import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpen,
  FileText,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Palette,
  Download,
  Wand2,
  RefreshCcw,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Features — Lesson plans, notes, assessments with brand PDFs",
  description:
    "Everything PressClass does: AI lesson plans, study notes, assessments, branded PDFs with your school colors, credit-based billing, and curriculum-aware prompts.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <>
      <Hero />
      <CoreTools />
      <Brand />
      <Workflow />
      <Cta />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Built around how teachers actually work
        </div>
        <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          One toolkit. Less prep. More teaching.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          PressClass replaces hours of formatting, retyping, and copy-pasting with a few seconds and a few credits.
        </p>
      </div>
    </section>
  );
}

function CoreTools() {
  const tools = [
    {
      icon: BookOpen,
      title: "Lesson plan generator",
      subtitle: "GES / SBC structure out of the box",
      cost: 5,
      body:
        "Provide subject, class, topic, sub-topic, duration and week / term — get back a complete plan: learning objectives, RPK, materials, three lesson stages (starter, development, reflection), core points, and evaluation. Inline editing, brand-aware PDF export, optional auto-generated assessment.",
      bullets: [
        "Structured starter / development / reflection",
        "Evaluation built in",
        "Inline edit before exporting",
        "Branded PDF with school name + colors",
      ],
    },
    {
      icon: FileText,
      title: "Notes generator",
      subtitle: "Topic-summary notes for student study",
      cost: 3,
      body:
        "Three-paragraph lesson summary written for the student. Key points, real examples, an end-of-topic activity, and curated external resources. Perfect for printing or pasting into a class group.",
      bullets: [
        "Three-paragraph summary",
        "Key points + concrete examples",
        "Reflection activity",
        "External reading links",
      ],
    },
    {
      icon: ClipboardCheck,
      title: "Assessment generator",
      subtitle: "Quizzes, tests, and end-of-topic checks",
      cost: 4,
      body:
        "Objective, subjective, or mixed-difficulty assessments with a controllable easy / normal / hard split. Auto answer key on a separate page. Generate directly from a lesson plan or notes you've already created.",
      bullets: [
        "Mixed-difficulty distribution you control",
        "Objective + subjective question types",
        "Auto answer key",
        "Generate from any plan or notes in one click",
      ],
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-16">
        {tools.map((t, i) => (
          <article
            key={t.title}
            className={`grid gap-10 items-center md:grid-cols-2 ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.title}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                  {t.cost} credits
                </span>
              </div>
              <p className="mt-1 text-sm text-primary font-medium">{t.subtitle}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{t.body}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ToolMock title={t.title} icon={t.icon} />
          </article>
        ))}
      </div>
    </section>
  );
}

function ToolMock({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40 text-xs text-muted-foreground">
        <span className="font-medium">{title}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="p-6 space-y-3">
        <div className="h-3 w-2/3 rounded-full bg-muted" />
        <div className="h-2 w-full rounded-full bg-muted" />
        <div className="h-2 w-11/12 rounded-full bg-muted" />
        <div className="h-2 w-3/4 rounded-full bg-muted" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-7 rounded-md bg-primary/10" />
          <div className="h-7 rounded-md bg-amber-500/10" />
          <div className="h-7 rounded-md bg-primary/10" />
        </div>
      </div>
    </div>
  );
}

function Brand() {
  const items = [
    {
      icon: Palette,
      title: "Your school colors, your brand",
      body: "Pick a school color and a personal color in onboarding. Every PDF can be exported with that brand applied — colored header bar, accent stripe, your name and school in the footer.",
    },
    {
      icon: Download,
      title: "Branded or plain — your call",
      body: "Each download asks if you want it branded or plain B&W. Same content, different identity. Perfect for staff-room sharing vs. official submission.",
    },
    {
      icon: Wand2,
      title: "Edit before you export",
      body: "Everything is editable inline. Tweak a question, swap an example, fix a typo — all without regenerating and without spending another credit.",
    },
    {
      icon: RefreshCcw,
      title: "Refunds when AI slips",
      body: "If a generation fails or returns garbage, your credits return automatically. You only pay for output you can actually use.",
    },
    {
      icon: Globe,
      title: "African-curriculum aware",
      body: "Trained on GES / SBC, WAEC, NECO, KNEC and IGCSE patterns. Examples and vocabulary that match your classroom.",
    },
    {
      icon: Sparkles,
      title: "Rapid generation",
      body: "Lesson plan in ~15 seconds. Assessment in under 20. No waiting, no spinners that don't move.",
    },
  ];
  return (
    <section className="py-20 bg-muted/30 border-y">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">More than just generation</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          The little things that turn a tool into something teachers actually keep using.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article key={it.title} className="rounded-xl border bg-background p-6">
              <it.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { n: "01", t: "Tell us what you're teaching", c: "Fill in 5–8 short fields. Less than a minute." },
    { n: "02", t: "Review and tweak", c: "Inline edit anything before downloading." },
    { n: "03", t: "Export with your brand", c: "Branded PDF with school colors, or plain B&W." },
  ];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">A workflow that respects your time</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="text-4xl font-bold text-primary/30">{s.n}</div>
              <h3 className="mt-2 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.c}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Try it free. 25 credits on us.</h2>
        <p className="mt-3 text-muted-foreground">Enough for a few real lesson plans before you spend a cedi.</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/auth/signup">Create your account <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
