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
import { ObserveIcon, PulseIcon, ToolsIcon, DataIcon, VaultIcon, PlayIcon } from '@/components/icons'

const navItems = [
  { href: '/observe', label: 'Observe', icon: ObserveIcon },
  { href: '/pulse', label: 'Pulse', icon: PulseIcon },
  { href: '/tools', label: 'Tools', icon: ToolsIcon },
  { href: '/data', label: 'Data', icon: DataIcon },
  { href: '/vault', label: 'Vault', icon: VaultIcon },
  { href: '/play', label: 'Play', icon: PlayIcon },
]

// Submenus - using category names for DATA
const observeSubmenu = [
  { href: '/observe/dashboard', label: 'Dashboard', active: true },
  { href: '/observe/space', label: 'Space', active: true },
  { href: '/observe/earth', label: 'Earth', active: true },
  { href: '/observe/life', label: 'Life', active: true },
  { href: '/observe/infrastructure', label: 'Infrastructure', active: true },
  { href: '/observe/detectors', label: 'Detectors', active: true },
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

// Data submenu - section landing pages
const dataSubmenu = [
  { href: '/data/fabric', label: 'The Fabric', active: true },
  { href: '/data/elements', label: 'Elements', active: true },
  { href: '/data/life', label: 'Life', active: true },
  { href: '/data/earth', label: 'Earth', active: true },
  { href: '/data/cosmos', label: 'The Cosmos', active: true },
  { href: '/data/mathematics', label: 'Mathematics', active: true },
  { href: '/data/society', label: 'Society', active: false },
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
    <header className="hidden md:block w-full px-4 py-6 bg-black">
      <div className="grid grid-cols-12 items-start">
        {/* Logo + tagline: cols 1-2 */}
        <div className="col-span-2">
          <Link href="/" className="block group">
            <Logo className="h-14 w-auto text-white" />
            <span className="text-xs text-white/60 tracking-wide mt-1 block">
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

            const Icon = item.icon

            return (
              <div key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-light tracking-wider uppercase cursor-pointer leading-none ${
                    isActive ? 'text-white' : 'text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
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
                          className={`block text-xs cursor-pointer uppercase ${
                            pathname === subItem.href
                              ? 'text-white font-medium'
                              : 'text-white/60'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <span
                          key={subItem.label}
                          className="block text-xs text-white/40 uppercase"
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
              <button className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer uppercase">
                Sign In / Register
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/account"
              className="text-sm text-white/60 hover:text-white transition-colors"
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
