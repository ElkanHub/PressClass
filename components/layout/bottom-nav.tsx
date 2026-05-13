"use client";

// components/layout/bottom-nav.tsx
// Native-feeling bottom tab bar shown only on mobile (md:hidden) inside the
// protected layout. The middle "Generate" tab is elevated as a primary action.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  href: string;
  label: string;
  icon: typeof Home;
  matches: (path: string) => boolean;
}

const tabs: Tab[] = [
  { href: "/dashboard",    label: "Home",  icon: Home,      matches: (p) => p === "/dashboard" || p.startsWith("/search") },
  { href: "/lesson-plans", label: "Plans", icon: BookOpen,  matches: (p) => p.startsWith("/lesson-plans") },
  // generator slot rendered separately as elevated CTA
  { href: "/notes",        label: "Notes", icon: FileText,  matches: (p) => p.startsWith("/notes") },
  { href: "/account",      label: "Account", icon: Settings, matches: (p) => p.startsWith("/account") || p.startsWith("/credits") },
];

export function BottomNav() {
  const pathname = usePathname();
  const generatorActive = pathname.startsWith("/generator");

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pb-[max(0px,env(safe-area-inset-bottom))]"
    >
      {/* subtle top fade so cards behind the bar don't feel cut off */}
      <div className="pointer-events-none absolute -top-6 inset-x-0 h-6 bg-gradient-to-t from-background to-transparent" />

      <div className="relative bg-background/90 backdrop-blur-xl border-t border-border/70">
        <ul className="grid grid-cols-5 items-end px-2 pt-2">
          {tabs.slice(0, 2).map((t) => (
            <li key={t.href}><TabLink tab={t} active={t.matches(pathname)} /></li>
          ))}

          {/* Elevated Generate button */}
          <li className="flex justify-center">
            <Link
              href="/generator"
              aria-label="Generate"
              className={cn(
                "relative inline-flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full shadow-lg shadow-primary/30 transition-transform active:scale-95",
                generatorActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary text-primary-foreground hover:brightness-110"
              )}
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </Link>
          </li>

          {tabs.slice(2).map((t) => (
            <li key={t.href}><TabLink tab={t} active={t.matches(pathname)} /></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function TabLink({ tab, active }: { tab: Tab; active: boolean }) {
  const Icon = tab.icon;
  return (
    <Link
      href={tab.href}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "stroke-[2.4]" : "")} />
      <span>{tab.label}</span>
    </Link>
  );
}
