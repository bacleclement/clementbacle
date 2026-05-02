'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NodeDef, EdgeDef, NodeType } from './usecases';
import styles from './lab.module.scss';

// ── Types ────────────────────────────────────────────────────────────

export interface PositionedNode extends NodeDef {
  w: number;
  h: number;
  stacked: boolean;
}

export interface CanvasProps {
  nodes: NodeDef[];
  edges: EdgeDef[];
  focusedNodeId: string | null;
  animatingEdges: Set<string>;
  onNodeClick: (node: PositionedNode) => void;
}

interface Point {
  x: number;
  y: number;
}

// ── Node style map ───────────────────────────────────────────────────

interface NodeStyle {
  bg: string;
  border: string;
  icon: string;
  accent: string;
  inverted?: boolean;
}

const NODE_STYLES: Record<NodeType, NodeStyle> = {
  input:        { bg: '#1e1d1b', border: '#F5F0EB', icon: '→',  accent: '#F5F0EB' },
  output:       { bg: '#F5F0EB', border: '#F5F0EB', icon: '✓',  accent: '#0F0F12', inverted: true },
  llm:          { bg: '#1c1b19', border: '#2e2c29', icon: '✦',  accent: '#E85C30' },
  agent:        { bg: '#1c1b19', border: '#2e2c29', icon: '◆',  accent: '#E85C30' },
  orchestrator: { bg: '#1c1b19', border: '#2e2c29', icon: '❖',  accent: '#E85C30' },
  router:       { bg: '#1c1b19', border: '#2e2c29', icon: '⤳',  accent: '#E85C30' },
  aggregator:   { bg: '#1c1b19', border: '#2e2c29', icon: '⨁',  accent: '#E85C30' },
  tools:        { bg: '#161514', border: '#2a2826', icon: '⚙',  accent: '#636059' },
  env:          { bg: '#161514', border: '#2a2826', icon: '◉',  accent: '#636059' },
  gate:         { bg: '#161514', border: '#2a2826', icon: '◇',  accent: '#636059' },
  retry:        { bg: '#161514', border: '#2a2826', icon: '↻',  accent: '#636059' },
  guard:        { bg: '#1f1010', border: '#4a1a1a', icon: '⛨',  accent: '#f87171' },
  human:        { bg: '#0f1520', border: '#1e3a5f', icon: '☻',  accent: '#60a5fa' },
  eval:         { bg: '#0f1a12', border: '#1a3d22', icon: '★',  accent: '#4ade80' },
};

// ── Measure / layout helpers ─────────────────────────────────────────

const NODE_W_MIN = 110;
const NODE_W_CHAR = 7.5; // px per char approx
const NODE_H = 52;
const NODE_PAD = 16;

function measureNode(node: NodeDef): PositionedNode {
  const labelW = node.label.length * NODE_W_CHAR + NODE_PAD * 2 + 24;
  const subW = node.sub ? node.sub.length * 6.5 + NODE_PAD * 2 : 0;
  const w = Math.max(NODE_W_MIN, labelW, subW);
  return { ...node, w, h: NODE_H, stacked: false };
}

