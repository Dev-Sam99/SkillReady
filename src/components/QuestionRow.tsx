'use client';

import React, { useState } from 'react';
import { Question, ConfidenceLevel } from '@/types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ConfirmDialog } from './ConfirmDialog';
import { ChevronDown, ChevronUp, Pencil, Trash2, Clock, CircleDashed, Star, Eye } from 'lucide-react';

interface QuestionRowProps {
  question: Question;
  topicName?: string;
  isAdmin?: boolean;
  flashcardMode?: boolean;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
  onConfidenceCycle: (id: string, currentConfidence: ConfidenceLevel) => void;
  onToggleFlag?: (id: string) => void;
  onSaveNotes?: (id: string, notes: string) => void;
}

export const QuestionRow: React.FC<QuestionRowProps> = ({
  question,
  topicName,
  isAdmin = false,
  flashcardMode = false,
  onEdit,
  onDelete,
  onConfidenceCycle,
  onToggleFlag,
  onSaveNotes,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localNotes, setLocalNotes] = useState(question.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const getNextConfidence = (curr: ConfidenceLevel): ConfidenceLevel => {
    if (curr === 'weak') return 'medium';
    if (curr === 'medium') return 'solid';
    return 'weak';
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Never reviewed';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Never reviewed';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  };

  const handleExpandToggle = () => {
    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);
    if (nextExpanded && !flashcardMode) {
      setIsAnswerRevealed(true);
    } else if (nextExpanded && flashcardMode) {
      setIsAnswerRevealed(false);
    }
  };

  const handleSaveNotesClick = () => {
    if (onSaveNotes) {
      setIsSavingNotes(true);
      onSaveNotes(question.id, localNotes);
      setTimeout(() => setIsSavingNotes(false), 600);
    }
  };

  return (
    <div className="group border-b border-line/70 last:border-b-0 transition-colors solid-table-row hover:bg-white">
      {/* Card Container */}
      <div
        onClick={handleExpandToggle}
        className="p-4 sm:px-5 sm:py-4 cursor-pointer select-none transition-colors flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center space-y-3 md:space-y-0"
      >
        {/* Mobile top metadata header (Status Chip + Last Reviewed) */}
        <div className="flex md:hidden items-center justify-between gap-2 border-b border-line/40 pb-2">
          <ConfidenceBadge
            confidence={question.confidence}
            onClick={() => onConfidenceCycle(question.id, getNextConfidence(question.confidence))}
          />
          <span className="text-sm font-medium text-slate flex items-center gap-1.5 font-sans">
            {question.last_reviewed ? (
              <>
                <Clock className="w-4 h-4 text-slate" aria-hidden="true" />
                <span>{formatDate(question.last_reviewed)}</span>
              </>
            ) : (
              <>
                <CircleDashed className="w-4 h-4 text-slate" aria-hidden="true" />
                <span>Never reviewed</span>
              </>
            )}
          </span>
        </div>

        {/* Column 1: Expand Button + Flag Icon + Question Title */}
        <div className="col-span-12 md:col-span-6 flex items-start gap-2 sm:gap-3">
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse question details' : 'Expand question details'}
            onClick={(e) => {
              e.stopPropagation();
              handleExpandToggle();
            }}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate hover:text-ink rounded-full hover:bg-tint transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" aria-hidden="true" /> : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
          </button>

          {/* Optional Flag / Bookmark Button */}
          {onToggleFlag && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFlag(question.id);
              }}
              aria-label={question.is_flagged ? 'Unflag question' : 'Flag question as important'}
              title={question.is_flagged ? 'Important question' : 'Mark as important'}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate hover:text-amber-500 rounded-full hover:bg-amber-50 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              <Star
                className={`w-5 h-5 ${question.is_flagged ? 'fill-amber-400 text-amber-500' : 'text-slate/60'}`}
                aria-hidden="true"
              />
            </button>
          )}

          <div className="space-y-1 flex-1 min-w-0 pt-2 md:pt-1">
            <div className="text-sm sm:text-base font-semibold text-ink leading-relaxed line-clamp-2 md:line-clamp-3">
              <MarkdownRenderer content={question.question} />
            </div>
          </div>
        </div>

        {/* Desktop Columns / Mobile Bottom Actions */}
        <div className="flex items-center justify-between md:contents pt-2 md:pt-0 border-t md:border-t-0 border-line/40">
          {/* Column 2: Topic & Category Chip */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-1 items-start">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-tint text-ink border border-line/80 truncate max-w-full">
              {topicName || 'General'}
            </span>
            {question.category_tag && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {question.category_tag}
              </span>
            )}
          </div>

          {/* Column 3: Confidence Badge (Desktop) */}
          <div className="hidden md:block col-span-3 md:col-span-2">
            <ConfidenceBadge
              confidence={question.confidence}
              onClick={() => onConfidenceCycle(question.id, getNextConfidence(question.confidence))}
            />
          </div>

          {/* Column 4: Last Reviewed & Action Buttons */}
          <div className="col-span-6 md:col-span-2 flex items-center justify-end text-sm font-medium text-slate font-sans gap-2">
            <span className="hidden md:inline text-sm font-medium text-slate" suppressHydrationWarning>
              {formatDate(question.last_reviewed)}
            </span>

            {/* Action Buttons (44px target with 8px gap) */}
            <div
              className={`flex items-center gap-2 ml-auto transition-opacity ${
                isAdmin ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(question)}
                    aria-label="Edit question"
                    className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate hover:text-deep bg-white hover:bg-tint border border-line rounded-full transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
                    title="Edit Question"
                  >
                    <Pencil className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    aria-label="Delete question"
                    className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate hover:text-[#B42318] bg-[#FEE4E2]/50 hover:bg-[#FEE4E2] border border-line hover:border-[#FECDCA] rounded-full transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-[#B42318] focus-visible:outline-none"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Q&A Detail Container */}
      {isExpanded && (
        <div className="px-4 sm:px-6 py-4 bg-tint/40 border-t border-line/60 space-y-4 animate-fadeIn">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate uppercase tracking-wider block">
              Question Detail
            </span>
            <div className="text-sm sm:text-base text-ink leading-relaxed bg-white p-4 rounded-xl border border-line shadow-2xs">
              <MarkdownRenderer content={question.question} />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Solution / Answer
            </span>
            
            {!isAnswerRevealed ? (
              <button
                type="button"
                onClick={() => setIsAnswerRevealed(true)}
                className="w-full min-h-[48px] px-4 py-3 bg-white hover:bg-tint text-deep font-semibold rounded-xl border border-deep/30 shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] group/reveal"
              >
                <Eye className="w-5 h-5 text-deep transition-transform group-hover/reveal:scale-110" />
                <span>Reveal Answer to Self-Assess</span>
              </button>
            ) : (
              <div className="text-sm sm:text-base text-ink leading-relaxed bg-white p-4.5 rounded-xl border border-[#BBF7D0] shadow-2xs space-y-4">
                <MarkdownRenderer content={question.answer} />

                {/* Direct 1-Click Self-Rating Buttons */}
                <div className="pt-3 border-t border-line/60 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate uppercase tracking-wider">
                    Rate Your Recall:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onConfidenceCycle(question.id, 'weak')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        question.confidence === 'weak'
                          ? 'bg-[#FEE4E2] text-[#912018] border-[#FECDCA] ring-2 ring-[#FECDCA]'
                          : 'bg-white text-slate hover:bg-[#FEE4E2]/50 border-line'
                      }`}
                    >
                      Weak 🔴
                    </button>
                    <button
                      type="button"
                      onClick={() => onConfidenceCycle(question.id, 'medium')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        question.confidence === 'medium'
                          ? 'bg-[#FEF0C7] text-[#B54708] border-[#FEDF89] ring-2 ring-[#FEDF89]'
                          : 'bg-white text-slate hover:bg-[#FEF0C7]/50 border-line'
                      }`}
                    >
                      Medium 🟡
                    </button>
                    <button
                      type="button"
                      onClick={() => onConfidenceCycle(question.id, 'solid')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        question.confidence === 'solid'
                          ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] ring-2 ring-[#BBF7D0]'
                          : 'bg-white text-slate hover:bg-[#DCFCE7]/50 border-line'
                      }`}
                    >
                      Solid 🟢
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Personal Notes / Interview Hints Box */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate uppercase tracking-wider block">
              Personal Interview Notes & Hints
            </span>
            <div className="p-3 bg-white rounded-xl border border-line shadow-2xs space-y-2">
              <textarea
                rows={2}
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Add personal interview notes (e.g., Asked at Google round 2, watch out for memory leaks)..."
                className="w-full text-xs text-ink placeholder-slate bg-transparent focus:outline-none resize-none font-medium leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotesClick}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-deep text-white hover:bg-[#155AA3] transition-all shadow-2xs active:scale-95"
                >
                  {isSavingNotes ? 'Saved!' : 'Save note'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-sm font-medium text-slate pt-2 border-t border-line/60 gap-2">
            <span>Last reviewed: {formatDate(question.last_reviewed)}</span>
            <div className="flex items-center gap-2">
              <span className="text-slate text-sm font-medium">Rating:</span>
              <ConfidenceBadge
                confidence={question.confidence}
                onClick={() => onConfidenceCycle(question.id, getNextConfidence(question.confidence))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Question"
        description="Are you sure you want to delete this question from your question bank? This action cannot be undone."
        confirmText="Delete Question"
        cancelText="Cancel"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(question.id);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

