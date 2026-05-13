import Link from "next/link";
import { Plus, BookOpen, Clock, GraduationCap, Calendar } from "lucide-react";
import { getLessonPlans } from "@/actions/lesson-plans";
import { Button } from "@/components/ui/button";
import { PageShell, Section } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemCard } from "@/components/ui/item-card";

export const dynamic = "force-dynamic";

export default async function LessonPlansPage() {
  const { data: lessonPlans } = await getLessonPlans(1, 200);
  const groups = (lessonPlans || []).reduce<Record<string, any[]>>((acc, plan: any) => {
    const key = plan.subject || "Other";
    (acc[key] ||= []).push(plan);
    return acc;
  }, {});

  return (
    <PageShell
      title="Lesson plans"
      description="Every plan you've built. Tap one to edit or export."
      actions={
        <Button asChild>
          <Link href="/generator/lesson-plan"><Plus className="mr-2 h-4 w-4" /> Create new</Link>
        </Button>
      }
    >
      {(!lessonPlans || lessonPlans.length === 0) ? (
        <EmptyState
          icon={BookOpen}
          title="No lesson plans yet"
          description="Tell us what you're teaching and PressClass writes the plan."
          actionLabel="Generate your first plan"
          actionHref="/generator/lesson-plan"
        />
      ) : (
        Object.entries(groups).map(([subject, plans]) => (
          <Section key={subject} title={subject}>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan: any) => (
                <ItemCard
                  key={plan.id}
                  href={`/lesson-plans/${plan.id}`}
                  title={plan.title}
                  subtitle={plan.topic}
                  badge={plan.class_level}
                  meta={[
                    plan.duration ? { icon: Clock, label: plan.duration } : null,
                    { icon: Calendar, label: plan.date || new Date(plan.created_at).toLocaleDateString() },
                    plan.sub_topic ? { icon: GraduationCap, label: plan.sub_topic } : null,
                  ].filter(Boolean) as any}
                />
              ))}
            </div>
          </Section>
        ))
      )}
    </PageShell>
  );
}
