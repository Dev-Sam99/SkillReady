'use client';

import React from 'react';
import { Question, Topic } from '@/types';
import { Trophy, CheckCircle2, Star, TriangleAlert, CircleCheck, Minus } from 'lucide-react';

interface WeeklyPracticeInsightsProps {
  questions: Question[];
  topics: Topic[];
}

export const WeeklyPracticeInsights: React.FC<WeeklyPracticeInsightsProps> = ({ questions, topics }) => {
  const total = questions.length;
  const weakCount = questions.filter((q) => q.confidence === 'weak').length;
  const mediumCount = questions.filter((q) => q.confidence === 'medium').length;
  const solidCount = questions.filter((q) => q.confidence === 'solid').length;
  const flaggedCount = questions.filter((q) => q.is_flagged).length;

  const pluralize = (count: number, singular: string, plural?: string) => {
    return `${count} ${count === 1 ? singular : plural || `${singular}s`}`;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/95 shadow-glass space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-tint flex items-center justify-center text-deep shrink-0">
            <Trophy className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-ink">Interview Preparation</h3>
            <p className="text-xs font-medium text-slate font-sans">Confidence breakdown & topic coverage</p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate uppercase tracking-wider">
          Rating Distribution
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-[#FEE4E2]/50 border border-[#FECDCA] space-y-1">
            <span className="flex items-center justify-center gap-1 text-xs font-bold text-[#B42318]">
              <TriangleAlert className="w-3.5 h-3.5" /> Weak
            </span>
            <span className="font-display font-extrabold text-xl text-[#B42318] block">
              {weakCount}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FEF0C7]/50 border border-[#FEDF89] space-y-1">
            <span className="flex items-center justify-center gap-1 text-xs font-bold text-[#93370D]">
              <Minus className="w-3.5 h-3.5" /> Medium
            </span>
            <span className="font-display font-extrabold text-xl text-[#93370D] block">
              {mediumCount}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#DCFCE7]/50 border border-[#BBF7D0] space-y-1">
            <span className="flex items-center justify-center gap-1 text-xs font-bold text-[#166534]">
              <CircleCheck className="w-3.5 h-3.5" /> Solid
            </span>
            <span className="font-display font-extrabold text-xl text-[#166534] block">
              {solidCount}
            </span>
          </div>
        </div>
      </div>

      {/* Flagged Status summary */}
      <div className="p-4 bg-tint/50 rounded-2xl border border-line flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-ink">Important Questions</p>
            <p className="text-xs font-medium text-slate font-sans">Flagged for final review</p>
          </div>
        </div>
        <span className="font-display font-extrabold text-xl text-amber-600">
          {flaggedCount}
        </span>
      </div>

      {/* Topic Readiness Summary Footer */}
      <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-medium text-slate font-sans">
        <span className="flex items-center gap-1.5 text-ink font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Topic Coverage
        </span>
        <span className="text-ink font-bold">{pluralize(topics.length, 'subject')} active • {pluralize(total, 'question')} total</span>
      </div>
    </div>
  );
};

