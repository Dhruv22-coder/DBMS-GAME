import React, { useState, useEffect } from 'react';
import { UserStats, QuestionTopic } from './types/game';
import { QUESTION_BANK, INITIAL_USER_STATS, RANKS } from './data/questionBank';
import { sounds } from './utils/audio';
import { Navbar } from './components/Navbar';
import { Roadmap } from './components/Roadmap';
import { TopicLessonModal } from './components/TopicLessonModal';
import { MiniGameChallenge } from './components/MiniGameChallenge';
import { BossBattleModal } from './components/BossBattleModal';
import { CramSheetModal } from './components/CramSheetModal';
import { Sparkles, Trophy, Swords, Zap, CheckCircle2, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'dbms_pt2_game_stats_v2';

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_USER_STATS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load stats from localStorage', e);
    }
    return INITIAL_USER_STATS;
  });

  const [selectedMarksFilter, setSelectedMarksFilter] = useState<string>('all');
  const [activeTeachTopic, setActiveTeachTopic] = useState<QuestionTopic | null>(null);
  const [activeChallengeTopic, setActiveChallengeTopic] = useState<QuestionTopic | null>(null);
  const [activeBossTopic, setActiveBossTopic] = useState<QuestionTopic | null>(null);
  const [showCramSheet, setShowCramSheet] = useState<boolean>(false);

  // Sync stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats', e);
    }
  }, [stats]);

  // Handle XP addition & Rank leveling
  const addXp = (amount: number) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newRankTitle = prev.rankTitle;

      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (newXp >= RANKS[i].minXp) {
          newLevel = RANKS[i].level;
          newRankTitle = RANKS[i].title;
          break;
        }
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        rankTitle: newRankTitle
      };
    });
  };

  const handleUpdateStats = (newFields: Partial<UserStats>) => {
    setStats((prev) => ({ ...prev, ...newFields }));
  };

  // Called when a topic node is clicked on roadmap
  const handleSelectTopicFromRoadmap = (topic: QuestionTopic) => {
    // As per user instruction: "Teach me each topic briefly before testing me"
    // Always open Teach Briefing first!
    setActiveTeachTopic(topic);
  };

  // Called from Teach modal when user clicks "Start Challenge" or "Enter Boss Arena"
  const handleStartChallengeFromTeach = (topic: QuestionTopic) => {
    setActiveTeachTopic(null);
    if (topic.isBoss) {
      setActiveBossTopic(topic);
    } else {
      setActiveChallengeTopic(topic);
    }
  };

  // Called when standard mini-game challenge is completed
  const handleChallengeComplete = (topicId: string, earnedXp: number) => {
    addXp(earnedXp);
    setStats((prev) => {
      const completed = Array.from(new Set([...prev.completedTopics, topicId]));
      return {
        ...prev,
        completedTopics: completed
      };
    });
  };

  // Called when boss is defeated
  const handleBossVictory = (topicId: string, earnedXp: number) => {
    addXp(earnedXp);
    setStats((prev) => {
      const bosses = Array.from(new Set([...prev.bossesDefeated, topicId]));
      const completed = Array.from(new Set([...prev.completedTopics, topicId]));
      return {
        ...prev,
        bossesDefeated: bosses,
        completedTopics: completed
      };
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all progress and start fresh from Level 1?')) {
      sounds.playClick();
      setStats(INITIAL_USER_STATS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const completedCount = stats.completedTopics.length;
  const totalCount = QUESTION_BANK.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Find next recommended topic
  const nextTopic = QUESTION_BANK.find(
    (t) => !stats.completedTopics.includes(t.id) && !stats.bossesDefeated.includes(t.id)
  ) || QUESTION_BANK[QUESTION_BANK.length - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation & Status Bar */}
      <Navbar
        stats={stats}
        onUpdateStats={handleUpdateStats}
        selectedMarksFilter={selectedMarksFilter}
        onSelectMarksFilter={setSelectedMarksFilter}
        onOpenCramSheet={() => {
          sounds.playClick();
          setShowCramSheet(true);
        }}
        onOpenExamMode={() => {
          sounds.playClick();
          setShowCramSheet(true);
        }}
      />

      {/* Hero Quest Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 border-b border-slate-800/80 px-4 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DBS228917 • Semester IV Computer Engineering</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              DBMS PT2 Exam Quest & Boss Fights
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Master every question from the syllabus. Review concise, exam-focused points, test your concepts with interactive mini-games, and conquer numerical boss fights!
            </p>
          </div>

          {/* Quick Quest Dashboard Card */}
          <div className="w-full md:w-80 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Syllabus Completion</span>
              <span className="font-mono font-bold text-amber-400">{completedCount} / {totalCount} ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Current Objective */}
            <div className="pt-1 text-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-0.5">
                Current Exam Objective:
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-200 truncate">
                  Q.{nextTopic.qNumber}: {nextTopic.title}
                </span>
                <button
                  onClick={() => handleSelectTopicFromRoadmap(nextTopic)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0 transition-transform active:scale-95"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Area */}
      <main className="flex-1">
        <Roadmap
          topics={QUESTION_BANK}
          stats={stats}
          selectedMarksFilter={selectedMarksFilter}
          onSelectTopic={handleSelectTopicFromRoadmap}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-500 text-center px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            DBMS PT2 Interactive Syllabus Quest • Computer Engineering Semester IV (DBS228917)
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCramSheet(true)}
              className="hover:text-amber-400 underline transition-colors"
            >
              27-Question Model Answers
            </button>
            <button
              onClick={handleResetProgress}
              className="hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Data
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL 1: "Teach Me First" Briefing */}
      {activeTeachTopic && (
        <TopicLessonModal
          topic={activeTeachTopic}
          onClose={() => setActiveTeachTopic(null)}
          onStartChallenge={handleStartChallengeFromTeach}
        />
      )}

      {/* MODAL 2: Mini-Game Challenge */}
      {activeChallengeTopic && (
        <MiniGameChallenge
          topic={activeChallengeTopic}
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onComplete={handleChallengeComplete}
          onClose={() => setActiveChallengeTopic(null)}
          onBackToTeach={() => {
            const t = activeChallengeTopic;
            setActiveChallengeTopic(null);
            setActiveTeachTopic(t);
          }}
        />
      )}

      {/* MODAL 3: Boss Battle (Numericals) */}
      {activeBossTopic && (
        <BossBattleModal
          topic={activeBossTopic}
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onVictory={handleBossVictory}
          onClose={() => setActiveBossTopic(null)}
          onOpenTeach={() => {
            const t = activeBossTopic;
            setActiveBossTopic(null);
            setActiveTeachTopic(t);
          }}
        />
      )}

      {/* MODAL 4: Complete 27-Question Cram Sheet Vault */}
      {showCramSheet && (
        <CramSheetModal
          topics={QUESTION_BANK}
          onClose={() => setShowCramSheet(false)}
          onOpenTopic={(t) => {
            setShowCramSheet(false);
            setActiveTeachTopic(t);
          }}
        />
      )}
    </div>
  );
}
