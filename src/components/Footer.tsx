import Link from 'next/link'
import Logo from './Logo'

const footerLinks = {
  explore: [
    { href: '/observe', label: 'Observe' },
    { href: '/tools', label: 'Tools' },
    { href: '/data', label: 'Data' },
    { href: '/vault', label: 'Vault' },
    { href: '/play', label: 'Play' },
  ],
  about: [
    { href: '/about', label: 'About MXWLL' },
    { href: '/about/contact', label: 'Contact' },
    { href: '/collaborations', label: 'Collaborations' },
    { href: '/newsletter', label: 'Newsletter' },
  ],
  partners: [
    { href: '/about/partnerships', label: 'Institutions' },
    { href: '/about/investment', label: 'Investors' },
    { href: '/about/advertising', label: 'Advertising' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="hidden md:block w-full px-4 md:px-8 lg:px-12 py-12 border-t border-black/10 bg-white">
      <div className="grid grid-cols-12 gap-8">
        {/* Brand - cols 1-3 */}
        <div className="col-span-3">
          <Logo className="h-7 w-auto mb-3 text-black" />
          <p className="text-sm text-black/50 leading-relaxed">
            A digital laboratory for looking at science. Live data, interactive tools, and 2,500 years of scientific texts — beautifully presented.
          </p>
        </div>

        {/* Spacer - col 4 */}
        <div className="col-span-1" />

        {/* Links - cols 5-12 */}
        <div className="col-span-8 grid grid-cols-4 gap-8">
          {/* Explore */}
          <div>
            <h4 className="text-xs font-medium text-black uppercase tracking-wider mb-4">
              Explore
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.explore.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-black/50 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-medium text-black uppercase tracking-wider mb-4">
              About
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.about.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-black/50 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-xs font-medium text-black uppercase tracking-wider mb-4">
              Partners
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.partners.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-black/50 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-medium text-black uppercase tracking-wider mb-4">
              Legal
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-black/50 hover:text-black transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-6 border-t border-black/10">
        <p className="text-xs text-black/40">
          © {new Date().getFullYear()} MXWLL. All rights reserved.
        </p>
      </div>
    </footer>
  )
}