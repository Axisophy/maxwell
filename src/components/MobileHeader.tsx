'use client'

import Link from 'next/link'
import Logo from './Logo'
import { Search, User } from 'lucide-react'

export default function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
      {/* Safe area for notched phones */}
      <div className="bg-shell-light" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 h-14 border-b border-border-light">
          {/* Logo - tap to go home */}
          <Link href="/" className="flex items-center">
            <Logo className="h-6 w-auto" />
          </Link>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -m-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-text-primary" strokeWidth={1.5} />
            </button>
            
            <button 
              className="p-2 -m-2"
              aria-label="Account"
            >
              <User className="w-5 h-5 text-text-primary" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}