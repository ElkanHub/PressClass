import Link from "next/link";
import { Plus, FileText, Search } from "lucide-react";
import { getNotes } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { RecordList, type RecordColumn } from "@/components/ui/record-list";
import { ListSearchBar } from "@/components/ui/list-search-bar";
import { ListPagination } from "@/components/ui/list-pagination";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

interface SP { page?: string; q?: string; }

interface NoteRow {
  id: string;
  title: string;
  subject?: string;
  strand?: string;
  sub_strand?: string;
  class_level?: string;
  date?: string;
  duration?: string;
  created_at: string;
}

const columns: RecordColumn<NoteRow>[] = [
  { key: "title", label: "Title", primary: true, render: (r) => r.title, className: "w-2/5" },
  { key: "subject", label: "Subject", render: (r) => r.subject },
  { key: "strand", label: "Topic", render: (r) => [r.strand, r.sub_strand].filter(Boolean).join(" · ") },
  { key: "class", label: "Class", badge: true, render: (r) => r.class_level },
  { key: "date", label: "Date", className: "w-32", render: (r) => r.date || new Date(r.created_at).toLocaleDateString(), hideOnMobile: false },
];

export default async function NotesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const query = (sp.q ?? "").trim();

  const { data, count } = await getNotes(page, PAGE_SIZE, query);
  const records = (data ?? []) as NoteRow[];
  const hasQuery = !!query;
  const isEmpty = records.length === 0;

  return (
    <PageShell
      title="Notes"
      description="Topic notes you can share or print for students."
      actions={
        <Button asChild>
          <Link href="/generator/notes"><Plus className="mr-2 h-4 w-4" /> Create new</Link>
        </Button>
      }
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <ListSearchBar placeholder="Search notes by title, subject, strand…" />
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
            title="No notes match that search"
            description={`Nothing matched "${query}". Try a different keyword.`}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="No notes yet"
            description="Generate clean, student-ready notes in a few seconds."
            actionLabel="Create your first set"
            actionHref="/generator/notes"
          />
        )
      ) : (
        <>
          <RecordList
            records={records}
            columns={columns}
            rowHref={(r) => `/notes/${r.id}`}
            rowKey={(r) => r.id}
          />
          <ListPagination
            page={page}
            pageSize={PAGE_SIZE}
            total={count}
            basePath="/notes"
            searchParams={{ q: query || undefined }}
          />
        </>
      )}
    </PageShell>
  );
}
