'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  icon,
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const sortedOptions = React.useMemo(() => {
    if (!value || value === 'all') return options;
    const selected = options.find((o) => o.value === value);
    if (!selected) return options;
    return [selected, ...options.filter((o) => o.value !== value)];
  }, [options, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white hover:bg-[#F5FAF4] border-2 border-[#D9E4D0] hover:border-[#2F5D3A] rounded-xl shadow-xs text-[#1F2D1F] text-xs font-extrabold transition-all focus:outline-none focus:ring-2 focus:ring-[#2F5D3A] cursor-pointer min-h-[42px] ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {icon && <span className="text-[#2F5D3A] shrink-0 flex items-center">{icon}</span>}
          {!icon && selectedOption?.icon && (
            <span className="shrink-0 flex items-center">{selectedOption.icon}</span>
          )}
          <span className={`truncate text-left ${!selectedOption ? 'text-slate-500 font-medium' : 'text-[#1F2D1F] font-extrabold'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2F5D3A]' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border-2 border-[#D9E4D0] rounded-xl shadow-xl overflow-hidden animate-fadeIn p-1 space-y-1 max-h-60 overflow-y-auto ${dropdownClassName}`}>
          {sortedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left font-sans rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2F5D3A] text-white font-extrabold shadow-xs'
                    : 'text-[#1F2D1F] font-bold hover:bg-[#EAF3EB] hover:text-[#2F5D3A]'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {opt.icon && <span className="shrink-0 flex items-center">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected ? (
                  <Check className="w-4 h-4 flex-shrink-0 ml-1.5 text-white" />
                ) : opt.badge !== undefined ? (
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#EAF3EB] text-[#2F5D3A]">
                    {opt.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
