'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/observe', label: 'OBSERVE' },
  { href: '/tools', label: 'TOOLS' },
  { href: '/play', label: 'PLAY' },
  { href: '/about', label: 'ABOUT' },
  { href: '/shop', label: 'SHOP' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[var(--widget-border)]">
      {/* Logo */}
      <Link href="/" className="text-lg font-medium tracking-tight hover:opacity-70 transition-opacity">
        MAXWELL
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-wide transition-opacity ${
                isActive 
                  ? 'opacity-100' 
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
