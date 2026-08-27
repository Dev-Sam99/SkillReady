'use client';

import React from 'react';
import { Question, Topic } from '@/types';
import { Terminal, Activity, Target } from 'lucide-react';

interface DashboardStatsProps {
  questions: Question[];
  topics: Topic[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ questions, topics }) => {
  const total = questions.length;
  const solidCount = questions.filter((q) => q.confidence === 'solid').length;
  const mediumCount = questions.filter((q) => q.confidence === 'medium').length;
  const weakCount = questions.filter((q) => q.confidence === 'weak').length;

  const overallProgress = total > 0 ? Math.round((solidCount / total) * 100) : 0;

  // Calculate lowest progress topics
  const topicStats = topics.map((t) => {
    const topicQuestions = questions.filter((q) => q.topic_id === t.id);
    const tTotal = topicQuestions.length;
    const tSolid = topicQuestions.filter((q) => q.confidence === 'solid').length;
    const pct = tTotal > 0 ? Math.round((tSolid / tTotal) * 100) : 0;
    return { name: t.name, total: tTotal, solid: tSolid, pct };
  });

  const lowestTopics = [...topicStats]
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Readiness Index */}
      <div className="bg-[#0e0f12] border border-zinc-800/80 p-5 rounded-xl shadow-xl flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">Readiness Index</span>
          <Terminal className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-mono font-extrabold text-emerald-400 tracking-tight">{overallProgress}%</span>
          <span className="text-xs font-mono text-zinc-500">({solidCount}/{total} mastered)</span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-3 overflow-hidden border border-zinc-800">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Mastery Status */}
      <div className="bg-[#0e0f12] border border-zinc-800/80 p-5 rounded-xl shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
          <span>Mastery Breakdown</span>
          <Activity className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center font-mono">
          <div className="bg-red-500/5 border border-red-500/20 p-2 rounded-lg">
            <span className="text-[10px] text-red-400 block">WEAK</span>
            <span className="text-lg font-bold text-red-400">{weakCount}</span>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 p-2 rounded-lg">
            <span className="text-[10px] text-amber-400 block">MEDIUM</span>
            <span className="text-lg font-bold text-amber-400">{mediumCount}</span>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-2 rounded-lg">
            <span className="text-[10px] text-emerald-400 block">SOLID</span>
            <span className="text-lg font-bold text-emerald-400">{solidCount}</span>
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="md:col-span-2 bg-[#0e0f12] border border-zinc-800/80 p-5 rounded-xl shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-400" /> Topic Priority Queue
          </span>
          <span className="text-zinc-600">low_score_first</span>
        </div>

        <div className="space-y-2 mt-3 font-mono">
          {lowestTopics.map((lt, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 truncate max-w-[200px]">{lt.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${lt.pct}%` }}
                  />
                </div>
                <span className="text-zinc-400 w-8 text-right font-mono">{lt.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
