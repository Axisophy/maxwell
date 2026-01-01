interface IconProps {
  className?: string
  size?: number
}

export default function PulseIcon({
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
      <path d="M250,0C100,0,0,500,0,500h500S400,0,250,0Z" />
      <path d="M750,1000c150,0,250-500,250-500h-500s100,500,250,500Z" />
    </svg>
  )
}
