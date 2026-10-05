import React, { useState } from 'react';
import { QuestionTopic, UserStats, BossStep } from '../types/game';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Swords, Heart, Shield, Flame, Sparkles, Trophy, ChevronRight, HelpCircle } from 'lucide-react';

interface BossBattleModalProps {
  topic: QuestionTopic;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onVictory: (topicId: string, earnedXp: number) => void;
  onClose: () => void;
  onOpenTeach: () => void;
}

export const BossBattleModal: React.FC<BossBattleModalProps> = ({
  topic,
  stats,
  onUpdateStats,
  onVictory,
  onClose,
  onOpenTeach
}) => {
  const boss = topic.bossData;
  if (!boss) return null;

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [lastDamageDealt, setLastDamageDealt] = useState<number | null>(null);
  const [battleLogs, setBattleLogs] = useState<string[]>([
    `⚔️ Encounter started! ${boss.bossName} approaches with high-yield numerical exam power.`
  ]);
  const [isVictory, setIsVictory] = useState(false);
  const [showWorkingPad, setShowWorkingPad] = useState(false);

  const step: BossStep = boss.steps[currentStepIdx];
  const hpPercent = Math.max(0, Math.round((bossHp / boss.maxHp) * 100));

  const handleSelect = (idx: number) => {
    if (isEvaluated) return;
    setSelectedOptIdx(idx);
    sounds.playClick();
  };

  const handleExecuteAttack = () => {
    if (selectedOptIdx === null || isEvaluated) return;

    const chosen = step.options[selectedOptIdx];
    setIsEvaluated(true);

    if (chosen.isCorrect) {
      sounds.playHit();
      const dmg = chosen.damageToBoss || 35;
      const newHp = Math.max(0, bossHp - dmg);
      setBossHp(newHp);
      setLastDamageDealt(dmg);

      setBattleLogs((prev) => [
        `💥 CRITICAL HIT! You dealt ${dmg} damage to ${boss.bossName}!`,
        ...prev
      ]);

      const newStreak = stats.streak + 1;
      onUpdateStats({
        streak: newStreak,
        bestStreak: Math.max(newStreak, stats.bestStreak)
      });
    } else {
      sounds.playError();
      const newLives = Math.max(0, stats.lives - 1);
      onUpdateStats({
        lives: newLives,
        streak: 0
      });
      setBattleLogs((prev) => [
        `❌ ${boss.bossName} countered your calculation! Lost 1 Heart.`,
        ...prev
      ]);
    }
  };

  const handleNextPhase = () => {
    sounds.playClick();
    if (currentStepIdx + 1 < boss.steps.length) {
      setCurrentStepIdx(currentStepIdx + 1);
      setSelectedOptIdx(null);
      setIsEvaluated(false);
      setLastDamageDealt(null);
    } else {
      // Victory!
      setIsVictory(true);
      sounds.playVictory();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
      const victoryXp = boss.victoryRewardXp + stats.streak * 20;
      onVictory(topic.id, victoryXp);
      setBattleLogs((prev) => [
        `🏆 BOSS DEFEATED! ${boss.bossName} has fallen! Earned +${victoryXp} XP!`,
        ...prev
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-500/50 rounded-2xl max-w-3xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Boss Arena Header */}
        <div className="p-4 sm:p-5 border-b border-rose-950 bg-gradient-to-r from-rose-950/80 via-slate-950 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center text-3xl shadow-lg shadow-rose-500/30 animate-pulse">
              {boss.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white tracking-widest">
                  NUMERICAL BOSS
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {topic.marks} MARKS EXAM CHALLENGE
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">{boss.bossName}</h2>
              <p className="text-xs text-rose-300/80">{boss.title}</p>
            </div>
          </div>

          {/* Boss HP Bar */}
          <div className="w-full sm:w-56 bg-slate-950/90 border border-slate-800 p-2.5 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-1 font-mono">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-rose-500" /> BOSS HP
              </span>
              <span className="text-white font-bold">{bossHp}/{boss.maxHp}</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Boss Fight Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {isVictory ? (
            /* Boss Defeat Victory Screen */
            <div className="text-center py-6 space-y-4 animate-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-4xl shadow-xl shadow-amber-500/30">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400">
                  NUMERICAL CONQUERED!
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {boss.bossName} Vanquished!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                  You solved the full university numerical step-by-step with zero shortcuts. This guarantees full marks in your exam!
                </p>
              </div>

              <div className="inline-flex items-center gap-4 bg-slate-950 border border-slate-800 px-6 py-3 rounded-2xl">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">XP Earned</span>
                  <span className="text-lg font-black text-amber-400 font-mono">+{boss.victoryRewardXp} XP</span>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Exam Confidence</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">100% SECURED</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  Return to World Map
                </button>
              </div>
            </div>
          ) : stats.lives <= 0 ? (
            /* Boss Knockout */
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center mx-auto text-rose-400 text-2xl font-mono">
                ☠️
              </div>
              <h4 className="text-lg font-bold text-white">Knocked Out by {boss.bossName}!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Numerical boss attacks are tough. Review the teach briefing to master the step-by-step algorithm!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onOpenTeach}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
                >
                  Review Lesson Solution
                </button>
                <button
                  onClick={() => onUpdateStats({ lives: stats.maxLives })}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
                >
                  Revive Energy & Retry
                </button>
              </div>
            </div>
          ) : (
            /* Step Combat Phase */
            <div className="space-y-4">
              {/* Question Context Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs mb-1 font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">{step.title}</span>
                  <span>Phase {currentStepIdx + 1}/{boss.steps.length}</span>
                </div>
                <p className="text-xs font-mono text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800 select-text">
                  {step.scheduleContext}
                </p>
              </div>

              {/* Working Pad Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Strategic Combat Decision:
                </span>
                <button
                  onClick={() => setShowWorkingPad(!showWorkingPad)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {showWorkingPad ? 'Hide Scratchpad' : 'Show Rough Working Hint'}
                </button>
              </div>

              {showWorkingPad && (
                <div className="bg-amber-950/40 border border-amber-600/40 p-3 rounded-xl text-xs text-amber-200 leading-relaxed font-mono">
                  💡 <strong>Exam Hint:</strong> {step.workingHint}
                </div>
              )}

              {/* Step Question */}
              <p className="text-xs sm:text-sm font-semibold text-slate-100">
                {step.question}
              </p>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {step.options.map((opt, idx) => {
                  const isSelected = selectedOptIdx === idx;
                  let btnStyle = 'bg-slate-950/70 border-slate-800 hover:border-rose-500/50 text-slate-200';

                  if (isEvaluated) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                    } else {
                      btnStyle = 'opacity-30 border-slate-900 bg-slate-950 text-slate-500';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-slate-800 border-rose-500 text-white ring-1 ring-rose-500';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isEvaluated}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current shrink-0 flex items-center justify-center text-xs font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Attack Result Feedback */}
              {isEvaluated && selectedOptIdx !== null && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1 animate-in fade-in-50 duration-200 ${
                    step.options[selectedOptIdx].isCorrect
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {step.options[selectedOptIdx].isCorrect ? '⚔️ ATTACK SUCCESSFUL' : '🛡️ ATTACK BLOCKED'}
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {step.options[selectedOptIdx].explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isVictory && stats.lives > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Flee Arena
            </button>

            {!isEvaluated ? (
              <button
                onClick={handleExecuteAttack}
                disabled={selectedOptIdx === null}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Swords className="w-4 h-4" />
                <span>Strike Boss with Calculation</span>
              </button>
            ) : (
              <button
                onClick={handleNextPhase}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <span>{currentStepIdx + 1 < boss.steps.length ? 'Next Battle Phase' : 'Claim Victory!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
