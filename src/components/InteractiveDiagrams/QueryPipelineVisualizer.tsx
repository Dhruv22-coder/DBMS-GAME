import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Database, Cpu, Cog, FileText } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  icon: React.ReactNode;
  shortDesc: string;
  examDeliverables: string[];
  costFactor: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: '1. Parsing & Translation',
    icon: <FileText className="w-4 h-4 text-sky-400" />,
    shortDesc: 'Validates SQL syntax, checks table and column names in the Data Dictionary / Catalog, and parses into initial Relational Algebra expression.',
    examDeliverables: [
      'Lexical Analysis & Syntax Checking',
      'Data Dictionary verification',
      'Transforms declarative SQL into Relational Algebra parse tree'
    ],
    costFactor: 'Low CPU overhead (syntax verification)'
  },
  {
    id: 2,
    title: '2. Query Optimization (Core)',
    icon: <Cog className="w-4 h-4 text-amber-400" />,
    shortDesc: 'Generates alternative equivalent execution plans. Uses Heuristics (pushing σ and π down) and Cost Estimation to find the cheapest plan.',
    examDeliverables: [
      'Heuristic Optimization: Push Selections & Projections early',
      'Cost-Based Optimization: Catalog statistics (cardinality, block size, B+ Tree index heights)',
      'Formula: Cost = (Block Transfers × Transfer Time) + (Seeks × Seek Time)'
    ],
    costFactor: 'Crucial: Disk I/O dominates total execution time'
  },
  {
    id: 3,
    title: '3. Code Generation / Plan Selection',
    icon: <Cpu className="w-4 h-4 text-purple-400" />,
    shortDesc: 'Translates the best relational algebra evaluation plan into low-level executable machine instructions/calls for the evaluation engine.',
    examDeliverables: [
      'Generates query execution plan primitives',
      'Links join algorithms (Hash Join, Merge Join, Nested Loops)'
    ],
    costFactor: 'Internal compilation step'
  },
  {
    id: 4,
    title: '4. Evaluation Engine',
    icon: <Database className="w-4 h-4 text-emerald-400" />,
    shortDesc: 'Executes the plan primitives against physical storage and buffer pool, returning resulting tuples to the user.',
    examDeliverables: [
      'Fetches disk blocks into buffer cache',
      'Applies pipelined or materialized operators',
      'Outputs result tuples to client'
    ],
    costFactor: 'Physical disk reads/writes and memory bandwidth'
  }
];

export const QueryPipelineVisualizer: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(1);
  const activeStage = STAGES[activeStageIndex];

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 my-3 font-sans">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            6/8 MARKS FLOW
          </span>
          <h4 className="text-sm font-semibold text-slate-200">Query Processing & Optimization Pipeline</h4>
        </div>
        <span className="text-xs text-slate-400">Step through stages</span>
      </div>

      {/* Stage Stepper Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {STAGES.map((st, i) => (
          <button
            key={st.id}
            onClick={() => setActiveStageIndex(i)}
            className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
              activeStageIndex === i
                ? 'bg-slate-800 border-amber-500/60 ring-1 ring-amber-500/50'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-bold font-mono">{st.id}.</span>
              {st.icon}
            </div>
            <span className="text-xs font-semibold text-slate-200 line-clamp-1">{st.title.replace(/^\d+\.\s*/, '')}</span>
          </button>
        ))}
      </div>

      {/* Active Stage Details */}
      <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            {activeStage.icon}
            <h5 className="font-bold text-slate-100 text-sm">{activeStage.title}</h5>
          </div>
          <span className="font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 text-[11px]">
            {activeStage.costFactor}
          </span>
        </div>

        <p className="text-slate-300 leading-relaxed">{activeStage.shortDesc}</p>

        <div className="space-y-1 pt-1">
          <span className="text-slate-400 font-semibold">Key Exam Points & Deliverables:</span>
          {activeStage.examDeliverables.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
