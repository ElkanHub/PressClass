import { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  secondary?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, secondary }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
      {Icon && (
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-background">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {(actionLabel && actionHref) || secondary ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          {actionLabel && actionHref && (
            <Button asChild>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          )}
          {secondary}
        </div>
      ) : null}
    </div>
  );
}
