'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { HomeIcon, ObserveIcon, PulseIcon, ToolsIcon, DataIcon, VaultIcon, PlayIcon } from '@/components/icons'

// Navigation items with submenus where applicable
const navItems = [
  {
    href: '/observe',
    label: 'Observe',
    icon: ObserveIcon,
    matchPaths: ['/observe'],
    submenu: [
      { href: '/observe/dashboard', label: 'Dashboard' },
      { href: '/observe/space', label: 'Space' },
      { href: '/observe/earth', label: 'Earth' },
      { href: '/observe/life', label: 'Life' },
      { href: '/observe/infrastructure', label: 'Infrastructure' },
      { href: '/observe/detectors', label: 'Detectors' },
    ]
  },
  {
    href: '/pulse',
    label: 'Pulse',
    icon: PulseIcon,
    matchPaths: ['/pulse'],
    submenu: []
  },
  {
    href: '/tools',
    label: 'Tools',
    icon: ToolsIcon,
    matchPaths: ['/tools'],
    submenu: []
  },
  {
    href: '/data',
    label: 'Data',
    icon: DataIcon,
    matchPaths: ['/data'],
    submenu: [
      { href: '/data/elements', label: 'Elements' },
      { href: '/data/particles', label: 'Particles' },
      { href: '/data/constants', label: 'Constants' },
      { href: '/data/spectrum', label: 'Spectrum' },
      { href: '/data/earth', label: 'Earth' },
      { href: '/data/solar-system', label: 'Solar System' },
    ]
  },
  {
    href: '/vault',
    label: 'Vault',
    icon: VaultIcon,
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
    icon: PlayIcon,
    matchPaths: ['/play'],
    submenu: [
      { href: '/play/attractors', label: 'Attractors' },
      { href: '/play/fractals', label: 'Fractals' },
      { href: '/play/patterns', label: 'Patterns' },
      { href: '/play/games', label: 'Games' },
    ]
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
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSubmenu}
        />
      )}

      {/* Mobile nav container - fixed at bottom with padding */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-2 pb-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
      >

        {/* Expanded submenu panel - above main nav */}
        {openSubmenu && activeItem && (
          <div className="bg-white rounded-lg mb-px overflow-hidden">
            {/* Section header with icon */}
            <Link
              href={activeItem.href}
              onClick={closeSubmenu}
              className="flex items-center gap-3 p-2 border-b border-black/10"
            >
              <activeItem.icon className="w-8 h-8 text-black" />
              <span className="text-lg font-light text-black uppercase">
                {activeItem.label}
              </span>
            </Link>

            {/* Submenu items */}
            {activeItem.submenu && activeItem.submenu.length > 0 && (
              <div className="max-h-[40vh] overflow-y-auto">
                {activeItem.submenu.map((subitem) => {
                  const isSubActive = pathname === subitem.href
                  return (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      onClick={closeSubmenu}
                      className={`
                        block px-2 py-2 pl-[52px]
                        ${isSubActive ? 'bg-black/5 text-black font-medium' : 'text-black/60'}
                        active:bg-black/10
                      `}
                    >
                      {subitem.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Main nav bar - white frame */}
        <div className="bg-white rounded-lg">
          <div className="flex items-center h-14">
            {/* Home button */}
            <Link
              href="/"
              onClick={closeSubmenu}
              className={`
                flex flex-col items-center justify-center
                w-14 h-full
                ${pathname === '/' ? 'text-black' : 'text-black/50'}
              `}
            >
              <HomeIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-medium uppercase">Home</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-8 bg-black/10" />

            {/* Section items */}
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
                      h-full px-1
                      ${active || isOpen ? 'text-black' : 'text-black/50'}
                    `}
                  >
                    <Icon className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-medium uppercase">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
