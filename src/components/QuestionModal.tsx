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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100">
            {initialQuestion ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs md:text-sm">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Select Topic *</label>
            <select
              required
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="" disabled>Select a topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Question Text *</label>
            <input
              type="text"
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Explain how Floyd's Cycle Detection works."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Detailed Answer (Multiline) *</label>
            <textarea
              required
              rows={5}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Comprehensive solution, code snippet, algorithm breakdown..."
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-sans focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Initial Confidence</label>
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="weak">🔴 Weak (Needs Work)</option>
              <option value="medium">🟡 Medium (Getting There)</option>
              <option value="solid">🟢 Solid (Mastered)</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              {isSubmitting ? 'Saving...' : initialQuestion ? 'Save Changes' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
