import { cn } from '@/lib/utils'

type ProgressRingProps = {
  value: number
  size?: number
  stroke?: number
  className?: string
  trackClassName?: string
  indicatorClassName?: string
  children?: React.ReactNode
}

export function ProgressRing({
  value,
  size = 160,
  stroke = 12,
  className,
  trackClassName = 'stroke-zinc-800',
  indicatorClassName = 'stroke-emerald-400',
  children,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(value, 0), 1)

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className={trackClassName} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          className={cn('transition-[stroke-dashoffset] duration-700 ease-out', indicatorClassName)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}
