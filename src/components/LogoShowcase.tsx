'use client';

import React from 'react';

export type Concept3CStyleId = 'deep-sky' | 'obsidian-emerald' | 'glass-pill' | 'outline' | 'indigo-white';

interface Concept3CShowcaseProps {
  activeVariant: Concept3CStyleId;
  onSelectVariant: (variantId: Concept3CStyleId) => void;
}

{/* 3C-1: Deep Navy & Sky Accent */}
export const Concept3C1DeepSkySVG: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`} aria-hidden="true">
    <rect width="52" height="52" rx="14" fill="#E6F3FE" />
    {/* Deep Blue Terminal Container */}
    <rect x="7" y="8" width="38" height="34" rx="9" fill="#1B6FC2" stroke="#2F9BEA" strokeWidth="1.5" />
    {/* Sky Blue Control Dots */}
    <circle cx="13" cy="14" r="2" fill="#9FD3FA" />
    <circle cx="19" cy="14" r="2" fill="#9FD3FA" opacity="0.6" />
    <circle cx="25" cy="14" r="2" fill="#9FD3FA" opacity="0.3" />
    <line x1="7" y1="19" x2="45" y2="19" stroke="#9FD3FA" strokeWidth="1" opacity="0.4" />
    {/* Code Prompt >_ */}
    <path d="M13 26L17 29L13 32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="20" y1="32" x2="26" y2="32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    {/* Sky Blue Checkmark Badge */}
    <circle cx="37" cy="34" r="8.5" fill="#2F9BEA" stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M33.5 34L36 36.5L40.5 31.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

{/* 3C-2: Obsidian & Electric Emerald */}
export const Concept3C2ObsidianSVG: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`} aria-hidden="true">
    <rect width="52" height="52" rx="14" fill="#0F172A" />
    {/* Dark Obsidian Terminal Container */}
    <rect x="7" y="8" width="38" height="34" rx="9" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
    {/* Colored Control Dots */}
    <circle cx="13" cy="14" r="2" fill="#EF4444" />
    <circle cx="19" cy="14" r="2" fill="#F59E0B" />
    <circle cx="25" cy="14" r="2" fill="#10B981" />
    <line x1="7" y1="19" x2="45" y2="19" stroke="#334155" strokeWidth="1" />
    {/* Electric Emerald Prompt >_ */}
    <path d="M13 26L17 29L13 32" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="20" y1="32" x2="26" y2="32" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
    {/* Emerald Checkmark Badge */}
    <circle cx="37" cy="34" r="8.5" fill="#10B981" stroke="#0F172A" strokeWidth="2.5" />
    <path d="M33.5 34L36 36.5L40.5 31.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

{/* 3C-3: Glass Pill Terminal */}
export const Concept3C3GlassPillSVG: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`} aria-hidden="true">
    <defs>
      <linearGradient id="glassPillGrad" x1="4" y1="4" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2F9BEA" />
        <stop offset="1" stopColor="#1B6FC2" />
      </linearGradient>
    </defs>
    <rect width="52" height="52" rx="14" fill="url(#glassPillGrad)" />
    {/* Semi-transparent Glass Terminal Box */}
    <rect x="7" y="8" width="38" height="34" rx="10" fill="#FFFFFF" fillOpacity="0.2" stroke="#FFFFFF" strokeWidth="2" />
    {/* Control Dots */}
    <circle cx="13" cy="14" r="2" fill="#FFFFFF" />
    <circle cx="19" cy="14" r="2" fill="#FFFFFF" opacity="0.6" />
    <circle cx="25" cy="14" r="2" fill="#FFFFFF" opacity="0.3" />
    <line x1="7" y1="19" x2="45" y2="19" stroke="#FFFFFF" strokeWidth="1" opacity="0.3" />
    {/* White Code Prompt >_ */}
    <path d="M13 26L17 29L13 32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="20" y1="32" x2="26" y2="32" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    {/* Floating Solid White Checkmark Badge */}
    <circle cx="37" cy="34" r="8.5" fill="#FFFFFF" />
    <path d="M33.5 34L36 36.5L40.5 31.5" stroke="#1B6FC2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

{/* 3C-4: Minimalist Line Art */}
export const Concept3C4OutlineSVG: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`} aria-hidden="true">
    <rect width="52" height="52" rx="14" fill="#FFFFFF" stroke="#D5E3F1" strokeWidth="2" />
    {/* Outline Terminal Container */}
    <rect x="7" y="8" width="38" height="34" rx="9" fill="#E6F3FE" stroke="#1B6FC2" strokeWidth="2.5" />
    {/* Control Dots */}
    <circle cx="13" cy="14" r="2" fill="#1B6FC2" />
    <circle cx="19" cy="14" r="2" fill="#1B6FC2" opacity="0.5" />
    <circle cx="25" cy="14" r="2" fill="#1B6FC2" opacity="0.2" />
    <line x1="7" y1="19" x2="45" y2="19" stroke="#1B6FC2" strokeWidth="1.5" opacity="0.3" />
    {/* Prompt >_ */}
    <path d="M13 26L17 29L13 32" stroke="#1B6FC2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="20" y1="32" x2="26" y2="32" stroke="#1B6FC2" strokeWidth="2.5" strokeLinecap="round" />
    {/* Badge */}
    <circle cx="37" cy="34" r="8.5" fill="#1B6FC2" />
    <path d="M33.5 34L36 36.5L40.5 31.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

