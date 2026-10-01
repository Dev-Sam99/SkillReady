'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Topic, Question, ConfidenceLevel } from '@/types';
import { Search, Inbox, Plus, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { ConfidenceIconBadge } from './ConfidenceIconBadge';

interface NavigationPanelProps {
  topics: Topic[];
  questions: Question[];
  selectedTopicId: string; // 'all' | topicId
  selectedTag?: string;
  markerFilter: 'all' | 'flagged' | 'important';
  selectedQuestionId: string | null;
  searchQuery: string;
  confidenceFilter: 'all' | ConfidenceLevel;
  searchInputRef?: React.Ref<HTMLInputElement>;
  onSelectTopicId: (topicId: string) => void;
  onSelectTag?: (tag: string) => void;
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
  selectedTag = 'all',
  markerFilter,
  selectedQuestionId,
  searchQuery,
  confidenceFilter,
  searchInputRef,
  onSelectTopicId,
  onSelectTag,
  onSelectMarkerFilter,
  onSelectQuestion,
  onSearchChange,
  onConfidenceFilterChange,
  onAddQuestion,
}) => {
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Close filter popover on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(e.target as Node) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(e.target as Node)
      ) {
        setIsFilterPopoverOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFilterPopoverOpen(false);
      }
    };

    if (isFilterPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterPopoverOpen]);

  // Counts calculation
  const totalQuestionsCount = questions.length;

  // Extract all unique company tags
  const companyTags = React.useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => q.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [questions]);

  // Count active non-default filters
  const activeFilterCount =
    (selectedTag !== 'all' ? 1 : 0) +
    (markerFilter !== 'all' ? 1 : 0) +
    (confidenceFilter !== 'all' ? 1 : 0);

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (selectedTopicId === 'flagged' && !q.is_flagged) return false;
    if (selectedTopicId === 'important' && !q.is_important) return false;
    if (selectedTopicId !== 'all' && selectedTopicId !== 'flagged' && selectedTopicId !== 'important' && q.topic_id !== selectedTopicId) {
      return false;
    }
    if (selectedTag !== 'all' && (!q.tags || !q.tags.includes(selectedTag))) return false;
    if (markerFilter === 'flagged' && !q.is_flagged) return false;
    if (markerFilter === 'important' && !q.is_important) return false;
    if (confidenceFilter !== 'all' && q.confidence !== confidenceFilter) return false;

    if (searchQuery.trim()) {
      const qText = q.question.toLowerCase();
      const aText = q.answer.toLowerCase();
      const nText = (q.notes || '').toLowerCase();
      const tagText = (q.tags || []).join(' ').toLowerCase();
      const sTerm = searchQuery.toLowerCase();
      if (!qText.includes(sTerm) && !aText.includes(sTerm) && !nText.includes(sTerm) && !tagText.includes(sTerm)) {
        return false;
      }
    }
    return true;
  });

  // Questions retain their stable numerical ordering (#1, #2, #3...)
  const sortedQuestions = filteredQuestions;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopicId, selectedTag, markerFilter, confidenceFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(sortedQuestions.length / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  // Sync page when selectedQuestionId changes externally (e.g. keyboard shortcuts j/k or AnswerPanel buttons)
  const prevSelectedIdRef = useRef(selectedQuestionId);
  useEffect(() => {
    if (selectedQuestionId && selectedQuestionId !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedQuestionId;
      const qIndex = sortedQuestions.findIndex((q) => q.id === selectedQuestionId);
      if (qIndex >= 0) {
        const targetPage = Math.floor(qIndex / pageSize) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
    }
  }, [selectedQuestionId, sortedQuestions, pageSize, currentPage]);

  const handlePageChange = (newPage: number) => {
    const targetPage = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(targetPage);
    const newStartIndex = (targetPage - 1) * pageSize;
    const targetPageQuestions = sortedQuestions.slice(newStartIndex, newStartIndex + pageSize);
    if (targetPageQuestions.length > 0) {
      prevSelectedIdRef.current = targetPageQuestions[0].id;
      onSelectQuestion(targetPageQuestions[0]);
    }
  };

  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedQuestions.length);
  const paginatedQuestions = sortedQuestions.slice(startIndex, endIndex);

  const clearAllFilters = () => {
    onSelectTopicId('all');
    if (onSelectTag) onSelectTag('all');
    onSelectMarkerFilter('all');
    onConfidenceFilterChange('all');
    onSearchChange('');
    setIsFilterPopoverOpen(false);
  };

  return (
    <div className="matcha-card p-4 flex flex-col h-full bg-white border border-[#D9E4D0] rounded-[22px] shadow-subtle min-h-0 overflow-hidden">
      {/* 1. Subject Header Bar (All + Styled Subject Select Dropdown) */}
      <div className="shrink-0 pb-2.5 border-b border-[#D9E4D0]">
        <div className="flex items-center gap-2 justify-between">
          {/* Main Subject Selector Dropdown */}
          <div className="relative flex-1 min-w-0">
            <select
              value={selectedTopicId}
              onChange={(e) => onSelectTopicId(e.target.value)}
              aria-label="Select Subject"
              className={`w-full px-3.5 py-1.5 border rounded-full text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] appearance-none pr-8 ${
                selectedTopicId !== 'all'
                  ? 'bg-[#2F5D3A] text-white border-[#2F5D3A] shadow-subtle'
                  : 'bg-[#EEF3E8] text-[#1F2D1F] border-[#D9E4D0] hover:bg-[#E1EBD9]'
              }`}
            >
              <option value="all" className="bg-white text-[#1F2D1F] font-semibold py-1">
                All Subjects ({totalQuestionsCount})
              </option>
              {topics.map((t) => {
                const count = questions.filter((q) => q.topic_id === t.id).length;
                return (
                  <option key={t.id} value={t.id} className="bg-white text-[#1F2D1F] font-semibold py-1">
                    {t.name} ({count})
                  </option>
                );
              })}
            </select>
            <ChevronDown
              className={`w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                selectedTopicId !== 'all' ? 'text-white' : 'text-[#2F5D3A]'
              }`}
              aria-hidden="true"
            />
          </div>

          {/* Right Summary Badge */}
          <div className="text-[11px] font-bold text-[#566656] bg-[#EEF3E8] border border-[#D9E4D0] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
            {topics.length} Subjects · {sortedQuestions.length} Qs
          </div>
        </div>

        {/* 2. Search Field & Filters Button Row */}
        <div className="flex items-center gap-2">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#566656] pointer-events-none" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search questions... (/)"
              className="w-full pl-9 pr-7 py-2 bg-white border border-[#D9E4D0] rounded-[16px] text-xs font-medium text-[#1F2D1F] placeholder-[#566656] focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#566656] hover:text-[#1F2D1F] font-bold p-0.5"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Button with Active Badge */}
          <div className="relative">
            <button
              ref={filterBtnRef}
              type="button"
              onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
              aria-expanded={isFilterPopoverOpen}
              aria-label="Filter options"
              className="h-9 px-3 bg-white border border-[#D9E4D0] hover:bg-[#EEF3E8] rounded-[16px] text-xs font-semibold text-[#1F2D1F] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#2F5D3A]" aria-hidden="true" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#2F5D3A] text-white text-[10px] font-bold inline-flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Solid Filter Popover */}
            {isFilterPopoverOpen && (
              <div
                ref={filterPopoverRef}
                className="absolute right-0 mt-2 w-72 bg-white border border-[#D9E4D0] rounded-[22px] shadow-card p-4 z-50 animate-fadeIn space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#D9E4D0] pb-2">
                  <span className="font-bold text-[#1F2D1F]">Filter options</span>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[#C2412D] font-bold hover:underline text-[11px]"
                  >
                    Clear all
                  </button>
                </div>

                {/* Company Tag Filter Pills */}
                {companyTags.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-[#566656] uppercase tracking-wider block text-[10px]">Company</span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => onSelectTag && onSelectTag('all')}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          selectedTag === 'all' ? 'bg-[#2F5D3A] text-white' : 'bg-[#EEF3E8] text-[#1F2D1F]'
                        }`}
                      >
                        All
                      </button>
                      {companyTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => onSelectTag && onSelectTag(tag)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            selectedTag === tag ? 'bg-[#2F5D3A] text-white' : 'bg-[#EEF3E8] text-[#1F2D1F]'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Filter Pills */}
                <div className="space-y-1.5">
                  <span className="font-bold text-[#566656] uppercase tracking-wider block text-[10px]">Status</span>
                  <div className="flex gap-1.5">
                    {(['all', 'flagged', 'important'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => onSelectMarkerFilter(m)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          markerFilter === m ? 'bg-[#2F5D3A] text-white' : 'bg-[#EEF3E8] text-[#1F2D1F]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence Level Filter Pills */}
                <div className="space-y-1.5">
                  <span className="font-bold text-[#566656] uppercase tracking-wider block text-[10px]">Level</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['all', 'weak', 'medium', 'solid'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => onConfidenceFilterChange(lvl)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          confidenceFilter === lvl ? 'bg-[#2F5D3A] text-white' : 'bg-[#EEF3E8] text-[#1F2D1F]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Active Removable Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {selectedTag !== 'all' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#E1EBD9] text-[#2F5D3A] px-2.5 py-0.5 rounded-full">
                Company: {selectedTag}
                <button type="button" onClick={() => onSelectTag && onSelectTag('all')} className="hover:text-[#C2412D]">✕</button>
              </span>
            )}
            {markerFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#E1EBD9] text-[#2F5D3A] px-2.5 py-0.5 rounded-full capitalize">
                Status: {markerFilter}
                <button type="button" onClick={() => onSelectMarkerFilter('all')} className="hover:text-[#C2412D]">✕</button>
              </span>
            )}
            {confidenceFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#E1EBD9] text-[#2F5D3A] px-2.5 py-0.5 rounded-full capitalize">
                Level: {confidenceFilter}
                <button type="button" onClick={() => onConfidenceFilterChange('all')} className="hover:text-[#C2412D]">✕</button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] font-semibold text-[#C2412D] hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* 4. Scrolling Question List */}
      <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 min-h-0">
        {sortedQuestions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EEF3E8] text-[#2F5D3A] flex items-center justify-center">
              <Inbox className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#1F2D1F]">No questions found</p>
              <p className="text-xs text-[#566656] mt-0.5">Adjust filters or search query</p>
            </div>
            <button
              type="button"
              onClick={onAddQuestion}
              className="px-4 py-2 bg-[#2F5D3A] text-white text-xs font-bold rounded-[16px] hover:bg-[#254B2E] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add question</span>
            </button>
          </div>
        ) : (
          paginatedQuestions.map((q, pageIndex) => {
            const globalIndex = startIndex + pageIndex + 1;
            const isSelected = q.id === selectedQuestionId;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(q)}
                aria-current={isSelected ? 'true' : undefined}
                className={`w-full text-left p-3 rounded-[16px] transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#2F5D3A] bg-[#EEF3E8] shadow-subtle'
                    : 'bg-white hover:bg-[#EEF3E8]/60 border border-[#D9E4D0]'
                }`}
              >
                {/* Left: Question Number Badge + Question Title & Markers */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {/* Question Number Badge */}
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#E1EBD9] text-[#2F5D3A] border border-[#D9E4D0] shrink-0 font-mono">
                      #{globalIndex}
                    </span>
                    <p className="line-clamp-2 text-sm font-bold text-[#1F2D1F] leading-snug">
                      {q.question}
                    </p>
                  </div>

                  {/* Markers (Flag / Important) */}
                  {(q.is_flagged || q.is_important) && (
                    <div className="flex items-center gap-2 pt-0.5 pl-[34px]">
                      {q.is_flagged && (
                        <span className="text-xs">🚩</span>
                      )}
                      {q.is_important && (
                        <span className="text-xs">⭐</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: ICON-ONLY Confidence Badge */}
                <ConfidenceIconBadge confidence={q.confidence} />
              </button>
            );
          })
        )}
      </div>

      {/* 5. Pagination & Question Count Footer */}
      {sortedQuestions.length > 0 && (
        <div className="border-t border-[#D9E4D0] pt-2.5 mt-auto shrink-0 space-y-2">
          {/* Page Controls */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => handlePageChange(validPage - 1)}
              aria-label="Previous page"
              className="px-2.5 py-1.5 rounded-[12px] border border-[#D9E4D0] bg-white text-[#1F2D1F] hover:bg-[#EEF3E8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#2F5D3A]" aria-hidden="true" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <div className="flex items-center gap-1.5">
              {/* Page Select Jump Dropdown */}
              <select
                value={validPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="px-2 py-0.5 bg-white border border-[#D9E4D0] rounded-[8px] text-xs font-bold text-[#1F2D1F] focus:outline-none focus:ring-1 focus:ring-[#2F5D3A] cursor-pointer"
                aria-label="Select page"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Pg {p}/{totalPages}
                  </option>
                ))}
              </select>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-1.5 py-0.5 bg-white border border-[#D9E4D0] rounded-[8px] text-[11px] font-semibold text-[#1F2D1F] focus:outline-none focus:ring-1 focus:ring-[#2F5D3A] cursor-pointer"
                aria-label="Questions per page"
              >
                <option value={5}>5 / pg</option>
                <option value={10}>10 / pg</option>
                <option value={20}>20 / pg</option>
                <option value={50}>50 / pg</option>
              </select>
            </div>

            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => handlePageChange(validPage + 1)}
              aria-label="Next page"
              className="px-2.5 py-1.5 rounded-[12px] border border-[#D9E4D0] bg-white text-[#1F2D1F] hover:bg-[#EEF3E8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 text-[#2F5D3A]" aria-hidden="true" />
            </button>
          </div>

          {/* Range Summary */}
          <div className="text-center text-[11px] font-medium text-[#566656]">
            Showing <strong className="text-[#1F2D1F]">{startIndex + 1}–{endIndex}</strong> of <strong className="text-[#1F2D1F]">{sortedQuestions.length}</strong> questions
          </div>
        </div>
      )}
    </div>
  );
};
