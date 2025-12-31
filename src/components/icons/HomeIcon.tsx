interface IconProps {
  className?: string
  size?: number
}

export default function HomeIcon({
  className = '',
  size = 24
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      fill="currentColor"
      className={className}
    >
      {/* Two triangular peaks */}
      <polygon points="500 1000 0 1000 250 0 500 1000" />
      <polygon points="1000 1000 500 1000 750 0 1000 1000" />
    </svg>
  )
}
