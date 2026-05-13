import Link from "next/link";
import Image from "next/image";
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
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HERO_IMAGE,
  CLASSROOM_WIDE,
  FEATURE_SHOTS,
  TESTIMONIAL_FACES,
} from "@/lib/images";

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
      <PanAfricanDivider />
      <Trust />
      <Features />
      <HowItWorks />
      <Testimonials />
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
      <div className="absolute inset-0 -z-10 ambient-glow" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-24 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          <div className="space-y-7">
            <div className="reveal inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative inline-flex h-2 w-2 pulse-dot">
                <span className="absolute inset-0 rounded-full bg-accent" />
              </span>
              Built for African teachers
            </div>

            <h1 className="reveal reveal-delay-1 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.05]">
              Lesson plans, notes,
              <br className="hidden sm:block" />
              and assessments —{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  in seconds.
                </span>
              </span>
            </h1>

            <p className="reveal reveal-delay-2 text-lg text-muted-foreground max-w-xl leading-relaxed">
              PressClass is the AI productivity toolkit built for teachers across Africa.
              Curriculum-aware. Branded PDFs. No subscription — pay only when you generate.
            </p>

            <div className="reveal reveal-delay-3 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition">
                <Link href="/auth/signup">
                  Get 25 free credits
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base rounded-full border-2">
                <Link href="/features">See how it works</Link>
              </Button>
            </div>

            <div className="reveal reveal-delay-4 flex items-center gap-4 text-xs text-muted-foreground">
              <FacePile />
              <span>Trusted by teachers across 12+ African countries</span>
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function FacePile() {
  return (
    <div className="flex -space-x-2">
      {TESTIMONIAL_FACES.slice(0, 4).map((face, i) => (
        <span
          key={i}
          className="relative inline-block h-8 w-8 rounded-full ring-2 ring-background overflow-hidden bg-muted"
        >
          <Image
            src={face.src}
            alt={face.alt}
            fill
            sizes="32px"
            className="object-cover"
          />
        </span>
      ))}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="reveal reveal-delay-2 relative">
      <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] rounded-[36px] overflow-hidden border border-border/60 shadow-2xl shadow-primary/10">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          style={{ objectPosition: HERO_IMAGE.focus }}
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Floating output card */}
        <div className="absolute -left-3 sm:-left-6 bottom-6 sm:bottom-10 w-[78%] max-w-[320px] rounded-2xl bg-white/95 backdrop-blur p-4 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Lesson plan ready
          </div>
          <div className="mt-1.5 text-sm font-semibold text-neutral-900 leading-tight">
            Photosynthesis — JHS 2 Science
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <Chip>Objectives</Chip>
            <Chip tone="accent">Starter</Chip>
            <Chip>Evaluation</Chip>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-500">
            <span className="inline-flex items-center gap-1"><Coins className="h-3 w-3" /> 5 credits</span>
            <span>~12s</span>
          </div>
        </div>

        {/* Credits badge */}
        <div className="absolute top-4 right-4 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-lg flex items-center gap-1.5">
          <span className="relative inline-flex h-2 w-2 pulse-dot">
            <span className="absolute inset-0 rounded-full bg-accent" />
          </span>
          25 free credits
        </div>
      </div>

      {/* Pan-African stripe accent */}
      <div className="pa-stripe absolute -bottom-1 left-12 right-12 h-1.5 rounded-full opacity-80" />
    </div>
  );
}

