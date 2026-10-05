import React from 'react';
import { UserStats, QuestionMarks } from '../types/game';
import { RANKS } from '../data/questionBank';
import { sounds } from '../utils/audio';
import { Heart, Flame, Sparkles, BookOpen, Volume2, VolumeX, Key, GraduationCap } from 'lucide-react';

interface NavbarProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  selectedMarksFilter: string;
  onSelectMarksFilter: (filter: string) => void;
  onOpenCramSheet: () => void;
  onOpenExamMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  onUpdateStats,
  selectedMarksFilter,
  onSelectMarksFilter,
  onOpenCramSheet,
  onOpenExamMode
}) => {
  const currentRank = RANKS.find((r) => r.level === stats.level) || RANKS[0];
  const nextRank = RANKS.find((r) => r.level === stats.level + 1);

  const prevXp = currentRank.minXp;
  const targetXp = nextRank ? nextRank.minXp : stats.xp + 1000;
  const xpInLevel = Math.max(0, stats.xp - prevXp);
  const xpNeeded = targetXp - prevXp;
  const progressPct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  const toggleSound = () => {
    const nextVal = !stats.soundEnabled;
    sounds.enabled = nextVal;
    onUpdateStats({ soundEnabled: nextVal });
    if (nextVal) sounds.playClick();
  };

  const toggleTeacherMode = () => {
    sounds.playClick();
    onUpdateStats({ teacherMode: !stats.teacherMode });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand / Course Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 font-mono text-xs">
                PT2
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm md:text-base text-white tracking-tight">
                  DBMS PT2 Master
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  DBS228917
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Teach-First Briefings • Interactive Mini-Games • Numerical Boss Battles
              </p>
            </div>
          </div>

          {/* Mobile quick actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenCramSheet}
              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1"
              title="Quick Revision Cram Sheet"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
            >
              {stats.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Center: Lives, Streak, XP, Level */}
        <div className="flex flex-wrap items-center gap-2.5 md:gap-4 justify-between sm:justify-center">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-xs">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: stats.maxLives }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 transition-all ${
                    i < stats.lives
                      ? 'fill-rose-500 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-slate-400 text-[11px] ml-1">
              {stats.lives}/{stats.maxLives}
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-xs">
            <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-600'}`} />
            <span className="font-mono font-bold text-amber-300">{stats.streak}</span>
            <span className="text-[10px] text-slate-400 font-medium">Streak</span>
          </div>

          {/* Level & XP Bar */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full text-xs">
            <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded font-mono text-[11px] border border-amber-500/30">
              Lv.{stats.level}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[10px] gap-2">
                <span className="font-semibold text-slate-200">{stats.rankTitle}</span>
                <span className="font-mono text-slate-400">{stats.xp} XP</span>
              </div>
              <div className="w-24 sm:w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick actions & Teacher mode */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenCramSheet}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>27-Q Cram Sheet</span>
          </button>

          <button
            onClick={toggleTeacherMode}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              stats.teacherMode
                ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Unlock all topics for immediate exam review"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{stats.teacherMode ? 'Teacher Mode: ON' : 'Unlock All'}</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title={stats.soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {stats.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Marks prioritization banner */}
      <div className="bg-slate-950 px-4 py-1.5 border-t border-slate-850 flex items-center justify-between text-xs overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="font-semibold text-slate-300">Exam Priority Filter:</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: 'all', label: 'All 27 Questions' },
            { id: '8', label: '👑 8 Marks (High Yield)' },
            { id: '6', label: '⚔️ 6 Marks (Core)' },
            { id: '4', label: '🛡️ 4 Marks (Quick)' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => {
                sounds.playClick();
                onSelectMarksFilter(flt.id);
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                selectedMarksFilter === flt.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-850'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
