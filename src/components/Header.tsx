'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const utilityItems = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/store', label: 'Store' },
  { href: '/signin', label: 'Sign In' },
]

const navItems = [
  { href: '/observe', label: 'observe' },
  { href: '/tools', label: 'tools' },
  { href: '/data', label: 'data' },
  { href: '/vault', label: 'vault' },
  { href: '/play', label: 'play' },
]

// Submenus
const observeSubmenu = [
  { href: '/observe/the-pulse', label: 'The Pulse', active: true },
  { href: '/observe/your-dashboard', label: 'Your Dashboard', active: true },
]

const toolsSubmenu = [
  { href: '#', label: 'Calculate', active: false },
  { href: '#', label: 'Measure', active: false },
  { href: '#', label: 'Explore', active: false },
]

const dataSubmenu = [
  { href: '#', label: 'Elements & Atoms', active: false },
  { href: '#', label: 'Life', active: false },
  { href: '#', label: 'Earth & Time', active: false },
  { href: '#', label: 'Space', active: false },
  { href: '#', label: 'Visualizations', active: false },
]

const vaultSubmenu = [
  { href: '/vault/ancient', label: 'Ancient', active: true },
  { href: '/vault/renaissance', label: 'Renaissance', active: true },
  { href: '/vault/modern', label: 'Modern', active: true },
  { href: '/vault/scientific-fiction', label: 'Scientific Fiction', active: true },
  { href: '/vault/paths', label: 'Reading Paths', active: true },
]

const playSubmenu = [
  { href: '#', label: 'Games', active: false },
  { href: '#', label: 'Simulations', active: false },
]

// Map nav items to their submenus
const submenus: Record<string, typeof observeSubmenu> = {
  '/observe': observeSubmenu,
  '/tools': toolsSubmenu,
  '/data': dataSubmenu,
  '/vault': vaultSubmenu,
  '/play': playSubmenu,
}

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="hidden md:block w-full px-8 lg:px-12 py-8 border-b border-border-light bg-shell-light">
      <div className="grid grid-cols-12 items-start">
        {/* Logo + tagline: cols 1-2 */}
        <div className="col-span-2">
          <Link href="/" className="block group">
            <Logo className="h-7 w-auto" />
            <span className="text-sm text-text-primary tracking-wide mt-1.5 block font-sans">
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
                  className={`text-nav font-sans-display font-light tracking-wide cursor-pointer block ${
                    isActive ? 'text-text-primary' : 'text-text-primary'
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
                          className={`block text-sm cursor-pointer font-sans ${
                            pathname === subItem.href 
                              ? 'text-text-primary font-medium' 
                              : 'text-text-primary'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <span
                          key={subItem.label}
                          className="block text-sm text-text-muted font-sans"
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

        {/* Utility column: cols 11-12 */}
        <div className="col-span-2 text-right">
          <div className="mt-3 space-y-0.5">
            {utilityItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-text-muted cursor-pointer font-sans"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}