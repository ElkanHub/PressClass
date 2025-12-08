import { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface HeroAction {
  label: ReactNode;
  href: string;
  variant?: "default" | "outline";
}

interface HeroProps {
  title: ReactNode;
  subtitle: string;
  actions?: HeroAction[];
  badge?: {
    icon?: ReactNode;
    text: string;
  };
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
  className?: string;
}

export function Hero({
  title,
  subtitle,
  actions = [],
  badge,
  titleClassName = "text-5xl md:text-7xl font-bold tracking-tight mb-6",
  subtitleClassName = "text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed",
  actionsClassName = "flex flex-col sm:flex-row gap-4 justify-center items-center",
  className = "",
}: HeroProps) {
  return (
    <section
      className={`relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
        {badge && (
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            {badge.icon || <Sparkles className="mr-2 h-4 w-4" />}
            {badge.text}
          </div>
        )}

        <h1 className={titleClassName}>{title}</h1>

        <p className={subtitleClassName}>{subtitle}</p>

        {actions.length > 0 && (
          <div className={actionsClassName}>
            {actions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={
                  action.variant === "outline"
                    ? "inline-flex items-center justify-center rounded-full border border-input bg-background/50 px-8 py-4 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-all"
                    : "inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                }
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
