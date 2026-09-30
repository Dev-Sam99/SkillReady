'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Topic, Question } from '@/types';
import { bulkCreateQuestions } from '@/app/actions';
import { MarkdownRenderer } from './MarkdownRenderer';
import { X, ListPlus, Sparkles, Eye, ChevronDown, ChevronUp, Upload, CheckCircle2, CircleAlert, Plus, Check } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newQuestions?: Question[], targetTopicId?: string) => void;
  topics: Topic[];
  defaultTopicId?: string;
  onAddTopic?: (name: string) => Promise<{ success: boolean; error?: string }>;
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
  onAddTopic,
}) => {
  const [topicId, setTopicId] = useState('');
  const [rawText, setRawText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedPairs, setParsedPairs] = useState<{ question: string; answer: string }[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Inline topic creation states
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [topicError, setTopicError] = useState<string | null>(null);
  const [isCreatingTopicSubmitting, setIsCreatingTopicSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTopicId(defaultTopicId && defaultTopicId !== 'all' ? defaultTopicId : topics[0]?.id || '');
  }, [defaultTopicId, topics, isOpen]);

  const handleCreateTopicSubmit = async () => {
    if (!newTopicName.trim() || !onAddTopic || isCreatingTopicSubmitting) return;
    setTopicError(null);
    setIsCreatingTopicSubmitting(true);

    const result = await onAddTopic(newTopicName.trim());
    setIsCreatingTopicSubmitting(false);

    if (result.success) {
      setNewTopicName('');
      setIsCreatingTopic(false);
    } else {
      setTopicError(result.error || 'Failed to add topic');
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) return;

      setUploadedFileName(file.name);

      if (file.name.endsWith('.json')) {
        try {
          const parsedJson = JSON.parse(content);
          if (Array.isArray(parsedJson)) {
            const formatted = parsedJson
              .map((item) => {
                const q = item.question || item.q || '';
                const a = item.answer || item.a || '';
                return q && a ? `Q: ${q}\nA: ${a}` : '';
              })
              .filter(Boolean)
              .join('\n---\n');
            setRawText(formatted);
            return;
          }
        } catch {
          setStatusMessage({ type: 'error', msg: 'Failed to parse JSON file structure.' });
        }
      }

      setRawText(content);
    };
    reader.readAsText(file);
  };

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
        onSuccess(res.data || [], topicId);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="glass-panel border border-white/95 rounded-3xl w-full max-w-2xl shadow-glass overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col text-ink">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line/60 flex items-center justify-between bg-tint/40">
          <div className="flex items-center gap-2.5">
            <ListPlus className="w-6 h-6 text-deep" aria-hidden="true" />
            <h2 className="text-xl font-display font-extrabold text-ink">
              Bulk upload questions
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-y-auto flex-1">
          <div>
            <div className="flex items-center justify-between mb-2 text-xs font-semibold uppercase tracking-wider">
              <label className="text-ink">Target topic *</label>
              {onAddTopic && (!isCreatingTopic ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingTopic(true);
                    setTopicError(null);
                  }}
                  className="text-deep hover:underline flex items-center gap-1 font-sans text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" /> Create new topic
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreatingTopic(false)}
                  className="text-slate hover:text-ink font-sans text-xs font-semibold underline"
                >
                  Cancel topic creation
                </button>
              ))}
            </div>

            {isCreatingTopic ? (
              <div className="p-3.5 bg-tint/60 border border-line rounded-xl space-y-2 animate-fadeIn">
                <label className="block text-xs font-semibold text-deep uppercase tracking-wider">New topic name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. System Architecture..."
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-white border border-line rounded-lg text-sm text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleCreateTopicSubmit}
                    disabled={isCreatingTopicSubmitting || !newTopicName.trim()}
                    className="px-4 py-2 bg-deep hover:bg-[#155AA3] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" aria-hidden="true" /> Save
                  </button>
                </div>
                {topicError && <p className="text-xs font-semibold text-[#B42318]">{topicError}</p>}
              </div>
            ) : (
              <CustomSelect
                options={topics.map((t) => ({ value: t.id, label: t.name }))}
                value={topicId}
                onChange={setTopicId}
                placeholder="Select topic..."
              />
            )}
          </div>

          {/* Quick Upload or Raw Paste */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-ink text-xs font-semibold uppercase tracking-wider">
                Q&A text content or Markdown file *
              </label>
              <button
                type="button"
                onClick={() => setRawText(SAMPLE_TEMPLATE)}
                className="text-xs font-semibold text-deep hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4 text-sky" aria-hidden="true" /> Load sample format
              </button>
            </div>

            {/* File Upload Box */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".md,.txt,.json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-line hover:border-deep bg-white/70 p-4 rounded-xl text-center cursor-pointer transition-all space-y-1 group"
            >
              <Upload className="w-6 h-6 text-slate group-hover:text-deep mx-auto transition-colors" aria-hidden="true" />
              <p className="text-sm text-slate font-semibold">
                {uploadedFileName ? (
                  <span className="text-deep font-mono">Loaded: {uploadedFileName}</span>
                ) : (
                  'Click to upload .md, .txt, or .json file'
                )}
              </p>
            </div>

            <textarea
              rows={8}
              required
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                if (uploadedFileName) setUploadedFileName(null);
              }}
              placeholder={`Paste questions formatted as:\nQ: Question text here\nA: Answer explanation here\n---\nQ: Next question...`}
              className="w-full p-3.5 bg-white border border-line rounded-xl text-ink placeholder-slate focus:outline-none focus:ring-2 focus:ring-deep font-mono text-xs leading-relaxed shadow-2xs"
            />
          </div>

          {/* Live Parsing Counter */}
          <div className="flex items-center justify-between p-3.5 bg-tint/60 rounded-xl text-sm font-semibold border border-line/60">
            <span className="text-ink">
              Parsed Questions: <strong className="text-[#166534]">{parsedPairs.length}</strong> valid blocks
            </span>
            {parsedPairs.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-deep hover:underline flex items-center gap-1 font-sans"
              >
                <Eye className="w-4 h-4" aria-hidden="true" />
                {showPreview ? 'Hide preview' : 'Preview parsing'}
                {showPreview ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
              </button>
            )}
          </div>

          {/* Preview Section */}
          {showPreview && parsedPairs.length > 0 && (
            <div className="space-y-3 p-4 bg-white/90 border border-line rounded-xl max-h-60 overflow-y-auto animate-fadeIn">
              <h4 className="text-xs font-semibold text-slate uppercase tracking-wider">
                Parsed Content Preview
              </h4>
              {parsedPairs.map((pair, idx) => (
                <div key={idx} className="p-3 bg-tint/30 rounded-lg border border-line space-y-1">
                  <p className="font-semibold text-sm text-ink">Q{idx + 1}: {pair.question}</p>
                  <div className="text-xs text-slate line-clamp-2">
                    <MarkdownRenderer content={pair.answer} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                  : 'bg-[#FEE4E2] text-[#B42318] border border-[#FECDCA]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#166534]" aria-hidden="true" />
              ) : (
                <CircleAlert className="w-5 h-5 text-[#B42318]" aria-hidden="true" />
              )}
              <span>{statusMessage.msg}</span>
            </div>
          )}

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
              disabled={isSubmitting || parsedPairs.length === 0}
              className="min-w-[44px] min-h-[44px] px-6 py-2.5 bg-deep hover:bg-[#155AA3] text-white rounded-full text-sm font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Importing...' : `Import ${parsedPairs.length} questions`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
