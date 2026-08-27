'use client';

import React, { useState, useEffect } from 'react';
import { Question, Topic, ConfidenceLevel } from '@/types';
import { X } from 'lucide-react';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    topic_id: string;
    question: string;
    answer: string;
    confidence: ConfidenceLevel;
  }) => Promise<void>;
  initialQuestion?: Question | null;
  topics: Topic[];
  defaultTopicId?: string;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuestion,
  topics,
  defaultTopicId,
}) => {
  const [topicId, setTopicId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [confidence, setConfidence] = useState<ConfidenceLevel>('weak');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialQuestion) {
      setTopicId(initialQuestion.topic_id);
      setQuestionText(initialQuestion.question);
      setAnswerText(initialQuestion.answer);
      setConfidence(initialQuestion.confidence);
    } else {
      setTopicId(defaultTopicId && defaultTopicId !== 'all' ? defaultTopicId : topics[0]?.id || '');
      setQuestionText('');
      setAnswerText('');
      setConfidence('weak');
    }
  }, [initialQuestion, isOpen, defaultTopicId, topics]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !answerText.trim() || !topicId || isSubmitting) return;

    setIsSubmitting(true);
    await onSave({
      id: initialQuestion?.id,
      topic_id: topicId,
      question: questionText.trim(),
      answer: answerText.trim(),
      confidence,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold font-mono text-stone-900 dark:text-zinc-100">
            {initialQuestion ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs md:text-sm">
          <div>
            <label className="block text-stone-600 dark:text-zinc-400 mb-1 font-mono text-xs">Topic *</label>
            <select
              required
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded text-stone-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="" disabled>Select a topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-600 dark:text-zinc-400 mb-1 font-mono text-xs">Question *</label>
            <input
              type="text"
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Explain how Floyd's Cycle Detection works."
              className="w-full p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded text-stone-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 dark:text-zinc-400 mb-1 font-mono text-xs">Detailed Answer *</label>
            <textarea
              required
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Solution breakdown, complexity, approach..."
              className="w-full p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded text-stone-900 dark:text-zinc-100 font-sans focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 dark:text-zinc-400 mb-1 font-mono text-xs">Confidence</label>
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}
              className="w-full p-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded text-stone-900 dark:text-zinc-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="weak">weak (needs work)</option>
              <option value="medium">medium (practicing)</option>
              <option value="solid">solid (mastered)</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium shadow-sm transition-all"
            >
              {isSubmitting ? 'Saving...' : initialQuestion ? 'Save Changes' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
