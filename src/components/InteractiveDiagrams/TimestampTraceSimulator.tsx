import React, { useState } from 'react';
import { Clock, ShieldAlert, CheckCircle2, Play, RefreshCw } from 'lucide-react';

export const TimestampTraceSimulator: React.FC = () => {
  const [wTs, setWTs] = useState<number>(100);
  const [rTs, setRTs] = useState<number>(100);
  const [txTs, setTxTs] = useState<number>(120);
  const [opType, setOpType] = useState<'read' | 'write'>('read');
  const [result, setResult] = useState<{
    action: 'GRANT' | 'ROLLBACK';
    reason: string;
    newWTs: number;
    newRTs: number;
  } | null>(null);

  const evaluateRule = () => {
    if (opType === 'read') {
      if (txTs < wTs) {
        setResult({
          action: 'ROLLBACK',
          reason: `TS(Ti) = ${txTs} < W-TS(Q) = ${wTs}. The transaction is attempting to read an older value that was already overwritten by a younger transaction. Ti must be ABORTED and ROLLED BACK.`,
          newWTs: wTs,
          newRTs: rTs
        });
      } else {
        const updatedR = Math.max(rTs, txTs);
        setResult({
          action: 'GRANT',
          reason: `TS(Ti) = ${txTs} >= W-TS(Q) = ${wTs}. Read operation is granted. R-TS(Q) updated to max(${rTs}, ${txTs}) = ${updatedR}.`,
          newWTs: wTs,
          newRTs: updatedR
        });
        setRTs(updatedR);
      }
    } else {
      // Write
      if (txTs < rTs) {
        setResult({
          action: 'ROLLBACK',
          reason: `TS(Ti) = ${txTs} < R-TS(Q) = ${rTs}. A younger transaction (TS=${rTs}) has already read the data item. Ti is attempting to produce an obsolete write. Ti must be ABORTED and ROLLED BACK.`,
          newWTs: wTs,
          newRTs: rTs
        });
      } else if (txTs < wTs) {
        setResult({
          action: 'ROLLBACK',
          reason: `TS(Ti) = ${txTs} < W-TS(Q) = ${wTs}. Ti is attempting to overwrite a value produced by a younger transaction (TS=${wTs}). Ti must be ABORTED and ROLLED BACK (Note: Thomas Write Rule would skip/ignore this write instead).`,
          newWTs: wTs,
          newRTs: rTs
        });
      } else {
        setResult({
          action: 'GRANT',
          reason: `TS(Ti) = ${txTs} is >= both R-TS (${rTs}) and W-TS (${wTs}). Write operation is granted. W-TS(Q) updated to ${txTs}.`,
          newWTs: txTs,
          newRTs: rTs
        });
        setWTs(txTs);
      }
    }
  };

  const resetAll = () => {
    setWTs(100);
    setRTs(100);
    setTxTs(120);
    setResult(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 my-3 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-semibold text-slate-200">Timestamp Protocol Rule Arbiter (Q6 & Q15)</h4>
        </div>
        <button
          onClick={resetAll}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Item State Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3 text-xs">
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Item Q Read Timestamp:</span>
          <span className="text-sky-400 font-mono font-bold text-sm">R-TS(Q) = {rTs}</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Item Q Write Timestamp:</span>
          <span className="text-amber-400 font-mono font-bold text-sm">W-TS(Q) = {wTs}</span>
        </div>
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 col-span-2 md:col-span-1">
          <span className="text-slate-400 block mb-0.5">Transaction Timestamp:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={txTs}
              onChange={(e) => setTxTs(Number(e.target.value))}
              className="w-20 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-white font-mono text-xs"
            />
            <span className="text-slate-400 font-mono">TS(Ti)</span>
          </div>
        </div>
      </div>

      {/* Operation selector and test button */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex bg-slate-950 p-1 rounded border border-slate-800 text-xs">
          <button
            onClick={() => setOpType('read')}
            className={`px-3 py-1 rounded transition-colors ${
              opType === 'read' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Read(Q)
          </button>
          <button
            onClick={() => setOpType('write')}
            className={`px-3 py-1 rounded transition-colors ${
              opType === 'write' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Write(Q)
          </button>
        </div>

        <button
          onClick={evaluateRule}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-1.5 rounded font-bold flex items-center gap-1.5 transition-all"
        >
          <Play className="w-3 h-3" /> Evaluate Protocol Rule
        </button>
      </div>

      {/* Decision Output */}
      {result && (
        <div
          className={`p-3 rounded-lg border text-xs space-y-1.5 ${
            result.action === 'GRANT'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold">
              {result.action === 'GRANT' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">OPERATION GRANTED</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400">OPERATION REJECTED — TRANSACTION ROLLED BACK</span>
                </>
              )}
            </div>
          </div>
          <p className="leading-relaxed text-slate-300">{result.reason}</p>
        </div>
      )}
    </div>
  );
};
