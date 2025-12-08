// README.md
// React Flow Whiteboard - PressClass
// Paste this folder inside your Next.js app (App Router). Uses React Flow, Tailwind, shadcn UI and Supabase.

/*
ENVIRONMENT (add to .env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=your_service_role_key (only for server-side ops, keep secret)

INSTALL
npm install reactflow @supabase/supabase-js html2canvas jspdf framer-motion @radix-ui/react-dialog

TAILWIND
This assumes Tailwind is configured. shadcn components already follow Tailwind.

USAGE
1. Copy the `whiteboard` folder into `app/(protected)/whiteboard` or a page route you want.
2. Ensure Tailwind classes and dark mode are configured (class strategy recommended).
3. Run dev and visit the page.

SECURITY NOTES
- Never expose the SERVICE_ROLE key to the client. Use it only on server endpoints (edge or server actions) for secure DB writes.
- For client saving/loading use anon key but enforce RLS policies in Supabase to allow only the authorized user to read/write their boards.
- Use server actions or API routes to perform privileged operations.

---

// supabase-schema.sql
-- Run this in Supabase SQL editor

CREATE TABLE IF NOT EXISTS boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS board_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES boards(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  data jsonb NOT NULL,
  position jsonb NOT NULL,
  z_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Policies (example)
-- Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_nodes ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own boards (adjust as needed)
CREATE POLICY "Boards: users can manage their boards" ON boards
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "BoardNodes: users can manage their nodes" ON board_nodes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


---

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
import CustomNode from '@/whiteboard/components/CustomNode';
import RightSidebar from '@/whiteboard/components/RightSidebar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Minimal styles: container should respect parent theme (tailwind)
export default function WhiteboardPage({}) {
  const supabase = createClientComponentClient();
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


// File: whiteboard/components/CustomNode.tsx
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


// File: whiteboard/components/RightSidebar.tsx
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


// File: whiteboard/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

// NOTE: For privileged operations use a server-side client created with the service role key.


// File: app/(protected)/whiteboard/route.ts (server route for saving board snapshot if needed)
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

export async function POST(req) {
  const body = await req.json();
  // validate, auth, etc - this route must be server-only
  // use body.nodes, body.boardId
  const { boardId, nodes, title } = body;
  // upsert nodes server-side using service role key
  // implement validation
  return NextResponse.json({ ok: true });
}


// Integration tips (security & RLS)
// - Use Supabase RLS policies to restrict reads/writes to the logged-in user.
// - For client-side saving use anon key with RLS enforced. For server-side bulk ops or backups use service role key in server routes only.
// - Store positions as { x: number, y: number }
// - Save node data frequently but debounce saves to avoid excess writes.

// Performance tips
// - Use ReactFlow's viewport and only render nodes in view if you have thousands of nodes (virtualization). For typical teacher boards this is unnecessary.
// - Debounce save calls (e.g., wait 500ms after drag stop before saving).
// - Limit node data size; avoid storing huge HTML blobs in node data.

// Done. Open the files above in your project and adapt imports paths if necessary.
