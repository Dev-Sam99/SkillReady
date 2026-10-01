'use client';

import React, { useState } from 'react';
import { Question, Topic, ConfidenceLevel } from '@/types';
import { QuestionRow } from './QuestionRow';
import { EmptyState } from './EmptyState';
import {
  Folder,
  Search,
  Plus,
  RotateCcw,
  ChevronRight,
  ArrowUpDown,
  Star,
  Target,
  Eye,
  EyeOff,
} from 'lucide-react';

interface QuestionLayoutShowcaseProps {
  questions: Question[];
  topics: Topic[];
  isAdmin: boolean;
  selectedTopicId: string;
  searchQuery: string;
  onSelectTopic: (id: string) => void;
  onSearchChange: (q: string) => void;
  onEditQuestion: (q: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onConfidenceCycle: (id: string, current: ConfidenceLevel) => void;
  onAddQuestion: () => void;
  onToggleFlag?: (id: string) => void;
  onSaveNotes?: (id: string, notes: string) => void;
}

export const QuestionLayoutShowcase: React.FC<QuestionLayoutShowcaseProps> = ({
  questions,
  topics,
  isAdmin,
  selectedTopicId,
  searchQuery,
  onSelectTopic,
  onSearchChange,
  onEditQuestion,
  onDeleteQuestion,
  onConfidenceCycle,
  onAddQuestion,
  onToggleFlag,
  onSaveNotes,
}) => {
  const [sortOrder, setSortOrder] = useState<'weak-first' | 'flagged-first' | 'recently-reviewed' | 'alphabetical'>('weak-first');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'weak' | 'medium' | 'solid'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopicId, searchQuery, showFlaggedOnly, confidenceFilter]);

  const sortedTopics = React.useMemo(() => {
    if (selectedTopicId === 'all') return topics;
    const selected = topics.find((t) => t.id === selectedTopicId);
    if (!selected) return topics;
    return [selected, ...topics.filter((t) => t.id !== selectedTopicId)];
  }, [topics, selectedTopicId]);

  // Pluralization Helper
  const pluralize = (count: number, singular: string, plural?: string) => {
    return `${count} ${count === 1 ? singular : plural || `${singular}s`}`;
  };

  // Interactive Readiness Calculation
  const totalQuestions = questions.length;
  const solidQuestionsCount = questions.filter((q) => q.confidence === 'solid').length;
  const readinessScore = totalQuestions > 0 ? Math.round((solidQuestionsCount / totalQuestions) * 100) : 0;

  // Filter Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesTopic = selectedTopicId === 'all' || q.topic_id === selectedTopicId;
    const matchesSearch =
      !searchQuery.trim() ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.notes && q.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFlag = !showFlaggedOnly || q.is_flagged;
    const matchesConfidence = confidenceFilter === 'all' || q.confidence === confidenceFilter;

    return matchesTopic && matchesSearch && matchesFlag && matchesConfidence;
  });

  // Sort Questions (Weak first by default)
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortOrder === 'weak-first') {
      const confidenceOrder: Record<ConfidenceLevel, number> = { weak: 1, medium: 2, solid: 3 };
      return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    }
    if (sortOrder === 'flagged-first') {
      return (b.is_flagged ? 1 : 0) - (a.is_flagged ? 1 : 0);
    }
    if (sortOrder === 'recently-reviewed') {
      const dateA = a.last_reviewed ? new Date(a.last_reviewed).getTime() : 0;
      const dateB = b.last_reviewed ? new Date(b.last_reviewed).getTime() : 0;
      return dateB - dateA;
    }
    if (sortOrder === 'alphabetical') {
      return a.question.localeCompare(b.question);
    }
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedQuestions.length / itemsPerPage));
  const paginatedQuestions = sortedQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentTopicName = selectedTopicId === 'all'
    ? 'All questions'
    : `${topics.find((t) => t.id === selectedTopicId)?.name || 'Topic'} Questions`;

  return (
    <div id="questions-section" className="glass-panel border border-white/95 rounded-3xl shadow-glass overflow-hidden flex-1 flex flex-col h-full space-y-0">
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 border-b border-line/60 bg-white/50 space-y-3 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tint text-ink text-xs font-semibold border border-line/80">
                <Folder className="w-3.5 h-3.5 text-deep" />
                <span>Subject Workspace</span>
              </div>

              {/* Interactive Readiness Badge */}
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'weak-first' ? 'alphabetical' : 'weak-first')}
                title="Click to toggle sorting by weak/solid readiness"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] text-xs font-semibold border border-[#BBF7D0] transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <Target className="w-3.5 h-3.5 text-[#166534]" />
                <span>
                  Readiness: {totalQuestions > 0 ? `${readinessScore}%` : '0%'} ({solidQuestionsCount} of {totalQuestions} solid)
                </span>
              </button>
            </div>

            <h2 className="text-lg sm:text-xl font-display font-extrabold text-ink">
              {currentTopicName} ({pluralize(sortedQuestions.length, 'question')})
            </h2>
          </div>

          {/* Search Box & Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search questions & notes..."
                className="w-full pl-9 pr-9 py-2 bg-white border border-line rounded-full text-xs text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep min-h-[38px] shadow-2xs font-medium font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate hover:text-ink rounded-full"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Confidence Filter Dropdown */}
            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value as 'all' | 'weak' | 'medium' | 'solid')}
              aria-label="Filter by confidence level"
              className="min-h-[38px] px-3 py-1.5 bg-white border border-line rounded-full text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-deep cursor-pointer shadow-2xs font-sans"
            >
              <option value="all">Level: All</option>
              <option value="weak">🔴 Weak Only</option>
              <option value="medium">🟡 Medium Only</option>
              <option value="solid">🟢 Solid Only</option>
            </select>

            {/* Flagged Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
              className={`min-h-[38px] px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                showFlaggedOnly
                  ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-2xs'
                  : 'bg-white text-slate border-line hover:bg-tint hover:text-ink'
              }`}
              title="Toggle flagged questions only"
            >
              <Star className={`w-3.5 h-3.5 ${showFlaggedOnly ? 'fill-amber-500 text-amber-600' : 'text-slate'}`} />
              <span className="hidden sm:inline">Important</span>
            </button>

            {/* Self-Quiz / Flashcard Mode Toggle */}
            <button
              type="button"
              onClick={() => setFlashcardMode(!flashcardMode)}
              className={`min-h-[38px] px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                flashcardMode
                  ? 'bg-deep text-white border-deep shadow-2xs'
                  : 'bg-white text-slate border-line hover:bg-tint hover:text-ink'
              }`}
              title="Toggle Flashcard Self-Assessment Mode"
            >
              {flashcardMode ? <EyeOff className="w-3.5 h-3.5 text-white" /> : <Eye className="w-3.5 h-3.5 text-deep" />}
              <span className="hidden sm:inline">{flashcardMode ? 'Self-Quiz ON' : 'Self-Quiz'}</span>
            </button>

            {/* Sort Control Dropdown */}
            <div className="relative inline-flex items-center">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate pointer-events-none" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'weak-first' | 'flagged-first' | 'recently-reviewed' | 'alphabetical')}
                aria-label="Sort questions"
                className="min-h-[38px] pl-8 pr-7 py-1.5 bg-white border border-line rounded-full text-xs text-ink font-semibold focus:outline-none focus:ring-2 focus:ring-deep appearance-none cursor-pointer shadow-2xs font-sans"
              >
                <option value="weak-first">Sort: Weak first</option>
                <option value="flagged-first">Sort: Important first</option>
                <option value="recently-reviewed">Sort: Recently reviewed</option>
                <option value="alphabetical">Sort: Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Sidebar & Question Area - Single Screen Flex Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-line/60 flex-1 overflow-hidden items-stretch">
        {/* Left Subject Sidebar (Compact 2 columns / 16.7% width) */}
        <div className="md:col-span-2 p-2.5 sm:p-3 bg-white/60 flex flex-col justify-between space-y-3 overflow-hidden">
          <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xs font-semibold text-slate uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Folder className="w-3.5 h-3.5 text-deep" />
              <span className="truncate">Subject</span>
            </h3>

            <div className="space-y-1 flex-1 overflow-y-auto pr-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => onSelectTopic('all')}
                className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between ${
                  selectedTopicId === 'all'
                    ? 'bg-deep text-white border-deep shadow-xs font-semibold'
                    : 'bg-white/80 hover:bg-white text-ink border-line hover:border-deep/30 font-medium'
                }`}
              >
                <div className="min-w-0 flex-1 pr-1">
                  <p className="text-xs font-bold truncate">All</p>
                  <p className={`text-[10px] font-sans ${selectedTopicId === 'all' ? 'text-tint' : 'text-slate'}`}>
                    {questions.length} total
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              {sortedTopics.map((t) => {
                const tCount = questions.filter((q) => q.topic_id === t.id).length;
                const tSolid = questions.filter((q) => q.topic_id === t.id && q.confidence === 'solid').length;
                const isSelected = selectedTopicId === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTopic(t.id)}
                    className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-deep text-white border-deep shadow-xs font-semibold'
                        : 'bg-white/80 hover:bg-white text-ink border-line hover:border-deep/30 font-medium'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-1">
                      <p className="text-xs font-bold truncate" title={t.name}>{t.name}</p>
                      <p className={`text-[10px] font-sans ${isSelected ? 'text-tint' : 'text-slate'}`}>
                        {tSolid}/{tCount} solid
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Questions Panel (Expanded to 10 columns / 83.3% width) */}
        <div className="md:col-span-10 p-3.5 sm:p-4 bg-white/40 flex flex-col space-y-3 overflow-hidden h-full">
          <div className="flex items-center justify-between border-b border-line/60 pb-2 shrink-0">
            <h3 className="text-base font-display font-extrabold text-ink">
              {currentTopicName}
            </h3>
            {isAdmin && (
              <button
                type="button"
                onClick={onAddQuestion}
                className="px-3 py-1.5 bg-deep text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add question
              </button>
            )}
          </div>

          {flashcardMode && (
            <div className="p-2.5 bg-tint/80 border border-deep/20 rounded-xl text-xs font-medium text-ink flex items-center gap-2 shrink-0">
              <Eye className="w-3.5 h-3.5 text-deep shrink-0" />
              <span>
                <strong>Self-Quiz Active:</strong> Answers hidden by default. Expand and click <strong>Reveal Answer</strong> to test recall.
              </span>
            </div>
          )}

          {sortedQuestions.length > 0 ? (
            <div className="divide-y divide-line/60 rounded-2xl border border-line bg-white/85 shadow-2xs overflow-hidden flex-1 flex flex-col min-h-0">
              {/* Table Header Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2.5 bg-white/95 border-b border-line text-[11px] font-semibold text-slate uppercase tracking-wider font-sans shrink-0">
                <div className="col-span-6">Question</div>
                <div className="col-span-2">Topic</div>
                <div className="col-span-2">Confidence</div>
                <div className="col-span-2 text-right">Actions / Reviewed</div>
              </div>

              {/* Paginated Questions List Container */}
              <div className="divide-y divide-line/60 flex-1 overflow-y-auto no-scrollbar">
                {paginatedQuestions.map((q) => (
                  <QuestionRow
                    key={q.id}
                    question={q}
                    topicName={topics.find((t) => t.id === q.topic_id)?.name}
                    isAdmin={isAdmin}
                    flashcardMode={flashcardMode}
                    onEdit={onEditQuestion}
                    onDelete={onDeleteQuestion}
                    onConfidenceCycle={onConfidenceCycle}
                    onToggleFlag={onToggleFlag}
                    onSaveNotes={onSaveNotes}
                  />
                ))}
              </div>

              {/* Pagination Bar */}
              <div className="px-4 py-2 bg-white/95 border-t border-line flex items-center justify-between text-xs font-semibold text-slate font-sans shrink-0">
                <span>
                  Showing {sortedQuestions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
                  {Math.min(currentPage * itemsPerPage, sortedQuestions.length)} of {sortedQuestions.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-full border border-line bg-white hover:bg-tint text-ink disabled:opacity-35 disabled:pointer-events-none transition-all shadow-2xs"
                  >
                    Prev
                  </button>
                  <span className="px-2 font-bold text-ink">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-full border border-line bg-white hover:bg-tint text-ink disabled:opacity-35 disabled:pointer-events-none transition-all shadow-2xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              type={searchQuery || showFlaggedOnly ? 'empty-search' : 'empty-topic'}
              searchQuery={searchQuery}
              topicName={currentTopicName}
              isAdmin={isAdmin}
              onAddQuestion={onAddQuestion}
              onClearSearch={() => {
                onSearchChange('');
                setShowFlaggedOnly(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};


