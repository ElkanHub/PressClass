import Link from "next/link";
import { Plus, BookOpen, Search } from "lucide-react";
import { getLessonPlans } from "@/actions/lesson-plans";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { RecordList, type RecordColumn } from "@/components/ui/record-list";
import { ListSearchBar } from "@/components/ui/list-search-bar";
import { ListPagination } from "@/components/ui/list-pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

interface SP { page?: string; q?: string; }

interface LessonPlanRow {
  id: string;
  title: string;
  subject?: string;
  topic?: string;
  sub_topic?: string;
  class_level?: string;
  date?: string;
  duration?: string;
  created_at: string;
}

const columns: RecordColumn<LessonPlanRow>[] = [
  { key: "title", label: "Title", primary: true, render: (r) => r.title, className: "w-2/5" },
  { key: "subject", label: "Subject", render: (r) => r.subject },
  { key: "topic", label: "Topic", render: (r) => [r.topic, r.sub_topic].filter(Boolean).join(" · ") },
  { key: "class", label: "Class", badge: true, render: (r) => r.class_level },
  { key: "date", label: "Date", className: "w-32", render: (r) => r.date || new Date(r.created_at).toLocaleDateString() },
];

export default async function LessonPlansPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const query = (sp.q ?? "").trim();

  const { data, count } = await getLessonPlans(page, PAGE_SIZE, query);
  const records = (data ?? []) as LessonPlanRow[];
  const hasQuery = !!query;
  const isEmpty = records.length === 0;

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
          <RecordList
            records={records}
            columns={columns}
            rowHref={(r) => `/lesson-plans/${r.id}`}
            rowKey={(r) => r.id}
          />
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
