// components/ui/list-pagination.tsx
// Server-rendered link-based pagination. Keeps existing search params intact.

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  /** Base path. e.g. "/notes". */
  basePath: string;
  /** Existing search params to preserve. */
  searchParams?: Record<string, string | undefined>;
  className?: string;
}

export function ListPagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams = {},
  className,
}: ListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function buildHref(p: number): string {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v != null && v !== "" && k !== "page") params.set(k, v);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = pageRange(page, totalPages);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-between gap-3 flex-wrap", className)}
    >
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}</span>–
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>
      <div className="inline-flex items-center gap-1">
        <PageLink href={buildHref(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </PageLink>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="px-2 text-muted-foreground">…</span>
          ) : (
            <PageLink
              key={p}
              href={buildHref(p)}
              active={p === page}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </PageLink>
          )
        )}
        <PageLink href={buildHref(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  [k: string]: any;
}) {
  const base =
    "inline-flex items-center justify-center min-w-[2.25rem] h-9 px-3 rounded-md text-sm font-medium transition";
  const cls = active
    ? "bg-primary text-primary-foreground"
    : "border bg-background text-foreground/80 hover:bg-muted";
  if (disabled) {
    return (
      <span
        aria-disabled
        className={cn(base, "border bg-muted/40 text-muted-foreground/60 cursor-not-allowed")}
      >
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={cn(base, cls)} {...rest}>
      {children}
    </Link>
  );
}

/** Returns the page numbers to show, with "ellipsis" markers. */
function pageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) out.push("ellipsis");
  for (let p = left; p <= right; p++) out.push(p);
  if (right < total - 1) out.push("ellipsis");
  out.push(total);
  return out;
}
