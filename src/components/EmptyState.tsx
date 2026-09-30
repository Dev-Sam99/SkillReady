'use client';

import React from 'react';
import { Inbox, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  type: 'empty-topic' | 'empty-search';
  topicName?: string;
  searchQuery?: string;
  isAdmin?: boolean;
  onAddQuestion?: () => void;
  onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  topicName,
  searchQuery,
  isAdmin = false,
  onAddQuestion,
  onClearSearch,
}) => {
  if (type === 'empty-search') {
    return (
      <div className="p-12 sm:p-16 text-center space-y-4 animate-fadeIn solid-table-row">
        <div className="w-14 h-14 rounded-2xl bg-tint border border-line flex items-center justify-center mx-auto text-deep">
          <Inbox className="w-7 h-7 stroke-[2]" aria-hidden="true" />
        </div>
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h3 className="text-xl font-display font-extrabold text-ink">
            No questions here yet
          </h3>
          <p className="text-sm text-slate leading-relaxed font-medium">
            No questions matched your search filter <span className="font-semibold text-deep bg-tint px-2 py-0.5 rounded">&quot;{searchQuery}&quot;</span>.
          </p>
        </div>
        {onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="min-w-[44px] min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-tint hover:bg-[#D5E8FD] text-deep font-semibold text-sm rounded-full transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
          >
            <RotateCcw className="w-4 h-4 text-deep" aria-hidden="true" />
            <span>Clear search filter</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-12 sm:p-16 text-center space-y-4 animate-fadeIn solid-table-row">
      <div className="w-14 h-14 rounded-2xl bg-tint border border-line flex items-center justify-center mx-auto text-deep">
        <Inbox className="w-7 h-7 stroke-[2]" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-xl font-display font-extrabold text-ink">
          {topicName ? `No ${topicName} questions here yet` : 'No questions here yet'}
        </h3>
        <p className="text-sm text-slate leading-relaxed font-medium">
          {topicName
            ? `There are no technical questions logged under ${topicName}.`
            : 'Start building your interview study queue by adding your first question.'}
        </p>
      </div>
      {isAdmin && onAddQuestion && (
        <button
          type="button"
          onClick={onAddQuestion}
          className="min-w-[44px] min-h-[44px] inline-flex items-center gap-2 px-6 py-3 bg-deep hover:bg-[#155AA3] text-white font-semibold text-sm rounded-full transition-all shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
          <span>Add question</span>
        </button>
      )}
    </div>
  );
};
