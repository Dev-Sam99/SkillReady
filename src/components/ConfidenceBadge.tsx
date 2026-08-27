'use client';

import React from 'react';
import { ConfidenceLevel } from '@/types';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  onClick?: () => void;
  interactive?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  onClick,
  interactive = true,
}) => {
  const getBadgeStyle = (level: ConfidenceLevel) => {
    switch (level) {
      case 'weak':
        return 'bg-red-50 text-red-700 border-red-200 hover:border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      case 'medium':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'solid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getDotStyle = (level: ConfidenceLevel) => {
    switch (level) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'solid':
        return 'bg-emerald-500';
    }
  };

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-mono transition-all duration-150 ${getBadgeStyle(
        confidence
      )} ${interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
      title={interactive ? 'Click to cycle state (weak -> medium -> solid)' : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle(confidence)}`} />
      <span className="capitalize">{confidence}</span>
    </button>
  );
};
