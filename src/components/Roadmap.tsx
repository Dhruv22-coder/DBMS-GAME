import React from 'react';
import { QuestionTopic, UserStats } from '../types/game';
import { sounds } from '../utils/audio';
import { Lock, CheckCircle2, Swords, Sparkles, BookOpen, ChevronRight, Award } from 'lucide-react';

interface RoadmapProps {
  topics: QuestionTopic[];
  stats: UserStats;
  selectedMarksFilter: string;
  onSelectTopic: (topic: QuestionTopic) => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({
  topics,
  stats,
  selectedMarksFilter,
  onSelectTopic
}) => {
  // Filter topics by marks if active
  const filteredTopics = topics.filter((t) => {
    if (selectedMarksFilter === 'all') return true;
    if (selectedMarksFilter === '8') return t.marks.includes('8');
    if (selectedMarksFilter === '6') return t.marks.includes('6');
    if (selectedMarksFilter === '4') return t.marks.includes('4');
    return true;
  });

  // Group by realms
  const realms = Array.from(new Set(topics.map((t) => t.realmName))).map((realmName) => {
    const realmTopics = filteredTopics.filter((t) => t.realmName === realmName);
    const allRealmTopics = topics.filter((t) => t.realmName === realmName);
    const completedCount = allRealmTopics.filter((t) =>
      stats.completedTopics.includes(t.id) || stats.bossesDefeated.includes(t.id)
    ).length;

    return {
      realmName,
      topics: realmTopics,
      completedCount,
      totalCount: allRealmTopics.length
    };
  }).filter((r) => r.topics.length > 0);

  const isTopicUnlocked = (topic: QuestionTopic, index: number) => {
    if (stats.teacherMode) return true;
    if (topic.unlockedByDefault) return true;

    // Check if the previous topic in the overall syllabus is completed
    const overallIdx = topics.findIndex((t) => t.id === topic.id);
    if (overallIdx <= 0) return true;

    const prevTopic = topics[overallIdx - 1];
    return (
      stats.completedTopics.includes(prevTopic.id) ||
      stats.bossesDefeated.includes(prevTopic.id)
    );
  };

  const isTopicCompleted = (topic: QuestionTopic) => {
    return (
      stats.completedTopics.includes(topic.id) ||
      stats.bossesDefeated.includes(topic.id)
    );
  };

  const getMarksBadge = (marks: string) => {
    if (marks.includes('8')) {
      return (
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
          👑 {marks}M
        </span>
      );
    }
    if (marks.includes('6')) {
      return (
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
          ⚔️ {marks}M
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
        🛡️ {marks}M
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {realms.map((realm, rIdx) => {
        const isRealmMastered = realm.completedCount === realm.totalCount && realm.totalCount > 0;

        return (
          <section key={realm.realmName} className="space-y-4">
            {/* Realm Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-amber-400 text-xs border border-slate-700">
                  {rIdx + 1}
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    {realm.realmName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Syllabus Section • {realm.topics.length} Exam Questions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {isRealmMastered ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Award className="w-3.5 h-3.5" /> Realm Mastered
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
                    Progress: <strong className="text-amber-400">{realm.completedCount}</strong>/{realm.totalCount}
                  </span>
                )}
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {realm.topics.map((topic, tIdx) => {
                const unlocked = isTopicUnlocked(topic, tIdx);
                const completed = isTopicCompleted(topic);

                return (
                  <div
                    key={topic.id}
                    onClick={() => {
                      if (!unlocked) {
                        sounds.playError();
                        return;
                      }
                      sounds.playClick();
                      onSelectTopic(topic);
                    }}
                    className={`relative group rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer overflow-hidden ${
                      !unlocked
                        ? 'bg-slate-950/40 border-slate-850 opacity-60 cursor-not-allowed'
                        : topic.isBoss
                        ? 'bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 border-rose-500/50 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-900/20 hover:-translate-y-0.5'
                        : completed
                        ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 hover:-translate-y-0.5'
                        : 'bg-slate-900/90 border-slate-700/80 hover:border-amber-400/70 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Status corner glow */}
                    {topic.isBoss && (
                      <div className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black font-mono uppercase px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1">
                        <Swords className="w-3 h-3" /> BOSS FIGHT
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Q.{topic.qNumber}
                        </span>
                        {getMarksBadge(topic.marks)}
                      </div>

                      {/* State icon */}
                      <div>
                        {completed ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : !unlocked ? (
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 group-hover:scale-110 transition-transform">
                            {topic.isBoss ? <Swords className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {topic.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {topic.teachBriefing.coreDefinition}
                    </p>

                    {/* Bottom action prompt */}
                    <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-400 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                        <span>Briefing & Mini-Game</span>
                      </span>

                      <span
                        className={`font-semibold ${
                          !unlocked
                            ? 'text-slate-600'
                            : completed
                            ? 'text-emerald-400'
                            : topic.isBoss
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {!unlocked
                          ? 'Locked'
                          : completed
                          ? 'Review (+XP)'
                          : topic.isBoss
                          ? 'Engage Boss ⚔️'
                          : 'Teach Me First →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
