'use client';

import React, { useState } from 'react';
import { Question, Topic, ConfidenceLevel } from '@/types';
import { updateQuestion } from '@/app/actions';
import { MarkdownRenderer } from './MarkdownRenderer';
import { X, Play, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

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

    // Shuffle questions randomly
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

    // Update confidence server-side immediately
    await updateQuestion(currentQ.id, { confidence: rating });

    // Advance or finish
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
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fafaf8] border border-stone-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col min-h-[420px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-serif-display font-semibold text-stone-900">
              Practice Mode (Active Recall)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State 1: Topic Selection Start Screen */}
        {!sessionStarted && (
          <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-serif-display font-medium text-stone-900">
                Select Topic for Practice
              </h3>
              <p className="text-xs text-stone-500 font-sans leading-relaxed">
                Questions will be presented one at a time in randomized order. Read the question, test your recall, reveal the answer, and self-rate your confidence.
              </p>

              <div className="pt-2">
                <label className="block text-xs font-mono text-stone-600 mb-1">PRACTICE TOPIC</label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm font-sans text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 shadow-sm"
                >
                  <option value="all">All Topics ({questions.length} Questions)</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({questions.filter((q) => q.topic_id === t.id).length} Questions)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200/80">
              <button
                type="button"
                onClick={handleStartWeakMediumSession}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-full font-mono font-medium text-xs shadow-sm transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Practice Weak & Medium Only ({questions.filter(q => q.confidence === 'weak' || q.confidence === 'medium').length})</span>
              </button>

              <button
                type="button"
                onClick={handleStartSession}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-medium text-xs shadow-sm transition-all active:scale-95"
              >
                <Play className="w-4 h-4 stroke-[2]" />
                <span>Start Practice Session</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2: Active Question Cards */}
        {sessionStarted && !isFinished && currentQuestion && (
          <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
            {/* Top Bar Info */}
            <div className="flex items-center justify-between text-xs font-mono text-stone-400">
              <span>Question {currentIndex + 1} of {sessionQuestions.length}</span>
              <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-700">
                {topics.find((t) => t.id === currentQuestion.topic_id)?.name || 'General'}
              </span>
            </div>

            {/* Main Question Display */}
            <div className="space-y-4 my-auto">
              <div className="text-xl font-serif-display font-medium text-stone-900 leading-snug">
                <MarkdownRenderer content={currentQuestion.question} />
              </div>

              {/* Code prediction input if code is present */}
              {hasCode && !showAnswer && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                    Predict Output / Answer (Code Question Detected)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Type your predicted output or code solution here before revealing..."
                    className="w-full p-3 bg-white border border-stone-200 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 shadow-sm"
                  />
                </div>
              )}

              {!showAnswer ? (
                <button
                  type="button"
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-6 border-2 border-dashed border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-2xl flex flex-col items-center justify-center gap-2 text-stone-600 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-mono font-medium">Click to Reveal Stored Answer</span>
                </button>
              ) : (
                <div className="p-5 bg-white rounded-2xl border border-stone-200 text-xs md:text-sm text-stone-800 leading-relaxed font-sans shadow-sm animate-fadeIn space-y-2 max-h-72 overflow-y-auto">
                  <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Stored Answer</div>
                  <MarkdownRenderer content={currentQuestion.answer} />
                </div>
              )}
            </div>

            {/* Self Rating Actions */}
            {showAnswer && (
              <div className="pt-4 border-t border-stone-200/80 space-y-2 animate-fadeIn">
                <div className="text-center text-xs font-mono text-stone-500">Rate your recall performance:</div>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelfRating('weak')}
                    className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-xl text-xs font-medium font-mono transition-all active:scale-95"
                  >
                    🔴 Weak
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelfRating('medium')}
                    className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-medium font-mono transition-all active:scale-95"
                  >
                    🟡 Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelfRating('solid')}
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium font-mono transition-all active:scale-95"
                  >
                    🟢 Solid
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* State 3: Session Complete Summary */}
        {isFinished && (
          <div className="p-8 flex-1 flex flex-col justify-between text-center space-y-6 animate-fadeIn">
            <div className="my-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-800">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-serif-display font-semibold text-stone-900">
                  Practice Session Completed!
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Reviewed {sessionQuestions.length} questions in this session. All rating updates have been saved.
                </p>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto font-mono text-xs pt-2">
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-red-800 block font-bold">{ratings.filter(r => r.rating === 'weak').length}</span>
                  <span className="text-[10px] text-red-600">Weak</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="text-amber-800 block font-bold">{ratings.filter(r => r.rating === 'medium').length}</span>
                  <span className="text-[10px] text-amber-600">Medium</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-emerald-800 block font-bold">{ratings.filter(r => r.rating === 'solid').length}</span>
                  <span className="text-[10px] text-emerald-600">Solid</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-stone-600 hover:text-stone-900 font-mono text-xs"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleRestartWeakOnly}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-full text-xs font-mono font-medium shadow-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Practice Weak Only ({ratings.filter((r) => r.rating === 'weak').length})
              </button>

              <button
                type="button"
                onClick={handleStartSession}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-mono font-medium shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restart All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
