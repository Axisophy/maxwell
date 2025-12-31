import Link from 'next/link'

interface KeyNumberProps {
  value: string          // Pre-formatted, may include HTML for superscripts
  unit: string
  context: string
  href: string
}

export default function KeyNumber({ value, unit, context, href }: KeyNumberProps) {
  return (
    <Link
      href={href}
      className="block p-4 md:p-6 text-center hover:bg-white rounded-xl transition-colors group"
    >
      {/* Number - using dangerouslySetInnerHTML for superscripts in scientific notation */}
      <div
        className="text-3xl md:text-4xl lg:text-5xl font-light font-mono tracking-tight text-black"
        dangerouslySetInnerHTML={{ __html: value }}
      />

      {/* Unit / label */}
      <div className="text-sm md:text-base text-black/50 uppercase tracking-wider mt-2">
        {unit}
      </div>

      {/* Context */}
      <div className="text-xs md:text-sm text-black/40 mt-1">
        {context}
      </div>

      {/* Hover indicator */}
      <div className="text-xs text-black/30 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        Explore →
      </div>
    </Link>
  )
}
