'use client';

import React, { useState, useEffect } from 'react';
import { Topic } from '@/types';
import { bulkCreateQuestions } from '@/app/actions';
import { MarkdownRenderer } from './MarkdownRenderer';
import { X, Layers, Sparkles, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  topics: Topic[];
  defaultTopicId?: string;
}

const SAMPLE_TEMPLATE = `Q: What is Floyd's Cycle Detection algorithm?
A: Floyd's algorithm uses two pointers (slow and fast) to detect cycles in linked lists in O(N) time and O(1) space:
\`\`\`typescript
function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next!;
    if (slow === fast) return true;
  }
  return false;
}
\`\`\`
---
Q: What is the CAP Theorem?
A: In a distributed system, you can only guarantee two out of Consistency, Availability, and Partition Tolerance.`;

export const BulkAddModal: React.FC<BulkAddModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  topics,
  defaultTopicId,
}) => {
  const [topicId, setTopicId] = useState('');
  const [rawText, setRawText] = useState('');
  const [parsedPairs, setParsedPairs] = useState<{ question: string; answer: string }[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    setTopicId(defaultTopicId && defaultTopicId !== 'all' ? defaultTopicId : topics[0]?.id || '');
  }, [defaultTopicId, topics, isOpen]);

  // Code-fence aware detection count
  useEffect(() => {
    if (!rawText.trim()) {
      setParsedPairs([]);
      return;
    }
    const lines = rawText.split(/\r?\n/);
    const blocks: string[] = [];
    let currentBlockLines: string[] = [];
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        currentBlockLines.push(line);
      } else if (!inCodeBlock && line.trim() === '---') {
        if (currentBlockLines.length > 0) {
          blocks.push(currentBlockLines.join('\n').trim());
          currentBlockLines = [];
        }
      } else {
        currentBlockLines.push(line);
      }
    }

    if (currentBlockLines.length > 0) {
      blocks.push(currentBlockLines.join('\n').trim());
    }

    const pairs: { question: string; answer: string }[] = [];

    for (const block of blocks) {
      const qMatch = block.match(/Q:\s*([\s\S]*?)(?=A:|$)/i);
      const aMatch = block.match(/A:\s*([\s\S]*)/i);

      if (qMatch && aMatch && qMatch[1].trim() && aMatch[1].trim()) {
        pairs.push({
          question: qMatch[1].trim(),
          answer: aMatch[1].trim(),
        });
      }
    }

    setParsedPairs(pairs);
  }, [rawText]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || !topicId || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await bulkCreateQuestions(topicId, rawText);
    setIsSubmitting(false);

    if (res.error) {
      setStatusMessage({ type: 'error', msg: res.error });
    } else {
      setStatusMessage({ type: 'success', msg: `Successfully added ${res.count} questions!` });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-stone-900" />
            <h2 className="text-base font-serif-display font-semibold text-stone-900">
              Bulk Add Questions
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs md:text-sm overflow-y-auto flex-1">
          <div>
            <label className="block text-stone-600 mb-1 font-mono text-xs">Target Topic *</label>
            <select
              required
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none"
            >
              <option value="" disabled>Select a topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 font-mono text-xs">
              <label className="text-stone-600">Paste Q&A Content (Q: ... A: ... --- format) *</label>
              <button
                type="button"
                onClick={() => setRawText(SAMPLE_TEMPLATE)}
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Insert Sample
              </button>
            </div>
            <textarea
              required
              rows={7}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Q: What is Floyds algorithm?\nA: Slow and fast pointer approach.\n---\nQ: What is CAP theorem?\nA: Consistency, Availability, Partition tolerance.`}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono text-xs leading-relaxed focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

          {/* Status Bar & Preview Toggle */}
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <div className="flex items-center gap-3">
              <span className="text-stone-500">
                Detected: <strong className="text-stone-900">{parsedPairs.length} questions</strong>
              </span>

              {parsedPairs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 text-stone-600 hover:text-stone-900 underline"
                >
                  <Eye className="w-3 h-3" />
                  <span>{showPreview ? 'Hide Markdown Preview' : 'Show Markdown Preview'}</span>
                  {showPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {statusMessage && (
              <span className={`px-2.5 py-1 rounded text-xs font-sans ${
                statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {statusMessage.msg}
              </span>
            )}
          </div>

          {/* Live Markdown Preview Container */}
          {showPreview && parsedPairs.length > 0 && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4 max-h-60 overflow-y-auto animate-fadeIn">
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                Live Markdown & Code Preview ({parsedPairs.length})
              </div>
              {parsedPairs.map((pair, idx) => (
                <div key={idx} className="p-3 bg-white border border-stone-200/80 rounded-lg space-y-2">
                  <div className="font-semibold text-stone-900">
                    <MarkdownRenderer content={`Q: ${pair.question}`} />
                  </div>
                  <div className="text-stone-700 border-t border-stone-100 pt-2">
                    <MarkdownRenderer content={pair.answer} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-stone-500 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || parsedPairs.length === 0}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-full font-medium shadow-sm transition-all"
            >
              {isSubmitting ? 'Inserting...' : `Bulk Insert (${parsedPairs.length})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
