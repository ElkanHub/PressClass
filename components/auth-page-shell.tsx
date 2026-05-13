// components/auth-page-shell.tsx
// Shared shell for the small auth-flow pages (sign-up-success, forgot-password,
// update-password, error). Keeps them visually consistent without re-creating
// the full split-screen used by signup/login.

import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AuthPageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function AuthPageShell({ eyebrow, title, description, children }: AuthPageShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 ambient-glow" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full gradient-drift text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            PressClass
          </Link>
        </div>
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          {eyebrow && (
            <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              {eyebrow}
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </div>
  );
}
