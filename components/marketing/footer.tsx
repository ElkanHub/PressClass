import Link from "next/link";
import { Sparkles } from "lucide-react";

export function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            PressClass
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            The AI productivity toolkit built for African teachers.
          </p>
        </div>

        <FooterColumn
          title="Product"
          links={[
            ["Features", "/features"],
            ["Pricing", "/pricing"],
            ["FAQs", "/faqs"],
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            ["About", "/about"],
            ["Contact", "mailto:hello@pressclass.app"],
          ]}
        />
        <FooterColumn
          title="Get started"
          links={[
            ["Sign in", "/auth/login"],
            ["Create account", "/auth/signup"],
          ]}
        />
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <span>© {year} PressClass. Built for African educators.</span>
          <span>Made with ☕ across the continent.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-foreground/80 hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
