'use client';

import React, { useState, useEffect } from 'react';
import { Question, ReviewLog } from '@/types';
import {
  Flag,
  Star,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Plus,
  Building2,
  Copy,
  Check,
  History,
  Calendar,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ConfirmDialog } from './ConfirmDialog';
import { getHistory, updateQuestionNotes } from '@/app/actions';

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
  onFilterByTag?: (tag: string) => void;
  onUpdateQuestion?: (updated: Question) => void;
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
  onFilterByTag,
  onUpdateQuestion,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<ReviewLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    if (!question) {
      setHistoryLogs([]);
      return;
    }
    setNotesText(question.notes || '');
    setIsEditingNotes(false);

    let isMounted = true;
    setLoadingHistory(true);
    getHistory(question.id)
      .then((res) => {
        if (isMounted && res.data) {
          setHistoryLogs(res.data as ReviewLog[]);
        }
      })
      .catch((err) => console.error('Failed to load question history', err))
      .finally(() => {
        if (isMounted) setLoadingHistory(false);
      });

    return () => {
      isMounted = false;
    };
  }, [question]);

  const handleCopy = () => {
    if (!question) return;
    const textToCopy = `Q: ${question.question}\n\nAnswer:\n${question.answer}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNotes = async () => {
    if (!question) return;
    const cleanNotes = notesText.trim();
    const res = await updateQuestionNotes(question.id, cleanNotes);
    if (res.data && onUpdateQuestion) {
      onUpdateQuestion(res.data);
    } else if (onUpdateQuestion) {
      onUpdateQuestion({ ...question, notes: cleanNotes });
    }
    setIsEditingNotes(false);
  };

  if (!question) {
    return (
      <div className="h-full bg-white border border-line rounded-[22px] p-8 shadow-subtle flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E1EBD9] text-[#2F5D3A] flex items-center justify-center">
          <Inbox className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-bold text-xl text-[#1F2D1F]">No question selected</h2>
          <p className="text-sm text-[#566656]">Select a question from the list or add a new one.</p>
        </div>
        {onAddQuestion && (
          <button
            type="button"
            onClick={onAddQuestion}
            className="px-5 py-2.5 bg-[#2F5D3A] text-white font-medium text-sm rounded-[16px] hover:opacity-90 transition-opacity inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>Add question</span>
          </button>
        )}
      </div>
    );
  }

  // Confidence styling mapping
  const confidenceStyles = {
    weak: {
      bg: 'bg-[#FBE5E0]',
      text: 'text-[#C2412D]',
      border: 'border-[#FBE5E0]',
      icon: BatteryLow,
      label: 'Weak',
      tooltip: 'Weak Concept — Needs review',
    },
    medium: {
      bg: 'bg-[#FBEFD2]',
      text: 'text-[#B7791F]',
      border: 'border-[#FBEFD2]',
      icon: BatteryMedium,
      label: 'Medium',
      tooltip: 'Medium Concept',
    },
    solid: {
      bg: 'bg-[#DDF1E5]',
      text: 'text-[#2E8B57]',
      border: 'border-[#DDF1E5]',
      icon: BatteryFull,
      label: 'Solid',
      tooltip: 'Solid Concept — Mastered!',
    },
  };

  const currentConf = confidenceStyles[question.confidence] || confidenceStyles.weak;
  const ConfIcon = currentConf.icon;

  const formatNextReview = (nextReviewAt?: string | null) => {
    if (!nextReviewAt) return 'Due now (never reviewed)';
    const date = new Date(nextReviewAt);
    if (isNaN(date.getTime())) return 'Due now';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border border-line rounded-[22px] p-5 sm:p-6 shadow-subtle min-h-0 overflow-hidden">
      {/* 1. Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-line shrink-0">
        {/* Left: Topic tag, Confidence button, Company chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#E1EBD9] text-[#1F2D1F] border border-line">
            {topicName}
          </span>

          {/* Interactive confidence button */}
          <button
            type="button"
            onClick={() => onCycleConfidence(question)}
            title={`${currentConf.tooltip}\nClick to cycle level (Weak → Medium → Solid)`}
            className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all active:scale-95 inline-flex items-center gap-1.5 ${currentConf.bg} ${currentConf.text} ${currentConf.border} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]`}
          >
            <ConfIcon className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
            <span>{currentConf.label}</span>
          </button>

          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {question.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onFilterByTag && onFilterByTag(tag)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#2F5D3A] bg-[#EEF3E8] border border-line px-2 py-0.5 rounded-full hover:bg-[#E1EBD9] transition-colors"
                >
                  <Building2 className="w-3 h-3" aria-hidden="true" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Icon Buttons (Flag, Important, Edit, Divider, Delete) */}
        <div className="flex items-center gap-1">
          {/* Flag Toggle */}
          <button
            type="button"
            aria-pressed={question.is_flagged ?? false}
            aria-label={question.is_flagged ? 'Unflag question' : 'Flag question'}
            onClick={() => onToggleFlag(question)}
            className={`w-8 h-8 inline-flex items-center justify-center rounded-full border transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] ${
              question.is_flagged
                ? 'bg-[#1F2D1F] text-white border-[#1F2D1F]'
                : 'bg-white border-line text-[#566656] hover:text-[#1F2D1F] hover:bg-[#EEF3E8]'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${question.is_flagged ? 'fill-white' : ''}`} aria-hidden="true" />
          </button>

          {/* Important Toggle */}
          <button
            type="button"
            aria-pressed={question.is_important ?? false}
            aria-label={question.is_important ? 'Remove important mark' : 'Mark as important'}
            onClick={() => onToggleImportant(question)}
            className={`w-8 h-8 inline-flex items-center justify-center rounded-full border transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] ${
              question.is_important
                ? 'bg-[#2F5D3A] text-white border-[#2F5D3A]'
                : 'bg-white border-line text-[#566656] hover:text-[#1F2D1F] hover:bg-[#EEF3E8]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${question.is_important ? 'fill-white' : ''}`} aria-hidden="true" />
          </button>

          {/* Copy Button */}
          <button
            type="button"
            aria-label="Copy question and answer"
            onClick={handleCopy}
            title={copied ? 'Copied to clipboard!' : 'Copy Q&A'}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-line bg-white text-[#566656] hover:text-[#1F2D1F] hover:bg-[#EEF3E8] transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#2E8B57] font-bold" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>

          {/* Edit Button */}
          <button
            type="button"
            aria-label="Edit question"
            onClick={() => onEdit(question)}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-line bg-white text-[#566656] hover:text-[#1F2D1F] hover:bg-[#EEF3E8] transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          {/* Vertical Divider */}
          <div className="h-4 w-[1px] bg-line mx-0.5" aria-hidden="true" />

          {/* Delete Button */}
          <button
            type="button"
            aria-label="Delete question"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-line bg-white text-[#566656] hover:text-[#C2412D] hover:bg-[#FBE5E0] transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2412D]"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 2. Main Question & Answer Content area (scrollable) */}
      <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 min-h-0">
        {/* Question Title (shown ONCE as the title with question number) */}
        <h1 className="font-display font-bold text-xl sm:text-2xl text-[#1F2D1F] leading-tight flex items-start gap-2">
          <span className="text-[#2F5D3A] shrink-0 font-extrabold">Q{currentIndex + 1}.</span>
          <span>{question.question}</span>
        </h1>

        {/* Answer via MarkdownRenderer, max-width ~72ch, line-height 1.65 */}
        <div className="max-w-[72ch] text-[#1F2D1F] text-base leading-[1.65]">
          <MarkdownRenderer content={question.answer} />
        </div>

        {/* Personal Notes section */}
        <div className="max-w-[72ch] bg-[#EEF3E8] border border-line rounded-[16px] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#2F5D3A] uppercase tracking-wider">Personal Notes</h3>
            {!isEditingNotes ? (
              <button
                type="button"
                onClick={() => setIsEditingNotes(true)}
                className="text-xs font-medium text-[#2F5D3A] hover:underline flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" aria-hidden="true" />
                <span>{question.notes ? 'Edit' : 'Add Note'}</span>
              </button>
            ) : null}
          </div>

          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Write personal notes, key takeaways, or interview tips..."
                rows={3}
                className="w-full text-sm p-3 border border-line rounded-[12px] bg-white text-[#1F2D1F] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(false)}
                  className="px-3 py-1.5 text-xs text-[#566656] hover:bg-white/50 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 text-xs bg-[#2F5D3A] text-white font-medium rounded-full hover:opacity-90"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#1F2D1F] leading-relaxed whitespace-pre-wrap">
              {question.notes ? question.notes : 'No personal notes added yet.'}
            </p>
          )}
        </div>

        {/* History & Spaced Repetition section */}
        <div className="max-w-[72ch] border border-line rounded-[16px] p-4 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#2F5D3A]" aria-hidden="true" />
              <h3 className="text-xs font-bold text-[#1F2D1F] uppercase tracking-wider">Review History</h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#566656]">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Next review: <strong className="text-[#1F2D1F]">{formatNextReview(question.next_review_at)}</strong></span>
            </div>
          </div>

          {loadingHistory ? (
            <p className="text-xs text-[#566656]">Loading review history...</p>
          ) : historyLogs.length === 0 ? (
            <p className="text-xs text-[#566656]">No review history recorded yet. Rate this question during practice to build history.</p>
          ) : (
            <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-line">
              {historyLogs.map((log, index) => {
                const prevLog = historyLogs[index + 1];
                const conf = confidenceStyles[log.rating] || confidenceStyles.weak;
                const dateFormatted = new Date(log.reviewed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                let gapText = '';
                if (prevLog) {
                  const diffMs = new Date(log.reviewed_at).getTime() - new Date(prevLog.reviewed_at).getTime();
                  const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
                  gapText = `${diffDays} day${diffDays > 1 ? 's' : ''} later`;
                }

                let ratingChangeText = '';
                if (prevLog && prevLog.rating !== log.rating) {
                  if (log.rating === 'solid' && prevLog.rating === 'weak') {
                    ratingChangeText = 'moved up from Weak';
                  } else if (log.rating === 'solid' && prevLog.rating === 'medium') {
                    ratingChangeText = 'moved up from Medium';
                  } else if (log.rating === 'medium' && prevLog.rating === 'weak') {
                    ratingChangeText = 'moved up from Weak';
                  } else if (log.rating === 'weak') {
                    ratingChangeText = `dropped to Weak from ${prevLog.rating}`;
                  }
                }

                return (
                  <div key={log.id || index} className="relative flex items-start justify-between text-xs gap-2">
                    <span className="absolute -left-[19px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#2F5D3A] ring-4 ring-white" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${conf.bg} ${conf.text}`}>
                          {conf.label}
                        </span>
                        {ratingChangeText && (
                          <span className="text-[11px] font-medium text-[#2E8B57]">{ratingChangeText}</span>
                        )}
                      </div>
                      <span className="text-[#566656] text-[11px]">{dateFormatted}</span>
                    </div>

                    {gapText && (
                      <span className="text-[11px] text-[#566656] bg-[#EEF3E8] px-2 py-0.5 rounded-full">
                        {gapText}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Pinned Bottom Bar: Prev / Counter / Next */}
      <div className="border-t border-line pt-3 flex items-center justify-between mt-auto shrink-0 bg-white px-3 sm:px-4 py-2.5 rounded-[16px]">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex <= 0}
          aria-label="Previous question"
          className="min-w-[44px] min-h-[44px] px-4 py-2 rounded-full border border-line bg-white text-[#1F2D1F] hover:bg-[#EEF3E8] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1 font-medium text-xs transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <span className="text-xs sm:text-sm font-medium text-[#566656]">
          {totalCount > 0 ? `${currentIndex + 1} of ${totalCount}` : '0 of 0'}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={currentIndex >= totalCount - 1}
          aria-label="Next question"
          className="min-w-[44px] min-h-[44px] px-4 py-2 rounded-full border border-line bg-white text-[#1F2D1F] hover:bg-[#EEF3E8] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1 font-medium text-xs transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
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
