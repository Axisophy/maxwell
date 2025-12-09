'use client'

import Link from 'next/link'
import { X, Search } from 'lucide-react'
import { useState } from 'react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuSections = {
  explore: {
    title: 'Explore',
    links: [
      { href: '/observe', label: 'Observe' },
      { href: '/tools', label: 'Tools' },
      { href: '/data', label: 'Data' },
      { href: '/vault', label: 'Vault' },
      { href: '/play', label: 'Play' },
    ],
  },
  about: {
    title: 'About',
    links: [
      { href: '/about', label: 'About MXWLL' },
      { href: '/about/contact', label: 'Contact' },
      { href: '/collaborations', label: 'Collaborations' },
      { href: '/newsletter', label: 'Newsletter' },
    ],
  },
  partners: {
    title: 'Partners',
    links: [
      { href: '/about/partnerships', label: 'Institutions' },
      { href: '/about/investment', label: 'Investors' },
      { href: '/about/advertising', label: 'Advertising' },
      { href: '/store', label: 'Store' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Search for:', searchQuery)
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-[60] bg-white md:hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-black/10">
        <span className="text-sm font-medium text-black">Menu</span>
        <button 
          onClick={onClose}
          className="p-2 -m-2"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-black" strokeWidth={1.5} />
        </button>
      </div>

      {/* Scrollable content */}
      <div 
        className="overflow-y-auto"
        style={{ 
          height: 'calc(100vh - 56px - env(safe-area-inset-top))',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        {/* Search */}
        <div className="px-4 py-6 border-b border-black/10">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search MXWLL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-100 rounded-lg text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>
          </form>
        </div>

        {/* Account section */}
        <div className="px-4 py-6 border-b border-black/10">
          <div className="flex gap-3">
            <Link
              href="/signin"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-black text-white text-center text-sm font-medium rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-neutral-100 text-black text-center text-sm font-medium rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Link sections */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {Object.values(menuSections).map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-medium text-black/50 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="text-sm text-black"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-black/10">
          <p className="text-xs text-black/40">
            © {new Date().getFullYear()} MXWLL. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}