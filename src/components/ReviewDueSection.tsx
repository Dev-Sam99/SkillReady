'use client';

import React from 'react';
import { Question } from '@/types';
import { Clock, ChevronRight } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';

interface ReviewDueSectionProps {
  questions: Question[];
  onSelectQuestion: (q: Question) => void;
}

export const ReviewDueSection: React.FC<ReviewDueSectionProps> = ({
  questions,
  onSelectQuestion,
}) => {
  // Filter questions not reviewed in 7+ days or never reviewed
  const now = new Date();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const reviewDueQuestions = questions.filter((q) => {
    if (!q.last_reviewed) return true;
    const diff = now.getTime() - new Date(q.last_reviewed).getTime();
    return diff >= SEVEN_DAYS_MS;
  });

  if (reviewDueQuestions.length === 0) return null;

  return (
    <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" /> Review Due ({reviewDueQuestions.length} Questions 7+ Days Out)
        </h3>
        <span className="text-[11px] text-amber-400/80 font-mono">Priority Spaced Repetition</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reviewDueQuestions.slice(0, 4).map((q) => (
          <div
            key={q.id}
            onClick={() => onSelectQuestion(q)}
            className="p-3 bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/50 rounded-xl flex items-center justify-between cursor-pointer transition-all"
          >
            <div className="space-y-1 flex-1 pr-2">
              <div className="flex items-center gap-2">
                <ConfidenceBadge confidence={q.confidence} interactive={false} />
                <span className="text-[11px] text-slate-400 font-mono">
                  {q.last_reviewed ? '7+ days ago' : 'Never reviewed'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 line-clamp-1">{q.question}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400/80 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
