'use client';

import React, { useState } from 'react';
import { Question, ConfidenceLevel } from '@/types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ChevronDown, ChevronUp, Edit3, Trash2, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  topicName?: string;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onConfidenceCycle: (id: string, currentConfidence: ConfidenceLevel) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  topicName,
  onEdit,
  onDelete,
  onConfidenceCycle,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getNextConfidence = (curr: ConfidenceLevel): ConfidenceLevel => {
    if (curr === 'weak') return 'medium';
    if (curr === 'medium') return 'solid';
    return 'weak';
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Never';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white border border-line hover:border-deep/40 rounded-2xl p-4 space-y-3 transition-all duration-200 hover:-translate-y-0.5 group shadow-2xs hover:shadow-xs">
      {/* Header section */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {topicName && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-tint text-deep border border-line">
                {topicName}
              </span>
            )}
            <ConfidenceBadge
              confidence={question.confidence}
              onClick={() => onConfidenceCycle(question.id, getNextConfidence(question.confidence))}
            />
          </div>

          <h3 className="text-sm font-semibold text-ink leading-snug group-hover:text-deep transition-colors">
            {question.question}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-slate opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="p-1.5 hover:text-deep hover:bg-tint rounded-full transition-colors"
            title="Edit Question"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 hover:text-[#B42318] hover:bg-[#FEE4E2] rounded-full transition-colors"
            title="Delete Question"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Answer Reveal Toggle Button */}
      <div>
        <button
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border ${
            showAnswer
              ? 'bg-tint text-deep border-deep/30'
              : 'bg-white text-slate border-line hover:text-ink hover:border-deep/30'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-deep" />
            {showAnswer ? 'Hide Solution' : 'Reveal Solution'}
          </span>
          {showAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Collapsible Answer Body */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showAnswer ? 'max-h-[1000px] opacity-100 mt-2.5' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-3.5 bg-tint/30 rounded-xl border border-line text-xs text-ink leading-relaxed whitespace-pre-line font-sans">
            {question.answer}
          </div>
        </div>
      </div>

      {/* Footer metadata */}
      <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[11px] font-sans text-slate">
        <span suppressHydrationWarning>Last reviewed: {formatDate(question.last_reviewed)}</span>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="p-2.5 bg-[#FEE4E2] border border-[#FECDCA] rounded-xl flex items-center justify-between text-xs text-[#B42318] animate-fadeIn font-sans">
          <span>Confirm deletion?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2.5 py-1 rounded-full bg-white text-slate hover:bg-mist"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(question.id);
                setShowDeleteConfirm(false);
              }}
              className="px-2.5 py-1 rounded-full bg-[#B42318] hover:bg-[#912018] text-white font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
