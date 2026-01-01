'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useEffect, useState } from 'react'
import { ObserveIcon, PulseIcon, ToolsIcon, DataIcon, VaultIcon, PlayIcon } from '@/components/icons'

const exploreLinks = [
  { href: '/observe', label: 'Observe', icon: ObserveIcon },
  { href: '/pulse', label: 'Pulse', icon: PulseIcon },
  { href: '/tools', label: 'Tools', icon: ToolsIcon },
  { href: '/data', label: 'Data', icon: DataIcon },
  { href: '/vault', label: 'Vault', icon: VaultIcon },
  { href: '/play', label: 'Play', icon: PlayIcon },
]

const aboutLinks = [
  { href: '/about', label: 'About MXWLL' },
  { href: '/about/contact', label: 'Contact' },
  { href: '/collaborations', label: 'Collaborations' },
]

const partnersLinks = [
  { href: '/about/partnerships', label: 'Institutions' },
  { href: '/about/investment', label: 'Investors' },
  { href: '/about/advertising', label: 'Advertising' },
  { href: '/store', label: 'Store' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

export default function Footer() {
  const [utcTime, setUtcTime] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const updateTime = () => {
      const now = new Date()
      setUtcTime(
        now.toISOString().slice(11, 19) + ' UTC'
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="hidden md:block w-full bg-black">
      {/* Main footer content */}
      <div className="px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-12 gap-8">
          {/* Brand - cols 1-4 */}
          <div className="col-span-4">
            <Logo className="w-[80%] h-auto mb-6 text-white" />
            <p className="text-lg font-light text-white/80 leading-relaxed mb-6 max-w-sm">
              A digital laboratory for looking at science.
            </p>
            <p className="text-sm text-white/40 leading-relaxed max-w-sm">
              Live data, interactive tools, and 2,500 years of scientific texts - beautifully presented.
            </p>
          </div>

          {/* Spacer - col 5 */}
          <div className="col-span-1" />

          {/* Links - cols 6-12 */}
          <div className="col-span-7 grid grid-cols-4 gap-8">
            {/* Explore - with icons */}
            <div>
              <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                Explore
              </h4>
              <div className="flex flex-col gap-2">
                {exploreLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors uppercase"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* About */}
            <div>
              <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                About
              </h4>
              <div className="flex flex-col gap-2">
                {aboutLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors uppercase"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div>
              <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                Partners
              </h4>
              <div className="flex flex-col gap-2">
                {partnersLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors uppercase"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <div className="flex flex-col gap-2">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors uppercase"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar with live time */}
      <div className="px-4 md:px-8 lg:px-12 py-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40 uppercase">
            © {new Date().getFullYear()} MXWLL. All rights reserved.
          </p>

          {/* Live UTC time */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-white/60">
              {isClient ? utcTime : '00:00:00 UTC'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
