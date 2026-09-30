'use client';

import React from 'react';
import { ConfidenceLevel } from '@/types';
import { TriangleAlert, Minus, CircleCheck } from 'lucide-react';

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
  const getBadgeConfig = (level: ConfidenceLevel) => {
    switch (level) {
      case 'weak':
        return {
          style: 'bg-[#FEE4E2] text-[#B42318] border-[#FECDCA] hover:bg-[#FECDCA]',
          icon: <TriangleAlert className="w-4 h-4 shrink-0 text-[#B42318]" aria-hidden="true" />,
          label: 'Weak',
        };
      case 'medium':
        return {
          style: 'bg-[#FEF0C7] text-[#93370D] border-[#FEDF89] hover:bg-[#FEDF89]',
          icon: <Minus className="w-4 h-4 shrink-0 text-[#93370D]" aria-hidden="true" />,
          label: 'Medium',
        };
      case 'solid':
        return {
          style: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0] hover:bg-[#BBF7D0]',
          icon: <CircleCheck className="w-4 h-4 shrink-0 text-[#166534]" aria-hidden="true" />,
          label: 'Solid',
        };
    }
  };

  const config = getBadgeConfig(confidence);

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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold tracking-tight transition-all shadow-2xs ${
        config.style
      } ${interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
      title={interactive ? 'Click to cycle state (Weak → Medium → Solid)' : undefined}
    >
      {config.icon}
      <span>{config.label}</span>
    </button>
  );
};
