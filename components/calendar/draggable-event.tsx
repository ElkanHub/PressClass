"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DraggableEventProps {
    event: any;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export function DraggableEvent({ event, children, className, style, onClick }: DraggableEventProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: event.id,
        data: event,
    });

    const transformStyle = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={{ ...style, ...transformStyle }}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={cn(className, isDragging && "opacity-50 cursor-grabbing", "cursor-grab")}
        >
            {children}
        </div>
    );
}
