import React, { useState } from 'react';
import { QuestionTopic, MiniGameStep, UserStats } from '../types/game';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, AlertCircle, Sparkles, Flame, Heart, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface MiniGameChallengeProps {
  topic: QuestionTopic;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onComplete: (topicId: string, earnedXp: number) => void;
  onClose: () => void;
  onBackToTeach: () => void;
}

export const MiniGameChallenge: React.FC<MiniGameChallengeProps> = ({
  topic,
  stats,
  onUpdateStats,
  onComplete,
  onClose,
  onBackToTeach
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [challengeFinished, setChallengeFinished] = useState(false);

  const steps = topic.challenge.steps;
  const currentStep: MiniGameStep = steps[currentStepIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    sounds.playClick();
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    const correct = selectedOption === currentStep.correctIndex;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sounds.playCorrect();
      const newStreak = stats.streak + 1;
      const bestStreak = Math.max(newStreak, stats.bestStreak);
      onUpdateStats({
        streak: newStreak,
        bestStreak
      });
    } else {
      sounds.playError();
      const remainingLives = Math.max(0, stats.lives - 1);
      onUpdateStats({
        lives: remainingLives,
        streak: 0
      });
    }
  };

  const handleNextStep = () => {
    sounds.playClick();
    if (currentStepIndex + 1 < steps.length) {
      setCurrentStepIndex(currentStepIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Challenge finished!
      setChallengeFinished(true);
      sounds.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const xpGained = 100 + stats.streak * 10;
      onComplete(topic.id, xpGained);
    }
  };

  const handleRefillLives = () => {
    sounds.playClick();
    onUpdateStats({ lives: stats.maxLives });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                CHALLENGE MODE
              </span>
              <span className="text-xs text-slate-400">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {topic.challenge.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-xs">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="font-mono text-slate-300 font-bold">{stats.lives}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Challenge Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Out of lives state */}
          {stats.lives <= 0 ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
                <Heart className="w-6 h-6 fill-rose-500/20" />
              </div>
              <h4 className="text-base font-bold text-white">Out of Energy!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You ran out of lives on this topic. Don't worry, review the teach briefing to refresh your knowledge, or refill your energy!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onBackToTeach}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
                >
                  Review Teach Briefing
                </button>
                <button
                  onClick={handleRefillLives}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30"
                >
                  Refill Energy (Free)
                </button>
              </div>
            </div>
          ) : challengeFinished ? (
            /* Victory screen */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 mx-auto shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white">Concept Mastered!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  You successfully verified your understanding of <strong className="text-slate-200">{topic.title}</strong>.
                </p>
              </div>

              <div className="inline-flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-2.5">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Reward</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">+100 XP</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Node</span>
                  <span className="text-xs font-bold text-emerald-400">UNLOCKED</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  Continue Journey on Roadmap
                </button>
              </div>
            </div>
          ) : (
            /* Active step question */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Challenge Question
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                  {currentStep.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {currentStep.options?.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-200';

                  if (isAnswered) {
                    if (idx === currentStep.correctIndex) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                    } else {
                      btnStyle = 'opacity-40 border-slate-900 bg-slate-950 text-slate-500';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-slate-800 border-amber-500 text-white ring-1 ring-amber-500';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current shrink-0 flex items-center justify-center text-xs font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation feedback */}
              {isAnswered && (
                <div
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm space-y-1.5 animate-in fade-in-50 duration-200 ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>CORRECT! Exam Point Mastered</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>INCORRECT (-1 Heart)</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{currentStep.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!challengeFinished && stats.lives > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              onClick={onBackToTeach}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Re-read Teach Briefing
            </button>

            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs transition-all"
              >
                Submit Answer
              </button>
            ) : isCorrect ? (
              <button
                onClick={handleNextStep}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <span>{currentStepIndex + 1 < steps.length ? 'Next Step' : 'Finish Challenge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setIsAnswered(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
