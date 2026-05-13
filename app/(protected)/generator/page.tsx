import Link from "next/link";
import { BookOpen, FileText, ClipboardCheck, ArrowRight, Sparkles } from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";

const TOOLS = [
  {
    href: "/generator/lesson-plan",
    title: "Lesson plan",
    description: "A full plan with objectives, stages and evaluation.",
    icon: BookOpen,
    cost: 5,
    points: ["Structured starter / development / reflection", "RPK + objectives + materials", "Generate an assessment from it after"],
  },
  {
    href: "/generator/notes",
    title: "Notes",
    description: "Topic notes formatted for student study.",
    icon: FileText,
    cost: 3,
    points: ["Three-paragraph summary", "Key points + examples", "Activity + external resources"],
  },
  {
    href: "/generator/assessment",
    title: "Assessment",
    description: "Quiz or test with mixed difficulty.",
    icon: ClipboardCheck,
    cost: 4,
    points: ["Objective + subjective questions", "Auto answer key", "Print or export branded PDF"],
  },
] as const;

export default function GeneratorHubPage() {
  return (
    <PageShell
      title="Create something new"
      description="Pick a tool — each takes under a minute."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex flex-col rounded-xl border bg-card p-6 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3 w-3" /> {t.cost} credits
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted-foreground">
              {t.points.map((p) => <li key={p}>• {p}</li>)}
            </ul>
            <div className="mt-6 inline-flex items-center text-sm font-medium text-primary">
              Start <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
