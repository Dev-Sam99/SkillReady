'use client';

import React, { useEffect, useRef } from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'J', label: 'Next question' },
    { key: 'K', label: 'Previous question' },
    { key: 'F', label: 'Toggle Flag marker' },
    { key: 'S', label: 'Toggle Important star marker' },
    { key: 'Space', label: 'Reveal / Scroll answer' },
    { key: '/', label: 'Focus search bar' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dialog-title"
        className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-glass border border-line space-y-5 animate-scaleUp"
      >
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-tint text-deep flex items-center justify-center shrink-0">
              <Keyboard className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 id="shortcuts-dialog-title" className="font-display font-bold text-xl text-ink">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts modal"
            className="w-11 h-11 inline-flex items-center justify-center rounded-full text-slate hover:text-ink hover:bg-tint/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-3 rounded-2xl bg-page-bg/60 border border-line/60"
            >
              <span className="text-sm font-medium text-ink">{s.label}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-deep bg-white border border-line rounded-lg shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
