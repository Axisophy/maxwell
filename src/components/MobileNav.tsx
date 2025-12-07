'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Eye, Wrench, Database, BookOpen, Sparkles } from 'lucide-react'

// Navigation items with placeholder icons (will be custom pictograms later)
const navItems = [
  { href: '/', label: 'Observe', icon: Eye, matchPaths: ['/', '/observe'] },
  { href: '/tools', label: 'Tools', icon: Wrench, matchPaths: ['/tools'] },
  { href: '/data', label: 'Data', icon: Database, matchPaths: ['/data'] },
  { href: '/vault', label: 'vault', icon: BookOpen, matchPaths: ['/vault'] },
  { href: '/play', label: 'Play', icon: Sparkles, matchPaths: ['/play'] },
]

export default function MobileNav() {
  const pathname = usePathname()

  const isActive = (item: typeof navItems[0]) => {
    return item.matchPaths.some(path => 
      path === '/' ? pathname === '/' : pathname?.startsWith(path)
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div 
        className="bg-shell-light border-t border-border-light"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center 
                  w-full h-full
                  transition-colors
                  ${active ? 'text-text-primary' : 'text-text-muted'}
                `}
              >
                <Icon 
                  className="w-5 h-5 mb-1" 
                  strokeWidth={active ? 2 : 1.5}
                  fill={active ? 'currentColor' : 'none'}
                />
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}