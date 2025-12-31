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
      {/* Outer eye shape */}
      <path d="M1000,500s-200,300-500,300S0,500,0,500c0,0,200-300,500-300s500,300,500,300Z" />
      {/* White ring (uses explicit white so it cuts through) */}
      <circle cx="500" cy="500" r="200" fill="white" />
      {/* Pupil (uses currentColor so it matches the outer shape) */}
      <circle cx="500" cy="500" r="100" fill="currentColor" />
    </svg>
  )
}
