'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { SkillReadyWordmark } from './SkillReadyWordmark';
import { OverflowMenu } from './OverflowMenu';

interface HeaderProps {
  isAdmin: boolean;
  onAddQuestion: () => void;
  onDownloadPDF: () => void;
  onDownloadMarkdown?: () => void;
  onOpenBulkAdd: () => void;
  onOpenPractice?: () => void;
  onOpenShortcuts?: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  onAddQuestion,
  onDownloadPDF,
  onDownloadMarkdown,
  onOpenBulkAdd,
  onOpenPractice,
  onOpenShortcuts,
  onLogout,
}) => {
  return (
    <header className="sticky top-3 z-40 px-3 sm:px-6 mb-4 max-w-7xl mx-auto w-full">
      <div className="bg-white/74 backdrop-blur-[16px] backdrop-saturate-[1.4] border border-white/95 rounded-full px-4 py-2.5 flex items-center justify-between shadow-glass">
        {/* Left: Logo + Wordmark */}
        <SkillReadyWordmark logoSize={34} />

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Primary Action: Add Question */}
          <button
            type="button"
            onClick={onAddQuestion}
            aria-label="Add question"
            className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 bg-deep hover:bg-[#155ab0] text-white font-semibold text-sm rounded-full px-3.5 sm:px-4 py-2.5 inline-flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep focus-visible:ring-offset-2"
          >
            <Plus className="w-5 h-5 shrink-0 text-white" aria-hidden="true" />
            <span className="hidden sm:inline">Add question</span>
          </button>

          {/* More Overflow Menu */}
          <OverflowMenu
            isAdmin={isAdmin}
            onDownloadPDF={onDownloadPDF}
            onDownloadMarkdown={onDownloadMarkdown}
            onOpenBulkAdd={onOpenBulkAdd}
            onOpenPractice={onOpenPractice}
            onOpenShortcuts={onOpenShortcuts}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
};
