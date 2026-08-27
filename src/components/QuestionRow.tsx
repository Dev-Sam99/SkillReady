'use client';

import React, { useState } from 'react';
import { Question, ConfidenceLevel } from '@/types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';

interface QuestionRowProps {
  question: Question;
  topicName?: string;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onConfidenceCycle: (id: string, currentConfidence: ConfidenceLevel) => void;
}

export const QuestionRow: React.FC<QuestionRowProps> = ({
  question,
  topicName,
  onEdit,
  onDelete,
  onConfidenceCycle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className="border-b border-stone-200/70 last:border-b-0 transition-colors">
      {/* Clean Table Row */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="grid grid-cols-12 gap-4 px-5 py-4 items-center cursor-pointer hover:bg-stone-100/50 transition-colors select-none"
      >
        {/* Column 1: Question Title (6 cols) */}
        <div className="col-span-12 md:col-span-6 flex items-center gap-3">
          <button
            type="button"
            className="text-stone-400 hover:text-stone-700 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <span className="text-sm font-medium text-stone-900 line-clamp-1">
            {question.question}
          </span>
        </div>

        {/* Column 2: Topic (2 cols) */}
        <div className="col-span-6 md:col-span-2">
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-600 border border-stone-200/60 truncate max-w-full">
            {topicName || 'General'}
          </span>
        </div>

        {/* Column 3: Confidence Badge (2 cols) */}
        <div className="col-span-3 md:col-span-2">
          <ConfidenceBadge
            confidence={question.confidence}
            onClick={() => onConfidenceCycle(question.id, getNextConfidence(question.confidence))}
          />
        </div>

        {/* Column 4: Last Reviewed & Actions (2 cols) */}
        <div className="col-span-3 md:col-span-2 flex items-center justify-between text-xs text-stone-500 font-mono">
          <span className="hidden md:inline">{formatDate(question.last_reviewed)}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onEdit(question)}
              className="p-1 text-stone-400 hover:text-stone-900 rounded hover:bg-stone-200/60"
              title="Edit Question"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 text-stone-400 hover:text-red-600 rounded hover:bg-stone-200/60"
              title="Delete Question"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Inline Answer Panel */}
      {isExpanded && (
        <div className="px-12 pb-5 pt-1 bg-stone-50/70 border-t border-stone-200/50 space-y-3 animate-fadeIn">
          <div className="text-xs font-mono font-semibold text-stone-400 uppercase tracking-wider">
            Detailed Solution & Answer
          </div>
          <div className="p-4 bg-white rounded-lg border border-stone-200/80 text-xs md:text-sm text-stone-800 leading-relaxed whitespace-pre-line shadow-sm">
            {question.answer}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="p-3 mx-5 my-2 bg-red-50 border border-red-200 rounded flex items-center justify-between text-xs text-red-800 font-mono animate-fadeIn">
          <span>Delete this question permanently?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-1 rounded bg-stone-200 text-stone-700 hover:bg-stone-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(question.id);
                setShowDeleteConfirm(false);
              }}
              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
