interface TodayStripProps {
  data?: {
    solarActivity?: string
    gridRenewables?: number
    kpIndex?: number
    earthquakes?: number
  }
}

export default function TodayStrip({ data }: TodayStripProps) {
  // Default/placeholder data
  const stats = {
    solarActivity: data?.solarActivity ?? 'Low',
    gridRenewables: data?.gridRenewables ?? 52,
    kpIndex: data?.kpIndex ?? 2,
    earthquakes: data?.earthquakes ?? 3,
  }

  return (
    <div className="w-full px-12 lg:px-16 py-2 bg-[var(--widget-bg)] border-b border-[var(--widget-border)]">
      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        <span>Solar activity: <span className="text-[var(--text-primary)] font-normal">{stats.solarActivity}</span></span>
        <span className="opacity-30">·</span>
        <span>UK grid: <span className="text-[var(--text-primary)] font-normal">{stats.gridRenewables}% renewables</span></span>
        <span className="opacity-30">·</span>
        <span>Kp index: <span className="text-[var(--text-primary)] font-normal">{stats.kpIndex}</span></span>
        <span className="opacity-30">·</span>
        <span><span className="text-[var(--text-primary)] font-normal">{stats.earthquakes}</span> earthquakes &gt;5.0 today</span>
      </div>
    </div>
  )
}
