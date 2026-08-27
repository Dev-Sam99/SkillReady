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
    <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl space-y-3 shadow-sm">
      <div className="flex items-center justify-between font-mono">
        <h3 className="text-xs font-semibold text-amber-900 flex items-center gap-2 uppercase tracking-wider">
          <AlertCircle className="w-4 h-4 text-amber-600" /> Review Queue ({reviewDueQuestions.length} Questions &gt; 7 Days Out)
        </h3>
        <span className="text-[10px] text-amber-700/70">SPACED_REPETITION</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {reviewDueQuestions.slice(0, 4).map((q) => (
          <div
            key={q.id}
            onClick={() => onSelectQuestion(q)}
            className="p-3 bg-white border border-amber-200/80 hover:border-amber-400 rounded-lg flex items-center justify-between cursor-pointer transition-all group shadow-sm"
          >
            <div className="space-y-1 flex-1 pr-2">
              <div className="flex items-center gap-2">
                <ConfidenceBadge confidence={q.confidence} interactive={false} />
                <span className="text-[10px] text-stone-500 font-mono">
                  {q.last_reviewed ? '7+ days elapsed' : 'Unreviewed'}
                </span>
              </div>
              <p className="text-xs font-medium text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                {q.question}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
