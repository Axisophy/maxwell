'use client'

import Link from 'next/link'
import Logo from './Logo'
import { ObserveIcon, PulseIcon, ToolsIcon, DataIcon, VaultIcon, PlayIcon, CloseIcon } from '@/components/icons'
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
  { href: '/observe', label: 'Observe', icon: ObserveIcon, disabled: false },
  { href: '/pulse', label: 'Pulse', icon: PulseIcon, disabled: false },
  { href: '/tools', label: 'Tools', icon: ToolsIcon, disabled: true },
  { href: '/data', label: 'Data', icon: DataIcon, disabled: false },
  { href: '/vault', label: 'Vault', icon: VaultIcon, disabled: false },
  { href: '/play', label: 'Play', icon: PlayIcon, disabled: false },
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
      <div className="flex items-center justify-between px-2 h-14">
        <Logo className="h-8 w-auto text-white" />
        <button
          onClick={onClose}
          className="p-2 -m-2"
          aria-label="Close menu"
        >
          <CloseIcon size={20} className="text-white" />
        </button>
      </div>

      {/* Scrollable content */}
      <div
        className="overflow-y-auto px-2"
        style={{
          height: 'calc(100vh - 56px - env(safe-area-inset-top))',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        {/* Frames container */}
        <div className="flex flex-col gap-px">

          {/* Auth frame */}
          <div className="bg-white rounded-lg">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  onClick={onClose}
                  className="w-full p-3 text-left text-sm font-medium text-black uppercase"
                >
                  Sign In / Register
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center justify-between p-3"
              >
                <span className="text-sm font-medium text-black uppercase">Your Account</span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    },
                  }}
                />
              </Link>
            </SignedIn>
          </div>

          {/* Main Navigation frame */}
          <div className="bg-white rounded-lg overflow-hidden">
            {mainSections.map((section) => {
              const Icon = section.icon
              if (section.disabled) {
                return (
                  <div
                    key={section.href}
                    className="flex items-center gap-3 p-3"
                  >
                    <Icon className="w-6 h-6 text-black/30" />
                    <span className="text-sm font-medium text-black/30 uppercase">
                      {section.label}
                    </span>
                  </div>
                )
              }
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3"
                >
                  <Icon className="w-6 h-6 text-black" />
                  <span className="text-sm font-medium text-black uppercase">
                    {section.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Secondary Links frame */}
          <div className="bg-white rounded-lg overflow-hidden">
            {secondaryLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block p-3"
              >
                <span className="text-sm font-medium text-black uppercase">
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
