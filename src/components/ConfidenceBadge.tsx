'use client';

import React from 'react';
import { ConfidenceLevel } from '@/types';
import { BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

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
      case 'weak': {
        return {
          style: 'bg-[#FBE5E0] text-[#C2412D] border-[#FBE5E0] hover:bg-[#F8D4CE]',
          icon: <BatteryLow className="w-4 h-4 shrink-0 text-[#C2412D]" aria-hidden="true" />,
          label: 'Weak',
          tooltip: 'Weak Concept — Needs review',
        };
      }
      case 'medium': {
        return {
          style: 'bg-[#FBEFD2] text-[#B7791F] border-[#FBEFD2] hover:bg-[#F8E5BA]',
          icon: <BatteryMedium className="w-4 h-4 shrink-0 text-[#B7791F]" aria-hidden="true" />,
          label: 'Medium',
          tooltip: 'Medium Concept',
        };
      }
      case 'solid': {
        return {
          style: 'bg-[#DDF1E5] text-[#2E8B57] border-[#DDF1E5] hover:bg-[#CBEAD6]',
          icon: <BatteryFull className="w-4 h-4 shrink-0 text-[#2E8B57]" aria-hidden="true" />,
          label: 'Solid',
          tooltip: 'Solid Concept — Mastered!',
        };
      }
    }
  };

  const config = getBadgeConfig(confidence);
  const fullTitle = interactive ? `${config.tooltip}\nClick to cycle level (Weak → Medium → Solid)` : config.tooltip;

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
      title={fullTitle}
    >
      {config.icon}
      <span>{config.label}</span>
    </button>
  );
};
