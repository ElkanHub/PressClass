// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Settings, User, Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/generator", label: "Generator", icon: Zap },
    { href: "/classes", label: "Classes", icon: BookOpen },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-background border-r border-border/50 z-40">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="bg-primary/10 p-1.5 rounded-lg">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <span>PressClass</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200",
                                "rounded-full", // Pill shape
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-border/50 bg-muted/20">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src="/placeholder-user.png" />
                        <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">User Name</span>
                        <span className="text-xs text-muted-foreground truncate">user@example.com</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full rounded-full justify-start text-muted-foreground hover:text-destructive hover:border-destructive/50" asChild>
                    <Link href="/auth/logout">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Link>
                </Button>
            </div>
        </aside>
    );
}
