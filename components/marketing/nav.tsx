"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Tighten the bar after a few pixels of scroll for a subtle "stickier" feel.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="px-3 sm:px-6 pt-3 sm:pt-4">
        <nav
          className={cn(
            "mx-auto flex items-center justify-between transition-[box-shadow,padding] duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]",
            "max-w-5xl bg-background/70 backdrop-blur-xl border border-border/60 nav-shape",
            scrolled
              ? "shadow-[0_18px_44px_-22px_rgba(15,118,110,0.35)] py-2 pl-3 pr-2"
              : "shadow-[0_10px_28px_-18px_rgba(15,118,110,0.25)] py-2.5 pl-4 pr-2.5"
          )}
        >
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full gradient-drift text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>PressClass</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  pathname === l.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Link
              href="/auth/login"
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/80 hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:brightness-110 transition"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {open && (
        <div className="md:hidden px-3 pt-3">
          <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-lg overflow-hidden">
            <div className="p-3 space-y-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-2.5 text-base font-medium",
                    pathname === l.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="border-t bg-muted/30 p-3 flex gap-2">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center rounded-xl border bg-background py-2.5 text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setOpen(false)}
                className="flex-1 text-center rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
