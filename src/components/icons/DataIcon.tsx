interface IconProps {
  className?: string
  size?: number
}

export default function DataIcon({
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
      <polygon points="960 720 900 720 900 500 860 460 540 460 540 280 600 280 640 240 640 40 600 0 400 0 360 40 360 240 400 280 460 280 460 460 140 460 100 500 100 720 40 720 0 760 0 960 40 1000 240 1000 280 960 280 760 240 720 180 720 180 540 460 540 460 720 400 720 360 760 360 960 400 1000 600 1000 640 960 640 760 600 720 540 720 540 540 820 540 820 720 760 720 720 760 720 960 760 1000 960 1000 1000 960 1000 760 960 720" />
    </svg>
  )
}
