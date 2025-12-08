'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

export default function RightSidebar({ open, node, onClose, onSave }) {
    const [local, setLocal] = useState({ title: '', content: '' });

    useEffect(() => {
        const handler = (e) => {
            const id = e.detail.id;
            // find node
            const nodes = window.__REACT_FLOW_NODES__;
            if (!nodes) return;
            const found = nodes.find((n) => n.id === id);
            if (found) {
                setLocal({ title: found.data.title || '', content: found.data.content || '' });
                // set external selected node for saving
                // we cannot import state here; components communicate via events
                window.__WHITEBOARD_SELECTED__ = found;
                // show sidebar
                document.dispatchEvent(new CustomEvent('whiteboard:sidebar:open'));
            }
        };
        window.addEventListener('whiteboard:edit', handler);
        const openHandler = () => onClose(false);
        window.addEventListener('whiteboard:sidebar:open', openHandler);
        return () => window.removeEventListener('whiteboard:edit', handler);
    }, []);

    useEffect(() => {
        const sel = window.__WHITEBOARD_SELECTED__;
        if (sel) {
            setLocal({ title: sel.data.title || '', content: sel.data.content || '' });
        }
    }, [open]);

    return (
        <div className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700 transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform`}>
            <div className="p-4">
                <h3 className="text-lg font-semibold">Edit Card</h3>
                <div className="mt-4 flex flex-col gap-2">
                    <label className="text-sm">Title</label>
                    <input value={local.title} onChange={(e) => setLocal((s) => ({ ...s, title: e.target.value }))} className="w-full p-2 border rounded bg-white dark:bg-neutral-800" />
                    <label className="text-sm">Content</label>
                    <textarea value={local.content} onChange={(e) => setLocal((s) => ({ ...s, content: e.target.value }))} className="w-full p-2 border rounded bg-white dark:bg-neutral-800 h-32" />
                </div>
                <div className="mt-4 flex gap-2">
                    <Button onClick={() => {
                        const sel = window.__WHITEBOARD_SELECTED__;
                        if (sel) {
                            sel.data = { ...sel.data, ...local };
                            onSave(local);
                        }
                        onClose();
                    }}>Save</Button>
                    <Button variant="ghost" onClick={() => onClose()}>Close</Button>
                </div>
            </div>
        </div>
    );
}