// Topological sort → lane-based horizontal layout
function laneLayout(nodes: NodeDef[], edges: EdgeDef[]): PositionedNode[] {
  const positioned = nodes.map(measureNode);
  const byId = new Map(positioned.map(n => [n.id, n]));

  // Build adjacency
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();
  positioned.forEach(n => { outgoing.set(n.id, []); incoming.set(n.id, []); });
  edges.forEach(e => {
    outgoing.get(e.from)?.push(e.to);
    incoming.get(e.to)?.push(e.from);
    if (e.bidir) {
      outgoing.get(e.to)?.push(e.from);
      incoming.get(e.from)?.push(e.to);
    }
  });

  // Kahn's topo sort
  const inDeg = new Map<string, number>();
  positioned.forEach(n => inDeg.set(n.id, 0));
  edges.forEach(e => {
    inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
  });

  const queue: string[] = [];
  inDeg.forEach((d, id) => { if (d === 0) queue.push(id); });
  const order: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    outgoing.get(id)?.forEach(nid => {
      const d = (inDeg.get(nid) ?? 1) - 1;
      inDeg.set(nid, d);
      if (d === 0) queue.push(nid);
    });
  }
  // Add remaining (cycles)
  positioned.forEach(n => { if (!order.includes(n.id)) order.push(n.id); });

  // Assign lane (x bucket) = longest path from any root
  const lane = new Map<string, number>();
  order.forEach(id => {
    const preds = incoming.get(id) ?? [];
    const maxPredLane = preds.reduce((m, pid) => Math.max(m, lane.get(pid) ?? -1), -1);
    lane.set(id, maxPredLane + 1);
  });

  // Group by lane
  const lanes = new Map<number, string[]>();
  lane.forEach((l, id) => {
    if (!lanes.has(l)) lanes.set(l, []);
    lanes.get(l)!.push(id);
  });

  // Position nodes using original x/y as hints if provided, else auto
  // We'll use the original x/y from data (they are manually set)
  positioned.forEach(n => {
    const orig = byId.get(n.id)!;
    n.x = orig.x;
    n.y = orig.y;
  });

  return resolveOverlaps(positioned);
}

function resolveOverlaps(nodes: PositionedNode[]): PositionedNode[] {
  const PAD_X = 16;
  const PAD_Y = 12;
  let changed = true;
  let passes = 0;
  const result = nodes.map(n => ({ ...n }));

  while (changed && passes < 8) {
    changed = false;
    passes++;
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const a = result[i];
        const b = result[j];
        const overlapX = a.x + a.w + PAD_X > b.x && b.x + b.w + PAD_X > a.x;
        const overlapY = a.y + a.h + PAD_Y > b.y && b.y + b.h + PAD_Y > a.y;
        if (overlapX && overlapY) {
          // Push b down
          b.y = a.y + a.h + PAD_Y;
          changed = true;
        }
      }
    }
  }
  return result;
}

// ── Edge routing ─────────────────────────────────────────────────────

function getAnchor(node: PositionedNode, side: 'right' | 'left' | 'top' | 'bottom'): Point {
  switch (side) {
    case 'right':  return { x: node.x + node.w, y: node.y + node.h / 2 };
    case 'left':   return { x: node.x,           y: node.y + node.h / 2 };
    case 'top':    return { x: node.x + node.w / 2, y: node.y };
    case 'bottom': return { x: node.x + node.w / 2, y: node.y + node.h };
  }
}

function pickAnchors(from: PositionedNode, to: PositionedNode): [Point, Point] {
  // Primarily horizontal routing
  const fCx = from.x + from.w / 2;
  const tCx = to.x + to.w / 2;
  const fCy = from.y + from.h / 2;
  const tCy = to.y + to.h / 2;

  if (Math.abs(tCx - fCx) >= Math.abs(tCy - fCy)) {
    // Horizontal dominant
    if (tCx > fCx) return [getAnchor(from, 'right'), getAnchor(to, 'left')];
    return [getAnchor(from, 'left'), getAnchor(to, 'right')];
  } else {
    // Vertical dominant
    if (tCy > fCy) return [getAnchor(from, 'bottom'), getAnchor(to, 'top')];
    return [getAnchor(from, 'top'), getAnchor(to, 'bottom')];
  }
}

