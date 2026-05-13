// components/ui/item-card.tsx — uniform list-row card for notes / lesson plans / assessments.

import { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemMetaProps {
  icon?: LucideIcon;
  label: ReactNode;
}

interface ItemCardProps {
  href: string;
  title: string;
  subtitle?: string;
  badge?: string;
  meta?: ItemMetaProps[];
  actions?: ReactNode;
  className?: string;
}

export function ItemCard({ href, title, subtitle, badge, meta, actions, className }: ItemCardProps) {
  return (
    <div className={cn("group rounded-xl border bg-card transition-shadow hover:shadow-sm", className)}>
      <Link href={href} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold leading-tight">{title}</h3>
            {subtitle && <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {badge && (
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {badge}
            </span>
          )}
        </div>

        {meta && meta.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {meta.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                {m.icon && <m.icon className="h-3.5 w-3.5" />}
                {m.label}
              </span>
            ))}
          </div>
        )}
      </Link>
      {actions && <div className="flex items-center justify-end gap-1 border-t bg-muted/20 px-3 py-2">{actions}</div>}
    </div>
  );
}
