interface IconProps {
  className?: string
  size?: number
}

export default function ToolsIcon({
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
      <polygon points="960 160 820 300 700 300 700 180 840 40 800 0 700 0 560 140 560 240 0 800 0 1000 200 1000 760 440 760 440 860 440 1000 300 1000 200 960 160" />
    </svg>
  )
}
