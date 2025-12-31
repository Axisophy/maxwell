import Link from 'next/link'

interface PortalCardProps {
  title: string
  description: string
  href: string
}

export default function PortalCard({ title, description, href }: PortalCardProps) {
  return (
    <Link
      href={href}
      className="block p-4 bg-black rounded-lg border border-white/10 hover:border-white/30 transition-colors"
    >
      <h2 className="text-2xl md:text-3xl font-light text-white uppercase mb-2">
        {title}
      </h2>
      <p className="text-sm text-white/50">
        {description}
      </p>
    </Link>
  )
}
