"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import type { AssociationRule } from "@/types";

interface NetworkGraphProps {
  rules: AssociationRule[];
}

interface NodeData {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  count: number;
}

interface EdgeData {
  source: string;
  target: string;
  lift: number;
  support: number;
  confidence: number;
}

export default function NetworkGraph({ rules }: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const height = 400;

  // Responsive width
  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<EdgeData | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Ambil top 20 aturan untuk divisualisasikan agar graf tidak terlalu padat
  const topRules = useMemo(() => {
    return [...rules].sort((a, b) => b.lift - a.lift).slice(0, 20);
  }, [rules]);

  // Bangun node dan edge dari topRules
  useEffect(() => {
    const nodeCounts = new Map<string, number>();
    const edgeMap = new Map<string, EdgeData>();

    topRules.forEach(rule => {
      // Kita hanya memetakan relasi 1-ke-1 atau perwakilan item pertama untuk visualisasi graf yang bersih
      const ant = rule.antecedent[0];
      const cons = rule.consequent[0];

      if (!ant || !cons) return;

      nodeCounts.set(ant, (nodeCounts.get(ant) ?? 0) + 1);
      nodeCounts.set(cons, (nodeCounts.get(cons) ?? 0) + 1);

      const edgeKey = [ant, cons].sort().join(" <-> ");
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, {
          source: ant,
          target: cons,
          lift: rule.lift,
          support: rule.support,
          confidence: rule.confidence
        });
      }
    });

    // Inisialisasi node dengan posisi acak di dalam ruang
    const initialNodes: NodeData[] = Array.from(nodeCounts.entries()).map(([id, count]) => {
      const radius = 10 + Math.min(count * 3, 20); // Ukuran radius berdasarkan frekuensi relasi
      return {
        id,
        x: width / 2 + (Math.random() - 0.5) * (width * 0.4),
        y: height / 2 + (Math.random() - 0.5) * (height * 0.4),
        vx: 0,
        vy: 0,
        radius,
        count
      };
    });

    const initialEdges = Array.from(edgeMap.values());

    // Jalankan simulasi force-directed sederhana (200 tick)
    let tempNodes = [...initialNodes];
    const k = 0.08; // Konstanta pegas (attraction)
    const repel = 450; // Konstanta gaya tolak (repulsion)
    const centerGravity = 0.02; // Tarikan ke tengah

    for (let tick = 0; tick < 200; tick++) {
      // 1. Gaya Tolak-menolak (Coulomb) antar semua pasang node
      for (let i = 0; i < tempNodes.length; i++) {
        for (let j = i + 1; j < tempNodes.length; j++) {
          const n1 = tempNodes[i];
          const n2 = tempNodes[j];

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // Gaya tolak terbalik kuadrat jarak
          const force = repel / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          n1.vx -= fx;
          n1.vy -= fy;
          n2.vx += fx;
          n2.vy += fy;
        }
      }

      // 2. Gaya Tarik-menarik (Hooke) sepanjang edge
      initialEdges.forEach(edge => {
        const sourceNode = tempNodes.find(n => n.id === edge.source);
        const targetNode = tempNodes.find(n => n.id === edge.target);

        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const restLength = 120; // Panjang santai pegas

          const force = k * (dist - restLength);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          sourceNode.vx += fx;
          sourceNode.vy += fy;
          targetNode.vx -= fx;
          targetNode.vy -= fy;
        }
      });

      // 3. Tarikan Gravitasi ke Tengah & Update Posisi
      tempNodes = tempNodes.map(n => {
        // Gravitasi tengah
        const dx = width / 2 - n.x;
        const dy = height / 2 - n.y;
        n.vx += dx * centerGravity;
        n.vy += dy * centerGravity;

        // Gesekan/peredam kecepatan (damping)
        n.vx *= 0.85;
        n.vy *= 0.85;

        // Update posisi
        let newX = n.x + n.vx;
        let newY = n.y + n.vy;

        // Batasi di dalam ruang SVG
        const pad = n.radius + 10;
        if (newX < pad) { newX = pad; n.vx = 0; }
        if (newX > width - pad) { newX = width - pad; n.vx = 0; }
        if (newY < pad) { newY = pad; n.vy = 0; }
        if (newY > height - pad) { newY = height - pad; n.vy = 0; }

        return {
          ...n,
          x: newX,
          y: newY
        };
      });
    }

    setNodes(tempNodes);
    setEdges(initialEdges);
  }, [topRules, width]);

  // Filter edge & node untuk highlight interaktif
  const highlightedNodes = useMemo(() => {
    if (!hoveredNode && !selectedNode) return null;
    const target = selectedNode || hoveredNode;
    const connected = new Set<string>([target!]);
    edges.forEach(e => {
      if (e.source === target) connected.add(edge.target);
      if (e.target === target) connected.add(edge.source);
    });
    return connected;
  }, [edges, hoveredNode, selectedNode]);

  return (
    <div ref={containerRef} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="font-bold text-base text-gray-900">Graf Jaringan Ko-pembelian</h3>
          <p className="text-xs text-gray-400">Node = Produk (ukuran &propto; koneksi), Garis = Pasangan dalam aturan (tebal &propto; Lift Ratio).</p>
        </div>
        {(selectedNode || hoveredNode || hoveredEdge) && (
          <button 
            onClick={() => { setSelectedNode(null); setHoveredNode(null); setHoveredEdge(null); }}
            className="text-[10px] text-brand-teal hover:underline font-bold"
          >
            Reset Fokus
          </button>
        )}
      </div>

      <div className="relative border border-gray-50 bg-gray-50/40 rounded-xl overflow-hidden">
        <svg width={width} height={height} className="select-none cursor-grab active:cursor-grabbing">
          {/* Garis Penghubung (Edges) */}
          {edges.map((edge, idx) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            const isHovered = hoveredEdge === edge;
            const focusTarget = selectedNode || hoveredNode;
            const isDimmed = focusTarget && (edge.source !== focusTarget && edge.target !== focusTarget);

            // Ketebalan berdasarkan nilai Lift Ratio (min: 1px, maks: 6px)
            const strokeWidth = Math.max(1, Math.min(edge.lift * 1.5, 6));

            return (
              <line
                key={idx}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHovered ? "#E8A13A" : isDimmed ? "#E2E8F0" : "#13837A"}
                strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                strokeOpacity={isDimmed ? 0.2 : 0.65}
                className="transition-all duration-300"
                onMouseEnter={() => setHoveredEdge(edge)}
                onMouseLeave={() => setHoveredEdge(null)}
              />
            );
          })}

          {/* Node Produk */}
          {nodes.map(node => {
            const isHovered = hoveredNode === node.id || selectedNode === node.id;
            const isDimmed = highlightedNodes && !highlightedNodes.has(node.id);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
              >
                {/* Efek glow hover */}
                {isHovered && (
                  <circle
                    r={node.radius + 6}
                    fill="none"
                    stroke="#E8A13A"
                    strokeWidth={2}
                    strokeDasharray="4 2"
                    className="animate-[spin_10s_linear_infinite]"
                  />
                )}
                {/* Node utama */}
                <circle
                  r={node.radius}
                  fill={isHovered ? "#E8A13A" : isDimmed ? "#CBD5E1" : "#0E5C57"}
                  stroke={isHovered ? "#FFF" : "#13837A"}
                  strokeWidth={1.5}
                  className="transition-colors duration-300"
                />
                {/* Label Teks */}
                <text
                  y={node.radius + 14}
                  textAnchor="middle"
                  className={`text-[9px] font-bold tracking-tight select-none transition-all ${
                    isHovered ? "fill-brand-amber text-[10px]" : isDimmed ? "fill-gray-350 opacity-40" : "fill-gray-700"
                  }`}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Panel Informasi Detil Hover/Fokus */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-gray-100 p-3 rounded-lg shadow-md max-w-xs text-[10px] space-y-1 transition-all">
          {hoveredEdge ? (
            <>
              <div className="font-bold text-brand-teal mb-1">Detail Hubungan:</div>
              <div><span className="font-semibold text-gray-500">Pasangan:</span> {hoveredEdge.source} &harr; {hoveredEdge.target}</div>
              <div><span className="font-semibold text-gray-500">Support:</span> {(hoveredEdge.support * 100).toFixed(2)}%</div>
              <div><span className="font-semibold text-gray-500">Confidence:</span> {(hoveredEdge.confidence * 100).toFixed(1)}%</div>
              <div><span className="font-semibold text-gray-500 text-brand-amber">Lift Ratio:</span> <strong className="text-brand-amber">{hoveredEdge.lift.toFixed(3)}</strong></div>
            </>
          ) : selectedNode || hoveredNode ? (
            (() => {
              const activeId = selectedNode || hoveredNode;
              const activeNode = nodes.find(n => n.id === activeId);
              const connections = edges.filter(e => e.source === activeId || e.target === activeId);
              return (
                <>
                  <div className="font-bold text-brand-teal mb-1 truncate">{activeId}</div>
                  <div><span className="font-semibold text-gray-500">Koneksi Aturan:</span> {activeNode?.count ?? 0} pasangan</div>
                  <div><span className="font-semibold text-gray-500">Pasangan Terkait:</span></div>
                  <div className="flex flex-wrap gap-1 mt-1 max-h-16 overflow-y-auto">
                    {connections.map((c, i) => {
                      const peer = c.source === activeId ? c.target : c.source;
                      return (
                        <span key={i} className="bg-gray-100 text-gray-600 px-1 rounded-sm text-[8px] font-medium">
                          {peer} (L: {c.lift.toFixed(1)})
                        </span>
                      );
                    })}
                  </div>
                </>
              );
            })()
          ) : (
            <div className="text-gray-400 font-medium italic">Sorot node produk atau garis hubungan untuk melihat metrik.</div>
          )}
        </div>
      </div>
    </div>
  );
}
