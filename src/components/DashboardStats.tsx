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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Readiness Index */}
      <div className="bg-white dark:bg-[#121316] border border-stone-200/80 dark:border-zinc-800/60 p-4 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-zinc-400">
          <span>READINESS SCORE</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-mono font-semibold text-emerald-700 dark:text-emerald-400">{overallProgress}%</span>
          <span className="text-xs font-mono text-stone-400 dark:text-zinc-500">({solidCount}/{total})</span>
        </div>
        <div className="w-full bg-stone-100 dark:bg-zinc-900 rounded-full h-1.5 mt-3 overflow-hidden border border-stone-200/60 dark:border-zinc-800/80">
          <div
            className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400 h-full rounded-full transition-all duration-500 animate-progressGlow"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Mastery Status */}
      <div className="bg-white dark:bg-[#121316] border border-stone-200/80 dark:border-zinc-800/60 p-4 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-zinc-400">
          <span>CONFIDENCE BREAKDOWN</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-center">
          <div className="bg-red-50 border border-red-100 dark:bg-red-500/5 dark:border-red-500/10 p-1.5 rounded">
            <span className="text-[10px] text-red-700 dark:text-red-400 block">WEAK</span>
            <span className="text-sm font-semibold text-red-700 dark:text-red-400">{weakCount}</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/10 p-1.5 rounded">
            <span className="text-[10px] text-amber-800 dark:text-amber-400 block">MEDIUM</span>
            <span className="text-sm font-semibold text-amber-800 dark:text-amber-400">{mediumCount}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/10 p-1.5 rounded">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block">SOLID</span>
            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{solidCount}</span>
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="md:col-span-2 bg-white dark:bg-[#121316] border border-stone-200/80 dark:border-zinc-800/60 p-4 rounded-lg shadow-sm flex flex-col justify-between font-mono">
        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-zinc-400">
          <span>PRIORITY TOPIC QUEUE</span>
          <span className="text-stone-400 dark:text-zinc-600">lowest_progress</span>
        </div>

        <div className="space-y-2 mt-2">
          {lowestTopics.map((lt, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-stone-700 dark:text-zinc-300 truncate max-w-[200px]">{lt.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-28 bg-stone-100 dark:bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-stone-200 dark:border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${lt.pct}%` }}
                  />
                </div>
                <span className="text-stone-500 dark:text-zinc-400 w-8 text-right font-mono">{lt.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
