import Link from "next/link";
import { Plus, ClipboardCheck, Search } from "lucide-react";
import { getAssessments } from "@/actions/assessments";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { RecordList, type RecordColumn } from "@/components/ui/record-list";
import { ListSearchBar } from "@/components/ui/list-search-bar";
import { ListPagination } from "@/components/ui/list-pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

interface SP { page?: string; q?: string; }

interface AssessmentRow {
  id: string;
  title: string;
  topic?: string;
  class_level?: string;
  questions?: any[];
  created_at: string;
}

const columns: RecordColumn<AssessmentRow>[] = [
  { key: "title", label: "Title", primary: true, render: (r) => r.title, className: "w-2/5" },
  { key: "topic", label: "Topic", render: (r) => r.topic },
  { key: "class", label: "Class", badge: true, render: (r) => r.class_level },
  { key: "questions", label: "Questions", align: "right", className: "w-28", render: (r) => r.questions?.length ?? 0 },
  { key: "date", label: "Created", className: "w-32", render: (r) => new Date(r.created_at).toLocaleDateString() },
];

export default async function AssessmentsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const query = (sp.q ?? "").trim();

  const { data, count } = await getAssessments(page, PAGE_SIZE, query);
  const records = (data ?? []) as AssessmentRow[];
  const hasQuery = !!query;
  const isEmpty = records.length === 0;

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
          <RecordList
            records={records}
            columns={columns}
            rowHref={(r) => `/assessments/${r.id}`}
            rowKey={(r) => r.id}
          />
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
