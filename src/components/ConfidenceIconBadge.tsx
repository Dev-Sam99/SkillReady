'use client';

import React from 'react';
import { ConfidenceLevel } from '@/types';
import { BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

interface ConfidenceIconBadgeProps {
  confidence: ConfidenceLevel;
  className?: string;
}

export const ConfidenceIconBadge: React.FC<ConfidenceIconBadgeProps> = ({
  confidence,
  className = '',
}) => {
  const getConfig = (level: ConfidenceLevel) => {
    switch (level) {
      case 'weak':
        return {
          bg: 'bg-[#FBE5E0] text-[#C2412D]',
          icon: <BatteryLow className="w-5 h-5" aria-hidden="true" />,
          label: 'Weak Concept',
          tooltip: 'Weak Concept — Needs review',
        };
      case 'medium':
        return {
          bg: 'bg-[#FBEFD2] text-[#B7791F]',
          icon: <BatteryMedium className="w-5 h-5" aria-hidden="true" />,
          label: 'Medium Concept',
          tooltip: 'Medium Concept',
        };
      case 'solid':
        return {
          bg: 'bg-[#DDF1E5] text-[#2E8B57]',
          icon: <BatteryFull className="w-5 h-5" aria-hidden="true" />,
          label: 'Solid Concept',
          tooltip: 'Solid Concept — Mastered!',
        };
    }
  };

  const config = getConfig(confidence);

  return (
    <div
      role="img"
      aria-label={config.label}
      title={config.tooltip}
      className={`w-8 h-8 rounded-full shrink-0 inline-flex items-center justify-center ${config.bg} ${className}`}
    >
      {config.icon}
    </div>
  );
};
