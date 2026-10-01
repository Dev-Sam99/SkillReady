import React from 'react';
import { Logo } from './Logo';

export const SkillReadyWordmark: React.FC<{
  className?: string;
  logoSize?: number;
  showTagline?: boolean;
}> = ({ className = '', logoSize = 40, showTagline = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={logoSize} />
      <div className="flex flex-col justify-center">
        <span className="font-display font-extrabold text-xl sm:text-2xl tracking-[0.01em] text-[#1F2D1F] leading-none">
          SkillReady
        </span>
        {showTagline && (
          <span className="text-[11px] font-semibold text-[#566656] font-sans mt-0.5 tracking-wide hidden sm:block">
            Master Every Technical Interview — One Concept at a Time
          </span>
        )}
      </div>
    </div>
  );
};
