'use client';

import React, { useState } from 'react';
import { Question, ConfidenceLevel } from '@/types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ChevronDown, ChevronUp, Edit3, Trash2, Clock, Terminal } from 'lucide-react';

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
    <div className="bg-[#0e0f12] border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-5 space-y-4 shadow-xl transition-all duration-150 relative overflow-hidden group">
      {/* Header bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {topicName && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800/80">
                {topicName}
              </span>
            )}
            <ConfidenceBadge
              confidence={question.confidence}
              onClick={() => onConfidenceCycle(question.id, getNextConfidence(question.confidence))}
            />
          </div>

          <h3 className="text-base font-semibold text-zinc-100 leading-snug group-hover:text-emerald-400 transition-colors">
            {question.question}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-zinc-500 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="p-1.5 hover:text-emerald-400 hover:bg-zinc-900 rounded-md transition-colors"
            title="Edit Question"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 hover:text-red-400 hover:bg-zinc-900 rounded-md transition-colors"
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
          className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-medium flex items-center justify-between transition-all border ${
            showAnswer
              ? 'bg-zinc-900/90 text-emerald-400 border-emerald-500/30'
              : 'bg-zinc-950/60 text-zinc-400 border-zinc-800/60 hover:text-zinc-200 hover:border-zinc-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            {showAnswer ? 'hide_solution.sh' : 'reveal_solution.sh'}
          </span>
          {showAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Collapsible Answer Body */}
        {showAnswer && (
          <div className="mt-3 p-4 bg-[#050607] rounded-lg border border-zinc-800 text-xs md:text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line animate-fadeIn relative">
            <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-600 uppercase">Solution Note</div>
            {question.answer}
          </div>
        )}
      </div>

      {/* Footer metadata */}
      <div className="pt-2 border-t border-zinc-800/40 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-zinc-600" /> Last Reviewed: {formatDate(question.last_reviewed)}
        </span>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-center justify-between text-xs text-red-300 animate-fadeIn">
          <span className="font-mono">Delete this item permanently?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-mono"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(question.id);
                setShowDeleteConfirm(false);
              }}
              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-mono font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
