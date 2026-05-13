import Link from "next/link";
import { Plus, BookOpen, Clock, GraduationCap, Calendar, Search } from "lucide-react";
import { getLessonPlans } from "@/actions/lesson-plans";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemCard } from "@/components/ui/item-card";
import { ListSearchBar } from "@/components/ui/list-search-bar";
import { ListPagination } from "@/components/ui/list-pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

interface SP {
  page?: string;
  q?: string;
}

export default async function LessonPlansPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const query = (sp.q ?? "").trim();

  const { data: lessonPlans, count } = await getLessonPlans(page, PAGE_SIZE, query);
  const hasQuery = !!query;
  const isEmpty = !lessonPlans || lessonPlans.length === 0;

  return (
    <PageShell
      title="Lesson plans"
      description="Every plan you've built. Tap one to edit or export."
      actions={
        <Button asChild>
          <Link href="/generator/lesson-plan">
            <Plus className="mr-2 h-4 w-4" /> Create new
          </Link>
        </Button>
      }
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <ListSearchBar placeholder="Search lesson plans by title, subject, topic…" />
        {!isEmpty && (
          <div className="text-xs text-muted-foreground">
            {count} {count === 1 ? "result" : "results"}{hasQuery && ` for "${query}"`}
          </div>
        )}
      </div>

      {isEmpty ? (
        hasQuery ? (
          <EmptyState
            icon={Search}
            title="No lesson plans match that search"
            description={`Nothing matched "${query}". Try a different keyword.`}
          />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No lesson plans yet"
            description="Tell us what you're teaching and PressClass writes the plan."
            actionLabel="Generate your first plan"
            actionHref="/generator/lesson-plan"
          />
        )
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {lessonPlans.map((plan: any) => (
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
          <ListPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={count}
            basePath="/lesson-plans"
            searchParams={{ q: query || undefined }}
          />
        </>
      )}
    </PageShell>
  );
}
