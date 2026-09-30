'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EllipsisVertical, FileDown, FileText, ListPlus, LogOut, Lock, User, Sparkles, Keyboard } from 'lucide-react';

interface OverflowMenuProps {
  isAdmin: boolean;
  onDownloadPDF: () => void;
  onDownloadMarkdown?: () => void;
  onOpenBulkAdd: () => void;
  onOpenPractice?: () => void;
  onOpenShortcuts?: () => void;
  onLogout: () => void;
}

export const OverflowMenu: React.FC<OverflowMenuProps> = ({
  isAdmin,
  onDownloadPDF,
  onDownloadMarkdown,
  onOpenBulkAdd,
  onOpenPractice,
  onOpenShortcuts,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="More options menu"
        className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-full text-slate hover:text-ink bg-white/90 hover:bg-white border border-line shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep focus-visible:ring-offset-2 transition-all active:scale-95"
      >
        <EllipsisVertical className="w-5 h-5 text-slate" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 bg-white/75 backdrop-blur-md border border-white/95 rounded-2xl shadow-glass p-1.5 z-50 animate-fadeIn focus:outline-none space-y-1"
        >
          {/* Action: Mock Practice Round */}
          {onOpenPractice && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onOpenPractice();
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-tint/80 rounded-xl flex items-center gap-3 transition-colors focus-visible:bg-tint focus-visible:outline-none"
            >
              <Sparkles className="w-4 h-4 text-deep" aria-hidden="true" />
              <span>Start Mock Practice Round</span>
            </button>
          )}

          {/* Action: Keyboard Shortcuts */}
          {onOpenShortcuts && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onOpenShortcuts();
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-tint/80 rounded-xl flex items-center gap-3 transition-colors focus-visible:bg-tint focus-visible:outline-none"
            >
              <Keyboard className="w-4 h-4 text-deep" aria-hidden="true" />
              <span>Keyboard Shortcuts</span>
            </button>
          )}

          {/* Action: Markdown Cheat Sheet */}
          {onDownloadMarkdown && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onDownloadMarkdown();
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-tint/80 rounded-xl flex items-center gap-3 transition-colors focus-visible:bg-tint focus-visible:outline-none"
            >
              <FileText className="w-4 h-4 text-deep" aria-hidden="true" />
              <span>Export Markdown (.md)</span>
            </button>
          )}

          {isAdmin ? (
            <>
              {/* Admin Avatar Header */}
              <div className="px-3.5 py-2.5 rounded-xl border border-line/50 flex items-center gap-2.5 bg-tint/60">
                <div className="w-8 h-8 rounded-full bg-deep text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink font-sans">Admin Session</p>
                  <p className="text-[11px] font-semibold text-emerald-700 font-sans">Authenticated</p>
                </div>
              </div>

              {/* Action 1: PDF Export */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onDownloadPDF();
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-tint/80 rounded-xl flex items-center gap-3 transition-colors focus-visible:bg-tint focus-visible:outline-none"
              >
                <FileDown className="w-4 h-4 text-deep" aria-hidden="true" />
                <span>Export PDF Summary</span>
              </button>

              {/* Action 2: Bulk Add */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenBulkAdd();
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-tint/80 rounded-xl flex items-center gap-3 transition-colors focus-visible:bg-tint focus-visible:outline-none"
              >
                <ListPlus className="w-4 h-4 text-deep" aria-hidden="true" />
                <span>Bulk Add Questions</span>
              </button>

              <div className="my-1 border-t border-line/60" />

              {/* Action 3: Logout */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#B42318] hover:bg-[#FEE4E2]/80 rounded-xl flex items-center gap-3 transition-colors focus-visible:bg-[#FEE4E2]/80 focus-visible:outline-none"
              >
                <LogOut className="w-4 h-4 text-[#B42318]" aria-hidden="true" />
                <span>Log Out Admin</span>
              </button>
            </>
          ) : (
            <>
              {/* Guest Admin Login */}
              <a
                href="/login"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-tint/80 rounded-xl flex items-center gap-3 transition-colors focus-visible:bg-tint focus-visible:outline-none"
              >
                <Lock className="w-4 h-4 text-deep" aria-hidden="true" />
                <span>Sign In as Admin</span>
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};
