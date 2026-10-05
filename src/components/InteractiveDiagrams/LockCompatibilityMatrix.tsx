import React, { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const LockCompatibilityMatrix: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{
    held: 'Shared (S)' | 'Exclusive (X)';
    requested: 'Shared (S)' | 'Exclusive (X)';
  } | null>({ held: 'Shared (S)', requested: 'Shared (S)' });

  const getCellData = (held: 'S' | 'X', req: 'S' | 'X') => {
    if (held === 'S' && req === 'S') {
      return {
        compatible: true,
        reason: 'Multiple transactions can read the same item simultaneously without conflict. No dirty writes occur.',
        examSnippet: 'TRUE: S and S do not interfere. Read-Read is non-conflicting.'
      };
    }
    if (held === 'S' && req === 'X') {
      return {
        compatible: false,
        reason: 'Writer wants exclusive write lock, but reader is currently reading. Granting would cause Dirty Read or Inconsistent Analysis.',
        examSnippet: 'FALSE: Writer must wait until all Shared locks are unlocked.'
      };
    }
    if (held === 'X' && req === 'S') {
      return {
        compatible: false,
        reason: 'Writer is currently modifying the item. Reading now would read uncommitted changes (Dirty Read violation).',
        examSnippet: 'FALSE: Reader must wait until the Exclusive lock holder commits/aborts.'
      };
    }
    return {
      compatible: false,
      reason: 'Two transactions cannot write to the same item simultaneously; causes Lost Updates and write collision.',
      examSnippet: 'FALSE: Exclusive mode enforces strict mutual exclusion.'
    };
  };

  const currentInfo = selectedCell
    ? getCellData(selectedCell.held === 'Shared (S)' ? 'S' : 'X', selectedCell.requested === 'Shared (S)' ? 'S' : 'X')
    : null;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 my-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
            4 MARKS MATRIX
          </span>
          <h4 className="text-sm font-semibold text-slate-200">Lock Compatibility Function [Comp(A, B)]</h4>
        </div>
        <span className="text-xs text-slate-400">Click cells to inspect rule</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-slate-700 bg-slate-950 text-xs text-slate-400 font-mono">
                Held \ Requested
              </th>
              <th className="p-2 border border-slate-700 bg-slate-950 text-xs font-bold text-sky-400 font-mono">
                Shared (S)
              </th>
              <th className="p-2 border border-slate-700 bg-slate-950 text-xs font-bold text-rose-400 font-mono">
                Exclusive (X)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-slate-700 bg-slate-950 font-bold text-sky-400 text-xs font-mono">
                Shared (S)
              </td>
              <td
                onClick={() => setSelectedCell({ held: 'Shared (S)', requested: 'Shared (S)' })}
                className={`p-3 border border-slate-700 cursor-pointer transition-all ${
                  selectedCell?.held === 'Shared (S)' && selectedCell?.requested === 'Shared (S)'
                    ? 'ring-2 ring-emerald-400 bg-emerald-950/70'
                    : 'bg-emerald-950/30 hover:bg-emerald-900/40'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TRUE</span>
                </div>
              </td>
              <td
                onClick={() => setSelectedCell({ held: 'Shared (S)', requested: 'Exclusive (X)' })}
                className={`p-3 border border-slate-700 cursor-pointer transition-all ${
                  selectedCell?.held === 'Shared (S)' && selectedCell?.requested === 'Exclusive (X)'
                    ? 'ring-2 ring-rose-400 bg-rose-950/70'
                    : 'bg-rose-950/30 hover:bg-rose-900/40'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>FALSE</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-2 border border-slate-700 bg-slate-950 font-bold text-rose-400 text-xs font-mono">
                Exclusive (X)
              </td>
              <td
                onClick={() => setSelectedCell({ held: 'Exclusive (X)', requested: 'Shared (S)' })}
                className={`p-3 border border-slate-700 cursor-pointer transition-all ${
                  selectedCell?.held === 'Exclusive (X)' && selectedCell?.requested === 'Shared (S)'
                    ? 'ring-2 ring-rose-400 bg-rose-950/70'
                    : 'bg-rose-950/30 hover:bg-rose-900/40'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>FALSE</span>
                </div>
              </td>
              <td
                onClick={() => setSelectedCell({ held: 'Exclusive (X)', requested: 'Exclusive (X)' })}
                className={`p-3 border border-slate-700 cursor-pointer transition-all ${
                  selectedCell?.held === 'Exclusive (X)' && selectedCell?.requested === 'Exclusive (X)'
                    ? 'ring-2 ring-rose-400 bg-rose-950/70'
                    : 'bg-rose-950/30 hover:bg-rose-900/40'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>FALSE</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {currentInfo && selectedCell && (
        <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-slate-300">
              Held: <strong className="text-white">{selectedCell.held}</strong> + Requested: <strong className="text-white">{selectedCell.requested}</strong>
            </span>
            <span
              className={`font-bold px-2 py-0.5 rounded ${
                currentInfo.compatible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {currentInfo.compatible ? 'Compatible' : 'Incompatible (Blocked)'}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">{currentInfo.reason}</p>
          <p className="text-amber-300 font-mono pt-1">Exam Note: {currentInfo.examSnippet}</p>
        </div>
      )}
    </div>
  );
};
