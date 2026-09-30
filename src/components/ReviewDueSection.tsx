'use client';

import React from 'react';
import { Question } from '@/types';
import { Repeat, Play, ChevronRight } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';

interface ReviewDueSectionProps {
  questions: Question[];
  onSelectQuestion: (q: Question) => void;
  onStartReviewSession?: () => void;
}

export const ReviewDueSection: React.FC<ReviewDueSectionProps> = ({
  questions,
  onSelectQuestion,
  onStartReviewSession,
}) => {
  const now = new Date();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const reviewDueQuestions = questions.filter((q) => {
    if (!q.last_reviewed) return true;
    const diff = now.getTime() - new Date(q.last_reviewed).getTime();
    return diff >= SEVEN_DAYS_MS;
  });

  const count = reviewDueQuestions.length;
  const pluralQuestionText = count === 1 ? '1 question due' : `${count} questions due`;

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/95 shadow-glass space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-tint flex items-center justify-center text-deep">
            <Repeat className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-ink">
              Review Queue
            </h3>
            <p className="text-xs font-semibold text-slate font-sans">{pluralQuestionText} for practice</p>
          </div>
        </div>
        {onStartReviewSession && (
          <button
            type="button"
            onClick={onStartReviewSession}
            className="min-w-[44px] min-h-[44px] px-4 py-2 bg-deep hover:bg-[#155AA3] text-white rounded-full font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Practice</span>
          </button>
        )}
      </div>

      {count === 0 ? (
        <div className="p-8 text-center space-y-2">
          <p className="text-base font-semibold text-ink">All caught up!</p>
          <p className="text-sm text-slate font-medium">No questions are currently due for practice.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Requirement 8: Review Queue shows up to 3 due items */}
          {reviewDueQuestions.slice(0, 3).map((q) => (
            <div
              key={q.id}
              onClick={() => onSelectQuestion(q)}
              className="p-3.5 bg-white/85 hover:bg-white border border-line/80 hover:border-deep/40 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all group shadow-2xs"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <ConfidenceBadge confidence={q.confidence} interactive={false} />
                  <span className="text-xs font-semibold text-slate font-sans">
                    {q.last_reviewed ? '7+ days ago' : 'Never reviewed'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-ink line-clamp-2 group-hover:text-deep transition-colors leading-snug">
                  {q.question}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectQuestion(q);
                  }}
                  className="min-w-[36px] min-h-[36px] p-2 rounded-full bg-tint hover:bg-deep text-deep hover:text-white transition-all flex items-center justify-center"
                  aria-label="Practice question"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <ChevronRight className="w-4 h-4 text-slate group-hover:text-deep transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

