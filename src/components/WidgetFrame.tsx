'use client';

import { useState, ReactNode } from 'react';
import { Info } from 'lucide-react'; // TODO: Replace with custom MXWLL info icon

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

  const statusColors = {
    live: 'bg-green-500',
    ok: 'bg-green-500',
    loading: 'bg-amber-500',
    error: 'bg-red-500',
  };

  const showPulse = status === 'live';

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Widget Frame - white rounded box */}
      <div className="bg-white rounded-lg overflow-hidden">

        {/* Header row - title, status dot, info icon */}
        <div className="px-2 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <span className="text-sm md:text-base font-medium text-black uppercase">
            {title}
          </span>
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
              {showPulse && (
                <div className={`absolute inset-0 w-2 h-2 rounded-full ${statusColors[status]} animate-ping opacity-75`} />
              )}
            </div>
            {/* Info button - TODO: Replace with custom MXWLL info icon */}
            {(description || source) && (
              <button
                onClick={() => setInfoOpen(!infoOpen)}
                className={`p-1 rounded transition-opacity ${
                  infoOpen ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                }`}
                aria-label="Toggle info panel"
              >
                <Info size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Widget content area */}
        <div>
          {children}
        </div>
      </div>

      {/* Info Panel - black rounded box below widget (when expanded) */}
      {infoOpen && (description || source) && (
        <div className="bg-black rounded-lg p-2 md:p-4 mt-px">
          {description && (
            <p className="text-sm text-white/70 leading-relaxed">
              {description}
            </p>
          )}
          {source && (
            <div className={description ? 'mt-3 pt-3 border-t border-white/10' : ''}>
              <span className="text-[10px] md:text-xs font-medium text-white/40 uppercase tracking-wider">
                Source
              </span>
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-white mt-1 hover:text-white/80 transition-colors"
                >
                  {source}
                </a>
              ) : (
                <p className="text-sm text-white mt-1">{source}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
