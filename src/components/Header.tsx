'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Logo from './Logo'

const navItems = [
  { href: '/observe', label: 'observe' },
  { href: '/pulse', label: 'pulse' },
  { href: '/tools', label: 'tools' },
  { href: '/data', label: 'data' },
  { href: '/vault', label: 'vault' },
  { href: '/play', label: 'play' },
]

// Submenus - using category names for DATA
const observeSubmenu = [
  { href: '/observe', label: 'Living Dashboard', active: true },
  { href: '/observe/vital-signs', label: 'Vital Signs', active: true },
  { href: '/observe/space', label: 'Space', active: true },
  { href: '/observe/earth', label: 'Earth', active: true },
  { href: '/observe/your-dashboard', label: 'Your Dashboard', active: true },
]

const pulseSubmenu = [
  { href: '/pulse', label: 'Latest', active: false },
  { href: '#', label: 'Partner Highlights', active: false },
  { href: '#', label: 'Archive', active: false },
]

const toolsSubmenu = [
  { href: '#', label: 'Calculate', active: false },
  { href: '#', label: 'Measure', active: false },
  { href: '#', label: 'Explore', active: false },
]

// Data submenu
const dataSubmenu = [
  { href: '/data/elements', label: 'Elements', active: true },
  { href: '/data/particles', label: 'Particles', active: true },
  { href: '/data/constants', label: 'Constants', active: true },
  { href: '/data/spectrum', label: 'Spectrum', active: true },
  { href: '/data/earth', label: 'Earth', active: true },
  { href: '/data/solar-system', label: 'Solar System', active: true },
  { href: '/data/time', label: 'Time', active: true },
]

const vaultSubmenu = [
  { href: '/vault/ancient', label: 'Ancient', active: true },
  { href: '/vault/renaissance', label: 'Renaissance', active: true },
  { href: '/vault/modern', label: 'Modern', active: true },
  { href: '/vault/scientific-fiction', label: 'Scientific Fiction', active: true },
  { href: '/vault/paths', label: 'Reading Paths', active: true },
]

const playSubmenu = [
  { href: '/play/attractors', label: 'Attractors', active: true },
  { href: '/play/fractals', label: 'Fractals', active: true },
  { href: '/play/patterns', label: 'Patterns', active: true },
  { href: '/play/games', label: 'Games', active: true },
]

// Map nav items to their submenus
const submenus: Record<string, typeof observeSubmenu> = {
  '/observe': observeSubmenu,
  '/pulse': pulseSubmenu,
  '/tools': toolsSubmenu,
  '/data': dataSubmenu,
  '/vault': vaultSubmenu,
  '/play': playSubmenu,
}

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="hidden md:block w-full px-4 md:px-8 lg:px-12 py-6 border-b border-black/10 bg-white">
      <div className="grid grid-cols-12 items-start">
        {/* Logo + tagline: cols 1-2 */}
        <div className="col-span-2">
          <Link href="/" className="block group">
            <Logo className="h-14 w-auto text-black" />
            <span className="text-xs text-black/60 tracking-wide mt-1 block">
              a digital laboratory
            </span>
          </Link>
        </div>

        {/* Navigation: cols 3-10 */}
        <div className="col-span-8 flex items-start gap-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(item.href + '/')

            const submenu = submenus[item.href]

            return (
              <div key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`text-xl font-light tracking-wide cursor-pointer block leading-none ${
                    isActive ? 'text-black' : 'text-black'
                  }`}
                >
                  {item.label}
                </Link>

                {/* Submenu */}
                {submenu && (
                  <div className="mt-3 space-y-0.5">
                    {submenu.map((subItem) =>
                      subItem.active ? (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className={`block text-sm cursor-pointer ${
                            pathname === subItem.href
                              ? 'text-black font-medium'
                              : 'text-black'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <span
                          key={subItem.label}
                          className="block text-sm text-black/40"
                        >
                          {subItem.label}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Auth: cols 11-12 */}
        <div className="col-span-2 flex justify-end items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm text-black/60 hover:text-black transition-colors cursor-pointer">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/account"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Account
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
