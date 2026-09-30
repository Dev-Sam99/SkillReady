'use client';

import React from 'react';
import { ConfidenceLevel } from '@/types';
import { TriangleAlert, Minus, CircleCheck } from 'lucide-react';

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
          bg: 'bg-[#FEE4E2] text-[#B42318]',
          icon: <TriangleAlert className="w-5 h-5" strokeWidth={2} aria-hidden="true" />,
          label: 'Weak',
        };
      case 'medium':
        return {
          bg: 'bg-[#FEF0C7] text-[#93370D]',
          icon: <Minus className="w-5 h-5" strokeWidth={2} aria-hidden="true" />,
          label: 'Medium',
        };
      case 'solid':
        return {
          bg: 'bg-[#DCFCE7] text-[#166534]',
          icon: <CircleCheck className="w-5 h-5" strokeWidth={2} aria-hidden="true" />,
          label: 'Solid',
        };
    }
  };

  const config = getConfig(confidence);

  return (
    <div
      role="img"
      aria-label={config.label}
      title={config.label}
      className={`w-8 h-8 rounded-full shrink-0 inline-flex items-center justify-center ${config.bg} ${className}`}
    >
      {config.icon}
    </div>
  );
};
