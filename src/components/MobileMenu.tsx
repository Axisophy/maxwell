'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import Logo from './Logo'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const mainSections = [
  { href: '/observe', label: 'Observe' },
  { href: '/pulse', label: 'Pulse' },
  { href: '/tools', label: 'Tools' },
  { href: '/data', label: 'Data' },
  { href: '/vault', label: 'Vault' },
  { href: '/play', label: 'Play' },
]

const secondaryLinks = [
  { href: '/about', label: 'About' },
  { href: '/about/contact', label: 'Contact' },
  { href: '/collaborations', label: 'Collaborations' },
  { href: '/about/partnerships', label: 'Partnerships' },
  { href: '/about/investment', label: 'Investment' },
  { href: '/store', label: 'Store' },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black md:hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
        <Logo className="h-8 w-auto text-white" />
        <button 
          onClick={onClose}
          className="p-2 -m-2"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-white" strokeWidth={1.5} />
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
        {/* Auth buttons */}
        <div className="px-4 py-6 border-b border-white/10">
          <SignedOut>
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-white/10 text-white text-center text-sm font-medium rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-white/10 text-white text-center text-sm font-medium rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                >
                  Register
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10',
                    },
                  }}
                />
                <span className="text-sm text-white">Your Account</span>
              </div>
              <Link
                href="/account"
                onClick={onClose}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Settings
              </Link>
            </div>
          </SignedIn>
        </div>

        {/* Main Navigation - THE STARS */}
        <div className="px-4 py-8 border-b border-white/10">
          <div className="flex flex-col gap-1">
            {mainSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                onClick={onClose}
                className="group py-2"
              >
                <span className="text-4xl font-light text-white group-hover:text-[#e6007e] transition-colors">
                  {section.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary Links */}
        <div className="px-4 py-8">
          <div className="flex flex-col gap-1">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="group py-2"
              >
                <span className="text-2xl font-light text-white group-hover:text-[#e6007e] transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}