import Link from "next/link";
import { BookOpen, FileText, ClipboardCheck, Calendar, ArrowRight, Search } from "lucide-react";
import { getNotes } from "@/actions/notes";
import { getLessonPlans } from "@/actions/lesson-plans";
import { getAssessments } from "@/actions/assessments";
import { Button } from "@/components/ui/button";
import { PageShell, Section } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemCard } from "@/components/ui/item-card";
import { ListSearchBar } from "@/components/ui/list-search-bar";

export const dynamic = "force-dynamic";

const PREVIEW = 6;

interface SP {
  q?: string;
}

export default async function GlobalSearchPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();

  if (!query) {
    return (
      <PageShell
        title="Search"
        description="Find any lesson plan, set of notes, or assessment you've created."
      >
        <ListSearchBar placeholder="Search your lesson plans, notes, assessments…" />
        <EmptyState
          icon={Search}
          title="Type to search"
          description="Start typing above to find anything you've generated."
        />
      </PageShell>
    );
  }

  const [
    { data: lessonPlans, count: lpCount },
    { data: notes, count: notesCount },
    { data: assessments, count: assessmentsCount },
  ] = await Promise.all([
    getLessonPlans(1, PREVIEW, query),
    getNotes(1, PREVIEW, query),
    getAssessments(1, PREVIEW, query),
  ]);

  const totalResults = (lpCount ?? 0) + (notesCount ?? 0) + (assessmentsCount ?? 0);

  return (
    <PageShell
      title="Search results"
      description={
        totalResults > 0
          ? `${totalResults} ${totalResults === 1 ? "match" : "matches"} for "${query}".`
          : `Nothing matched "${query}".`
      }
    >
      <ListSearchBar placeholder="Search your lesson plans, notes, assessments…" />

      {totalResults === 0 ? (
        <EmptyState
          icon={Search}
          title="Nothing found"
          description="Try a different keyword, or check the lists directly."
        />
      ) : (
        <>
          <ResultGroup
            label="Lesson plans"
            icon={BookOpen}
            items={lessonPlans}
            total={lpCount ?? 0}
            seeAllHref={`/lesson-plans?q=${encodeURIComponent(query)}`}
            renderCard={(plan: any) => (
              <ItemCard
                key={plan.id}
                href={`/lesson-plans/${plan.id}`}
                title={plan.title}
                subtitle={plan.topic}
                badge={plan.class_level}
                meta={[
                  { icon: Calendar, label: plan.date || new Date(plan.created_at).toLocaleDateString() },
                ]}
              />
            )}
          />

          <ResultGroup
            label="Notes"
            icon={FileText}
            items={notes}
            total={notesCount ?? 0}
            seeAllHref={`/notes?q=${encodeURIComponent(query)}`}
            renderCard={(note: any) => (
              <ItemCard
                key={note.id}
                href={`/notes/${note.id}`}
                title={note.title}
                subtitle={[note.strand, note.sub_strand].filter(Boolean).join(" · ")}
                badge={note.class_level}
                meta={[
                  { icon: Calendar, label: note.date || new Date(note.created_at).toLocaleDateString() },
                ]}
              />
            )}
          />

          <ResultGroup
            label="Assessments"
            icon={ClipboardCheck}
            items={assessments}
            total={assessmentsCount ?? 0}
            seeAllHref={`/assessments?q=${encodeURIComponent(query)}`}
            renderCard={(a: any) => (
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
            )}
          />
        </>
      )}
    </PageShell>
  );
}

function ResultGroup<T>({
  label,
  icon: Icon,
  items,
  total,
  seeAllHref,
  renderCard,
}: {
  label: string;
  icon: typeof BookOpen;
  items: T[];
  total: number;
  seeAllHref: string;
  renderCard: (item: T) => React.ReactNode;
}) {
  if (!items?.length) return null;
  return (
    <Section
      title={
        <span className="inline-flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {label}
          <span className="text-sm font-normal text-muted-foreground">({total})</span>
        </span>
      }
      actions={
        total > items.length && (
          <Button asChild variant="ghost" size="sm">
            <Link href={seeAllHref}>
              See all <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        )
      }
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map(renderCard)}
      </div>
    </Section>
  );
}
