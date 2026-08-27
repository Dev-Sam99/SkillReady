import React from 'react';

export const SkillReadyWordmark: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Editorial Minimal Hexagon Checkmark Logo */}
      <div className="w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center text-white shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="font-serif-display text-lg font-semibold tracking-tight text-stone-900">
        SkillReady
      </span>
    </div>
  );
};
