'use client';

import React from 'react';
import { Question } from '@/types';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';

interface ReviewDueSectionProps {
  questions: Question[];
  onSelectQuestion: (q: Question) => void;
}

export const ReviewDueSection: React.FC<ReviewDueSectionProps> = ({
  questions,
  onSelectQuestion,
}) => {
  const now = new Date();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const reviewDueQuestions = questions.filter((q) => {
    if (!q.last_reviewed) return true;
    const diff = now.getTime() - new Date(q.last_reviewed).getTime();
    return diff >= SEVEN_DAYS_MS;
  });

  if (reviewDueQuestions.length === 0) return null;

  return (
    <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-500/20 p-4 rounded-lg space-y-3 shadow-sm">
      <div className="flex items-center justify-between font-mono">
        <h3 className="text-xs font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2 uppercase tracking-wider">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Review Queue ({reviewDueQuestions.length} Items &gt; 7 Days Out)
        </h3>
        <span className="text-[10px] text-amber-600/80 dark:text-zinc-500">SPACED_REPETITION_ALERT</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {reviewDueQuestions.slice(0, 4).map((q) => (
          <div
            key={q.id}
            onClick={() => onSelectQuestion(q)}
            className="p-3 bg-white dark:bg-[#08090a] border border-amber-200/80 hover:border-amber-400 dark:border-amber-500/20 dark:hover:border-amber-500/40 rounded flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="space-y-1 flex-1 pr-2">
              <div className="flex items-center gap-2">
                <ConfidenceBadge confidence={q.confidence} interactive={false} />
                <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-mono">
                  {q.last_reviewed ? '7+ days elapsed' : 'Unreviewed'}
                </span>
              </div>
              <p className="text-xs font-medium text-stone-800 dark:text-zinc-200 line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {q.question}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 dark:text-zinc-600 group-hover:text-amber-600 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
