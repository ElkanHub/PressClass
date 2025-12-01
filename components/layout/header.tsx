import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu, Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { navItems } from "@/components/layout/nav-data";
import { cn } from "@/lib/utils";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-30 ml-0 md:ml-64 transition-all duration-300">
            {/* Left: Mobile Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <div className="flex flex-col h-full">
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
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search assessments, classes..."
                        className="pl-10 bg-muted/50 border-transparent focus:bg-background rounded-full transition-all duration-200"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <ThemeSwitcher />

                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-muted">
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src="/placeholder-user.png" alt="User" />
                                <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">User Name</p>
                                <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
