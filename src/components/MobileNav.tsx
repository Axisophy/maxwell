'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Home, Eye, Radio, Wrench, Database, BookOpen, Sparkles } from 'lucide-react'

// Navigation items with submenus where applicable
const navItems = [
  { 
    href: '/observe', 
    label: 'Observe', 
    icon: Eye, 
    matchPaths: ['/observe'],
    submenu: [
      { href: '/observe/vital-signs', label: 'Vital Signs' },
      { href: '/observe/dashboard', label: 'Dashboard' },
      { href: '/observe/moon', label: 'Lunar Atlas' },
    ]
  },
  { 
    href: '/pulse', 
    label: 'Pulse', 
    icon: Radio, 
    matchPaths: ['/pulse'],
    submenu: []
  },
  { 
    href: '/tools', 
    label: 'Tools', 
    icon: Wrench, 
    matchPaths: ['/tools'],
    submenu: []
  },
  {
    href: '/data',
    label: 'Data',
    icon: Database,
    matchPaths: ['/data'],
    submenu: [
      { href: '/data#cosmos', label: 'The Cosmos' },
      { href: '/data#matter', label: 'Matter' },
      { href: '/data#life', label: 'Life' },
      { href: '/data#earth', label: 'Earth' },
      { href: '/data#mathematics', label: 'Mathematics' },
      { href: '/data#tools', label: 'Tools' },
      { href: '/data#deep-sky', label: 'Deep Sky' },
    ]
  },
  { 
    href: '/vault', 
    label: 'Vault', 
    icon: BookOpen, 
    matchPaths: ['/vault'],
    submenu: [
      { href: '/vault/ancient', label: 'Ancient' },
      { href: '/vault/renaissance', label: 'Renaissance' },
      { href: '/vault/modern', label: 'Modern' },
      { href: '/vault/scientific-fiction', label: 'Scientific Fiction' },
      { href: '/vault/paths', label: 'Reading Paths' },
    ]
  },
  { 
    href: '/play', 
    label: 'Play', 
    icon: Sparkles, 
    matchPaths: ['/play'],
    submenu: []
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
    e.preventDefault()
    // If item has submenu, toggle it. Otherwise navigate directly.
    if (item.submenu && item.submenu.length > 0) {
      setOpenSubmenu(openSubmenu === item.href ? null : item.href)
    } else {
      // Navigate directly for items without submenus
      window.location.href = item.href
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

      {/* Submenu panel - seamless with bottom nav */}
      {openSubmenu && activeItem && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="bg-white border-t border-border-light">
            {/* Section header - links to section landing */}
            <Link
              href={activeItem.href}
              onClick={closeSubmenu}
              className="flex items-center gap-3 px-4 py-4 border-b border-border-light"
            >
              <activeItem.icon className="w-5 h-5 text-text-primary" strokeWidth={1.5} />
              <span className="text-lg font-medium text-text-primary">
                {activeItem.label}
              </span>
            </Link>
            
            {/* Submenu items */}
            {activeItem.submenu && activeItem.submenu.length > 0 && (
              <div className="border-b border-border-light">
                {activeItem.submenu.map((subitem) => {
                  const isSubActive = pathname === subitem.href
                  return (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      onClick={closeSubmenu}
                      className={`
                        block px-4 py-3 pl-12
                        ${isSubActive ? 'bg-gray-50 text-text-primary font-medium' : 'text-text-muted'}
                        active:bg-gray-100
                      `}
                    >
                      {subitem.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Nav bar integrated below */}
          <div 
            className="bg-shell-light border-t border-border-light"
          >
            <div className="flex items-center h-16">
              {/* Home button - slightly narrower */}
              <Link
                href="/"
                onClick={closeSubmenu}
                className={`
                  flex flex-col items-center justify-center 
                  w-12 h-full
                  transition-colors
                  ${pathname === '/' ? 'text-text-primary' : 'text-text-muted'}
                `}
              >
                <Home 
                  className="w-5 h-5 mb-1" 
                  strokeWidth={pathname === '/' ? 2 : 1.5}
                />
                <span className="text-[9px] font-medium">Home</span>
              </Link>

              {/* Divider */}
              <div className="w-px h-8 bg-border-light" />

              {/* Section items - 6 items now */}
              <div className="flex-1 flex items-center justify-around">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item)
                  const isOpen = openSubmenu === item.href
                  
                  return (
                    <button
                      key={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className={`
                        flex flex-col items-center justify-center 
                        h-full px-2
                        transition-colors
                        ${active || isOpen ? 'text-text-primary' : 'text-text-muted'}
                      `}
                    >
                      <Icon 
                        className="w-5 h-5 mb-1" 
                        strokeWidth={active || isOpen ? 2 : 1.5}
                      />
                      <span className="text-[9px] font-medium">
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main nav bar - only show when no submenu open */}
      {!openSubmenu && (
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
                  w-12 h-full
                  transition-colors
                  ${pathname === '/' ? 'text-text-primary' : 'text-text-muted'}
                `}
              >
                <Home 
                  className="w-5 h-5 mb-1" 
                  strokeWidth={pathname === '/' ? 2 : 1.5}
                />
                <span className="text-[9px] font-medium">Home</span>
              </Link>

              {/* Divider */}
              <div className="w-px h-8 bg-border-light" />

              {/* Section items - 6 items now */}
              <div className="flex-1 flex items-center justify-around">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item)
                  
                  return (
                    <button
                      key={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className={`
                        flex flex-col items-center justify-center 
                        h-full px-2
                        transition-colors
                        ${active ? 'text-text-primary' : 'text-text-muted'}
                      `}
                    >
                      <Icon 
                        className="w-5 h-5 mb-1" 
                        strokeWidth={active ? 2 : 1.5}
                      />
                      <span className="text-[9px] font-medium">
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  )
}