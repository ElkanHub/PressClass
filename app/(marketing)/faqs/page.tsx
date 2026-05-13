import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers about credits, pricing, curricula supported, PDF exports, refunds, and how PressClass works for African teachers.",
  alternates: { canonical: "/faqs" },
};

const FAQ_SECTIONS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "How do I sign up?",
        a: "Visit the signup page, enter your name, email, and a password. You'll land on a quick onboarding (about 90 seconds) where you'll add your school and pick your brand colors. As soon as that's done, we add 25 free credits to your account.",
      },
      {
        q: "Is there a free trial?",
        a: "Better — every new teacher receives 25 free credits on signup. That's enough for several real lesson plans, notes, or assessments before you spend anything.",
      },
      {
        q: "What's the onboarding for?",
        a: "We capture your school name, country, currency, subjects, and two brand colors. Your school name and colors appear on branded PDFs. Your subjects help us tune the generator output to what you actually teach.",
      },
    ],
  },
  {
    title: "Credits & pricing",
    items: [
      {
        q: "How does the credit system work?",
        a: "You buy a pack of credits, then spend them when you generate something. A set of notes costs 3 credits, an assessment 4, a lesson plan 5. If a generation fails or returns unparseable output, the credits are returned automatically.",
      },
      {
        q: "Is there a subscription?",
        a: "No. PressClass is pay-as-you-go. You only buy more credits when you need them.",
      },
      {
        q: "Do credits expire?",
        a: "Never. Whatever balance is in your account stays there until you spend it.",
      },
      {
        q: "Which currencies are supported?",
        a: "GHS, NGN, KES, ZAR, and USD at launch. We're rolling out more as we expand — UGX, TZS, RWF, EGP, MAD and XOF / XAF are on the near-term list.",
      },
      {
        q: "Can I get a refund on a purchase?",
        a: "Within 7 days of buying credits, we'll refund any unused portion. Contact us at hello@pressclass.app.",
      },
    ],
  },
  {
    title: "Generation quality",
    items: [
      {
        q: "Which curricula do you support?",
        a: "PressClass is trained on the Ghanaian SBC / GES, WAEC, NECO (Nigeria), KNEC (Kenya), and IGCSE patterns. We're continually expanding curriculum coverage.",
      },
      {
        q: "What if the AI gets something wrong?",
        a: "Everything is editable inline before you export. If a whole generation comes back unusable, the credits are refunded automatically and you can retry.",
      },
      {
        q: "Can I generate an assessment from an existing lesson plan?",
        a: "Yes — every lesson plan and set of notes has a one-click 'generate assessment' action that uses the existing content as context.",
      },
    ],
  },
  {
    title: "PDF exports",
    items: [
      {
        q: "Can I download my work?",
        a: "Yes. Every lesson plan, set of notes, and assessment can be exported as a PDF.",
      },
      {
        q: "What's the difference between a branded and plain PDF?",
        a: "Branded uses your school color in the header, your personal color as an accent stripe, and includes your name and school in the footer. Plain is clean black-and-white with no PressClass mark, ideal for formal submission to administrators.",
      },
      {
        q: "Can I change my brand colors later?",
        a: "We're adding a settings page for this. In the meantime, anything you set during onboarding is what appears on PDFs.",
      },
    ],
  },
  {
    title: "Account & data",
    items: [
      {
        q: "Where is my data stored?",
        a: "On Supabase (Postgres) in a region closest to our users. Your generations and account info are yours; we don't use them to train models.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes — email hello@pressclass.app and we'll remove your account and content within 30 days.",
      },
    ],
  },
];

export default function FaqsPage() {
  const allFaqs = FAQ_SECTIONS.flatMap((s) => s.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Questions, answered.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Couldn't find what you need?{" "}
            <a className="text-primary font-medium underline-offset-4 hover:underline" href="mailto:hello@pressclass.app">
              Email us
            </a>
            .
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-12">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.items.map((it) => (
                  <details key={it.q} className="rounded-xl border bg-card p-5 group">
                    <summary className="cursor-pointer list-none font-semibold flex items-start justify-between gap-4">
                      <span>{it.q}</span>
                      <span className="text-muted-foreground group-open:rotate-180 transition-transform shrink-0">▾</span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-muted/30 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to try it?</h2>
          <p className="mt-3 text-muted-foreground">25 free credits. 90 seconds to set up.</p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/auth/signup">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
