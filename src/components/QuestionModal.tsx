'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Question, Topic, ConfidenceLevel, QuestionTypeTag } from '@/types';
import { CustomSelect } from './CustomSelect';
import { X, Code } from 'lucide-react';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: {
    id?: string;
    topic_id: string;
    question: string;
    answer: string;
    confidence: ConfidenceLevel;
    category_tag?: QuestionTypeTag;
    tags?: string[];
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
  defaultTopicId = '',
}) => {
  const [topicId, setTopicId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [confidence, setConfidence] = useState<ConfidenceLevel>('weak');
  const [categoryTag, setCategoryTag] = useState<QuestionTypeTag>('Theoretical');
  const [tagsInput, setTagsInput] = useState('');
  const [notesText, setNotesText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answerRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (initialQuestion) {
      setTopicId(initialQuestion.topic_id);
      setQuestionText(initialQuestion.question);
      setAnswerText(initialQuestion.answer);
      setConfidence(initialQuestion.confidence);
      setCategoryTag((initialQuestion.category_tag as QuestionTypeTag) || 'Theoretical');
      setTagsInput(initialQuestion.tags ? initialQuestion.tags.join(', ') : '');
      setNotesText(initialQuestion.notes || '');
    } else {
      setTopicId(defaultTopicId && defaultTopicId !== 'all' ? defaultTopicId : topics[0]?.id || '');
      setQuestionText('');
      setAnswerText('');
      setConfidence('weak');
      setCategoryTag('Theoretical');
      setTagsInput('');
      setNotesText('');
    }
  }, [initialQuestion, defaultTopicId, topics]);

  if (!isOpen) return null;

  const insertSnippet = (template: string) => {
    if (!answerRef.current) return;
    const textarea = answerRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const newText = text.substring(0, start) + template + text.substring(end);
    setAnswerText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length, start + template.length);
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId || !questionText.trim() || !answerText.trim()) return;

    setIsSubmitting(true);
    try {
      const tagArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await onSave({
        id: initialQuestion?.id,
        topic_id: topicId,
        question: questionText.trim(),
        answer: answerText.trim(),
        confidence,
        category_tag: categoryTag,
        tags: tagArray,
        notes: notesText.trim(),
      });
      onClose();
    } catch (err) {
      console.error('Error saving question:', err);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#D9E4D0] rounded-[22px] w-full max-w-xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col text-[#1F2D1F]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D9E4D0] flex items-center justify-between bg-[#EEF3E8] shrink-0">
          <h2 className="text-xl font-bold text-[#1F2D1F]">
            {initialQuestion ? 'Edit question' : 'Add new question'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-[#566656] hover:text-[#1F2D1F] hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-[#2F5D3A] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1F2D1F] font-bold text-xs uppercase tracking-wider mb-2">Target topic *</label>
              <CustomSelect
                options={topicOptions}
                value={topicId}
                onChange={setTopicId}
                placeholder="Select a topic..."
              />
            </div>
            <div>
              <label className="block text-[#1F2D1F] font-bold text-xs uppercase tracking-wider mb-2">Category tag</label>
              <CustomSelect
                options={categoryOptions}
                value={categoryTag}
                onChange={(val) => setCategoryTag(val as QuestionTypeTag)}
                placeholder="Select type..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1F2D1F] font-bold text-xs uppercase tracking-wider mb-2">Question (Markdown supported) *</label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. What is the difference between Observables and Signals in Angular?"
              className="w-full p-3.5 bg-white border border-[#D9E4D0] rounded-[16px] text-[#1F2D1F] placeholder-[#566656]/60 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] font-medium leading-relaxed shadow-subtle text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[#1F2D1F] font-bold text-xs uppercase tracking-wider">Answer / Explanation (Markdown & Code) *</label>

              {/* Quick Snippet Insert Toolbar */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] text-[#566656] font-medium hidden sm:inline">Insert:</span>
                <button
                  type="button"
                  onClick={() => insertSnippet('\n```typescript\n// Write code here\n```\n')}
                  className="px-2 py-1 bg-[#EEF3E8] hover:bg-[#E1EBD9] text-[#2F5D3A] rounded-md font-mono text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer border border-[#D9E4D0]"
                  title="Insert code block"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Code block</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('`code`')}
                  className="px-2 py-1 bg-[#EEF3E8] hover:bg-[#E1EBD9] text-[#2F5D3A] rounded-md font-mono text-xs font-semibold transition-colors cursor-pointer border border-[#D9E4D0]"
                  title="Insert inline code"
                >
                  `inline`
                </button>
              </div>
            </div>

            <textarea
              ref={answerRef}
              rows={6}
              required
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Provide a clear code snippet using ```typescript ... ``` or markdown explanation..."
              className="w-full p-3.5 bg-white border border-[#D9E4D0] rounded-[16px] text-[#1F2D1F] placeholder-[#566656]/60 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] font-mono text-xs leading-relaxed shadow-subtle"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1F2D1F] font-bold text-xs uppercase tracking-wider mb-2">Initial confidence *</label>
              <CustomSelect
                options={confidenceOptions}
                value={confidence}
                onChange={(val) => setConfidence(val as ConfidenceLevel)}
                placeholder="Select confidence..."
              />
            </div>
            <div>
              <label className="block text-[#1F2D1F] font-bold text-xs uppercase tracking-wider mb-2">Company Tags (Comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Google, Amazon, Uber"
                className="w-full p-2.5 bg-white border border-[#D9E4D0] rounded-[16px] text-[#1F2D1F] placeholder-[#566656]/60 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] font-medium text-xs shadow-subtle min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1F2D1F] font-bold text-xs uppercase tracking-wider mb-2">Personal Notes / Interview Tips (Optional)</label>
            <textarea
              rows={2}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g. Asked at Amazon. Remember edge case with null input."
              className="w-full p-3 bg-white border border-[#D9E4D0] rounded-[16px] text-[#1F2D1F] placeholder-[#566656]/60 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] font-medium text-xs shadow-subtle"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#D9E4D0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] px-5 py-2.5 border border-[#D9E4D0] bg-white hover:bg-[#EEF3E8] text-[#566656] rounded-full text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[44px] min-h-[44px] px-6 py-2.5 bg-[#2F5D3A] hover:bg-[#254B2E] text-white rounded-full text-sm font-semibold shadow-subtle transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : initialQuestion ? 'Save changes' : 'Create question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
