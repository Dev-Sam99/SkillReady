import React from 'react';

export const SkillReadyLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Hexagon / Terminal Shield */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
      >
        <path
          d="M16 2L28 8.9282V23.0718L16 30L4 23.0718V8.9282L16 2Z"
          className="stroke-current stroke-[1.8] fill-emerald-500/10"
        />
        {/* Terminal Bracket + Checkmark Icon inside */}
        <path
          d="M10 13L13.5 16.5L22 10"
          className="stroke-emerald-400 stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
        />
        <path
          d="M10 21H22"
          className="stroke-emerald-500/60 stroke-[2] stroke-linecap-round"
        />
      </svg>
    </div>
  );
};
