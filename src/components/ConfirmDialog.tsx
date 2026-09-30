'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        ref={dialogRef}
        className="glass-panel border border-white/95 rounded-3xl w-full max-w-sm p-6 shadow-glass space-y-5 animate-scaleUp text-ink"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEE4E2] border border-[#FECDCA] flex items-center justify-center text-[#B42318] flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirm-dialog-title" className="text-base font-display font-extrabold text-ink">
                {title}
              </h3>
              <p id="confirm-dialog-description" className="text-xs text-slate font-medium mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close modal"
            className="text-slate hover:text-ink p-1.5 rounded-full hover:bg-tint transition-colors focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line/60">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="min-w-[44px] min-h-[44px] px-4 py-2 text-xs font-semibold text-slate bg-white border border-line hover:bg-tint rounded-full transition-all focus-visible:ring-2 focus-visible:ring-deep focus-visible:outline-none active:scale-95"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-w-[44px] min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-[#B42318] hover:bg-[#91180E] rounded-full transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-[#B42318] focus-visible:outline-none active:scale-95"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
