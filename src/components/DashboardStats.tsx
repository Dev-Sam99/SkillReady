'use client';

import React from 'react';
import { Question, Topic } from '@/types';

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
      {/* Total Questions Card */}
      <div className="bg-[#f5f4ef] p-5 rounded-2xl flex flex-col justify-between shadow-sm">
        <span className="text-3xl font-serif-display font-semibold text-stone-900 tracking-tight">{total}</span>
        <span className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-widest mt-2">TOTAL QUESTIONS</span>
      </div>

      {/* Readiness Score Card */}
      <div className="bg-[#f5f4ef] p-5 rounded-2xl flex flex-col justify-between shadow-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-serif-display font-semibold text-stone-900 tracking-tight">{overallProgress}%</span>
          <span className="text-xs font-mono text-stone-400">({solidCount} solid)</span>
        </div>
        <span className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-widest mt-2">READINESS SCORE</span>
      </div>

      {/* Confidence Breakdown Card */}
      <div className="bg-[#f5f4ef] p-5 rounded-2xl flex flex-col justify-between shadow-sm">
        <div className="flex items-baseline justify-between text-center font-mono">
          <div>
            <span className="text-lg font-serif-display font-bold text-red-700 block">{weakCount}</span>
            <span className="text-[9px] text-red-700/80 font-mono uppercase">WEAK</span>
          </div>
          <div className="border-x border-stone-300/60 px-3">
            <span className="text-lg font-serif-display font-bold text-amber-800 block">{mediumCount}</span>
            <span className="text-[9px] text-amber-800/80 font-mono uppercase">MEDIUM</span>
          </div>
          <div>
            <span className="text-lg font-serif-display font-bold text-emerald-800 block">{solidCount}</span>
            <span className="text-[9px] text-emerald-800/80 font-mono uppercase">SOLID</span>
          </div>
        </div>
        <span className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-widest mt-2">CONFIDENCE BREAKDOWN</span>
      </div>

      {/* Focus Topics Queue Card */}
      <div className="bg-[#f5f4ef] p-5 rounded-2xl flex flex-col justify-between shadow-sm">
        <div className="space-y-1.5 font-mono text-xs">
          {lowestTopics.map((lt, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-stone-700 truncate max-w-[140px] text-[11px] font-sans">{lt.name}</span>
              <span className="text-stone-500 font-mono text-[11px]">{lt.pct}%</span>
            </div>
          ))}
        </div>
        <span className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-widest mt-2">PRIORITY QUEUE</span>
      </div>
    </div>
  );
};
