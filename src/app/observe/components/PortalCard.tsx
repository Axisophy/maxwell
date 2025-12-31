import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface PortalCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export default function PortalCard({ title, description, href, icon: Icon }: PortalCardProps) {
  return (
    <Link
      href={href}
      className="block p-5 md:p-6 bg-white rounded-xl border border-transparent hover:border-black transition-colors"
    >
      <Icon size={24} className="text-black/40 mb-3" strokeWidth={1.5} />
      <h2 className="text-lg md:text-xl font-light text-black mb-1">
        {title}
      </h2>
      <p className="text-sm text-black/50">
        {description}
      </p>
    </Link>
  )
}
