"use client";

// components/document-view/index.tsx
// Shared primitives for the in-app document reader. Mirrors lib/pdf/templates.ts
// so what teachers edit on screen visually matches what they download as a PDF.
// Supports inline edit mode + light/dark themes + responsive layout.

import { ReactNode, useId } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Paper — outer "page" container. Uses card token so it adapts to dark mode
// while still feeling like a sheet of paper. Header bar at the top echoes the
// branded-PDF header.
// ---------------------------------------------------------------------------

interface DocumentPaperProps {
  children: ReactNode;
  className?: string;
}

export function DocumentPaper({ children, className }: DocumentPaperProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm",
        "max-w-4xl mx-auto",
        className
      )}
    >
      <div className="h-2 bg-primary" />
      <div className="h-[3px] bg-accent" />
      <div className="px-5 py-8 sm:px-10 sm:py-12 space-y-10">{children}</div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Header — title + subtitle (subject • class). Title is editable inline.
// ---------------------------------------------------------------------------

interface DocumentHeaderProps {
  title: string;
  subtitle?: ReactNode;
  editing?: boolean;
  onTitleChange?: (v: string) => void;
}

export function DocumentHeader({ title, subtitle, editing, onTitleChange }: DocumentHeaderProps) {
  return (
    <header className="space-y-2">
      {editing && onTitleChange ? (
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="h-auto py-1 px-2 text-2xl sm:text-3xl font-bold border-2 border-dashed"
        />
      ) : (
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{title}</h1>
      )}
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Meta grid — label/value pairs. Responsive: 2 cols on small, 3 on >=sm.
// ---------------------------------------------------------------------------

export interface MetaField {
  label: string;
  value: string | null | undefined;
  field?: string; // only required when editing
  editable?: boolean;
}

interface DocumentMetaProps {
  fields: MetaField[];
  editing?: boolean;
  onChange?: (field: string, value: string) => void;
}

export function DocumentMeta({ fields, editing, onChange }: DocumentMetaProps) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 border-y py-5 -mx-1 px-1">
      {fields.map((f) => (
        <MetaCell
          key={f.label}
          field={f}
          editing={!!editing && !!f.editable}
          onChange={onChange}
        />
      ))}
    </section>
  );
}

function MetaCell({
  field,
  editing,
  onChange,
}: {
  field: MetaField;
  editing: boolean;
  onChange?: (field: string, value: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {field.label}
      </div>
      {editing && field.field && onChange ? (
        <Input
          id={id}
          value={field.value ?? ""}
          onChange={(e) => onChange(field.field!, e.target.value)}
          className="mt-1 h-8"
        />
      ) : (
        <div className="mt-1 font-medium break-words">{field.value || "—"}</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section — eyebrow heading + underline + content. Mirrors PDF section heading.
// ---------------------------------------------------------------------------

interface DocumentSectionProps {
  label: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DocumentSection({ label, actions, children }: DocumentSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {label}
          </div>
          <div className="h-[2px] w-10 bg-primary" />
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Paragraph — display text (optionally editable via prop).
// ---------------------------------------------------------------------------

interface DocumentParagraphProps {
  value?: string;
  editing?: boolean;
  onChange?: (v: string) => void;
  placeholder?: string;
  emphasis?: boolean;
  minRows?: number;
}

export function DocumentParagraph({
  value,
  editing,
  onChange,
  placeholder = "—",
  emphasis,
  minRows = 4,
}: DocumentParagraphProps) {
  if (editing && onChange) {
    return (
      <Textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="resize-y border-2 border-dashed"
      />
    );
  }
  if (!value) return <p className="text-sm text-muted-foreground italic">{placeholder}</p>;

  // Preserve paragraph breaks like the PDF does.
  const paragraphs = value.split(/\n\n+/).filter(Boolean);
  return (
    <div className={cn("space-y-3 leading-relaxed", emphasis ? "font-medium" : "")}>
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line">{p}</p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bullet list with editable add/remove/edit.
// ---------------------------------------------------------------------------

interface DocumentBulletListProps {
  items?: string[];
  editing?: boolean;
  onChange?: (items: string[]) => void;
  placeholder?: string;
}

export function DocumentBulletList({
  items,
  editing,
  onChange,
  placeholder = "No items.",
}: DocumentBulletListProps) {
  const list = items ?? [];

  if (!editing) {
    if (!list.length) return <p className="text-sm text-muted-foreground italic">{placeholder}</p>;
    return (
      <ul className="space-y-2">
        {list.map((item, i) => (
          <li key={i} className="flex gap-3 leading-relaxed">
            <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  function update(i: number, value: string) {
    if (!onChange) return;
    const next = [...list];
    next[i] = value;
    onChange(next);
  }
  function add() {
    if (!onChange) return;
    onChange([...list, ""]);
  }
  function remove(i: number) {
    if (!onChange) return;
    const next = [...list];
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {list.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <GripVertical className="mt-2 h-4 w-4 text-muted-foreground/50 shrink-0" />
          <Input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 border-2 border-dashed"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            className="text-muted-foreground hover:text-destructive shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="mr-1.5 h-3.5 w-3.5" /> Add item
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Callout — tinted box used for activities, lesson stages, etc.
// ---------------------------------------------------------------------------

interface DocumentCalloutProps {
  label?: string;
  tone?: "primary" | "accent";
  value?: string;
  editing?: boolean;
  onChange?: (v: string) => void;
  minRows?: number;
  placeholder?: string;
}

export function DocumentCallout({
  label,
  tone = "primary",
  value,
  editing,
  onChange,
  minRows = 4,
  placeholder = "—",
}: DocumentCalloutProps) {
  const toneClasses =
    tone === "primary"
      ? "bg-primary/[0.06] border-primary/30"
      : "bg-accent/10 border-accent/40";
  const ink = tone === "primary" ? "text-primary" : "text-accent";

  return (
    <div className={cn("rounded-xl border p-4 sm:p-5", toneClasses)}>
      {label && (
        <div className={cn("text-[10px] font-semibold uppercase tracking-widest mb-2", ink)}>
          {label}
        </div>
      )}
      {editing && onChange ? (
        <Textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={minRows}
          placeholder={placeholder}
          className="resize-y bg-background/80 border-2 border-dashed"
        />
      ) : (
        <DocumentParagraph value={value} placeholder={placeholder} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action bar — sticky toolbar above the paper. Standardized across details.
// ---------------------------------------------------------------------------

interface DocumentActionBarProps {
  /** Optional eyebrow label (e.g. "Notes", "Lesson plan", "Assessment"). */
  eyebrow?: string;
  meta?: ReactNode;
  actions: ReactNode;
}

export function DocumentActionBar({ eyebrow, meta, actions }: DocumentActionBarProps) {
  return (
    <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 mb-6 bg-background/85 backdrop-blur-xl border-b">
      <div className="px-4 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-4xl mx-auto">
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </div>
          )}
          {meta && <div className="text-sm text-muted-foreground truncate">{meta}</div>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">{actions}</div>
      </div>
    </div>
  );
}