function Chip({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "accent" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-1.5 py-1 text-[10px] font-medium ${
        tone === "accent" ? "bg-amber-500/15 text-amber-700" : "bg-emerald-500/15 text-emerald-700"
      }`}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pan-African Divider
// ---------------------------------------------------------------------------
function PanAfricanDivider() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="pa-stripe h-1 rounded-full opacity-80" />
    </div>
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
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <it.icon className="h-4 w-4" />
              </span>
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
      copy:
        "Objectives, RPK, starter, development, reflection, materials, and evaluation — all generated and editable, formatted the way GES inspectors expect.",
      image: FEATURE_SHOTS.lessonPlan,
      cost: 5,
    },
    {
      icon: FileText,
      title: "Notes students actually read",
      copy:
        "Three-paragraph summaries with key points, examples, and an end-of-topic activity. Drop them into a class group chat or print straight from your phone.",
      image: FEATURE_SHOTS.notes,
      cost: 3,
    },
    {
      icon: ClipboardCheck,
      title: "Assessments with answer keys",
      copy:
        "Objective, subjective, or mixed. Easy / Normal / Hard distribution you control. Print-ready with a separate answer-key page.",
      image: FEATURE_SHOTS.assessment,
      cost: 4,
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow>What you get</SectionEyebrow>
        <SectionTitle>Three tools, focused on doing one thing each — properly.</SectionTitle>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="lift group relative overflow-hidden rounded-2xl border bg-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="relative aspect-[5/3] overflow-hidden">
                <Image
                  src={f.image.src}
                  alt={f.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  <f.icon className="h-3.5 w-3.5" /> {f.cost} credits
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold leading-snug">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.copy}</p>
                <Link
                  href="/features"
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
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
    {
      n: "01",
      title: "Tell us what you're teaching",
      copy: "Class, subject, strand or topic, duration. Half a minute.",
    },
    {
      n: "02",
      title: "PressClass drafts it",
      copy: "Lesson plan, notes, or assessment. Costs 3–5 credits depending on output.",
    },
    {
      n: "03",
      title: "Edit, brand, and export",
      copy: "Inline edits. Download as a branded PDF with your school colors — or plain B&W.",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 bg-muted/30 border-y overflow-hidden">
      <div className="absolute inset-0 -z-10 ambient-glow opacity-60" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow>How it works</SectionEyebrow>
        <SectionTitle>From blank screen to printable, in under a minute.</SectionTitle>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="lift rounded-2xl border bg-background/80 backdrop-blur p-7"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-5xl font-bold gradient-drift bg-clip-text text-transparent inline-block">
                {s.n}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials marquee
// ---------------------------------------------------------------------------
function Testimonials() {
  const items = [
    { name: "Ama Mensah", role: "JHS Mathematics, Accra", quote: "PressClass cut my Sunday prep from four hours to twenty minutes. I'm not exaggerating.", face: TESTIMONIAL_FACES[0] },
    { name: "Tunde Adebayo", role: "SHS Biology, Lagos", quote: "Assessments that match the WAEC style without me having to rewrite a thing. Brilliant.", face: TESTIMONIAL_FACES[2] },
    { name: "Wanjiru Kamau", role: "Primary 6 English, Nairobi", quote: "I love that my school name and colors are on every PDF. Parents notice these things.", face: TESTIMONIAL_FACES[1] },
    { name: "Kojo Asare", role: "JHS Science, Kumasi", quote: "The pricing feels honest. I pay for what I generate. No subscription nonsense.", face: TESTIMONIAL_FACES[3] },
    { name: "Fatima Bello", role: "SHS Economics, Abuja", quote: "It writes lesson plans the way GES wants them. That alone is worth ten times the price.", face: TESTIMONIAL_FACES[0] },
    { name: "Brian Otieno", role: "Primary 4 Maths, Mombasa", quote: "I now actually have time for my own family in the evenings. Best money I've spent on a tool.", face: TESTIMONIAL_FACES[2] },
  ];

  // Duplicate so the marquee loops seamlessly
  const loop = [...items, ...items];

  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionEyebrow>Loved by teachers</SectionEyebrow>
        <SectionTitle>Real teachers, reclaiming their evenings.</SectionTitle>
      </div>

      <div className="mt-12 relative">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex gap-5 marquee-track" style={{ width: "max-content" }}>
          {loop.map((t, i) => (
            <article key={i} className="w-[300px] sm:w-[340px] shrink-0 rounded-2xl border bg-card p-6">
              <Quote className="h-5 w-5 text-primary/40" />
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                "{t.quote}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="relative h-9 w-9 rounded-full overflow-hidden bg-muted">
                  <Image src={t.face.src} alt={t.face.alt} fill sizes="36px" className="object-cover" />
                </span>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </article>
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
    <section className="py-20 lg:py-24 bg-muted/30 border-y">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <SectionEyebrow>Made for the way you teach</SectionEyebrow>
        <SectionTitle>Trained on African curricula — not Silicon Valley's idea of school.</SectionTitle>
        <p className="mt-5 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          GES Standards-Based Curriculum, WAEC, NECO, KNEC, and IGCSE references built in.
          Examples that ring true. Vocabulary that doesn't feel imported.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {["GES SBC", "WAEC", "NECO", "KNEC", "IGCSE", "CAPS"].map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing teaser
// ---------------------------------------------------------------------------
function PricingTeaser() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <SectionEyebrow>Pricing</SectionEyebrow>
          <SectionTitle>Pay for what you generate. Nothing else.</SectionTitle>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Credits are spent only when PressClass actually produces something. If a generation
            fails, the credits come back. No subscription, no auto-renewal, no surprise bills.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            <li className="flex items-start gap-2"><Check /> 25 free credits when you sign up</li>
            <li className="flex items-start gap-2"><Check /> Top up from GHS 5 (≈ $0.50)</li>
            <li className="flex items-start gap-2"><Check /> Local currency support (GHS, NGN, KES, ZAR…)</li>
            <li className="flex items-start gap-2"><Check /> Refund on failure — always</li>
          </ul>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/pricing">See pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        <div className="lift rounded-2xl border bg-card p-6 shadow-sm">
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
    {
      q: "How does the credit system work?",
      a: "You buy a pack of credits and spend them only when you generate something. A note costs 3 credits, an assessment 4, a lesson plan 5. If a generation fails, the credits go back to your balance automatically.",
    },
    {
      q: "Is there a subscription?",
      a: "No. PressClass is pay-as-you-go. Buy credits when you need them — they don't expire.",
    },
    {
      q: "Which currencies are supported?",
      a: "Ghanaian cedi (GHS), Nigerian naira (NGN), Kenyan shilling (KES), South African rand (ZAR), and US dollar (USD). More coming as we expand.",
    },
    {
      q: "Can I download my work?",
      a: "Yes — every generation can be downloaded as a PDF, either branded with your school colors and name, or plain black-and-white.",
    },
  ];
  return (
    <section className="py-20 lg:py-28 bg-muted/30 border-y">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionEyebrow>Common questions</SectionEyebrow>
        <SectionTitle>Things teachers usually ask first.</SectionTitle>
        <div className="mt-10 space-y-3">
          {items.map((it) => (
            <details key={it.q} className="group rounded-2xl border bg-background p-5 transition open:shadow-sm">
              <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-4">
                {it.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/faqs">All FAQs</Link>
          </Button>
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Reclaim your evenings.
            </h2>
            <p className="mt-4 max-w-xl mx-auto opacity-90">
              Teachers using PressClass save 4–6 hours of prep every week. Start with 25 free
              credits — no card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 px-7 text-base rounded-full bg-white text-primary hover:bg-white/90"
              >
                <Link href="/auth/signup">Create your account</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 px-7 text-base rounded-full text-primary-foreground border border-white/30 hover:bg-white/10"
              >
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
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
    <div className="reveal text-xs font-semibold uppercase tracking-widest text-primary">{children}</div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="reveal reveal-delay-1 mt-2 text-3xl sm:text-4xl font-bold tracking-tight leading-tight max-w-3xl">
      {children}
    </h2>
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
