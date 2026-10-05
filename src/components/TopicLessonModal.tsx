import React, { useState } from 'react';
import { QuestionTopic } from '../types/game';
import { sounds } from '../utils/audio';
import { X, Sparkles, BookOpen, Swords, ChevronDown, ChevronUp, CheckCircle, Lightbulb } from 'lucide-react';
import { TransactionStateDiagram } from './InteractiveDiagrams/TransactionStateDiagram';
import { LockCompatibilityMatrix } from './InteractiveDiagrams/LockCompatibilityMatrix';
import { WaitForGraphInteractive } from './InteractiveDiagrams/WaitForGraphInteractive';
import { PrecedenceGraphVisualizer } from './InteractiveDiagrams/PrecedenceGraphVisualizer';
import { TimestampTraceSimulator } from './InteractiveDiagrams/TimestampTraceSimulator';
import { MongoTerminalSimulator } from './InteractiveDiagrams/MongoTerminalSimulator';
import { QueryPipelineVisualizer } from './InteractiveDiagrams/QueryPipelineVisualizer';

interface TopicLessonModalProps {
  topic: QuestionTopic;
  onClose: () => void;
  onStartChallenge: (topic: QuestionTopic) => void;
}

export const TopicLessonModal: React.FC<TopicLessonModalProps> = ({
  topic,
  onClose,
  onStartChallenge
}) => {
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const getMarksBadgeColor = (marks: string) => {
    if (marks.includes('8')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (marks.includes('6')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  };

  const handleStart = () => {
    sounds.playClick();
    onStartChallenge(topic);
  };

  const renderEmbeddedDiagram = () => {
    switch (topic.teachBriefing.diagramType) {
      case 'state_machine':
        return <TransactionStateDiagram />;
      case 'lock_matrix':
        return <LockCompatibilityMatrix />;
      case 'wait_for_graph':
        return <WaitForGraphInteractive />;
      case 'precedence_graph':
        return <PrecedenceGraphVisualizer />;
      case 'timestamp_timeline':
        return <TimestampTraceSimulator />;
      case 'query_pipeline':
        return <QueryPipelineVisualizer />;
      case 'nosql_tree':
        return <MongoTerminalSimulator />;
      default:
        // Contextual diagram fallback for specific questions
        if (topic.id.includes('timestamp')) return <TimestampTraceSimulator />;
        if (topic.id.includes('mongo') || topic.id.includes('cassandra')) return <MongoTerminalSimulator />;
        if (topic.id.includes('lock')) return <LockCompatibilityMatrix />;
        return null;
    }
  };

  const modelAnswer =
    topic.teachBriefing.modelAnswer8Marks ||
    topic.teachBriefing.modelAnswer6Marks ||
    topic.teachBriefing.modelAnswer4Marks;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                Q.{topic.qNumber}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getMarksBadgeColor(
                  topic.marks
                )}`}
              >
                {topic.marks} MARKS
              </span>
              <span className="text-xs text-slate-400">{topic.realmName}</span>
              {topic.isBoss && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700 animate-pulse">
                  ⚔️ BOSS FIGHT
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {topic.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Lesson Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-200 text-sm">
          {/* Mission Briefing Alert */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                Exam Briefing: Teach Me First
              </h4>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {topic.teachBriefing.coreDefinition}
              </p>
            </div>
          </div>

          {/* Interactive diagram if present */}
          {renderEmbeddedDiagram()}

          {/* Exam Key Points */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2.5 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Must-Include Points for Full Marks
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {topic.teachBriefing.examKeyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Pro Tips & Examiner Traps */}
          {topic.teachBriefing.examProTips.length > 0 && (
            <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3.5 text-xs sm:text-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-purple-400" />
                Examiner's Trap & Scoring Pro-Tip
              </h4>
              <ul className="space-y-1 text-purple-200/90 text-xs">
                {topic.teachBriefing.examProTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Accordion: Model Exam Answer */}
          {modelAnswer && (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="w-full px-4 py-3 bg-slate-900/80 hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400">📋 Model University Exam Answer</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    Structured for {topic.marks} Marks
                  </span>
                </div>
                {showModelAnswer ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showModelAnswer && (
                <div className="p-4 text-xs font-mono whitespace-pre-wrap text-slate-300 bg-slate-950 border-t border-slate-800 leading-relaxed select-text">
                  {modelAnswer}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>After this lesson:</span>
            <strong className="text-slate-200">
              {topic.isBoss ? 'Engage Boss Battle (+350 XP)' : 'Take Mini-Challenge (+100 XP)'}
            </strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Review Later
            </button>
            <button
              onClick={handleStart}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Swords className="w-4 h-4" />
              <span>{topic.isBoss ? 'Enter Boss Arena' : 'Start Mini-Challenge'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
