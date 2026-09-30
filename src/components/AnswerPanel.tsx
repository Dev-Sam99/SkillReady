'use client';

import React, { useState } from 'react';
import { Question } from '@/types';
import { Flag, Star, Pencil, Trash2, ChevronLeft, ChevronRight, Inbox, Plus } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ConfirmDialog } from './ConfirmDialog';

interface AnswerPanelProps {
  question: Question | null;
  topicName?: string;
  currentIndex: number;
  totalCount: number;
  onCycleConfidence: (q: Question) => void;
  onToggleFlag: (q: Question) => void;
  onToggleImportant: (q: Question) => void;
  onEdit: (q: Question) => void;
  onDelete: (q: Question) => void;
  onPrev: () => void;
  onNext: () => void;
  onAddQuestion?: () => void;
}

export const AnswerPanel: React.FC<AnswerPanelProps> = ({
  question,
  topicName = 'General',
  currentIndex,
  totalCount,
  onCycleConfidence,
  onToggleFlag,
  onToggleImportant,
  onEdit,
  onDelete,
  onPrev,
  onNext,
  onAddQuestion,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!question) {
    return (
      <div className="h-full bg-white/74 backdrop-blur-[16px] backdrop-saturate-[1.4] border border-white/95 rounded-3xl p-8 shadow-glass flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-tint text-deep flex items-center justify-center shadow-xs">
          <Inbox className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-bold text-xl text-ink">No question selected</h2>
          <p className="text-sm text-slate">Select a question from the list or add a new one.</p>
        </div>
        {onAddQuestion && (
          <button
            type="button"
            onClick={onAddQuestion}
            className="px-5 py-2.5 bg-deep text-white font-semibold text-sm rounded-full hover:bg-[#155ab0] transition-colors inline-flex items-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>Add question</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/74 backdrop-blur-[16px] backdrop-saturate-[1.4] border border-white/95 rounded-3xl p-5 sm:p-6 shadow-glass min-h-0 overflow-hidden">
      {/* 1. Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line/60 shrink-0">
        {/* Left: Topic tag & Confidence badge */}
        <div className="flex items-center gap-2.5">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-tint text-[#0F4C81] border border-line shadow-2xs">
            {topicName}
          </span>
          <ConfidenceBadge
            confidence={question.confidence}
            onClick={() => onCycleConfidence(question)}
            interactive={true}
          />
        </div>

        {/* Right: Icon Buttons (Flag, Important, Edit, Delete) */}
        <div className="flex items-center gap-1.5">
          {/* Flag Toggle */}
          <button
            type="button"
            aria-pressed={question.is_flagged ?? false}
            aria-label={question.is_flagged ? 'Unflag question' : 'Flag question'}
            onClick={() => onToggleFlag(question)}
            className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full border transition-all active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep ${
              question.is_flagged
                ? 'bg-ink text-white border-ink'
                : 'bg-white/90 border-line text-slate hover:text-ink hover:bg-white'
            }`}
          >
            <Flag className={`w-4 h-4 ${question.is_flagged ? 'fill-white' : ''}`} aria-hidden="true" />
          </button>

          {/* Important Toggle */}
          <button
            type="button"
            aria-pressed={question.is_important ?? false}
            aria-label={question.is_important ? 'Remove important mark' : 'Mark as important'}
            onClick={() => onToggleImportant(question)}
            className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full border transition-all active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep ${
              question.is_important
                ? 'bg-deep text-white border-deep'
                : 'bg-white/90 border-line text-slate hover:text-ink hover:bg-white'
            }`}
          >
            <Star className={`w-4 h-4 ${question.is_important ? 'fill-white' : ''}`} aria-hidden="true" />
          </button>

          {/* Edit Button */}
          <button
            type="button"
            aria-label="Edit question"
            onClick={() => onEdit(question)}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full border border-line bg-white/90 text-slate hover:text-ink hover:bg-white transition-all active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
          >
            <Pencil className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            aria-label="Delete question"
            onClick={() => setShowDeleteConfirm(true)}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full border border-line bg-white/90 text-slate hover:text-[#B42318] hover:bg-[#FEE4E2]/60 transition-all active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B42318]"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 2. Main Question & Answer Content area (scrollable) */}
      <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 min-h-0">
        {/* Question Title (shown once only) */}
        <h1 className="font-display font-extrabold text-xl sm:text-2xl text-ink leading-tight">
          {question.question}
        </h1>

        {/* Answer Rendered with Markdown */}
        <div className="max-w-[72ch] text-ink text-base leading-[1.65]">
          <MarkdownRenderer content={question.answer} />
        </div>

        {/* Personal Notes (if present) */}
        {question.notes && (
          <div className="max-w-[72ch] bg-tint/60 border border-line/80 rounded-2xl p-4 space-y-1.5 shadow-2xs">
            <h3 className="text-xs font-bold text-deep uppercase tracking-wider">Personal Notes</h3>
            <p className="text-sm text-ink font-sans leading-relaxed whitespace-pre-wrap">
              {question.notes}
            </p>
          </div>
        )}
      </div>

      {/* 3. Pinned Bottom Bar: Prev / Counter / Next */}
      <div className="border-t border-line/60 pt-3 flex items-center justify-between mt-auto shrink-0 bg-white/50 backdrop-blur-xs px-3 sm:px-4 py-2.5 rounded-2xl">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex <= 0}
          aria-label="Previous question"
          className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-full border border-line bg-white text-ink hover:bg-tint disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1 font-semibold text-xs transition-all active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <span className="text-xs sm:text-sm font-semibold text-slate font-sans">
          {totalCount > 0 ? `${currentIndex + 1} of ${totalCount}` : '0 of 0'}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={currentIndex >= totalCount - 1}
          aria-label="Next question"
          className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-full border border-line bg-white text-ink hover:bg-tint disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1 font-semibold text-xs transition-all active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(question);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
