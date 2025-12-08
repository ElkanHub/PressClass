'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Node } from 'reactflow';

interface RightSidebarProps {
    open: boolean;
    node: Node | null;
    onClose: () => void;
    onSave: (updates: { title: string; content: string }) => void;
}

export default function RightSidebar({ open, node, onClose, onSave }: RightSidebarProps) {
    const [local, setLocal] = useState({ title: '', content: '' });

    useEffect(() => {
        // IMPORTANT: TS FIX — accept Event, then cast to CustomEvent
        const handler = (evt: Event) => {
            const e = evt as CustomEvent<{ id: string }>;
            const id = e.detail?.id;
            if (!id) return;

            const nodes = (window as any).__REACT_FLOW_NODES__;
            if (!nodes) return;

            const found = nodes.find((n: any) => n.id === id);
            if (found) {
                setLocal({
                    title: found.data.title || '',
                    content: found.data.content || '',
                });

                (window as any).__WHITEBOARD_SELECTED__ = found;

                // signal sidebar open
                document.dispatchEvent(new CustomEvent('whiteboard:sidebar:open'));
            }
        };

        window.addEventListener('whiteboard:edit', handler as EventListener);

        const openHandler = () => onClose();
        window.addEventListener('whiteboard:sidebar:open', openHandler as EventListener);

        return () => {
            window.removeEventListener('whiteboard:edit', handler as EventListener);
            window.removeEventListener('whiteboard:sidebar:open', openHandler as EventListener);
        };
    }, [onClose]);

    useEffect(() => {
        const sel = (window as any).__WHITEBOARD_SELECTED__;
        if (sel) {
            setLocal({
                title: sel.data.title || '',
                content: sel.data.content || '',
            });
        }
    }, [open]);

    return (
        <div
            className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700 transform ${
                open ? 'translate-x-0' : 'translate-x-full'
            } transition-transform`}
        >
            <div className="p-4">
                <h3 className="text-lg font-semibold">Edit Card</h3>
                <div className="mt-4 flex flex-col gap-2">
                    <label className="text-sm">Title</label>
                    <input
                        value={local.title}
                        onChange={(e) => setLocal((s) => ({ ...s, title: e.target.value }))}
                        className="w-full p-2 border rounded bg-white dark:bg-neutral-800"
                    />
                    <label className="text-sm">Content</label>
                    <textarea
                        value={local.content}
                        onChange={(e) => setLocal((s) => ({ ...s, content: e.target.value }))}
                        className="w-full p-2 border rounded bg-white dark:bg-neutral-800 h-32"
                    />
                </div>

                <div className="mt-4 flex gap-2">
                    <Button
                        onClick={() => {
                            const sel = (window as any).__WHITEBOARD_SELECTED__;
                            if (sel) {
                                sel.data = { ...sel.data, ...local };
                                onSave(local);
                            }
                            onClose();
                        }}
                    >
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
