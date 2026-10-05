import React, { useState } from 'react';
import { QuestionTopic } from '../types/game';
import { X, Search, BookOpen, Printer, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface CramSheetModalProps {
  topics: QuestionTopic[];
  onClose: () => void;
  onOpenTopic: (topic: QuestionTopic) => void;
}

export const CramSheetModal: React.FC<CramSheetModalProps> = ({
  topics,
  onClose,
  onOpenTopic
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [marksFilter, setMarksFilter] = useState<'all' | '8' | '6' | '4'>('all');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    topics.forEach((t) => (all[t.id] = true));
    setExpandedTopics(all);
  };

  const collapseAll = () => {
    setExpandedTopics({});
  };

  const filtered = topics.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teachBriefing.coreDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.teachBriefing.examKeyPoints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMarks =
      marksFilter === 'all' ? true : t.marks.includes(marksFilter);

    return matchesSearch && matchesMarks;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                DBMS PT2 Exam Cram Sheet Vault
              </h2>
              <p className="text-xs text-slate-400">
                All 27 Questions • Model Answers • Examiner Keys • Filtered by Marks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print cheat sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row gap-2.5 items-center justify-between text-xs">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by topic, e.g. 2PL, MongoDB, WFG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Marks Filter Buttons & Expand/Collapse */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <div className="flex items-center gap-1">
              {(['all', '8', '6', '4'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMarksFilter(m)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                    marksFilter === m
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'all' ? 'All' : `${m} Marks`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={expandAll}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline"
              >
                Expand All
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={collapseAll}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline"
              >
                Collapse
              </button>
            </div>
          </div>
        </div>

        {/* Question List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No matching questions found for "{searchQuery}".
            </div>
          ) : (
            filtered.map((topic) => {
              const isExpanded = expandedTopics[topic.id] ?? false;
              const modelAnswer =
                topic.teachBriefing.modelAnswer8Marks ||
                topic.teachBriefing.modelAnswer6Marks ||
                topic.teachBriefing.modelAnswer4Marks;

              return (
                <div
                  key={topic.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden transition-all"
                >
                  {/* Item Accordion Header */}
                  <div
                    onClick={() => toggleExpand(topic.id)}
                    className="p-3.5 sm:p-4 hover:bg-slate-900/60 cursor-pointer flex items-center justify-between gap-3 select-none"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                        Q.{topic.qNumber}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                          topic.marks.includes('8')
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : topic.marks.includes('6')
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {topic.marks} MARKS
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {topic.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onOpenTopic(topic);
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium hidden sm:inline"
                      >
                        Practice Mode →
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800/80 bg-slate-950 text-xs sm:text-sm space-y-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block mb-1">
                          Core Exam Definition:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {topic.teachBriefing.coreDefinition}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-sky-400 block mb-1">
                          Essential Scoring Points:
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {topic.teachBriefing.examKeyPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {modelAnswer && (
                        <div className="pt-2">
                          <span className="text-[10px] font-mono uppercase font-bold text-purple-400 block mb-1">
                            Model University Exam Answer ({topic.marks} Marks):
                          </span>
                          <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                            {modelAnswer}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
