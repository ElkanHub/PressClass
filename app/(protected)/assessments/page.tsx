import Link from "next/link";
import { Plus, ClipboardCheck, Calendar, Search } from "lucide-react";
import { getAssessments } from "@/actions/assessments";
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

export default async function AssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const query = (sp.q ?? "").trim();

  const { data: assessments, count } = await getAssessments(page, PAGE_SIZE, query);
  const hasQuery = !!query;
  const isEmpty = !assessments || assessments.length === 0;

  return (
    <PageShell
      title="Assessments"
      description="Quizzes and tests you've built — ready to print."
      actions={
        <Button asChild>
          <Link href="/generator/assessment">
            <Plus className="mr-2 h-4 w-4" /> Create new
          </Link>
        </Button>
      }
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <ListSearchBar placeholder="Search assessments by title, topic, class…" />
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
            title="No assessments match that search"
            description={`Nothing matched "${query}". Try a different keyword.`}
          />
        ) : (
          <EmptyState
            icon={ClipboardCheck}
            title="No assessments yet"
            description="Generate a mixed-difficulty quiz in under a minute."
            actionLabel="Create your first assessment"
            actionHref="/generator/assessment"
          />
        )
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {assessments.map((a: any) => (
              <ItemCard
                key={a.id}
                href={`/assessments/${a.id}`}
                title={a.title}
                subtitle={a.topic}
                badge={a.class_level}
                meta={[
                  { icon: ClipboardCheck, label: `${a.questions?.length ?? 0} questions` },
                  { icon: Calendar, label: new Date(a.created_at).toLocaleDateString() },
                ]}
              />
            ))}
          </div>
          <ListPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={count}
            basePath="/assessments"
            searchParams={{ q: query || undefined }}
          />
        </>
      )}
    </PageShell>
  );
}
