import Link from "next/link";
import { Plus, FileText, Calendar, Clock, Search } from "lucide-react";
import { getNotes } from "@/actions/notes";
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

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1") || 1);
  const query = (sp.q ?? "").trim();

  const { data: notes, count } = await getNotes(page, PAGE_SIZE, query);
  const hasQuery = !!query;
  const isEmpty = !notes || notes.length === 0;

  return (
    <PageShell
      title="Notes"
      description="Topic notes you can share or print for students."
      actions={
        <Button asChild>
          <Link href="/generator/notes">
            <Plus className="mr-2 h-4 w-4" /> Create new
          </Link>
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note: any) => (
              <ItemCard
                key={note.id}
                href={`/notes/${note.id}`}
                title={note.title}
                subtitle={[note.strand, note.sub_strand].filter(Boolean).join(" · ")}
                badge={note.class_level}
                meta={[
                  { icon: Calendar, label: note.date || new Date(note.created_at).toLocaleDateString() },
                  note.duration ? { icon: Clock, label: note.duration } : null,
                ].filter(Boolean) as any}
              />
            ))}
          </div>
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
