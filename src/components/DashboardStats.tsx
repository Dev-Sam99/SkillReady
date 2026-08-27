'use client';

import React from 'react';
import { Question, Topic } from '@/types';
import { Award, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

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

  // Lowest progress topics with at least 1 question
  const lowestTopics = [...topicStats]
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-indigo-300 font-medium">Readiness Score</span>
          <Award className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-black text-indigo-400">{overallProgress}%</span>
          <span className="text-xs text-slate-400">({solidCount}/{total} Solid)</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Confidence Breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Confidence Breakdown</span>
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2 text-center">
          <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
            <span className="text-xs text-red-400 block font-medium">Weak</span>
            <span className="text-lg font-bold text-red-400">{weakCount}</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl">
            <span className="text-xs text-amber-400 block font-medium">Medium</span>
            <span className="text-lg font-bold text-amber-400">{mediumCount}</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl">
            <span className="text-xs text-emerald-400 block font-medium">Solid</span>
            <span className="text-lg font-bold text-emerald-400">{solidCount}</span>
          </div>
        </div>
      </div>

      {/* Focus Areas (Lowest Progress Topics) */}
      <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Priority Focus Topics (Lowest Progress)
          </span>
          <AlertCircle className="w-4 h-4 text-amber-400" />
        </div>

        <div className="space-y-2 mt-2">
          {lowestTopics.map((lt, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium truncate max-w-[200px]">{lt.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${lt.pct}%` }}
                  />
                </div>
                <span className="font-mono text-slate-400 w-8 text-right">{lt.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
