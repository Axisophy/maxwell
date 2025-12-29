'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Info } from 'lucide-react';

interface WidgetFrameProps {
  title: string;
  status?: 'live' | 'loading' | 'error' | 'ok';
  description?: string;
  source?: string;
  sourceUrl?: string;
  children: ReactNode;
  className?: string;
}

export default function WidgetFrame({
  title,
  status = 'ok',
  description,
  source,
  sourceUrl,
  children,
  className = '',
}: WidgetFrameProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [baseFontSize, setBaseFontSize] = useState(16);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive scaling based on container width
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setBaseFontSize(Math.max(12, Math.min(18, width / 25)));
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const statusColors = {
    live: 'bg-green-500',
    ok: 'bg-green-500',
    loading: 'bg-amber-500',
    error: 'bg-red-500',
  };

  const showPulse = status === 'live';

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col ${className}`}
      style={{ fontSize: `${baseFontSize}px` }}
    >
      {/* Widget Frame (Header) */}
      <div 
        className={`bg-[#e5e5e5] px-[1em] py-[0.75em] flex items-center justify-between ${
          infoOpen ? 'rounded-t-[0.75em]' : 'rounded-[0.75em]'
        }`}
      >
        <span className="text-[1.125em] font-normal text-black leading-tight">
          {title}
        </span>
        <div className="flex items-center gap-[0.75em]">
          {/* Status indicator */}
          <div className="relative">
            <div className={`w-[0.5em] h-[0.5em] rounded-full ${statusColors[status]}`} />
            {showPulse && (
              <div className={`absolute inset-0 w-[0.5em] h-[0.5em] rounded-full ${statusColors[status]} animate-ping opacity-75`} />
            )}
          </div>
          {/* Info button */}
          {(description || source) && (
            <button
              onClick={() => setInfoOpen(!infoOpen)}
              className={`p-[0.25em] rounded transition-opacity ${
                infoOpen ? 'opacity-100' : 'opacity-40 hover:opacity-100'
              }`}
              aria-label="Toggle info panel"
            >
              <Info size={baseFontSize * 1.25} />
            </button>
          )}
        </div>
      </div>

      {/* Info Panel (when expanded) */}
      {infoOpen && (description || source) && (
        <div className="bg-[#e5e5e5] px-[1em] pb-[1em] border-t border-[#d0d0d0] rounded-b-[0.75em]">
          {description && (
            <p className="text-[0.875em] text-black/70 mt-[0.75em] leading-relaxed">
              {description}
            </p>
          )}
          {source && (
            <div className="mt-[0.75em] pt-[0.75em] border-t border-[#d0d0d0]">
              <span className="text-[0.75em] font-medium text-black/40 uppercase tracking-wider">
                Source
              </span>
              {sourceUrl ? (
                <a 
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[0.875em] text-black mt-[0.25em] hover:text-[#e6007e] transition-colors"
                >
                  {source}
                </a>
              ) : (
                <p className="text-[0.875em] text-black mt-[0.25em]">{source}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Widget Content - with border for better definition against page background */}
      <div className="bg-white rounded-[0.75em] border border-[#e5e5e5] mt-[0.5em] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
