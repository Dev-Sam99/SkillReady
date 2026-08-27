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
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-[#121316]/90 border border-stone-200/80 dark:border-zinc-800/60 hover:border-stone-300 dark:hover:border-zinc-700/80 rounded-lg p-4 space-y-3 transition-all duration-200 hover:-translate-y-0.5 group shadow-sm hover:shadow-md">
      {/* Header section */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {topicName && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-600 border border-stone-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800">
                {topicName}
              </span>
            )}
            <ConfidenceBadge
              confidence={question.confidence}
              onClick={() => onConfidenceCycle(question.id, getNextConfidence(question.confidence))}
            />
          </div>

          <h3 className="text-sm font-medium text-stone-900 dark:text-zinc-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {question.question}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-stone-400 dark:text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="p-1 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded transition-colors"
            title="Edit Question"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded transition-colors"
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
          className={`w-full py-1.5 px-3 rounded text-xs font-mono flex items-center justify-between transition-all border ${
            showAnswer
              ? 'bg-stone-50 text-emerald-800 border-emerald-200 dark:bg-zinc-950 dark:text-emerald-400 dark:border-emerald-500/30'
              : 'bg-stone-50/60 text-stone-500 border-stone-200/60 hover:text-stone-800 hover:border-stone-300 dark:bg-zinc-950/40 dark:text-zinc-400 dark:border-zinc-800/40 dark:hover:text-zinc-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
            {showAnswer ? 'hide solution' : 'reveal solution'}
          </span>
          {showAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Collapsible Answer Body */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showAnswer ? 'max-h-[1000px] opacity-100 mt-2.5' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-3.5 bg-[#fcfbf9] dark:bg-[#08090a] rounded border border-stone-200 dark:border-zinc-800 text-xs text-stone-800 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
            {question.answer}
          </div>
        </div>
      </div>

      {/* Footer metadata */}
      <div className="pt-2 border-t border-stone-100 dark:border-zinc-800/40 flex items-center justify-between text-[11px] font-mono text-stone-400 dark:text-zinc-500">
        <span>last_reviewed: {formatDate(question.last_reviewed)}</span>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="p-2.5 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-500/30 rounded flex items-center justify-between text-xs text-red-700 dark:text-red-300 animate-fadeIn font-mono">
          <span>Confirm deletion?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 hover:bg-stone-300 dark:bg-zinc-800 dark:text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(question.id);
                setShowDeleteConfirm(false);
              }}
              className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
