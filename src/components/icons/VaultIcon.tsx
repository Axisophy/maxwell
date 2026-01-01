interface IconProps {
  className?: string
  size?: number
}

export default function VaultIcon({
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
      <path d="M800,0H40L0,40v920l40,40h920l40-40V200L800,0ZM760,480H240l-40-40V120l40-40h520l40,40v320s-40,40-40,40Z" />
      <polygon points="560 140 520 180 520 380 560 420 700 420 740 380 740 180 700 140 560 140" />
    </svg>
  )
}
