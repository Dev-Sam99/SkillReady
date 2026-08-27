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
        return 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25';
      case 'solid':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getLabel = (level: ConfidenceLevel) => {
    switch (level) {
      case 'weak':
        return '🔴 Weak';
      case 'medium':
        return '🟡 Medium';
      case 'solid':
        return '🟢 Solid';
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
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${getBadgeStyle(
        confidence
      )} ${interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
      title={interactive ? 'Click to cycle confidence level (Weak -> Medium -> Solid)' : undefined}
    >
      {getLabel(confidence)}
    </button>
  );
};
