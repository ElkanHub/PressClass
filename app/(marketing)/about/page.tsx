import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Sparkles, Globe, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLASSROOM_WIDE, TEACHER_AT_BOARD } from "@/lib/images";

export const metadata: Metadata = {
  title: "About — Built for African teachers",
  description:
    "PressClass exists to give African teachers back their evenings. We build AI tools that respect African curricula, classrooms, and currencies.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Hero />
      <Story />
      <Beliefs />
      <Cta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 ambient-glow" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 grid lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
        <div>
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Our mission
          </div>
          <h1 className="reveal reveal-delay-1 mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            Give African teachers
            <br />
            <span className="text-primary">their evenings back.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-6 text-lg text-muted-foreground leading-relaxed">
            We build tools that turn hours of lesson prep into seconds — without watering down the quality
            of what students actually receive.
          </p>
        </div>
        <div className="reveal reveal-delay-2 relative aspect-[4/5] rounded-[32px] overflow-hidden border border-border/60 shadow-2xl shadow-primary/15">
          <Image
            src={TEACHER_AT_BOARD.src}
            alt={TEACHER_AT_BOARD.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
            style={{ objectPosition: TEACHER_AT_BOARD.focus }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-xs text-white/95 font-medium drop-shadow">
            For teachers, by people who've spent time in African classrooms.
          </div>
        </div>
      </div>
      <div className="pa-stripe h-1" />
    </section>
  );
}

function Story() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 prose prose-neutral dark:prose-invert">
        <h2 className="text-2xl font-bold tracking-tight not-prose">Why PressClass exists</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          A teacher in Accra, Lagos, or Nairobi doesn't need a generic AI chatbot trained on
          California school districts. They need lesson plans formatted the way the inspector
          expects. Notes their students can actually read. Assessments aligned with the curriculum
          actually being taught in the classroom.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          That's what PressClass is. Not a foreign tool retrofitted for African schools — a tool
          built from the ground up around how teaching in Africa actually works: GES, WAEC,
          NECO, KNEC, IGCSE. Term structures. Class levels. Even the way prices feel — entry
          packs that start at the cost of a kelewele.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          We're a small team obsessed with one outcome: teachers spending the time they used to
          spend formatting tables and retyping notes, on actually teaching — or sleeping.
        </p>
      </div>
    </section>
  );
}

function Beliefs() {
  const items = [
    {
      icon: Heart,
      title: "Respect the teacher",
      body: "Teachers are professionals. The tool stays out of the way. Editable inline, no opaque magic, no buried fees.",
    },
    {
      icon: Globe,
      title: "Africa first, not Africa as an afterthought",
      body: "Curriculum-aware. Local currency support. Pricing calibrated to teacher salaries on the continent.",
    },
    {
      icon: Sparkles,
      title: "Pay for output, not access",
      body: "No subscription. Credits are spent only when PressClass actually produces something usable.",
    },
  ];
  return (
    <section className="py-16 bg-muted/30 border-y">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What we believe</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
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
              Come reclaim your time.
            </h2>
            <p className="mt-4 max-w-xl mx-auto opacity-90">25 free credits when you sign up. No card.</p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-7 h-12 px-7 text-base rounded-full bg-white text-primary hover:bg-white/90"
            >
              <Link href="/auth/signup">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
