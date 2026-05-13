"use client";

// components/ui/list-search-bar.tsx
// URL-driven search input. Updates ?q= and resets ?page=1 on every change.
// Debounced so we don't fire a server render on every keystroke.

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ListSearchBarProps {
  placeholder?: string;
  /** Parameter name to write to. Defaults to "q". */
  param?: string;
  /** Debounce in ms. Default 300. */
  debounceMs?: number;
}

export function ListSearchBar({
  placeholder = "Search…",
  param = "q",
  debounceMs = 300,
}: ListSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get(param) ?? "";
  const [value, setValue] = useState(initial);

  // Re-sync when URL changes from outside (e.g. browser back).
  useEffect(() => {
    setValue(searchParams.get(param) ?? "");
  }, [searchParams, param]);

  useEffect(() => {
    const trimmed = value.trim();
    const current = searchParams.get(param) ?? "";
    if (trimmed === current.trim()) return;

    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) params.set(param, trimmed);
      else params.delete(param);
      params.delete("page"); // reset pagination
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }, debounceMs);

    return () => clearTimeout(t);
  }, [value, debounceMs, param, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 bg-background"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
