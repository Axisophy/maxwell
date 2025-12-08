'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Home, Eye, Wrench, Database, BookOpen, Sparkles } from 'lucide-react'

// Navigation items with submenus where applicable
const navItems = [
  { 
    href: '/observe', 
    label: 'Observe', 
    icon: Eye, 
    matchPaths: ['/observe'],
    submenu: [
      { href: '/observe/the-pulse', label: 'The Pulse' },
      { href: '/observe/your-dashboard', label: 'Your Dashboard' },
    ]
  },
  { 
    href: '/tools', 
    label: 'Tools', 
    icon: Wrench, 
    matchPaths: ['/tools'],
    submenu: null
  },
  { 
    href: '/data', 
    label: 'Data', 
    icon: Database, 
    matchPaths: ['/data'],
    submenu: null
  },
  { 
    href: '/vault', 
    label: 'Vault', 
    icon: BookOpen, 
    matchPaths: ['/vault'],
    submenu: null
  },
  { 
    href: '/play', 
    label: 'Play', 
    icon: Sparkles, 
    matchPaths: ['/play'],
    submenu: null
  },
]

export default function MobileNav() {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Close submenu when navigating
  useEffect(() => {
    setOpenSubmenu(null)
  }, [pathname])

  const isActive = (item: typeof navItems[0]) => {
    return item.matchPaths.some(path => pathname?.startsWith(path))
  }

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    // If item has submenu, toggle it instead of navigating
    if (item.submenu && item.submenu.length > 0) {
      e.preventDefault()
      setOpenSubmenu(openSubmenu === item.href ? null : item.href)
    }
  }

  const closeSubmenu = () => setOpenSubmenu(null)

  const activeItem = navItems.find(item => item.href === openSubmenu)

  return (
    <>
      {/* Backdrop when submenu is open */}
      {openSubmenu && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={closeSubmenu}
        />
      )}

      {/* Submenu panel - slides up from bottom nav */}
      {openSubmenu && activeItem?.submenu && (
        <div 
          className="fixed bottom-16 left-0 right-0 z-50 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="mx-4 mb-2 bg-white rounded-xl shadow-lg border border-border-light overflow-hidden">
            {/* Section header - links to section landing */}
            <Link
              href={activeItem.href}
              onClick={closeSubmenu}
              className="block px-4 py-3 border-b border-border-light bg-gray-50"
            >
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                {activeItem.label}
              </span>
            </Link>
            
            {/* Submenu items */}
            {activeItem.submenu.map((subitem) => {
              const isSubActive = pathname === subitem.href
              return (
                <Link
                  key={subitem.href}
                  href={subitem.href}
                  onClick={closeSubmenu}
                  className={`
                    block px-4 py-3 
                    ${isSubActive ? 'bg-gray-50 text-text-primary font-medium' : 'text-text-primary'}
                    active:bg-gray-100
                  `}
                >
                  {subitem.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Main nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div 
          className="bg-shell-light border-t border-border-light"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center h-16">
            {/* Home button - slightly narrower */}
            <Link
              href="/"
              className={`
                flex flex-col items-center justify-center 
                w-14 h-full
                transition-colors
                ${pathname === '/' ? 'text-text-primary' : 'text-text-muted'}
              `}
            >
              <Home 
                className="w-5 h-5 mb-1" 
                strokeWidth={pathname === '/' ? 2 : 1.5}
              />
              <span className="text-[10px] font-medium">Home</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-8 bg-border-light" />

            {/* Section items */}
            <div className="flex-1 flex items-center justify-around">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item)
                const hasSubmenu = item.submenu && item.submenu.length > 0
                const isOpen = openSubmenu === item.href
                
                // Items with submenus are buttons, others are links
                if (hasSubmenu) {
                  return (
                    <button
                      key={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className={`
                        flex flex-col items-center justify-center 
                        h-full px-3
                        transition-colors
                        ${active || isOpen ? 'text-text-primary' : 'text-text-muted'}
                      `}
                    >
                      <Icon 
                        className="w-5 h-5 mb-1" 
                        strokeWidth={active || isOpen ? 2 : 1.5}
                      />
                      <span className="text-[10px] font-medium">
                        {item.label}
                      </span>
                    </button>
                  )
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex flex-col items-center justify-center 
                      h-full px-3
                      transition-colors
                      ${active ? 'text-text-primary' : 'text-text-muted'}
                    `}
                  >
                    <Icon 
                      className="w-5 h-5 mb-1" 
                      strokeWidth={active ? 2 : 1.5}
                    />
                    <span className="text-[10px] font-medium">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}