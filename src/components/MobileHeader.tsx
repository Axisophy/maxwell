'use client'

import Link from 'next/link'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        {/* Safe area for notched phones */}
        <div className="bg-shell-light" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center justify-between px-4 h-14 border-b border-border-light">
            {/* Logo - tap to go home */}
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>

            {/* Menu button */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -m-2"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-text-primary" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  )
}