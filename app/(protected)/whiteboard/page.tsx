// File: app/(protected)/whiteboard/page.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    Node,
    NodeTypes,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import CustomNode from '@/components/whiteboard/customNode';
import RightSidebar from '@/components/whiteboard/rightSideBar';
import { createClient } from '@/lib/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Minimal styles: container should respect parent theme (tailwind)
export default function WhiteboardPage({ }) {
    const supabase = createClient();
    const nodeTypes = useMemo(() => ({ customCard: CustomNode }), []);

    const [nodes, setNodes] = useState<Node[]>([]);
    const [rfInstance, setRfInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [boardId, setBoardId] = useState<string | null>(null);

    // Zoom limits
    const minZoom = 0.25;
    const maxZoom = 2.5;

    useEffect(() => {
        // load a default board or last saved
        (async () => {
            // For demo we create a temp board; in real app user chooses
            const { data: boards } = await supabase.from('boards').select('*').limit(1);
            if (boards && boards.length) {
                setBoardId(boards[0].id);
                loadNodes(boards[0].id);
            } else {
                const newId = uuidv4();
                const user = (await supabase.auth.getUser()).data.user;
                const insert = await supabase.from('boards').insert({ id: newId, user_id: user?.id, title: 'My Board' });
                setBoardId(newId);
            }
        })();
    }, []);

    const loadNodes = useCallback(async (bId: string) => {
        const { data } = await supabase.from('board_nodes').select('*').eq('board_id', bId);
        if (data) {
            const loaded = data.map((r: any) => ({
                id: r.id,
                type: r.type || 'customCard',
                position: r.position,
                data: r.data,
            }));
            setNodes(loaded);
        }
    }, []);

    const saveNode = useCallback(async (node: any) => {
        if (!boardId) return;
        const user = (await supabase.auth.getUser()).data.user;
        const payload = {
            id: node.id,
            board_id: boardId,
            user_id: user?.id,
            type: node.type || 'customCard',
            data: node.data,
            position: node.position,
        };
        await supabase.from('board_nodes').upsert(payload).eq('id', node.id);
    }, [boardId]);

    const onNodesChange = useCallback((changes) => {
        // reactflow gives changes; we simply map
        setNodes((nds) => nds.map((n) => {
            const change = changes.find((c) => c.id === n.id);
            if (!change) return n;
            if (change.type === 'position') {
                return { ...n, position: (change as any).position };
            }
            return n;
        }));
    }, []);

    const onNodeDragStop = useCallback(async (event, node) => {
        // Save position
        await saveNode(node);
    }, [saveNode]);

    const addCard = useCallback((preset?: string) => {
        const id = uuidv4();
        const basePos = { x: 100 + Math.random() * 400, y: 100 + Math.random() * 400 };
        const data = preset === 'todo' ? { title: 'Todo', content: 'To do...' } : preset === 'lesson' ? { title: 'Lesson', content: 'Lesson details...' } : { title: 'Card', content: 'Write anything...' };
        const node = { id, type: 'customCard', position: basePos, data };
        setNodes((nds) => [...nds, node]);
        // Save
        saveNode(node);
    }, [saveNode]);

    const fitView = useCallback(() => {
        if (!rfInstance) return;
        // @ts-ignore
        rfInstance.fitView({ padding: 0.1 });
    }, [rfInstance]);

    const exportAsImage = useCallback(async () => {
        const el = document.querySelector('.react-flow__renderer');
        if (!el) return;
        const canvas = await html2canvas(el as HTMLElement, { useCORS: true, scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'landscape' });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('board.pdf');
    }, []);

    // Snap to grid on drag stop
    const onNodeDrag = useCallback((event, node) => {
        // optional real-time snapping
    }, []);

    const onNodeDoubleClick = useCallback((evt, node) => {
        // don't open editor on tap — use Edit button on node
    }, []);

    return (
        <div className="w-full h-[85vh] bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center gap-2 p-3">
                <Button onClick={() => addCard('lesson')} className="flex items-center gap-2"><Plus />Add Lesson</Button>
                <Button onClick={() => addCard('todo')} className="flex items-center gap-2"><Plus />Add Todo</Button>
                <Button onClick={() => addCard()} className="flex items-center gap-2"><Plus />Add Card</Button>
                <Button onClick={fitView}>Center View</Button>
                <Button onClick={exportAsImage}>Export PDF</Button>
            </div>

            <div style={{ width: '100%', height: 'calc(85vh - 56px)' }}>
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        onNodesChange={setNodes}
                        onNodeDragStop={onNodeDragStop}
                        nodeTypes={nodeTypes}
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                        fitView
                        snapToGrid={true}
                        snapGrid={[20, 20]}
                        onInit={(instance) => setRfInstance(instance)}
                        onNodeDoubleClick={onNodeDoubleClick}
                    >
                        <Background gap={20} />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>

            <RightSidebar open={isSidebarOpen} node={selectedNode} onClose={() => setIsSidebarOpen(false)} onSave={async (updates) => {
                if (!selectedNode) return;
                const newNode = { ...selectedNode, data: { ...selectedNode.data, ...updates } };
                setNodes((nds) => nds.map((n) => n.id === newNode.id ? newNode : n));
                await saveNode(newNode);
            }} />
        </div>
    );
}