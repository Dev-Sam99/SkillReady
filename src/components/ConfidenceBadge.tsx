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
        return 'bg-red-500/10 text-red-400 border-red-500/25 hover:bg-red-500/20 hover:border-red-500/40';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25 hover:bg-amber-500/20 hover:border-amber-500/40';
      case 'solid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/40';
      default:
        return 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60';
    }
  };

  const getLabel = (level: ConfidenceLevel) => {
    switch (level) {
      case 'weak':
        return 'NEEDS WORK';
      case 'medium':
        return 'PRACTICING';
      case 'solid':
        return 'MASTERED';
    }
  };

  const getDotColor = (level: ConfidenceLevel) => {
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold tracking-wider border uppercase transition-all duration-150 ${getBadgeStyle(
        confidence
      )} ${interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
      title={interactive ? 'Click to cycle state (Weak -> Medium -> Solid)' : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(confidence)} animate-pulse`} />
      <span>{getLabel(confidence)}</span>
    </button>
  );
};
