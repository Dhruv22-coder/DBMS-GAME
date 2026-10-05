import React, { useState } from 'react';

type StateId = 'active' | 'partially_committed' | 'committed' | 'failed' | 'aborted';

interface StateInfo {
  id: StateId;
  name: string;
  x: number;
  y: number;
  color: string;
  badge: string;
  desc: string;
  examHighlight: string;
}

const STATES: StateInfo[] = [
  {
    id: 'active',
    name: 'Active',
    x: 80,
    y: 120,
    color: '#38bdf8', // sky-400
    badge: 'Initial State',
    desc: 'Transaction stays in active state while it executes its Read and Write operations.',
    examHighlight: 'Starts here upon BEGIN TRANSACTION. Operations execute in memory buffers.'
  },
  {
    id: 'partially_committed',
    name: 'Partially Committed',
    x: 320,
    y: 60,
    color: '#fbbf24', // amber-400
    badge: 'Final Statement Done',
    desc: 'The final statement has been executed, but updates are only in volatile RAM, not yet flushed to non-volatile disk/WAL log.',
    examHighlight: 'TRICK QUESTION in exams: It can still FAIL if disk write or system crashes here!'
  },
  {
    id: 'committed',
    name: 'Committed',
    x: 540,
    y: 60,
    color: '#4ade80', // green-400
    badge: 'Terminal State (Permanent)',
    desc: 'All updates are safely written to durable disk storage. Cannot be rolled back anymore.',
    examHighlight: 'Satisfies Durability. Absorbing state; never transitions anywhere else.'
  },
  {
    id: 'failed',
    name: 'Failed',
    x: 320,
    y: 200,
    color: '#f87171', // red-400
    badge: 'Error Encountered',
    desc: 'Entered when normal execution can no longer proceed due to logical errors, deadlock, or system crashes.',
    examHighlight: 'Can be reached from either Active or Partially Committed states.'
  },
  {
    id: 'aborted',
    name: 'Aborted',
    x: 540,
    y: 200,
    color: '#a855f7', // purple-400
    badge: 'Rolled Back',
    desc: 'Database state has been rolled back to before the transaction started. Recovery manager restores consistency.',
    examHighlight: 'System has 2 choices: (1) Restart transaction, or (2) Kill/Cancel transaction.'
  }
];

export const TransactionStateDiagram: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateInfo>(STATES[0]);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 my-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            6 MARKS DIAGRAM
          </span>
          <h4 className="text-sm font-semibold text-slate-200">Interactive Transaction State Machine</h4>
        </div>
        <span className="text-xs text-slate-400">Click any state bubble to inspect</span>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative overflow-x-auto bg-slate-950/70 rounded-lg p-2 border border-slate-800 flex justify-center">
        <svg viewBox="0 0 640 280" className="w-full max-w-[620px] h-auto select-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
            </marker>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#4ade80" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f87171" />
            </marker>
          </defs>

          {/* Transition Paths */}
          {/* Active -> Partially Committed */}
          <path d="M 140 105 L 260 70" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" fill="none" markerEnd="url(#arrow)" />
          <text x="175" y="75" fill="#94a3b8" fontSize="10" className="font-mono">last op ends</text>

          {/* Partially Committed -> Committed */}
          <path d="M 390 60 L 470 60" stroke="#4ade80" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-green)" />
          <text x="408" y="50" fill="#4ade80" fontSize="10" className="font-mono font-bold">commit</text>

          {/* Active -> Failed */}
          <path d="M 140 135 L 260 185" stroke="#f87171" strokeWidth="2" fill="none" markerEnd="url(#arrow-red)" />
          <text x="175" y="180" fill="#f87171" fontSize="10" className="font-mono">error/abort</text>

          {/* Partially Committed -> Failed */}
          <path d="M 320 90 L 320 165" stroke="#f87171" strokeWidth="2" strokeDasharray="3 3" fill="none" markerEnd="url(#arrow-red)" />
          <text x="328" y="130" fill="#f87171" fontSize="9" className="font-mono">disk crash</text>

          {/* Failed -> Aborted */}
          <path d="M 380 200 L 470 200" stroke="#a855f7" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
          <text x="400" y="192" fill="#c084fc" fontSize="10" className="font-mono">rollback</text>

          {/* Aborted -> Restart / Kill */}
          <path d="M 540 170 Q 570 140 540 120" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
          <text x="548" y="135" fill="#94a3b8" fontSize="9" className="font-mono">restart/kill</text>

          {/* Render State Nodes */}
          {STATES.map((st) => {
            const isSelected = selectedState.id === st.id;
            return (
              <g
                key={st.id}
                onClick={() => setSelectedState(st)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                {/* Glow ring if selected */}
                {isSelected && (
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r="40"
                    fill="none"
                    stroke={st.color}
                    strokeWidth="3"
                    className="animate-pulse"
                    opacity="0.6"
                  />
                )}
                {/* Main Circle */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r="34"
                  fill="#0f172a"
                  stroke={st.color}
                  strokeWidth={isSelected ? '3' : '2'}
                />
                {/* State Label */}
                <text
                  x={st.x}
                  y={st.id === 'partially_committed' ? st.y - 4 : st.y + 4}
                  textAnchor="middle"
                  fill={st.color}
                  fontSize={st.id === 'partially_committed' ? '9' : '11'}
                  fontWeight="bold"
                >
                  {st.id === 'partially_committed' ? 'Partially' : st.name}
                </text>
                {st.id === 'partially_committed' && (
                  <text
                    x={st.x}
                    y={st.y + 9}
                    textAnchor="middle"
                    fill={st.color}
                    fontSize="9"
                    fontWeight="bold"
                  >
                    Committed
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected State Details Card */}
      <div className="mt-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedState.color }}
            />
            <h5 className="text-sm font-bold text-slate-100">{selectedState.name}</h5>
            <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
              {selectedState.badge}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-300 mb-1.5 leading-relaxed">{selectedState.desc}</p>
        <div className="text-xs bg-amber-950/40 text-amber-200 border border-amber-800/40 px-2.5 py-1.5 rounded flex items-start gap-1.5">
          <span className="font-bold text-amber-400">💡 Exam Point:</span>
          <span>{selectedState.examHighlight}</span>
        </div>
      </div>
    </div>
  );
};
