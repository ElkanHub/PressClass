import Link from "next/link";
import { Plus, ClipboardCheck, Calendar } from "lucide-react";
import { getAssessments } from "@/actions/assessments";
import { Button } from "@/components/ui/button";
import { PageShell, Section } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemCard } from "@/components/ui/item-card";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage() {
  const { data: assessments } = await getAssessments(1, 200);
  const groups = (assessments || []).reduce<Record<string, any[]>>((acc, a: any) => {
    const key = a.topic || "Other";
    (acc[key] ||= []).push(a);
    return acc;
  }, {});

  return (
    <PageShell
      title="Assessments"
      description="Quizzes and tests you've built — ready to print."
      actions={
        <Button asChild>
          <Link href="/generator/assessment"><Plus className="mr-2 h-4 w-4" /> Create new</Link>
        </Button>
      }
    >
      {(!assessments || assessments.length === 0) ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No assessments yet"
          description="Generate a mixed-difficulty quiz in under a minute."
          actionLabel="Create your first assessment"
          actionHref="/generator/assessment"
        />
      ) : (
        Object.entries(groups).map(([topic, items]) => (
          <Section key={topic} title={topic}>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.map((a: any) => (
                <ItemCard
                  key={a.id}
                  href={`/assessments/${a.id}`}
                  title={a.title}
                  subtitle={`${a.questions?.length ?? 0} questions`}
                  badge={a.class_level}
                  meta={[
                    { icon: ClipboardCheck, label: `${a.questions?.length ?? 0} questions` },
                    { icon: Calendar, label: new Date(a.created_at).toLocaleDateString() },
                  ]}
                />
              ))}
            </div>
          </Section>
        ))
      )}
    </PageShell>
  );
}
