'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const observeSubmenu = [
  { href: '/', label: 'Living Dashboard', active: true },
  { href: '#', label: 'Scale Navigator', active: false },
  { href: '#', label: 'Time Machine', active: false },
  { href: '#', label: 'Conversational Entry', active: false },
  { href: '#', label: 'Observatory', active: false },
  { href: '#', label: 'Follow the Energy', active: false },
  { href: '#', label: 'Question Wall', active: false },
]

const navItems = [
  { href: '/observe', label: 'observe' },
  { href: '/tools', label: 'tools' },
  { href: '/play', label: 'play' },
  { href: '/about', label: 'about' },
  { href: '/store', label: 'store' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full px-12 lg:px-16 py-8 border-b border-[var(--widget-border)]">
      <div className="grid grid-cols-8 items-start">
        {/* Col 1: Logo + tagline */}
        <div className="col-span-1">
          <Link href="/" className="hover:text-[#e6007e] transition-colors block">
            <Logo className="h-10 w-auto" />
            <span className="text-base text-black tracking-wide mt-2 block font-normal">a digital laboratory</span>
            </Link>
        </div>

        {/* Col 2: Empty */}
        <div className="col-span-1" />

        {/* Cols 3-7: Navigation */}
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/') || (item.href === '/observe' && pathname === '/')
          const isObserve = item.href === '/observe'
          
          return (
            <div key={item.href} className="col-span-1">
              <Link
                href={item.href}
                className="text-4xl font-light tracking-wide text-black hover:text-[#e6007e] transition-colors block"
              >
                {item.label}
              </Link>
              
              {/* Submenu items under OBSERVE */}
              {isObserve && (
                <div className="mt-4 space-y-1">
                  {observeSubmenu.map((subItem) => (
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
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Col 8: Account */}
        <div className="col-span-1 text-right">
          <Link 
            href="/account" 
            className="text-4xl font-light tracking-wide text-black hover:text-[#e6007e] transition-colors"
          >
            sign in
          </Link>
        </div>
      </div>
    </header>
  )
}