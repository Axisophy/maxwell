interface IconProps {
  className?: string
  size?: number
}

export default function CloseIcon({
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
      <polygon points="1000 0 860 0 500 360 140 0 0 0 0 140 360 500 0 860 0 1000 140 1000 500 640 860 1000 1000 1000 1000 860 640 500 1000 140 1000 0" />
    </svg>
  )
}
