// components/ui/record-list.tsx
// Records table with two presentations:
//   md+ : real <table> with header row, hover, primary (title) cell links
//   sm- : stacked rows (compact card per record) — same data, no overflow
//
// Type-safe: pass a list of T plus a column spec describing how to render each
// field. The first column flagged `primary` is the row title (bigger, bolder).

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RecordColumn<T> {
  /** Stable key — also used as <th> id. */
  key: string;
  /** Header label. */
  label: string;
  /** Cell content. Returning null/undefined/empty renders an em-dash. */
  render: (row: T) => ReactNode;
  /** True for the primary "title" column — bolder, larger, clickable. */
  primary?: boolean;
  /** Render this cell as a small pill badge. */
  badge?: boolean;
  /** Hide on mobile. Useful for low-priority cols. */
  hideOnMobile?: boolean;
  /** Column width hint, applied as className on <th>/<td>. */
  className?: string;
  /** Align right (e.g. counts). */
  align?: "left" | "right";
}

interface RecordListProps<T> {
  records: T[];
  columns: RecordColumn<T>[];
  rowHref: (row: T) => string;
  /** Stable row id for React key. */
  rowKey: (row: T) => string;
  className?: string;
}

export function RecordList<T>({
  records,
  columns,
  rowHref,
  rowKey,
  className,
}: RecordListProps<T>) {
  return (
    <div className={cn("rounded-xl border bg-card overflow-hidden", className)}>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 font-medium",
                    col.align === "right" ? "text-right" : "text-left",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((row) => {
              const href = rowHref(row);
              return (
                <tr
                  key={rowKey(row)}
                  className="border-b last:border-b-0 hover:bg-muted/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 align-middle",
                        col.align === "right" ? "text-right" : "text-left",
                        col.className
                      )}
                    >
                      <Cell col={col} row={row} href={col.primary ? href : undefined} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked rows */}
      <ul className="md:hidden divide-y">
        {records.map((row) => {
          const primary = columns.find((c) => c.primary);
          const rest = columns.filter((c) => !c.primary && !c.hideOnMobile);
          return (
            <li key={rowKey(row)}>
              <Link
                href={rowHref(row)}
                className="block px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                {primary && (
                  <div className="text-sm font-semibold leading-snug">
                    {emptyOrContent(primary.render(row))}
                  </div>
                )}
                {rest.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {rest.map((col) => {
                      const content = col.render(row);
                      if (content === null || content === undefined || content === "") return null;
                      return (
                        <span key={col.key} className="inline-flex items-center gap-1">
                          {col.badge ? (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                              {content}
                            </span>
                          ) : (
                            content
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Cell<T>({
  col,
  row,
  href,
}: {
  col: RecordColumn<T>;
  row: T;
  href?: string;
}) {
  const content = col.render(row);
  const empty = content === null || content === undefined || content === "";

  if (empty) {
    return <span className="text-muted-foreground/60">—</span>;
  }

  if (col.badge) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
        {content}
      </span>
    );
  }

  if (col.primary) {
    return (
      <Link
        href={href ?? "#"}
        className="font-semibold text-foreground hover:text-primary hover:underline underline-offset-4"
      >
        {content}
      </Link>
    );
  }

  return <span className="text-foreground/80">{content}</span>;
}

function emptyOrContent(content: ReactNode): ReactNode {
  if (content === null || content === undefined || content === "") return "—";
  return content;
}
