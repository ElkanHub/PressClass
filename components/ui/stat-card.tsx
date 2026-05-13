import { ReactNode } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: LucideIcon;
  href?: string;
  tone?: "default" | "primary";
  className?: string;
}

export function StatCard({ label, value, hint, icon: Icon, href, tone = "default", className }: StatCardProps) {
  const body = (
    <div
      className={cn(
        "rounded-xl border p-5 transition-colors",
        tone === "primary"
          ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
          : "bg-card hover:border-foreground/20",
        className
      )}
    >
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">{label}</span>
        {Icon && <Icon className="h-4 w-4" />}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}
