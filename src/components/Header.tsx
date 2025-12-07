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
  { href: '/knowledge', label: 'knowledge' },
  { href: '/play', label: 'play' },
]

const observeSubmenu = [
  { href: '/', label: 'Your Dashboard', active: true },
  { href: '#', label: 'Scale Navigator', active: false },
  { href: '#', label: 'Ask Maxwell', active: false },
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

const knowledgeSubmenu = [
  { href: '/knowledge?era=ancient', label: 'Ancient', active: true },
  { href: '/knowledge?era=renaissance', label: 'Renaissance', active: true },
  { href: '/knowledge?era=modern', label: 'Modern', active: true },
]

// Map nav items to their submenus
const submenus: Record<string, typeof observeSubmenu> = {
  '/observe': observeSubmenu,
  '/tools': toolsSubmenu,
  '/data': dataSubmenu,
  '/knowledge': knowledgeSubmenu,
}

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full px-8 lg:px-12 py-8 border-b border-[var(--widget-border)]">
      <div className="grid grid-cols-12 items-start">
        {/* Logo + tagline: cols 1-2 */}
        <div className="col-span-2">
          <Link href="/" className="hover:text-[#e6007e] transition-colors block">
            <Logo className="h-7 w-auto" />
            <span className="text-sm text-black tracking-wide mt-1.5 block font-normal">
              a digital laboratory
            </span>
          </Link>
        </div>

        {/* Navigation: cols 3-10 */}
        <div className="col-span-8 flex items-start">
          {navItems.map((item) => {
            const isObserve = item.href === '/observe'
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(item.href + '/') ||
              (isObserve && pathname === '/')

            const submenu = submenus[item.href]

            return (
              <div key={item.href} className="flex-1">
                <Link
                  href={isObserve ? '/' : item.href}
                  className="text-2xl font-light tracking-wide text-black hover:text-[#e6007e] transition-colors block"
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
                          className="block text-sm text-black hover:text-[#e6007e] transition-colors font-normal"
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <span
                          key={subItem.label}
                          className="block text-sm text-[var(--text-muted)] font-normal"
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
                className="block text-sm text-[var(--text-muted)] hover:text-[#e6007e] transition-colors font-normal"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile hamburger stub */}
      <button className="hidden" aria-label="Menu">
        {/* TODO: implement mobile nav */}
      </button>
    </header>
  )
}