'use client';

import React, { useState, useEffect } from 'react';
import { Topic, Question, ConfidenceLevel } from '@/types';
import { Search, Inbox, Plus, BookOpen, Filter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { ConfidenceIconBadge } from './ConfidenceIconBadge';

interface NavigationPanelProps {
  topics: Topic[];
  questions: Question[];
  selectedTopicId: string; // 'all' | topicId
  markerFilter: 'all' | 'flagged' | 'important';
  selectedQuestionId: string | null;
  searchQuery: string;
  confidenceFilter: 'all' | ConfidenceLevel;
  searchInputRef?: React.Ref<HTMLInputElement>;
  onSelectTopicId: (topicId: string) => void;
  onSelectMarkerFilter: (filter: 'all' | 'flagged' | 'important') => void;
  onSelectQuestion: (question: Question) => void;
  onSearchChange: (query: string) => void;
  onConfidenceFilterChange: (level: 'all' | ConfidenceLevel) => void;
  onAddQuestion: () => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  topics,
  questions,
  selectedTopicId,
  markerFilter,
  selectedQuestionId,
  searchQuery,
  confidenceFilter,
  searchInputRef,
  onSelectTopicId,
  onSelectMarkerFilter,
  onSelectQuestion,
  onSearchChange,
  onConfidenceFilterChange,
  onAddQuestion,
}) => {
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // Counts calculation
  const totalQuestionsCount = questions.length;
  const flaggedCount = questions.filter((q) => q.is_flagged).length;
  const importantCount = questions.filter((q) => q.is_important).length;

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    // 1. Topic/Subject filter
    if (selectedTopicId !== 'all' && q.topic_id !== selectedTopicId) {
      return false;
    }

    // 2. Marker dropdown filter
    if (markerFilter === 'flagged' && !q.is_flagged) return false;
    if (markerFilter === 'important' && !q.is_important) return false;

    // 3. Confidence level filter
    if (confidenceFilter !== 'all' && q.confidence !== confidenceFilter) {
      return false;
    }

    // 4. Search query filter
    if (searchQuery.trim()) {
      const qText = q.question.toLowerCase();
      const aText = q.answer.toLowerCase();
      const sTerm = searchQuery.toLowerCase();
      if (!qText.includes(sTerm) && !aText.includes(sTerm)) {
        return false;
      }
    }

    return true;
  });

  // Sort: keep stable order when confidenceFilter === 'all' to prevent question list jumping when confidence changes
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (confidenceFilter !== 'all') {
      const order: Record<ConfidenceLevel, number> = { weak: 0, medium: 1, solid: 2 };
      return order[a.confidence] - order[b.confidence];
    }
    // Stable default ordering by topic or original index
    return 0;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedQuestions.length / ITEMS_PER_PAGE));

  // Sync pagination page when selected question changes
  useEffect(() => {
    if (selectedQuestionId) {
      const qIndex = sortedQuestions.findIndex((q) => q.id === selectedQuestionId);
      if (qIndex >= 0) {
        const targetPage = Math.floor(qIndex / ITEMS_PER_PAGE) + 1;
        setCurrentPage(targetPage);
      }
    }
  }, [selectedQuestionId, sortedQuestions]);

  // Ensure currentPage is valid when filters change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = sortedQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full bg-white/74 backdrop-blur-[16px] backdrop-saturate-[1.4] border border-white/95 rounded-3xl p-4 shadow-glass min-h-0 overflow-hidden">
      {/* 1. Styled Header Control Dropdowns */}
      <div className="space-y-2.5 shrink-0 pb-2">
        {/* Row 1: Subject & Category Dropdowns */}
        <div className="grid grid-cols-2 gap-2">
          {/* Subject Dropdown */}
          <div className="relative">
            <label htmlFor="subject-select" className="sr-only">Select Subject</label>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-tint/40 border border-line rounded-2xl shadow-2xs focus-within:ring-2 focus-within:ring-deep transition-all">
              <BookOpen className="w-4 h-4 text-deep shrink-0" aria-hidden="true" />
              <select
                id="subject-select"
                value={selectedTopicId}
                onChange={(e) => {
                  onSelectTopicId(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Select subject"
                className="w-full text-xs font-semibold text-ink bg-transparent focus:outline-none cursor-pointer pr-4 appearance-none truncate"
              >
                <option value="all">All Subjects ({topics.length} subjects · {totalQuestionsCount} Qs)</option>
                {topics.map((t) => {
                  const topicQCount = questions.filter((q) => q.topic_id === t.id).length;
                  return (
                    <option key={t.id} value={t.id} className="py-1">
                      {t.name} ({topicQCount} questions)
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate absolute right-2.5 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* Marker Filter Dropdown (All, Flagged, Important) */}
          <div className="relative">
            <label htmlFor="marker-select" className="sr-only">Filter Questions</label>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-tint/40 border border-line rounded-2xl shadow-2xs focus-within:ring-2 focus-within:ring-deep transition-all">
              <Filter className="w-4 h-4 text-deep shrink-0" aria-hidden="true" />
              <select
                id="marker-select"
                value={markerFilter}
                onChange={(e) => {
                  onSelectMarkerFilter(e.target.value as 'all' | 'flagged' | 'important');
                  setCurrentPage(1);
                }}
                aria-label="Filter questions by status"
                className="w-full text-xs font-semibold text-ink bg-transparent focus:outline-none cursor-pointer pr-4 appearance-none truncate"
              >
                <option value="all">All Questions ({totalQuestionsCount})</option>
                <option value="flagged">🚩 Flagged ({flaggedCount})</option>
                <option value="important">⭐ Important ({importantCount})</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate absolute right-2.5 pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Row 2: Search & Level Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate pointer-events-none" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search questions... (/)"
              className="w-full pl-9 pr-3.5 py-2 text-xs font-medium text-ink bg-white border border-line rounded-2xl placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep focus:border-transparent transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate hover:text-ink font-bold px-1.5 py-0.5 rounded-full"
              >
                ✕
              </button>
            )}
          </div>

          {/* Styled Confidence Level Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={confidenceFilter}
              onChange={(e) => {
                onConfidenceFilterChange(e.target.value as 'all' | ConfidenceLevel);
                setCurrentPage(1);
              }}
              aria-label="Filter by confidence level"
              className="py-2 pl-3 pr-7 text-xs font-semibold text-ink bg-white hover:bg-tint/40 border border-line rounded-2xl focus:outline-none focus:ring-2 focus:ring-deep cursor-pointer appearance-none shadow-2xs transition-all"
            >
              <option value="all">All Levels</option>
              <option value="weak">Weak First</option>
              <option value="medium">Medium</option>
              <option value="solid">Solid</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* 2. Question List Container */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 border-t border-line/50 pt-2">
        {sortedQuestions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-tint text-deep flex items-center justify-center shadow-2xs">
              <Inbox className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-sm text-ink">No questions found</p>
              <p className="text-xs text-slate mt-0.5">Adjust dropdown filters or search term</p>
            </div>
            <button
              type="button"
              onClick={onAddQuestion}
              className="px-4 py-2 bg-deep text-white text-xs font-semibold rounded-full hover:bg-[#155ab0] transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add question</span>
            </button>
          </div>
        ) : (
          paginatedQuestions.map((q) => {
            const isSelected = q.id === selectedQuestionId;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(q)}
                aria-current={isSelected ? 'true' : undefined}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep ${
                  isSelected
                    ? 'border-2 border-deep bg-tint/90 shadow-xs'
                    : 'bg-white/90 hover:bg-white border border-line hover:border-deep/30'
                }`}
              >
                {/* Left: Question title & markers */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="line-clamp-2 text-sm font-semibold text-ink leading-snug">
                    {q.question}
                  </p>
                  
                  {/* Markers (Flag / Important) */}
                  {(q.is_flagged || q.is_important) && (
                    <div className="flex items-center gap-2 pt-0.5">
                      {q.is_flagged && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink">
                          🚩 Flagged
                        </span>
                      )}
                      {q.is_important && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-deep">
                          ⭐ Important
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Icon-only confidence badge with solid, weak, medium status colors */}
                <ConfidenceIconBadge confidence={q.confidence} />
              </button>
            );
          })
        )}
      </div>

      {/* 3. Suitable Question List Pagination Bar */}
      {sortedQuestions.length > 0 && (
        <div className="border-t border-line/60 pt-2.5 mt-2 flex items-center justify-between shrink-0 bg-white/40 px-2 py-1.5 rounded-2xl">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous question page"
            className="min-w-[36px] min-h-[36px] p-1.5 rounded-full border border-line bg-white text-ink hover:bg-tint disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center transition-all active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <span className="text-xs font-semibold text-slate font-sans">
            Page {currentPage} of {totalPages} ({sortedQuestions.length} Qs)
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next question page"
            className="min-w-[36px] min-h-[36px] p-1.5 rounded-full border border-line bg-white text-ink hover:bg-tint disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center transition-all active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
