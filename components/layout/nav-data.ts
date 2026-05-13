import { Home, BookOpen, Zap, Calendar, Pen, Clock, Coins, Settings } from "lucide-react";

export const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/generator", label: "Generator", icon: Zap },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/study-time", label: "Study Time", icon: Clock },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/whiteboard", label: "Planning Board", icon: Pen },
    { href: "/credits", label: "Credits", icon: Coins },
    { href: "/account", label: "Account", icon: Settings },
];
