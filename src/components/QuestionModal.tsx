'use client';

import React, { useState, useEffect } from 'react';
import { Question, Topic, ConfidenceLevel, QuestionTypeTag } from '@/types';
import { X } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    topic_id: string;
    question: string;
    answer: string;
    confidence: ConfidenceLevel;
    category_tag?: QuestionTypeTag;
    notes?: string;
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
  const [categoryTag, setCategoryTag] = useState<QuestionTypeTag>('Theoretical');
  const [notesText, setNotesText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialQuestion) {
      setTopicId(initialQuestion.topic_id);
      setQuestionText(initialQuestion.question);
      setAnswerText(initialQuestion.answer);
      setConfidence(initialQuestion.confidence);
      setCategoryTag(initialQuestion.category_tag || 'Theoretical');
      setNotesText(initialQuestion.notes || '');
    } else {
      setTopicId(defaultTopicId && defaultTopicId !== 'all' ? defaultTopicId : topics[0]?.id || '');
      setQuestionText('');
      setAnswerText('');
      setConfidence('weak');
      setCategoryTag('Theoretical');
      setNotesText('');
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
      category_tag: categoryTag,
      notes: notesText.trim() || undefined,
    });
    setIsSubmitting(false);
    onClose();
  };

  const topicOptions = topics.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const confidenceOptions = [
    { value: 'weak', label: '🔴 Weak (Needs Work)' },
    { value: 'medium', label: '🟡 Medium (Practicing)' },
    { value: 'solid', label: '🟢 Solid (Mastered)' },
  ];

  const categoryOptions = [
    { value: 'Theoretical', label: '📘 Theoretical' },
    { value: 'Coding', label: '💻 Coding / Practical' },
    { value: 'Architecture', label: '🏗️ Architecture / System Design' },
    { value: 'Behavioral', label: '🗣️ Behavioral' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="glass-panel border border-white/95 rounded-3xl w-full max-w-xl shadow-glass overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col text-ink">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line/60 flex items-center justify-between bg-tint/40 flex-shrink-0">
          <h2 className="text-xl font-display font-extrabold text-ink">
            {initialQuestion ? 'Edit question' : 'Add new question'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-slate hover:text-ink hover:bg-tint transition-colors focus-visible:ring-2 focus-visible:ring-deep"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink font-semibold text-xs uppercase tracking-wider mb-2">Target topic *</label>
              <CustomSelect
                options={topicOptions}
                value={topicId}
                onChange={setTopicId}
                placeholder="Select a topic..."
              />
            </div>
            <div>
              <label className="block text-ink font-semibold text-xs uppercase tracking-wider mb-2">Category tag</label>
              <CustomSelect
                options={categoryOptions}
                value={categoryTag}
                onChange={(val) => setCategoryTag(val as QuestionTypeTag)}
                placeholder="Select type..."
              />
            </div>
          </div>

          <div>
            <label className="block text-ink font-semibold text-xs uppercase tracking-wider mb-2">Question (Markdown supported) *</label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What is the difference between Observables and Signals in Angular?"
              className="w-full p-3.5 bg-white border border-line rounded-xl text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep font-medium leading-relaxed shadow-2xs text-sm"
            />
          </div>

          <div>
            <label className="block text-ink font-semibold text-xs uppercase tracking-wider mb-2">Answer / Explanation *</label>
            <textarea
              rows={5}
              required
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Provide a clear code snippet or technical explanation..."
              className="w-full p-3.5 bg-white border border-line rounded-xl text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep font-medium leading-relaxed shadow-2xs text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink font-semibold text-xs uppercase tracking-wider mb-2">Initial confidence *</label>
              <CustomSelect
                options={confidenceOptions}
                value={confidence}
                onChange={(val) => setConfidence(val as ConfidenceLevel)}
                placeholder="Select confidence..."
              />
            </div>
          </div>

          <div>
            <label className="block text-ink font-semibold text-xs uppercase tracking-wider mb-2">Personal Notes / Interview Tips (Optional)</label>
            <textarea
              rows={2}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g. Asked at Amazon. Remember edge case with null input."
              className="w-full p-3 bg-white border border-line rounded-xl text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep font-medium text-xs shadow-2xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-line/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] px-5 py-2.5 border border-line bg-white hover:bg-tint text-slate rounded-full text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[44px] min-h-[44px] px-6 py-2.5 bg-deep hover:bg-[#155AA3] text-white rounded-full text-sm font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialQuestion ? 'Save changes' : 'Create question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
