'use client';

import React from 'react';
import { Handle, Position } from 'reactflow';
import { Button } from '@/components/ui/button';

export default function CustomNode({ data, id }) {
    return (
        <div className="w-64 rounded-lg shadow p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{data.title}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">{data.content}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <Button size="icon" variant="ghost" onClick={() => {
                        // dispatch an event to open right sidebar
                        const event = new CustomEvent('whiteboard:edit', { detail: { id } });
                        window.dispatchEvent(event);
                    }}>Edit</Button>
                </div>
            </div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    );
}