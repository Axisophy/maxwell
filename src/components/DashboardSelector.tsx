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
  const availableSets = PUBLIC_SETS

  // Load saved selection on mount
  useEffect(() => {
    const savedSetId = getSelectedSetId()
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
    setSelectedSetId(setId)
    onSetChange(setId)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button - black with white text */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-2 md:px-4 py-2 md:py-3 bg-black rounded-lg hover:bg-neutral-900 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm md:text-base font-medium text-white uppercase">
          {selectedSet.name}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-px bg-black rounded-lg overflow-hidden z-50"
          role="listbox"
        >
          {/* Available sets */}
          <div className="flex flex-col gap-px bg-white/10">
            {availableSets.map((set) => (
              <button
                key={set.id}
                onClick={() => handleSelect(set.id)}
                className={`w-full flex items-center gap-3 px-2 md:px-4 py-2 md:py-3 bg-black hover:bg-neutral-900 transition-colors ${
                  selectedSetId === set.id ? 'bg-neutral-900' : ''
                }`}
                role="option"
                aria-selected={selectedSetId === set.id}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {selectedSetId === set.id && (
                    <Check className="w-4 h-4 text-white" strokeWidth={2} />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-white uppercase">
                    {set.name}
                  </div>
                  <div className="text-xs text-white/50 truncate">
                    {set.description}
                  </div>
                </div>
                <span className="text-xs font-mono text-white/30 flex-shrink-0">
                  {set.widgets.length}
                </span>
              </button>
            ))}
          </div>

          {/* Registration prompt (for unregistered users) */}
          {!isRegistered && (
            <div className="mt-px">
              <a
                href="/sign-up"
                className="flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 bg-black hover:bg-neutral-900 transition-colors text-sm text-white/50 hover:text-white"
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
            <div className="mt-px">
              <button
                className="flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 bg-black hover:bg-neutral-900 transition-colors text-sm text-white/50 hover:text-white w-full text-left"
                onClick={() => {
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
