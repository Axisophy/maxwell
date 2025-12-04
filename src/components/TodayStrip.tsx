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
    <div className="w-full px-6 py-2 bg-[var(--widget-bg)] border-b border-[var(--widget-border)]">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
        <span>Solar activity: <strong className="text-[var(--text-primary)]">{stats.solarActivity}</strong></span>
        <span className="opacity-30">·</span>
        <span>UK grid: <strong className="text-[var(--text-primary)]">{stats.gridRenewables}% renewables</strong></span>
        <span className="opacity-30">·</span>
        <span>Kp index: <strong className="text-[var(--text-primary)]">{stats.kpIndex}</strong></span>
        <span className="opacity-30">·</span>
        <span><strong className="text-[var(--text-primary)]">{stats.earthquakes}</strong> earthquakes &gt;5.0 today</span>
      </div>
    </div>
  )
}
