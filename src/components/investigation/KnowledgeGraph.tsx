"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ForceGraphMethods, NodeObject, LinkObject } from "react-force-graph-2d";

/**
 * react-force-graph-2d reaches into `window`/`document` as soon as it's
 * imported, which breaks Next.js server-side rendering. Loading it with
 * `next/dynamic` and `ssr: false` defers that import to the client.
 */
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Node "kind" as returned by the graph API. Extend as new node types land. */
type NodeType = "Claim" | "Entity" | string;

interface GraphNode extends NodeObject {
  id: string;
  label: NodeType;
  /** Any additional human-readable name/description shown in the tooltip. */
  name?: string;
}

interface GraphLink extends LinkObject {
  source: string;
  target: string;
  relation?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

type FetchState = "idle" | "loading" | "success" | "error";

// ---------------------------------------------------------------------------
// Config / constants
// ---------------------------------------------------------------------------

const GRAPH_API_URL =
  process.env.NEXT_PUBLIC_GRAPH_API_URL ?? "http://127.0.0.1:8000/graph";

const NODE_COLORS: Record<string, string> = {
  Claim: "#22c55e", // green-500
  Entity: "#f97316", // orange-500
};
const DEFAULT_NODE_COLOR = "#94a3b8"; // slate-400, fallback for unknown types

const NODE_RADIUS = 6;
const LABEL_FONT_FAMILY = "Inter, system-ui, sans-serif";
const LABEL_COLOR = "#0f172a"; // slate-900
const LABEL_OFFSET_X = 8;

const EMPTY_GRAPH: GraphData = { nodes: [], links: [] };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function KnowledgeGraph() {
  const [graph, setGraph] = useState<GraphData>(EMPTY_GRAPH);
  const [status, setStatus] = useState<FetchState>("idle");
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });

  // -- Data fetching ---------------------------------------------------------

  const loadGraph = useCallback((signal: AbortSignal) => {
    setStatus("loading");
    setError(null);

    fetch(GRAPH_API_URL, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Graph API responded with ${res.status} ${res.statusText}`);
        }
        return res.json() as Promise<GraphData>;
      })
      .then((data) => {
        setGraph({
          nodes: data.nodes ?? [],
          links: data.links ?? [],
        });
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load graph data.");
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadGraph(controller.signal);
    return () => controller.abort();
  }, [loadGraph]);

  // -- Responsive sizing -------------------------------------------------------

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // -- Rendering helpers -------------------------------------------------------

  const getNodeColor = useCallback(
    (node: GraphNode) => NODE_COLORS[node.label] ?? DEFAULT_NODE_COLOR,
    []
  );

  const nodeLabel = useCallback(
    (node: GraphNode) => `${node.label}: ${node.name ?? node.id}`,
    []
  );

  const paintNode = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const fontSize = 14 / globalScale;

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = getNodeColor(node);
      ctx.fill();

      // Label
      ctx.font = `${fontSize}px ${LABEL_FONT_FAMILY}`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = LABEL_COLOR;
      ctx.fillText(node.name ?? node.id, x + LABEL_OFFSET_X, y);
    },
    [getNodeColor]
  );

  // Keep the clickable/hover hit-area in sync with the drawn circle so
  // interactions feel accurate regardless of zoom level.
  const paintNodePointerArea = useCallback(
    (node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      ctx.beginPath();
      ctx.arc(x, y, NODE_RADIUS + 2, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    },
    []
  );

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (!fgRef.current) return;
    fgRef.current.centerAt(node.x, node.y, 500);
    fgRef.current.zoom(3, 500);
  }, []);

  const legend = useMemo(
    () =>
      Object.entries(NODE_COLORS).map(([type, color]) => ({ type, color })),
    []
  );

  // -- Render ----------------------------------------------------------------

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 text-sm text-slate-600">
        {legend.map(({ type, color }) => (
          <span key={type} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            {type}
          </span>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative h-[600px] w-full overflow-hidden rounded-xl border border-slate-200"
      >
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
            Loading graph…
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-slate-500">
            <p>Couldn&apos;t load the knowledge graph{error ? `: ${error}` : "."}</p>
            <button
              type="button"
              onClick={() => {
                const controller = new AbortController();
                loadGraph(controller.signal);
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Retry
            </button>
          </div>
        )}

        {status === "success" && graph.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
            No graph data yet.
          </div>
        )}

        {dimensions.width > 0 && (
          <ForceGraph2D
            ref={fgRef}
            graphData={graph}
            width={dimensions.width}
            height={dimensions.height}
            nodeLabel={nodeLabel as never}
            nodeCanvasObject={paintNode as never}
            nodePointerAreaPaint={paintNodePointerArea as never}
            onNodeClick={handleNodeClick as never}
            linkDirectionalArrowLength={5}
            linkDirectionalArrowRelPos={1}
            linkColor={() => "rgba(100, 116, 139, 0.4)"}
            cooldownTicks={100}
          />
        )}
      </div>
    </div>
  );
}