{/* 3C-5: Indigo & White Header Format */}
export const Concept3C5IndigoSVG: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`} aria-hidden="true">
    <rect width="52" height="52" rx="14" fill="#EEF2FF" />
    {/* White Terminal Body with Indigo Header */}
    <rect x="7" y="8" width="38" height="34" rx="9" fill="#FFFFFF" stroke="#C7D2FE" strokeWidth="2" />
    <path d="M7 17C7 12 9 8 16 8H36C43 8 45 12 45 17V19H7V17Z" fill="#4F46E5" />
    {/* Control Dots */}
    <circle cx="13" cy="13.5" r="2" fill="#FFFFFF" />
    <circle cx="19" cy="13.5" r="2" fill="#FFFFFF" opacity="0.6" />
    <circle cx="25" cy="13.5" r="2" fill="#FFFFFF" opacity="0.3" />
    {/* Code Prompt >_ */}
    <path d="M13 26L17 29L13 32" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="20" y1="32" x2="26" y2="32" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
    {/* Indigo Checkmark Badge */}
    <circle cx="37" cy="34" r="8.5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M33.5 34L36 36.5L40.5 31.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Concept3Showcase: React.FC<Concept3CShowcaseProps> = ({
  activeVariant,
  onSelectVariant,
}) => {
  const styles = [
    {
      id: 'deep-sky' as Concept3CStyleId,
      name: 'Option 3C-1: Deep Navy & Sky Accent',
      desc: 'Deep blue terminal container with cyan controls & sky blue check badge',
      component: <Concept3C1DeepSkySVG size={52} />,
    },
    {
      id: 'obsidian-emerald' as Concept3CStyleId,
      name: 'Option 3C-2: Obsidian & Emerald',
      desc: 'Dark IDE terminal with electric green prompt & emerald check badge',
      component: <Concept3C2ObsidianSVG size={52} />,
    },
    {
      id: 'glass-pill' as Concept3CStyleId,
      name: 'Option 3C-3: Glass Pill & White Badge',
      desc: 'Gradient glass terminal background with white prompt & crisp white check badge',
      component: <Concept3C3GlassPillSVG size={52} />,
    },
    {
      id: 'outline' as Concept3CStyleId,
      name: 'Option 3C-4: Minimalist Line Art',
      desc: 'Clean white vector frame with sky tint body & deep blue prompt',
      component: <Concept3C4OutlineSVG size={52} />,
    },
    {
      id: 'indigo-white' as Concept3CStyleId,
      name: 'Option 3C-5: Indigo Header & White Body',
      desc: 'Indigo CLI title bar with white code body & indigo readiness badge',
      component: <Concept3C5IndigoSVG size={52} />,
    },
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/95 shadow-glass space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tint text-deep text-xs font-semibold mb-1">
            <span>💻 Terminal Logo (Concept 3C) Styling Options</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-ink">
            Compare Concept 3C Color & Format Variations
          </h2>
          <p className="text-sm font-medium text-slate">
            Click any color/format variation to preview it live in the header and app!
          </p>
        </div>
      </div>

      {/* Grid of 5 Concept 3C Styling Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles.map((item) => {
          const isSelected = activeVariant === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectVariant(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                isSelected
                  ? 'bg-white border-deep shadow-md ring-2 ring-deep ring-offset-2'
                  : 'bg-white/80 hover:bg-white border-line hover:border-deep/40 shadow-2xs'
              }`}
            >
              <div className="shrink-0">{item.component}</div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-base text-ink truncate">
                    {item.name}
                  </h3>
                  {isSelected && (
                    <span className="px-2.5 py-0.5 rounded-full bg-deep text-white text-xs font-semibold shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate font-medium leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