function bezierPath(p1: Point, p2: Point): string {
  const dx = Math.abs(p2.x - p1.x) * 0.5;
  const dy = Math.abs(p2.y - p1.y) * 0.5;
  const cx1 = p1.x + (p2.x > p1.x ? dx : -dx);
  const cy1 = p1.y + (p2.y !== p1.y ? dy * 0.3 : 0);
  const cx2 = p2.x - (p2.x > p1.x ? dx : -dx);
  const cy2 = p2.y - (p2.y !== p1.y ? dy * 0.3 : 0);
  return `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
}

function edgeKey(from: string, to: string) {
  return `${from}→${to}`;
}

// ── Canvas component ──────────────────────────────────────────────────

export default function Canvas({ nodes, edges, focusedNodeId, animatingEdges, onNodeClick }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [vb, setVb] = useState({ x: 0, y: 0, w: 800, h: 480 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef<Point>({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ node: PositionedNode; px: number; py: number } | null>(null);
  const [tokenPositions, setTokenPositions] = useState<Map<string, number>>(new Map());
  const animFrames = useRef<Map<string, number>>(new Map());

  const positioned = useMemo(() => laneLayout(nodes, edges), [nodes, edges]);
  const byId = useMemo(() => new Map(positioned.map(n => [n.id, n])), [positioned]);

  // Fit to viewport when flow changes
  useEffect(() => {
    if (!svgRef.current || positioned.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0) return;

    const minX = Math.min(...positioned.map(n => n.x)) - 40;
    const minY = Math.min(...positioned.map(n => n.y)) - 40;
    const maxX = Math.max(...positioned.map(n => n.x + n.w)) + 40;
    const maxY = Math.max(...positioned.map(n => n.y + n.h)) + 40;
    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const scaleX = rect.width / contentW;
    const scaleY = rect.height / contentH;
    const scale = Math.min(scaleX, scaleY, 1.2);
    const newW = rect.width / scale;
    const newH = rect.height / scale;
    setVb({ x: minX - (newW - contentW) / 2, y: minY - (newH - contentH) / 2, w: newW, h: newH });
    setZoom(scale);
    setPan({ x: 0, y: 0 });
  }, [positioned]);

  // Auto-pan to focused node
  useEffect(() => {
    if (!focusedNodeId || !svgRef.current) return;
    const n = byId.get(focusedNodeId);
    if (!n) return;
    const cx = n.x + n.w / 2;
    const cy = n.y + n.h / 2;
    const rect = svgRef.current.getBoundingClientRect();
    const targetX = cx - vb.w / 2;
    const targetY = cy - vb.h / 2;
    // Smooth pan: interpolate over ~300ms
    const startVb = { ...vb };
    const startTime = performance.now();
    const duration = 300;
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setVb(prev => ({
        ...prev,
        x: startVb.x + (targetX - startVb.x) * ease,
        y: startVb.y + (targetY - startVb.y) * ease,
      }));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedNodeId]);

  // Token animation on active edges
  useEffect(() => {
    // Cancel old animations
    animFrames.current.forEach(id => cancelAnimationFrame(id));
    animFrames.current.clear();

    if (animatingEdges.size === 0) {
      setTokenPositions(new Map());
      return;
    }

    const startTimes = new Map<string, number>();
    const DURATION = 1200; // ms per traversal

    const tick = (now: number) => {
      const newPos = new Map<string, number>();
      animatingEdges.forEach(key => {
        if (!startTimes.has(key)) startTimes.set(key, now);
        const elapsed = now - startTimes.get(key)!;
        newPos.set(key, (elapsed % DURATION) / DURATION);
      });
      setTokenPositions(newPos);
      const frameId = requestAnimationFrame(tick);
      animFrames.current.set('main', frameId);
    };

    const frameId = requestAnimationFrame(tick);
    animFrames.current.set('main', frameId);

    return () => {
      animFrames.current.forEach(id => cancelAnimationFrame(id));
      animFrames.current.clear();
    };
  }, [animatingEdges]);

  // Pan handlers
  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as SVGElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const dx = (e.clientX - lastPos.current.x) / zoom;
    const dy = (e.clientY - lastPos.current.y) / zoom;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setVb(prev => ({ ...prev, x: prev.x - dx, y: prev.y - dy }));
  }, [zoom]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    setZoom(z => Math.max(0.3, Math.min(3, z * factor)));
    setVb(prev => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return prev;
      const mx = (e.clientX - rect.left) / zoom;
      const my = (e.clientY - rect.top) / zoom;
      const newW = prev.w * factor;
      const newH = prev.h * factor;
      return {
        x: prev.x + mx * (1 - factor),
        y: prev.y + my * (1 - factor),
        w: newW,
        h: newH,
      };
    });
  }, [zoom]);

  // Point on a bezier at t
  function bezierPoint(p1: Point, p2: Point, t: number): Point {
    const dx = Math.abs(p2.x - p1.x) * 0.5;
    const cx1 = p1.x + (p2.x > p1.x ? dx : -dx);
    const cy1 = p1.y;
    const cx2 = p2.x - (p2.x > p1.x ? dx : -dx);
    const cy2 = p2.y;
    const mt = 1 - t;
    return {
      x: mt * mt * mt * p1.x + 3 * mt * mt * t * cx1 + 3 * mt * t * t * cx2 + t * t * t * p2.x,
      y: mt * mt * mt * p1.y + 3 * mt * mt * t * cy1 + 3 * mt * t * t * cy2 + t * t * t * p2.y,
    };
  }

  const viewBox = `${vb.x} ${vb.y} ${vb.w} ${vb.h}`;

  const zoomIn  = () => setVb(prev => ({ ...prev, w: prev.w * 0.8,  h: prev.h * 0.8  }));
  const zoomOut = () => setVb(prev => ({ ...prev, w: prev.w * 1.25, h: prev.h * 1.25 }));
  const fitView = () => {
    if (!svgRef.current || positioned.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const minX = Math.min(...positioned.map(n => n.x)) - 40;
    const minY = Math.min(...positioned.map(n => n.y)) - 40;
    const maxX = Math.max(...positioned.map(n => n.x + n.w)) + 40;
    const maxY = Math.max(...positioned.map(n => n.y + n.h)) + 40;
    const cw = maxX - minX, ch = maxY - minY;
    const scale = Math.min(rect.width / cw, rect.height / ch, 1.2);
    setVb({ x: minX - (rect.width / scale - cw) / 2, y: minY - (rect.height / scale - ch) / 2, w: rect.width / scale, h: rect.height / scale });
  };

  return (
    <div className={styles.canvasWrapper}>
    <svg
      ref={svgRef}
      className={styles.canvasSvg}
      viewBox={viewBox}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <defs>
        {/* Dot pattern bg */}
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#242422" />
        </pattern>
        {/* Arrow markers */}
        <marker id="arrow-idle" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#3a3836" />
        </marker>
        <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#E85C30" />
        </marker>
        {/* Radial glow for focused node */}
        <radialGradient id="nodeFocusGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#E85C30" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E85C30" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect x={vb.x - 1000} y={vb.y - 1000} width={vb.w + 2000} height={vb.h + 2000} fill="url(#dots)" />

      {/* Edges */}
      {edges.map(edge => {
        const fromNode = byId.get(edge.from);
        const toNode = byId.get(edge.to);
        if (!fromNode || !toNode) return null;

        const key = edgeKey(edge.from, edge.to);
        const isActive = animatingEdges.has(key);
        const [p1, p2] = pickAnchors(fromNode, toNode);
        const d = bezierPath(p1, p2);
        const t = tokenPositions.get(key) ?? 0;
        const tokenPt = isActive ? bezierPoint(p1, p2, t) : null;

        return (
          <g key={key}>
            {/* Glow layer for active edges */}
            {isActive && (
              <path
                d={d}
                fill="none"
                stroke="#E85C30"
                strokeWidth={6}
                strokeOpacity={0.12}
                strokeLinecap="round"
              />
            )}
            {/* Main edge */}
            <path
              d={d}
              fill="none"
              stroke={isActive ? '#E85C30' : '#3a3836'}
              strokeWidth={isActive ? 1.5 : 1}
              strokeDasharray={edge.dashed ? '5 4' : undefined}
              markerEnd={`url(#arrow-${isActive ? 'active' : 'idle'})`}
            />
            {edge.bidir && (
              <path
                d={bezierPath(p2, p1)}
                fill="none"
                stroke={isActive ? '#E85C30' : '#3a3836'}
                strokeWidth={isActive ? 1.5 : 1}
                strokeDasharray={edge.dashed ? '5 4' : undefined}
                markerEnd={`url(#arrow-${isActive ? 'active' : 'idle'})`}
              />
            )}
            {/* Edge label */}
            {edge.label && (
              <text
                x={(p1.x + p2.x) / 2}
                y={(p1.y + p2.y) / 2 - 6}
                fill="#636059"
                fontSize={9}
                textAnchor="middle"
                fontFamily="var(--font-jetbrains-mono), monospace"
              >
                {edge.label}
              </text>
            )}
            {/* Token on active edge */}
            {isActive && tokenPt && (
              <g>
                <circle cx={tokenPt.x} cy={tokenPt.y} r={8} fill="#E85C30" fillOpacity={0.2} />
                <circle cx={tokenPt.x} cy={tokenPt.y} r={3.5} fill="#E85C30" />
              </g>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {positioned.map(node => {
        const style = NODE_STYLES[node.type];
        const isFocused = node.id === focusedNodeId;
        const textColor = style.inverted ? '#0F0F12' : '#F5F0EB';
        const subColor = style.inverted ? '#3a3836' : '#736e68';

        return (
          <g
            key={node.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onNodeClick(node)}
          >
            {/* Focus glow bg */}
            {isFocused && (
              <ellipse
                cx={node.x + node.w / 2}
                cy={node.y + node.h / 2}
                rx={node.w * 0.8}
                ry={node.h * 1.2}
                fill="url(#nodeFocusGlow)"
              />
            )}

            {/* Node body */}
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              fill={style.bg}
              stroke={isFocused ? style.accent : style.border}
              strokeWidth={isFocused ? 1.5 : 1}
              rx={2}
            />

            {/* Accent left bar */}
            <rect
              x={node.x}
              y={node.y + 6}
              width={2}
              height={node.h - 12}
              fill={style.accent}
              rx={1}
            />

            {/* Icon */}
            <text
              x={node.x + 14}
              y={node.y + node.h / 2 + 4}
              fill={style.accent}
              fontSize={12}
              textAnchor="middle"
              fontFamily="var(--font-jetbrains-mono), monospace"
            >
              {style.icon}
            </text>

            {/* Label */}
            <text
              x={node.x + 26}
              y={node.y + (node.sub ? node.h / 2 - 4 : node.h / 2 + 4)}
              fill={textColor}
              fontSize={11}
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontWeight={600}
            >
              {node.label}
            </text>

            {/* Sub label */}
            {node.sub && (
              <text
                x={node.x + 26}
                y={node.y + node.h / 2 + 9}
                fill={subColor}
                fontSize={9}
                fontFamily="var(--font-jetbrains-mono), monospace"
              >
                {node.sub}
              </text>
            )}

            {/* Focus pulse rings */}
            {isFocused && (
              <>
                <rect
                  x={node.x - 3}
                  y={node.y - 3}
                  width={node.w + 6}
                  height={node.h + 6}
                  fill="none"
                  stroke={style.accent}
                  strokeWidth={1}
                  strokeOpacity={0.7}
                  rx={3}
                />
                <rect
                  x={node.x - 8}
                  y={node.y - 8}
                  width={node.w + 16}
                  height={node.h + 16}
                  fill="none"
                  stroke={style.accent}
                  strokeWidth={0.5}
                  strokeOpacity={0.25}
                  rx={5}
                />
              </>
            )}

            {/* Invisible hit area */}
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              fill="transparent"
              onMouseEnter={(e) => {
                const rect = svgRef.current?.getBoundingClientRect();
                if (!rect) return;
                setTooltip({ node, px: e.clientX - rect.left, py: e.clientY - rect.top });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        );
      })}

      {/* Tooltip rendered in SVG foreign object for proper positioning */}
    </svg>

    {/* Zoom controls */}
    <div className={styles.zoomControls}>
      <button className={styles.zoomBtn} onClick={zoomIn}  title="Zoom in">+</button>
      <button className={styles.zoomBtn} onClick={fitView} title="Fit view">⊡</button>
      <button className={styles.zoomBtn} onClick={zoomOut} title="Zoom out">−</button>
    </div>
    </div>
  );
}

// Export tooltip as separate component for overlay in page
export function NodeTooltip({ node, px, py }: { node: PositionedNode; px: number; py: number }) {
  const style = NODE_STYLES[node.type];
  return (
    <div
      className={styles.nodeTooltip}
      style={{ left: px + 12, top: py - 20 }}
    >
      <div className={styles.tooltipTech} style={{ color: style.accent }}>{node.tech}</div>
      <div className={styles.tooltipLabel}>{node.label}</div>
      <div className={styles.tooltipDetails}>{node.details}</div>
    </div>
  );
}

// Export NODE_STYLES for legend
export { NODE_STYLES };
