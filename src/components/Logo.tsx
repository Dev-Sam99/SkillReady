import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGlassPillGrad" x1="4" y1="4" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F9BEA" />
          <stop offset="1" stopColor="#1B6FC2" />
        </linearGradient>
      </defs>
      {/* Sky Glass Gradient Outer Container */}
      <rect width="52" height="52" rx="14" fill="url(#logoGlassPillGrad)" />

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
};
