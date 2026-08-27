'use client';

import React, { useState } from 'react';
import { Question, ConfidenceLevel } from '@/types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ChevronDown, ChevronUp, Edit3, Trash2, Clock, Sparkles } from 'lucide-react';

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
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 space-y-4 shadow-md transition-all duration-200">
      {/* Header section */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {topicName && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800 text-indigo-300 border border-slate-700">
                {topicName}
              </span>
            )}
            <ConfidenceBadge
              confidence={question.confidence}
              onClick={() => onConfidenceCycle(question.id, getNextConfidence(question.confidence))}
            />
          </div>

          <h3 className="text-base md:text-lg font-bold text-slate-100 leading-snug">
            {question.question}
          </h3>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            type="button"
            onClick={() => onEdit(question)}
            className="p-1.5 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit Question"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Delete Question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Answer Reveal Toggle Button */}
      <div>
        <button
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors border ${
            showAnswer
              ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30'
              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {showAnswer ? 'Hide Answer' : 'Click to Reveal Answer'}
          </span>
          {showAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Collapsible Answer Body */}
        {showAnswer && (
          <div className="mt-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line animate-fadeIn">
            {question.answer}
          </div>
        )}
      </div>

      {/* Footer metadata */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" /> Last Reviewed: {formatDate(question.last_reviewed)}
        </span>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg flex items-center justify-between text-xs text-rose-200 animate-fadeIn">
          <span>Are you sure you want to delete this question?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(question.id);
                setShowDeleteConfirm(false);
              }}
              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
