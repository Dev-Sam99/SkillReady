'use client';

import React from 'react';
import { Question, Topic } from '@/types';
import { Target, TriangleAlert, Minus, CircleCheck, Star, FolderOpen } from 'lucide-react';

interface DashboardStatsProps {
  questions: Question[];
  topics: Topic[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ questions, topics }) => {
  const total = questions.length;
  const reviewedQuestions = questions.filter((q) => q.last_reviewed !== null);
  const reviewedCount = reviewedQuestions.length;
  const solidReviewedCount = reviewedQuestions.filter((q) => q.confidence === 'solid').length;

  const weakCount = questions.filter((q) => q.confidence === 'weak').length;
  const mediumCount = questions.filter((q) => q.confidence === 'medium').length;
  const solidCount = questions.filter((q) => q.confidence === 'solid').length;
  const flaggedCount = questions.filter((q) => q.is_flagged).length;

  // Formula: Readiness % is Solid Reviewed / Total Reviewed (or 0 if no reviews yet)
  const readinessScore = reviewedCount > 0 ? Math.round((solidReviewedCount / reviewedCount) * 100) : 0;

  const pluralize = (count: number, singular: string, plural?: string) => {
    return `${count} ${count === 1 ? singular : plural || `${singular}s`}`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
      {/* 1. Readiness Card */}
      <div className="glass-panel p-5 rounded-2xl sm:rounded-3xl border border-white/95 shadow-glass flex flex-col justify-between hover:shadow-glass-hover transition-all group">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-tint flex items-center justify-center text-deep shrink-0">
            <Target className="w-[26px] h-[26px]" strokeWidth={2} aria-hidden="true" />
          </div>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            {reviewedCount > 0 ? `${readinessScore}%` : '0%'}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-line/60 flex flex-col">
          <span className="text-sm font-semibold text-ink">Interview Readiness</span>
          <span className="text-xs font-medium text-slate">
            {reviewedCount > 0 ? `${solidReviewedCount} of ${reviewedCount} reviewed solid` : 'Not enough reviews yet'}
          </span>
        </div>
      </div>

      {/* 2. Total Questions Bank */}
      <div className="glass-panel p-5 rounded-2xl sm:rounded-3xl border border-white/95 shadow-glass flex flex-col justify-between hover:shadow-glass-hover transition-all group">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-tint flex items-center justify-center text-deep shrink-0">
            <FolderOpen className="w-[26px] h-[26px]" strokeWidth={2} aria-hidden="true" />
          </div>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            {total}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-line/60 flex flex-col">
          <span className="text-sm font-semibold text-ink">Question Bank</span>
          <span className="text-xs font-medium text-slate">
            {pluralize(topics.length, 'subject')} active
          </span>
        </div>
      </div>

      {/* 3. Weak Questions (Needs Focus) */}
      <div className="glass-panel p-5 rounded-2xl sm:rounded-3xl border border-white/95 shadow-glass flex flex-col justify-between hover:shadow-glass-hover transition-all group">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-[#FEE4E2] flex items-center justify-center text-[#B42318] shrink-0">
            <TriangleAlert className="w-[26px] h-[26px]" strokeWidth={2} aria-hidden="true" />
          </div>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#B42318] tracking-tight">
            {weakCount}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-line/60 flex flex-col">
          <span className="text-sm font-semibold text-ink">Weak Rating</span>
          <span className="text-xs font-medium text-slate">Needs review</span>
        </div>
      </div>

      {/* 4. Medium Questions (Practicing) */}
      <div className="glass-panel p-5 rounded-2xl sm:rounded-3xl border border-white/95 shadow-glass flex flex-col justify-between hover:shadow-glass-hover transition-all group">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF0C7] flex items-center justify-center text-[#93370D] shrink-0">
            <Minus className="w-[26px] h-[26px]" strokeWidth={2} aria-hidden="true" />
          </div>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#93370D] tracking-tight">
            {mediumCount}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-line/60 flex flex-col">
          <span className="text-sm font-semibold text-ink">Medium Rating</span>
          <span className="text-xs font-medium text-slate">Practicing</span>
        </div>
      </div>

      {/* 5. Solid Questions (Mastered) */}
      <div className="glass-panel p-5 rounded-2xl sm:rounded-3xl border border-white/95 shadow-glass flex flex-col justify-between hover:shadow-glass-hover transition-all group">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-[#166534] shrink-0">
            <CircleCheck className="w-[26px] h-[26px]" strokeWidth={2} aria-hidden="true" />
          </div>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#166534] tracking-tight">
            {solidCount}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-line/60 flex flex-col">
          <span className="text-sm font-semibold text-ink">Solid Rating</span>
          <span className="text-xs font-medium text-slate">Mastered concepts</span>
        </div>
      </div>

      {/* 6. Flagged / Bookmarked Questions */}
      <div className="glass-panel p-5 rounded-2xl sm:rounded-3xl border border-white/95 shadow-glass flex flex-col justify-between hover:shadow-glass-hover transition-all group">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Star className="w-[26px] h-[26px] fill-amber-400" strokeWidth={2} aria-hidden="true" />
          </div>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-amber-600 tracking-tight">
            {flaggedCount}
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-line/60 flex flex-col">
          <span className="text-sm font-semibold text-ink">Flagged Questions</span>
          <span className="text-xs font-medium text-slate">Marked important</span>
        </div>
      </div>
    </div>
  );
};

