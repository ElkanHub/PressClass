import { Plus, FileText, BookOpen, ClipboardCheck, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageShell, Section } from "@/components/ui/page-shell";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemCard } from "@/components/ui/item-card";
import { getAssessments } from "@/actions/assessments";
import { getLessonPlans } from "@/actions/lesson-plans";
import { getNotes } from "@/actions/notes";
import { getStudyAnalytics } from "@/actions/study-time";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: assessments, count: assessmentsCount },
    { data: lessonPlans, count: lessonPlansCount },
    { data: notes, count: notesCount },
    { data: studyAnalytics },
    { data: balanceRow },
  ] = await Promise.all([
    user ? supabase.from("profiles").select("full_name, current_school").eq("id", user.id).maybeSingle() : Promise.resolve({ data: null }),
    getAssessments(1, 4),
    getLessonPlans(1, 4),
    getNotes(1, 4),
    getStudyAnalytics(),
    user ? supabase.from("credit_balances").select("balance").eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const firstName = (profile?.full_name ?? "there").split(" ")[0];

  return (
    <PageShell
      title={`Welcome back, ${firstName}.`}
      description={profile?.current_school ? `Teaching at ${profile.current_school}.` : "Let's make today's lessons easier."}
      actions={
        <Button asChild>
          <Link href="/generator"><Plus className="mr-2 h-4 w-4" /> Create new</Link>
        </Button>
      }
    >
      <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Credits" value={balanceRow?.balance ?? 0} icon={Sparkles} tone="primary" href="/credits" />
        <StatCard label="Lesson plans" value={lessonPlansCount ?? 0} icon={BookOpen} href="/lesson-plans" />
        <StatCard label="Notes" value={notesCount ?? 0} icon={FileText} href="/notes" />
        <StatCard label="Assessments" value={assessmentsCount ?? 0} icon={ClipboardCheck} href="/assessments" />
      </div>

      <Section
        title="Recent lesson plans"
        actions={<Button variant="ghost" size="sm" asChild><Link href="/lesson-plans">See all</Link></Button>}
      >
        {lessonPlans && lessonPlans.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {lessonPlans.map((lp: any) => (
              <ItemCard
                key={lp.id}
                href={`/lesson-plans/${lp.id}`}
                title={lp.title}
                subtitle={[lp.subject, lp.class_level].filter(Boolean).join(" • ")}
                badge={lp.class_level}
                meta={[
                  { icon: Clock, label: lp.duration || "—" },
                  { label: lp.date || "—" },
                ]}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No lesson plans yet"
            description="Generate your first one in under a minute."
            actionLabel="Create a lesson plan"
            actionHref="/generator/lesson-plan"
          />
        )}
      </Section>

      <Section
        title="Recent notes"
        actions={<Button variant="ghost" size="sm" asChild><Link href="/notes">See all</Link></Button>}
      >
        {notes && notes.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {notes.map((n: any) => (
              <ItemCard
                key={n.id}
                href={`/notes/${n.id}`}
                title={n.title}
                subtitle={[n.subject, n.strand].filter(Boolean).join(" • ")}
                badge={n.class_level}
                meta={[{ label: n.date || "—" }]}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No notes yet"
            description="Notes summarise a topic for student study."
            actionLabel="Create notes"
            actionHref="/generator/notes"
          />
        )}
      </Section>

      <Section
        title="Recent assessments"
        actions={<Button variant="ghost" size="sm" asChild><Link href="/assessments">See all</Link></Button>}
      >
        {assessments && assessments.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {assessments.map((a: any) => (
              <ItemCard
                key={a.id}
                href={`/assessments/${a.id}`}
                title={a.title}
                subtitle={a.topic}
                badge={a.class_level}
                meta={[
                  { icon: ClipboardCheck, label: `${a.questions?.length ?? 0} questions` },
                ]}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardCheck}
            title="No assessments yet"
            description="Quizzes and tests, generated and printable in seconds."
            actionLabel="Create an assessment"
            actionHref="/generator/assessment"
          />
        )}
      </Section>

      {studyAnalytics && (studyAnalytics.totalMinutesThisWeek > 0) && (
        <Section title="This week">
          <StatCard
            label="Study time"
            value={`${Math.floor(studyAnalytics.totalMinutesThisWeek / 60)}h ${studyAnalytics.totalMinutesThisWeek % 60}m`}
            icon={Clock}
            href="/study-time"
          />
        </Section>
      )}
    </PageShell>
  );
}
