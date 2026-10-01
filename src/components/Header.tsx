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
      <div className="bg-white border border-[#D9E4D0] rounded-full px-4 py-2 flex items-center justify-between shadow-subtle">
        {/* Left: Logo + Wordmark */}
        <SkillReadyWordmark logoSize={34} />

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Primary Action: Add Question */}
          <button
            type="button"
            onClick={onAddQuestion}
            aria-label="Add question"
            className="w-11 h-11 sm:w-auto sm:h-auto bg-[#2F5D3A] hover:bg-[#254B2E] text-white font-semibold text-sm rounded-[16px] px-3.5 sm:px-4 py-2.5 inline-flex items-center justify-center gap-2 transition-all active:scale-95 shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] cursor-pointer"
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
