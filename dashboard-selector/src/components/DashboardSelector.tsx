'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check, Lock } from 'lucide-react'
import { PUBLIC_SETS, getSetById, getDefaultSet, type WidgetSet } from '@/lib/dashboard/widget-sets'
import { getSelectedSetId, setSelectedSetId } from '@/lib/dashboard/storage'

interface DashboardSelectorProps {
  onSetChange: (setId: string) => void;
  isRegistered?: boolean; // For future Clerk integration
}

export default function DashboardSelector({ onSetChange, isRegistered = false }: DashboardSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSetId, setSelectedSetIdState] = useState<string>('default')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Available sets based on registration status
  // For now, all sets are public. Later, slice or filter for registered users.
  const availableSets = PUBLIC_SETS

  // Load saved selection on mount
  useEffect(() => {
    const savedSetId = getSelectedSetId()
    // Validate that the saved set exists
    const isValidSet = availableSets.some(set => set.id === savedSetId)
    const initialSetId = isValidSet ? savedSetId : 'default'
    setSelectedSetIdState(initialSetId)
    onSetChange(initialSetId)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const selectedSet = getSetById(selectedSetId) || getDefaultSet()

  const handleSelect = (setId: string) => {
    setSelectedSetIdState(setId)
    setSelectedSetId(setId) // Save to localStorage
    onSetChange(setId)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white rounded-xl border border-black/10 hover:border-black/20 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-medium text-black/40 uppercase tracking-wider">
            Viewing
          </span>
          <span className="text-base font-medium text-black">
            {selectedSet.name}
          </span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-black/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-black/10 shadow-lg overflow-hidden z-50"
          role="listbox"
        >
          {/* Available sets */}
          <div className="py-1">
            {availableSets.map((set) => (
              <button
                key={set.id}
                onClick={() => handleSelect(set.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.03] transition-colors ${
                  selectedSetId === set.id ? 'bg-black/[0.02]' : ''
                }`}
                role="option"
                aria-selected={selectedSetId === set.id}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {selectedSetId === set.id && (
                    <Check className="w-4 h-4 text-black" strokeWidth={2} />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-black">
                    {set.name}
                  </div>
                  <div className="text-xs text-black/50 truncate">
                    {set.description}
                  </div>
                </div>
                <span className="text-xs font-mono text-black/30 flex-shrink-0">
                  {set.widgets.length}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-black/10" />

          {/* Registration prompt (for unregistered users) */}
          {!isRegistered && (
            <div className="px-4 py-3 bg-black/[0.02]">
              <a 
                href="/sign-up"
                className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors"
              >
                <Lock className="w-4 h-4 flex-shrink-0" />
                <span>
                  Register for more widgets and custom dashboards
                </span>
              </a>
            </div>
          )}

          {/* Custom dashboard option (for registered users - future) */}
          {isRegistered && (
            <div className="px-4 py-3 bg-black/[0.02]">
              <button 
                className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors w-full text-left"
                onClick={() => {
                  // Future: Open widget picker modal
                  console.log('Open custom dashboard builder')
                  setIsOpen(false)
                }}
              >
                <span className="text-lg leading-none">+</span>
                <span>Create custom dashboard</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
