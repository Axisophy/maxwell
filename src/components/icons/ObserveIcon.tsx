interface IconProps {
  className?: string
  size?: number
}

export default function ObserveIcon({
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
      <path d="M500,200C200,200,0,500,0,500c0,0,200,300,500,300s500-300,500-300c0,0-200-300-500-300ZM500,700c-110.46,0-200-89.54-200-200s89.54-200,200-200,200,89.54,200,200-89.54,200-200,200Z"/>
      <circle cx="500" cy="500" r="100"/>
    </svg>
  )
}
