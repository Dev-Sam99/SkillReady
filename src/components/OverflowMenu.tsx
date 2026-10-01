'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EllipsisVertical, FileDown, FileText, ListPlus, LogOut, User, Play, Keyboard } from 'lucide-react';

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
        className="w-11 h-11 inline-flex items-center justify-center rounded-full text-[#1F2D1F] bg-white hover:bg-[#EEF3E8] border border-[#D9E4D0] shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] transition-all active:scale-95"
      >
        <EllipsisVertical className="w-5 h-5 text-[#1F2D1F]" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 bg-white border border-[#D9E4D0] rounded-[22px] shadow-card p-2 z-50 animate-fadeIn focus:outline-none space-y-1"
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
              className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#1F2D1F] hover:bg-[#EEF3E8] rounded-[16px] flex items-center gap-3 transition-colors focus-visible:bg-[#EEF3E8] focus-visible:outline-none"
            >
              <Play className="w-5 h-5 text-[#2F5D3A] shrink-0" aria-hidden="true" />
              <span>Start mock practice round</span>
            </button>
          )}

          {/* Action: Bulk Add */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onOpenBulkAdd();
            }}
            className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#1F2D1F] hover:bg-[#EEF3E8] rounded-[16px] flex items-center gap-3 transition-colors focus-visible:bg-[#EEF3E8] focus-visible:outline-none"
          >
            <ListPlus className="w-5 h-5 text-[#2F5D3A] shrink-0" aria-hidden="true" />
            <span>Bulk add questions</span>
          </button>

          {/* Action: Export Markdown */}
          {onDownloadMarkdown && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onDownloadMarkdown();
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#1F2D1F] hover:bg-[#EEF3E8] rounded-[16px] flex items-center gap-3 transition-colors focus-visible:bg-[#EEF3E8] focus-visible:outline-none"
            >
              <FileText className="w-5 h-5 text-[#2F5D3A] shrink-0" aria-hidden="true" />
              <span>Export Markdown (.md)</span>
            </button>
          )}

          {/* Action: Export PDF */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onDownloadPDF();
            }}
            className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#1F2D1F] hover:bg-[#EEF3E8] rounded-[16px] flex items-center gap-3 transition-colors focus-visible:bg-[#EEF3E8] focus-visible:outline-none"
          >
            <FileDown className="w-5 h-5 text-[#2F5D3A] shrink-0" aria-hidden="true" />
            <span>Export PDF summary</span>
          </button>

          {/* Action: Keyboard Shortcuts */}
          {onOpenShortcuts && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onOpenShortcuts();
              }}
              className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#1F2D1F] hover:bg-[#EEF3E8] rounded-[16px] flex items-center gap-3 transition-colors focus-visible:bg-[#EEF3E8] focus-visible:outline-none"
            >
              <Keyboard className="w-5 h-5 text-[#2F5D3A] shrink-0" aria-hidden="true" />
              <span>Keyboard shortcuts</span>
            </button>
          )}

          <div className="my-1 border-t border-[#D9E4D0]" />

          {/* Admin Row & Logout */}
          {isAdmin ? (
            <>
              <div className="px-3.5 py-2 rounded-[16px] border border-[#D9E4D0] flex items-center gap-2.5 bg-[#EEF3E8]">
                <div className="w-8 h-8 rounded-full bg-[#2F5D3A] text-white flex items-center justify-center font-semibold text-xs shrink-0">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1F2D1F]">Signed-in Admin</p>
                  <p className="text-[11px] font-semibold text-[#2E8B57]">Authenticated</p>
                </div>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#C2412D] hover:bg-[#FBE5E0] rounded-[16px] flex items-center gap-3 transition-colors focus-visible:bg-[#FBE5E0] focus-visible:outline-none"
              >
                <LogOut className="w-5 h-5 text-[#C2412D] shrink-0" aria-hidden="true" />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="w-full text-left px-3.5 py-2.5 text-sm font-semibold text-[#2F5D3A] hover:bg-[#EEF3E8] rounded-[16px] flex items-center gap-3 transition-colors block"
            >
              <User className="w-5 h-5 text-[#2F5D3A] shrink-0" aria-hidden="true" />
              <span>Admin Login</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};
