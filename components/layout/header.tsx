"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import SidebarContent from "@/components/layout/sidebar-content";
import { LogoutButton } from "@/components/logout-button";
import CreditsPill from "@/components/credits-pill";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    const userEmail = user?.email || "";
    const userName = user?.user_metadata?.full_name || userEmail.split("@")[0] || "User";
    const avatarUrl = user?.user_metadata?.avatar_url;

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-30 ml-0 md:ml-64">
            {/* Left: Mobile Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
                    </SheetContent>
                </Sheet>

                <HeaderSearch />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <CreditsPill />
                <ThemeSwitcher />

                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted">
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={avatarUrl} alt={userName} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {userName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{userName}</p>
                                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/account?tab=profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/account?tab=brand">Brand & school</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/account?tab=security">Security</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <LogoutButton />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

function HeaderSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initial = searchParams.get("q") ?? "";
    const [value, setValue] = useState(initial);

    useEffect(() => {
        setValue(searchParams.get("q") ?? "");
    }, [searchParams]);

    return (
        <form
            role="search"
            className="relative w-full max-w-md hidden md:block"
            onSubmit={(e) => {
                e.preventDefault();
                const q = value.trim();
                router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
            }}
        >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search your lesson plans, notes, assessments…"
                className="pl-10 bg-muted/50 border-transparent focus:bg-background rounded-full transition-colors duration-150"
            />
        </form>
    );
}
