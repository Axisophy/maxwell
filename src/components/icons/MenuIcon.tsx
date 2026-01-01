interface IconProps {
  className?: string
  size?: number
}

export default function MenuIcon({
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
      <polygon points="660 200 40 200 0 160 0 40 40 0 660 0 700 40 700 160 660 200" />
      <polygon points="960 1000 340 1000 300 960 300 840 340 800 960 800 1000 840 1000 960 960 1000" />
      <polygon points="960 600 40 600 0 560 0 440 40 400 960 400 1000 440 1000 560 960 600" />
    </svg>
  )
}
