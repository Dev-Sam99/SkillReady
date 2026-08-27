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
        return 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100/60';
      case 'medium':
        return 'bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100/60';
      case 'solid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/60';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getLabel = (level: ConfidenceLevel) => {
    switch (level) {
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'solid':
        return 'Solid';
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-all ${getBadgeStyle(
        confidence
      )} ${interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
      title={interactive ? 'Click to cycle state (Weak -> Medium -> Solid)' : undefined}
    >
      <span>{getLabel(confidence)}</span>
    </button>
  );
};
