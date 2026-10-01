'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Question, Topic, ConfidenceLevel } from '@/types';
import { rateQuestion } from '@/app/actions';
import { SCHEDULE_RULES, isQuestionDue, isQuestionOverdue } from '@/lib/constants';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ChevronLeft, Building2, CircleCheck, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

interface PracticeModeProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  topics: Topic[];
  practiceAll?: boolean;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  isOpen,
  onClose,
  questions,
  topics,
  practiceAll = false,
}) => {
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [ratings, setRatings] = useState<{ id: string; rating: ConfidenceLevel }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize practice queue when opened
  useEffect(() => {
    if (!isOpen) return;

    let pool: Question[];
    if (practiceAll) {
      pool = [...questions];
    } else {
      pool = questions.filter((q) => isQuestionDue(q.next_review_at));
      if (pool.length === 0) pool = [...questions]; // fallback if nothing due
    }

    // Sort queue: overdue first, then weak, medium, solid
    const sorted = [...pool].sort((a, b) => {
      const aOverdue = isQuestionOverdue(a.next_review_at) ? 1 : 0;
      const bOverdue = isQuestionOverdue(b.next_review_at) ? 1 : 0;
      if (aOverdue !== bOverdue) return bOverdue - aOverdue;

      const order: Record<ConfidenceLevel, number> = { weak: 0, medium: 1, solid: 2 };
      return order[a.confidence] - order[b.confidence];
    });

    setSessionQuestions(sorted);
    setCurrentIndex(0);
    setShowAnswer(false);
    setRatings([]);
    setIsFinished(false);
  }, [isOpen, practiceAll, questions]);

  const handleSelfRating = useCallback(async (rating: ConfidenceLevel) => {
    const currentQ = sessionQuestions[currentIndex];
    if (!currentQ) return;

    setRatings((prev) => [...prev, { id: currentQ.id, rating }]);

    // Rate question via Server Action with transaction & ReviewLog insert
    await rateQuestion(currentQ.id, rating);

    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, sessionQuestions]);

  // Keyboard Shortcuts: 1/2/3 to rate, Space to reveal, Esc/Back
  useEffect(() => {
    if (!isOpen || isFinished || sessionQuestions.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setShowAnswer(true);
      } else if (showAnswer) {
        if (e.key === '1') {
          e.preventDefault();
          handleSelfRating('weak');
        } else if (e.key === '2') {
          e.preventDefault();
          handleSelfRating('medium');
        } else if (e.key === '3') {
          e.preventDefault();
          handleSelfRating('solid');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showAnswer, isFinished, sessionQuestions.length, handleSelfRating]);

  if (!isOpen) return null;

  const currentQuestion = sessionQuestions[currentIndex];
  const currentTopicName = currentQuestion
    ? topics.find((t) => t.id === currentQuestion.topic_id)?.name || 'General'
    : 'General';

  return (
    <div className="fixed inset-0 z-50 bg-[#1F2D1F]/40 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="matcha-card w-full max-w-2xl shadow-card overflow-hidden flex flex-col min-h-[480px] max-h-[92vh] bg-white text-[#1F2D1F]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#D9E4D0] flex items-center justify-between bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to Questions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#566656] hover:text-[#1F2D1F] p-2 -ml-2 rounded-[16px] hover:bg-[#EEF3E8] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-[#2F5D3A]" aria-hidden="true" />
            <span>Back to Questions</span>
          </button>

          {!isFinished && sessionQuestions.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#1F2D1F]">
                {currentIndex + 1} of {sessionQuestions.length}
              </span>
            </div>
          )}
        </div>

        {/* Segmented Progress Bar */}
        {!isFinished && sessionQuestions.length > 0 && (
          <div className="w-full bg-[#E1EBD9] h-2">
            <div
              className="bg-[#2F5D3A] h-2 transition-all duration-300"
              style={{ width: `${Math.round(((currentIndex + 1) / sessionQuestions.length) * 100)}%` }}
            />
          </div>
        )}

        {/* ACTIVE QUESTION SCREEN */}
        {!isFinished && currentQuestion && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6 overflow-y-auto">
            {/* Topic, Level & Company Chips */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E1EBD9] text-[#2F5D3A]">
                {currentTopicName}
              </span>

              {/* Current Confidence Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQuestion.confidence === 'weak'
                    ? 'bg-[#FBE5E0] text-[#C2412D]'
                    : currentQuestion.confidence === 'medium'
                    ? 'bg-[#FBEFD2] text-[#B7791F]'
                    : 'bg-[#DDF1E5] text-[#2E8B57]'
                }`}
              >
                Level: {currentQuestion.confidence}
              </span>

              {/* Company Tags */}
              {currentQuestion.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F5D3A] bg-white border border-[#D9E4D0] px-2.5 py-1 rounded-full"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Question Heading */}
            <div className="space-y-4 my-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F2D1F] leading-snug flex items-start gap-2">
                <span className="text-[#2F5D3A] shrink-0 font-extrabold">Q{currentIndex + 1}.</span>
                <span>{currentQuestion.question}</span>
              </h2>

              {/* Hint Card before reveal */}
              {!showAnswer && (
                <div className="p-4 bg-[#EEF3E8] border border-[#D9E4D0] rounded-[22px] space-y-1 text-xs text-[#566656]">
                  <p className="font-semibold text-[#1F2D1F]">💡 Practice Tip</p>
                  <p>Say your answer out loud first. Then reveal it and rate how close you were.</p>
                </div>
              )}

              {/* Solution Box after reveal */}
              {showAnswer && (
                <div className="p-5 bg-white border border-[#D9E4D0] rounded-[22px] space-y-2 animate-fadeIn shadow-subtle">
                  <span className="text-xs font-bold text-[#2F5D3A] uppercase tracking-wider block">
                    Solution & Explanation
                  </span>
                  <div className="text-sm sm:text-base text-[#1F2D1F] leading-relaxed">
                    <MarkdownRenderer content={currentQuestion.answer} />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#D9E4D0] shrink-0">
              {!showAnswer ? (
                <button
                  type="button"
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 bg-[#2F5D3A] hover:bg-[#254B2E] text-white rounded-[16px] font-bold text-base shadow-subtle transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Show answer (Space)</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#566656] text-center uppercase tracking-wider">
                    Rate how close you were:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Weak Button */}
                    <button
                      type="button"
                      onClick={() => handleSelfRating('weak')}
                      title="Weak Concept — Needs review"
                      className="py-3 px-2 bg-[#FBE5E0] hover:bg-[#F8D4CE] text-[#C2412D] border border-[#F5C2B8] rounded-[16px] font-bold text-sm transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        <BatteryLow className="w-4 h-4" />
                        <span>Weak (1)</span>
                      </div>
                      <span className="text-[11px] font-normal opacity-80">{SCHEDULE_RULES.weak.label}</span>
                    </button>

                    {/* Medium Button */}
                    <button
                      type="button"
                      onClick={() => handleSelfRating('medium')}
                      title="Medium Concept"
                      className="py-3 px-2 bg-[#FBEFD2] hover:bg-[#F8E5BA] text-[#B7791F] border border-[#EED79D] rounded-[16px] font-bold text-sm transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        <BatteryMedium className="w-4 h-4" />
                        <span>Medium (2)</span>
                      </div>
                      <span className="text-[11px] font-normal opacity-80">{SCHEDULE_RULES.medium.label}</span>
                    </button>

                    {/* Solid Button */}
                    <button
                      type="button"
                      onClick={() => handleSelfRating('solid')}
                      title="Solid Concept — Mastered!"
                      className="py-3 px-2 bg-[#DDF1E5] hover:bg-[#CBEAD6] text-[#2E8B57] border border-[#B9DFC6] rounded-[16px] font-bold text-sm transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        <BatteryFull className="w-4 h-4" />
                        <span>Solid (3)</span>
                      </div>
                      <span className="text-[11px] font-normal opacity-80">{SCHEDULE_RULES.solid.label}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SESSION COMPLETE END SCREEN */}
        {isFinished && (
          <div className="p-8 space-y-6 flex-1 flex flex-col justify-between text-center animate-fadeIn my-auto">
            <div className="space-y-4 max-w-sm mx-auto my-auto">
              <div className="w-16 h-16 rounded-full bg-[#DDF1E5] text-[#2E8B57] flex items-center justify-center mx-auto">
                <CircleCheck className="w-8 h-8" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-[#1F2D1F]">Session complete!</h3>
                <p className="text-sm font-medium text-[#566656]">
                  You reviewed <strong>{sessionQuestions.length} questions</strong>.
                </p>
              </div>

              {/* Rating Counts Summary */}
              <div className="flex items-center justify-center gap-2 pt-2 font-semibold text-xs">
                <span className="px-3 py-1 rounded-full bg-[#FBE5E0] text-[#C2412D]">
                  Weak: {ratings.filter((r) => r.rating === 'weak').length}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FBEFD2] text-[#B7791F]">
                  Medium: {ratings.filter((r) => r.rating === 'medium').length}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#DDF1E5] text-[#2E8B57]">
                  Solid: {ratings.filter((r) => r.rating === 'solid').length}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#2F5D3A] hover:bg-[#254B2E] text-white font-bold text-base py-4 px-6 rounded-[16px] transition-all cursor-pointer shadow-subtle"
            >
              <span>Back to Questions</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
