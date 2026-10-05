import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface SchedulePreset {
  id: string;
  name: string;
  scheduleStr: string;
  edges: { from: string; to: string; reason: string }[];
  isSerializable: boolean;
  topologicalOrder?: string;
  hasBlindWrite: boolean;
}

const PRESETS: SchedulePreset[] = [
  {
    id: 'serializable-1',
    name: 'Schedule A (Serializable)',
    scheduleStr: 'R1(A), W1(A), R2(A), W2(A), R3(B), W3(B)',
    edges: [
      { from: 'T1', to: 'T2', reason: 'W1(A) precedes R2(A) & W2(A)' },
      { from: 'T1', to: 'T3', reason: 'No conflict on B; T1 finished before T3' }
    ],
    isSerializable: true,
    topologicalOrder: 'T1 → T2 → T3',
    hasBlindWrite: false
  },
  {
    id: 'cyclic-2',
    name: 'Schedule B (Deadly Conflict Cycle)',
    scheduleStr: 'R1(X), W2(X), W1(X), Commit 1, Commit 2',
    edges: [
      { from: 'T1', to: 'T2', reason: 'R1(X) precedes W2(X) [RW Conflict]' },
      { from: 'T2', to: 'T1', reason: 'W2(X) precedes W1(X) [WW Conflict]' }
    ],
    isSerializable: false,
    hasBlindWrite: false
  },
  {
    id: 'blind-write-3',
    name: 'Schedule C (Blind Write Case)',
    scheduleStr: 'R1(A), W2(A), W1(A), W3(A)',
    edges: [
      { from: 'T1', to: 'T2', reason: 'R1(A) precedes W2(A)' },
      { from: 'T2', to: 'T1', reason: 'W2(A) precedes W1(A)' },
      { from: 'T1', to: 'T3', reason: 'W1(A) precedes W3(A)' }
    ],
    isSerializable: false,
    hasBlindWrite: true
  }
];

export const PrecedenceGraphVisualizer: React.FC = () => {
  const [activePreset, setActivePreset] = useState<SchedulePreset>(PRESETS[0]);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 my-3">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            8 MARKS CORE
          </span>
          <h4 className="text-sm font-semibold text-slate-200">Precedence Graph (Serialization Graph) Tester</h4>
        </div>
        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePreset(p)}
              className={`text-xs px-2 py-1 rounded transition-all font-mono ${
                activePreset.id === p.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule text display */}
      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 mb-3 font-mono text-xs">
        <span className="text-slate-400">Schedule: </span>
        <span className="text-amber-400 font-semibold">{activePreset.scheduleStr}</span>
      </div>

      {/* Directed Graph Canvas */}
      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex justify-center">
        <svg viewBox="0 0 340 160" className="w-full max-w-[340px] h-auto select-none">
          <defs>
            <marker id="prec-arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <marker id="prec-cycle" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
            </marker>
          </defs>

          {/* Draw Nodes: T1 at (60, 80), T2 at (170, 80), T3 at (280, 80) */}
          {/* Edge T1 -> T2 */}
          {activePreset.edges.some((e) => e.from === 'T1' && e.to === 'T2') && (
            <path
              d={activePreset.edges.some((e) => e.from === 'T2' && e.to === 'T1') ? 'M 60 70 Q 115 40 170 70' : 'M 60 80 L 170 80'}
              fill="none"
              stroke={!activePreset.isSerializable ? '#f43f5e' : '#38bdf8'}
              strokeWidth="2"
              markerEnd={!activePreset.isSerializable ? 'url(#prec-cycle)' : 'url(#prec-arrow)'}
            />
          )}

          {/* Edge T2 -> T1 (Cycle return) */}
          {activePreset.edges.some((e) => e.from === 'T2' && e.to === 'T1') && (
            <path
              d="M 170 90 Q 115 120 60 90"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              markerEnd="url(#prec-cycle)"
            />
          )}

          {/* Edge T2 -> T3 or T1 -> T3 */}
          {activePreset.edges.some((e) => e.to === 'T3') && (
            <path
              d="M 170 80 L 280 80"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              markerEnd="url(#prec-arrow)"
            />
          )}

          {/* Transaction circles */}
          {[
            { id: 'T1', x: 60, y: 80 },
            { id: 'T2', x: 170, y: 80 },
            { id: 'T3', x: 280, y: 80 }
          ].map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="20" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Result Breakdown */}
      <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Conflict Serializability Verdict:</span>
          {activePreset.isSerializable ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Conflict Serializable (Acyclic DAG)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <XCircle className="w-4 h-4" /> NOT Conflict Serializable (Cycle T1 ⇄ T2)
            </span>
          )}
        </div>

        {activePreset.topologicalOrder && (
          <div className="flex items-center gap-2 text-amber-300 font-mono">
            <span>Equivalent Serial Order (Topological Sort):</span>
            <span className="px-2 py-0.5 bg-amber-950/60 border border-amber-700/50 rounded font-bold">
              {activePreset.topologicalOrder}
            </span>
          </div>
        )}

        {/* Conflicts list */}
        <div className="space-y-1 pt-1 border-t border-slate-800">
          <span className="text-slate-400 font-medium">Edges Generated by Conflicting Pairs:</span>
          {activePreset.edges.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-300 font-mono">
              <span className="text-sky-400 font-bold">{e.from} → {e.to}</span>
              <span className="text-slate-500">({e.reason})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
