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
    disabled: false,
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
    disabled: false,
    submenu: []
  },
  {
    href: '/tools',
    label: 'Tools',
    icon: ToolsIcon,
    matchPaths: ['/tools'],
    disabled: true,
    submenu: []
  },
  {
    href: '/data',
    label: 'Data',
    icon: DataIcon,
    matchPaths: ['/data'],
    disabled: false,
    submenu: [
      { href: '/data/fabric', label: 'The Fabric' },
      { href: '/data/elements', label: 'Elements' },
      { href: '/data/life', label: 'Life' },
      { href: '/data/earth', label: 'Earth' },
      { href: '/data/cosmos', label: 'The Cosmos' },
      { href: '/data/mathematics', label: 'Mathematics' },
    ]
  },
  {
    href: '/vault',
    label: 'Vault',
    icon: VaultIcon,
    matchPaths: ['/vault'],
    disabled: false,
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
    disabled: false,
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
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
      >

        {/* Expanded submenu panel - above main nav */}
        {openSubmenu && activeItem && (
          <div className="bg-white rounded-lg mb-px overflow-hidden">
            {/* Section header with icon */}
            <Link
              href={activeItem.href}
              onClick={closeSubmenu}
              className="flex items-center gap-3 p-2"
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
                        block px-2 py-1.5 pl-[52px] text-xs
                        ${isSubActive ? 'text-black font-medium' : 'text-black'}
                        active:bg-black/5
                      `}
                    >
                      <span className="uppercase">{subitem.label}</span>
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
                px-2 py-1 mx-1 rounded-lg
                ${pathname === '/' ? 'bg-black text-white' : 'text-black'}
              `}
            >
              <HomeIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-medium uppercase">Home</span>
            </Link>

            {/* Section items */}
            <div className="flex-1 flex items-center justify-around">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item)
                const isOpen = openSubmenu === item.href

                if (item.disabled) {
                  return (
                    <div
                      key={item.href}
                      className="flex flex-col items-center justify-center px-2 py-1 rounded-lg text-black/30"
                    >
                      <Icon className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px] font-medium uppercase">
                        {item.label}
                      </span>
                    </div>
                  )
                }

                return (
                  <button
                    key={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`
                      flex flex-col items-center justify-center
                      px-2 py-1 rounded-lg
                      ${active || isOpen ? 'bg-black text-white' : 'text-black'}
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
