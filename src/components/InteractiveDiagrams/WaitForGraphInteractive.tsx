import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface Edge {
  from: string;
  to: string;
  resource: string;
  inCycle: boolean;
}

export const WaitForGraphInteractive: React.FC = () => {
  // Scenario state: toggling between Scenario A (Deadlock Cycle) and Scenario B (Safe Acyclic)
  const [hasDeadlock, setHasDeadlock] = useState<boolean>(true);
  const [abortedNode, setAbortedNode] = useState<string | null>(null);

  const nodes = [
    { id: 'T1', x: 70, y: 70, label: 'T1', hold: 'Item A', wait: 'Item B' },
    { id: 'T2', x: 230, y: 70, label: 'T2', hold: 'Item B', wait: hasDeadlock && abortedNode !== 'T2' ? 'Item C' : 'None' },
    { id: 'T3', x: 230, y: 190, label: 'T3', hold: 'Item C', wait: hasDeadlock && abortedNode !== 'T3' ? 'Item A' : 'None' },
    { id: 'T4', x: 70, y: 190, label: 'T4', hold: 'Item D', wait: 'Item C' }
  ];

  const getEdges = (): Edge[] => {
    if (abortedNode) {
      // If victim selected, edges connected to victim are removed
      const base: Edge[] = [];
      if (abortedNode !== 'T1' && abortedNode !== 'T2') {
        base.push({ from: 'T1', to: 'T2', resource: 'B', inCycle: false });
      }
      if (abortedNode !== 'T4' && abortedNode !== 'T3') {
        base.push({ from: 'T4', to: 'T3', resource: 'C', inCycle: false });
      }
      return base;
    }

    if (!hasDeadlock) {
      return [
        { from: 'T1', to: 'T2', resource: 'B', inCycle: false },
        { from: 'T4', to: 'T3', resource: 'C', inCycle: false }
      ];
    }

    return [
      { from: 'T1', to: 'T2', resource: 'B', inCycle: true },
      { from: 'T2', to: 'T3', resource: 'C', inCycle: true },
      { from: 'T3', to: 'T1', resource: 'A', inCycle: true },
      { from: 'T4', to: 'T3', resource: 'C', inCycle: false }
    ];
  };

  const edges = getEdges();
  const isDeadlocked = hasDeadlock && !abortedNode;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 my-3">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
            6/8 MARKS TOOL
          </span>
          <h4 className="text-sm font-semibold text-slate-200">Wait-For Graph (WFG) & Deadlock Cycle Detector</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setHasDeadlock(!hasDeadlock);
              setAbortedNode(null);
            }}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Toggle Scenario: {hasDeadlock ? 'Cycle Present' : 'Acyclic (Safe)'}
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-x-auto bg-slate-950/80 rounded-lg p-2 border border-slate-800 flex justify-center">
        <svg viewBox="0 0 320 260" className="w-full max-w-[340px] h-auto select-none">
          <defs>
            <marker id="wfg-arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>
            <marker id="wfg-arrow-cycle" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, idx) => {
            const src = nodes.find((n) => n.id === e.from)!;
            const dst = nodes.find((n) => n.id === e.to)!;
            const isCycleEdge = e.inCycle;

            return (
              <g key={idx}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={dst.x}
                  y2={dst.y}
                  stroke={isCycleEdge ? '#f43f5e' : '#64748b'}
                  strokeWidth={isCycleEdge ? '2.5' : '1.5'}
                  strokeDasharray={isCycleEdge ? undefined : '3 2'}
                  markerEnd={isCycleEdge ? 'url(#wfg-arrow-cycle)' : 'url(#wfg-arrow)'}
                />
                <text
                  x={(src.x + dst.x) / 2 + (src.x === dst.x ? 12 : 0)}
                  y={(src.y + dst.y) / 2 - (src.y === dst.y ? 8 : 4)}
                  fill={isCycleEdge ? '#fda4af' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  wait({e.resource})
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const isAborted = abortedNode === n.id;
            const inCycle = isDeadlocked && (n.id === 'T1' || n.id === 'T2' || n.id === 'T3');

            return (
              <g
                key={n.id}
                onClick={() => {
                  if (isDeadlocked) {
                    setAbortedNode(n.id);
                  }
                }}
                className={`cursor-pointer transition-all ${isAborted ? 'opacity-30' : ''}`}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="24"
                  fill="#0f172a"
                  stroke={inCycle ? '#f43f5e' : isAborted ? '#64748b' : '#38bdf8'}
                  strokeWidth={inCycle ? '3' : '2'}
                  className={inCycle ? 'animate-pulse' : ''}
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  textAnchor="middle"
                  fill={inCycle ? '#f43f5e' : '#e2e8f0'}
                  fontWeight="bold"
                  fontSize="12"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Status banner */}
      <div className="mt-3 p-3 rounded-lg border text-xs">
        {isDeadlocked ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>DEADLOCK DETECTED! Directed Cycle: T1 → T2 → T3 → T1</span>
            </div>
            <p className="text-slate-300">
              Each transaction is waiting for a lock held by the next. Click a transaction node (T1, T2, or T3) to select it as the <strong className="text-amber-300">Victim</strong> for rollback and break the cycle!
            </p>
          </div>
        ) : abortedNode ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Deadlock Resolved! Victim {abortedNode} rolled back.</span>
              </div>
              <button
                onClick={() => setAbortedNode(null)}
                className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded hover:bg-slate-700"
              >
                Reset Cycle
              </button>
            </div>
            <p className="text-slate-300">
              Locks held by {abortedNode} were released, allowing the remaining transactions to continue. In exams, mention <strong>Victim Selection Criteria: youngest transaction, fewest locks held, or lowest rollback cost.</strong>
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>No Deadlock! Graph is acyclic (T1 → T2, T4 → T3). All transactions will complete.</span>
          </div>
        )}
      </div>
    </div>
  );
};
