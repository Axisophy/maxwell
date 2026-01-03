'use client';

import React from 'react';

export interface Lens {
  id: string;
  label: string;
  description?: string;
}

interface LensBarProps {
  lenses: Lens[];
  active: string;
  onChange: (id: string) => void;
  variant?: 'light' | 'dark';
  className?: string;
}

export default function LensBar({ 
  lenses, 
  active, 
  onChange, 
  variant = 'light',
  className = '' 
}: LensBarProps) {
  if (variant === 'dark') {
    return (
      <div className={`flex flex-wrap gap-px ${className}`}>
        {lenses.map((lens) => (
          <button
            key={lens.id}
            onClick={() => onChange(lens.id)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase tracking-wide
              ${active === lens.id
                ? 'bg-[#ffdf20] text-[#404040]'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'
              }
            `}
            title={lens.description}
          >
            {lens.label}
          </button>
        ))}
      </div>
    );
  }

  // Light variant (for white backgrounds)
  return (
    <div className={`flex flex-wrap gap-px ${className}`}>
      {lenses.map((lens) => (
        <button
          key={lens.id}
          onClick={() => onChange(lens.id)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase tracking-wide
            ${active === lens.id
              ? 'bg-black text-white'
              : 'bg-black/5 text-black/60 hover:text-black hover:bg-black/10'
            }
          `}
          title={lens.description}
        >
          {lens.label}
        </button>
      ))}
    </div>
  );
}

// Dropdown variant for when there are sub-options
interface LensDropdownProps {
  label: string;
  options: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  variant?: 'light' | 'dark';
}

export function LensDropdown({
  label,
  options,
  active,
  onChange,
  isOpen,
  onToggle,
  variant = 'light',
}: LensDropdownProps) {
  const activeOption = options.find(o => o.id === active);
  const isActive = options.some(o => o.id === active);

  if (variant === 'dark') {
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase tracking-wide
            flex items-center gap-1
            ${isActive
              ? 'bg-[#ffdf20] text-[#404040]'
              : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'
            }
          `}
        >
          {activeOption ? activeOption.label : label}
          <svg 
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-[#1d1d1d] rounded-lg shadow-xl border border-white/10 overflow-hidden z-50 min-w-[160px]">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  onToggle();
                }}
                className={`
                  w-full px-3 py-2 text-xs text-left transition-colors
                  ${active === option.id
                    ? 'bg-[#ffdf20] text-[#404040]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Light variant
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`
          px-3 py-1.5 text-xs font-medium rounded-lg transition-colors uppercase tracking-wide
          flex items-center gap-1
          ${isActive
            ? 'bg-black text-white'
            : 'bg-black/5 text-black/60 hover:text-black hover:bg-black/10'
          }
        `}
      >
        {activeOption ? activeOption.label : label}
        <svg 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-black/10 overflow-hidden z-50 min-w-[160px]">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                onToggle();
              }}
              className={`
                w-full px-3 py-2 text-xs text-left transition-colors
                ${active === option.id
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
