import Link from 'next/link'

const footerLinks = {
  main: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/press', label: 'Press' },
  ],
  connect: [
    { href: '/collaborations', label: 'Collaborations' },
    { href: '/education', label: 'Education' },
    { href: '/newsletter', label: 'Newsletter' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="w-full px-12 lg:px-16 py-8 border-t border-[var(--widget-border)]">
      <div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">MAXWELL</span>
            <span className="text-xs text-[var(--text-secondary)]">
              A digital laboratory for looking at science
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              {footerLinks.main.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {footerLinks.connect.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-[var(--widget-border)]">
          <span className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} MAXWELL
          </span>
        </div>
      </div>
    </footer>
  )
}
