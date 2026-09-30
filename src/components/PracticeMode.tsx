'use client';

import React, { useState } from 'react';
import { Question, Topic, ConfidenceLevel } from '@/types';
import { updateQuestion } from '@/app/actions';
import { MarkdownRenderer } from './MarkdownRenderer';
import { X, Play, Sparkles, Eye, Code, ListChecks, RotateCcw, MessagesSquare, TriangleAlert, Minus, CircleCheck } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface PracticeModeProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  topics: Topic[];
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  isOpen,
  onClose,
  questions,
  topics,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [ratings, setRatings] = useState<{ id: string; rating: ConfidenceLevel }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const handleStartSession = () => {
    const pool = selectedTopicId === 'all' 
      ? [...questions] 
      : questions.filter(q => q.topic_id === selectedTopicId);

    if (pool.length === 0) return;

    const shuffled = pool.sort(() => Math.random() - 0.5);
    setSessionQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setRatings([]);
    setIsFinished(false);
    setSessionStarted(true);
  };

  const handleStartWeakMediumSession = () => {
    const pool = questions.filter(q => q.confidence === 'weak' || q.confidence === 'medium');
    if (pool.length === 0) return;

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setSessionQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setRatings([]);
    setIsFinished(false);
    setSessionStarted(true);
  };

  const handleSelfRating = async (rating: ConfidenceLevel) => {
    const currentQ = sessionQuestions[currentIndex];
    setRatings((prev) => [...prev, { id: currentQ.id, rating }]);

    await updateQuestion(currentQ.id, { confidence: rating });

    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestartWeakOnly = () => {
    const weakSessionQIds = new Set(ratings.filter((r) => r.rating === 'weak').map((r) => r.id));

    let weakPool = sessionQuestions.filter((q) => weakSessionQIds.has(q.id));

    if (weakPool.length === 0) {
      weakPool = selectedTopicId === 'all'
        ? questions.filter((q) => q.confidence === 'weak')
        : questions.filter((q) => q.topic_id === selectedTopicId && q.confidence === 'weak');
    }

    if (weakPool.length === 0) return;

    const shuffled = [...weakPool].sort(() => Math.random() - 0.5);
    setSessionQuestions(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setRatings([]);
    setIsFinished(false);
  };

  const currentQuestion = sessionQuestions[currentIndex];
  const hasCode = currentQuestion ? currentQuestion.question.includes('```') || currentQuestion.answer.includes('```') : false;

  return (
    <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="glass-panel border border-white/95 rounded-3xl w-full max-w-2xl shadow-glass overflow-hidden animate-fadeIn flex flex-col min-h-[400px] max-h-[90vh] overflow-y-auto text-ink">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line/60 flex items-center justify-between bg-tint/40">
          <div className="flex items-center gap-2.5">
            <MessagesSquare className="w-6 h-6 text-deep" aria-hidden="true" />
            <h2 className="text-xl font-display font-extrabold text-ink">
              Mock round (Active recall)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-slate hover:text-ink hover:bg-tint transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* State 1: Topic Selection Start Screen */}
        {!sessionStarted && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-extrabold text-ink">
                Select topic for practice
              </h3>
              <p className="text-sm text-slate font-medium leading-relaxed">
                Questions will be presented one at a time in randomized order. Read the question, test your recall, reveal the answer, and self-rate your confidence.
              </p>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">Practice topic</label>
                <CustomSelect
                  options={[
                    { value: 'all', label: `All topics (${questions.length} questions)` },
                    ...topics.map((t) => ({
                      value: t.id,
                      label: `${t.name} (${questions.filter((q) => q.topic_id === t.id).length} questions)`,
                    })),
                  ]}
                  value={selectedTopicId}
                  onChange={setSelectedTopicId}
                  placeholder="Select a topic..."
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-line/60">
              <button
                type="button"
                onClick={handleStartWeakMediumSession}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FEF0C7] hover:bg-[#FEDF89] text-[#93370D] border border-[#FEDF89] rounded-full font-semibold text-sm shadow-2xs transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#93370D]" aria-hidden="true" />
                <span>Practice Weak & Medium only ({questions.filter(q => q.confidence === 'weak' || q.confidence === 'medium').length})</span>
              </button>

              <button
                type="button"
                onClick={handleStartSession}
                className="inline-flex items-center gap-2 px-6 py-3 bg-deep hover:bg-[#155AA3] text-white rounded-full font-semibold text-sm shadow-md transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                <span>Start practice session</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: Active Question Cards */}
        {sessionStarted && !isFinished && currentQuestion && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
            {/* Top Bar Info & Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate">
                <span>Question {currentIndex + 1} of {sessionQuestions.length}</span>
                <span className="px-3 py-1 rounded-full bg-tint text-deep font-semibold border border-line">
                  {topics.find((t) => t.id === currentQuestion.topic_id)?.name || 'General'}
                </span>
              </div>
              <div className="w-full bg-line/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-deep h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(((currentIndex + 1) / sessionQuestions.length) * 100)}%` }}
                />
              </div>
            </div>

            {/* Main Question Display */}
            <div className="space-y-4 my-auto">
              <div className="text-xl sm:text-2xl font-display font-extrabold text-ink leading-snug">
                <MarkdownRenderer content={currentQuestion.question} />
              </div>

              {/* Code prediction input */}
              {hasCode && !showAnswer && (
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate uppercase tracking-wider">
                    <Code className="w-4 h-4 text-deep" aria-hidden="true" />
                    <span>Predict Output / Answer (Code Question Detected)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Type your predicted output or code solution here before revealing..."
                    className="w-full p-3.5 bg-white border border-line rounded-xl text-sm font-mono text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep shadow-2xs"
                  />
                </div>
              )}

              {/* Revealed Answer Box */}
              {showAnswer && (
                <div className="p-5 bg-white border border-[#BBF7D0] rounded-2xl space-y-2 animate-fadeIn shadow-2xs">
                  <span className="text-xs font-semibold text-[#166534] uppercase tracking-wider block">
                    Solution / Revealed Answer
                  </span>
                  <div className="text-sm sm:text-base text-ink leading-relaxed">
                    <MarkdownRenderer content={currentQuestion.answer} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-line/60 flex items-center justify-between">
              {!showAnswer ? (
                <button
                  type="button"
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-3.5 bg-deep hover:bg-[#155AA3] text-white rounded-full font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" aria-hidden="true" />
                  <span>Reveal answer explanation</span>
                </button>
              ) : (
                <div className="w-full space-y-3">
                  <span className="text-xs font-semibold text-slate text-center block uppercase tracking-wider">
                    Self-rate mastery confidence:
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelfRating('weak')}
                      className="py-3 bg-[#FEE4E2] hover:bg-[#FECDCA] text-[#B42318] border border-[#FECDCA] rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <TriangleAlert className="w-4 h-4 text-[#B42318]" aria-hidden="true" />
                      <span>Weak</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelfRating('medium')}
                      className="py-3 bg-[#FEF0C7] hover:bg-[#FEDF89] text-[#93370D] border border-[#FEDF89] rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Minus className="w-4 h-4 text-[#93370D]" aria-hidden="true" />
                      <span>Medium</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelfRating('solid')}
                      className="py-3 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border border-[#BBF7D0] rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <CircleCheck className="w-4 h-4 text-[#166534]" aria-hidden="true" />
                      <span>Solid</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* State 3: Session Complete Summary */}
        {sessionStarted && isFinished && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between text-center animate-fadeIn">
            <div className="space-y-4 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center mx-auto text-[#166534]">
                <ListChecks className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-display font-extrabold text-ink">
                  Session complete!
                </h3>
                <p className="text-sm text-slate max-w-sm mx-auto font-medium leading-relaxed">
                  You reviewed <strong className="text-ink">{sessionQuestions.length} questions</strong>. Your confidence ratings have been saved.
                </p>
              </div>

              {/* Summary Chip Counts */}
              <div className="flex items-center justify-center gap-3 pt-2 font-semibold text-xs">
                <span className="px-3.5 py-1.5 rounded-full bg-[#FEE4E2] text-[#B42318] border border-[#FECDCA]">
                  Weak: {ratings.filter((r) => r.rating === 'weak').length}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#FEF0C7] text-[#93370D] border border-[#FEDF89]">
                  Medium: {ratings.filter((r) => r.rating === 'medium').length}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                  Solid: {ratings.filter((r) => r.rating === 'solid').length}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-line/60">
              <button
                type="button"
                onClick={handleRestartWeakOnly}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-tint hover:bg-[#D5E8FD] text-deep rounded-full font-semibold text-sm transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-deep" aria-hidden="true" />
                <span>Repeat weak questions only</span>
              </button>
              <button
                type="button"
                onClick={() => setSessionStarted(false)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-deep hover:bg-[#155AA3] text-white rounded-full font-semibold text-sm shadow-md transition-all active:scale-95"
              >
                <span>New practice session</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
