import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center space-x-2 text-sm text-muted-foreground mb-6", className)}
        >
            <Link
                href="/dashboard"
                className="flex items-center hover:text-foreground transition-colors"
            >
                <Home className="h-4 w-4" />
                <span className="sr-only">Dashboard</span>
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4" />
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={cn("font-medium text-foreground", isLast && "pointer-events-none")}>
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
