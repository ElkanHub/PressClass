"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-amber-500 text-white text-sm py-2 px-4 shadow-md"
    >
      <WifiOff className="h-4 w-4" />
      <span>You're offline — cached pages still work.</span>
    </div>
  );
}
