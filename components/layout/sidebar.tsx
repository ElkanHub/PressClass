"use client";

import SidebarContent from "@/components/layout/sidebar-content";

export default function Sidebar() {
    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-background border-r border-border/50 z-40">
            <SidebarContent />
        </aside>
    );
}
