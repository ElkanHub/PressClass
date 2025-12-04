"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    const searchParams = useSearchParams();

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={createPageUrl(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </Button>

            <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </div>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={createPageUrl(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}
