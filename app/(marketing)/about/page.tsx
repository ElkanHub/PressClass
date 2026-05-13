import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, Globe, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <section className="border-b">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Our mission
        </div>
        <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Give African teachers their evenings back.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          We build tools that turn hours of lesson prep into seconds — without watering down the quality
          of what students actually receive.
        </p>
      </div>
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
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Come reclaim your time.</h2>
        <p className="mt-3 text-muted-foreground">25 free credits when you sign up. No card.</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/auth/signup">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}
