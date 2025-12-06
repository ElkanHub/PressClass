"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/layout/nav-data";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/logout-button";

interface SidebarContentProps {
    onLinkClick?: () => void;
}

export default function SidebarContent({ onLinkClick }: SidebarContentProps) {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, []);

    const userRole = user?.user_metadata?.user_type || "regular";
    const userEmail = user?.email || "";
    const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "User";
    const avatarUrl = user?.user_metadata?.avatar_url;

    return (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary" onClick={onLinkClick}>
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
                            onClick={onLinkClick}
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
                {!loading && user ? (
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">{userName}</span>
                            <span className="text-xs text-muted-foreground truncate capitalize">{userRole}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 mb-4 px-2 opacity-50">
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                        <div className="flex flex-col gap-1">
                            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                )}
                <LogoutButton />
            </div>
        </div>
    );
}
