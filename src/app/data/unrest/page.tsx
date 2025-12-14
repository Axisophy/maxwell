'use client';

import { useState, useEffect, useCallback } from 'react';
import { Zap, Activity, Wind, Flame, Thermometer, ChevronRight } from 'lucide-react';
import LightningLive from '@/components/widgets/LightningLive';
import SeismicPulse from '@/components/widgets/SeismicPulse';
import { UnrestSummary, UnrestView } from '@/lib/unrest/types';

// View toggle button component
function ViewToggle({ 
  view, 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  view: UnrestView;
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${active 
          ? 'bg-black text-white' 
          : 'bg-transparent text-black/50 hover:text-black hover:bg-black/5'
        }
      `}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// Summary stat card
function StatCard({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  color = 'text-black',
  subtext 
}: { 
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  color?: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg bg-black/5 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-black/40 uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-black">{value}</span>
          {unit && <span className="text-sm text-black/50">{unit}</span>}
        </div>
        {subtext && (
          <div className="text-xs text-black/40 mt-1 truncate">{subtext}</div>
        )}
      </div>
    </div>
  );
}

// Activity feed item
function ActivityItem({ 
  type, 
  text, 
  time, 
  magnitude 
}: { 
  type: 'earthquake' | 'lightning' | 'storm' | 'volcano';
  text: string;
  time: string;
  magnitude?: number;
}) {
  const icons = {
    earthquake: Activity,
    lightning: Zap,
    storm: Wind,
    volcano: Flame,
  };
  const colors = {
    earthquake: 'text-amber-500',
    lightning: 'text-yellow-500',
    storm: 'text-blue-500',
    volcano: 'text-red-500',
  };
  
  const Icon = icons[type];
  
  return (
    <div className="flex items-center gap-3 py-2 border-b border-black/5 last:border-0">
      <div className={`p-1.5 rounded ${colors[type]} bg-black/5`}>
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-black truncate">
          {magnitude && <span className="font-mono font-medium">M{magnitude} </span>}
          {text}
        </div>
      </div>
      <div className="text-xs text-black/40 whitespace-nowrap">{time}</div>
    </div>
  );
}

export default function UnrestPage() {
  const [activeView, setActiveView] = useState<UnrestView>('all');
  const [summary, setSummary] = useState<UnrestSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch summary data
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/unrest/summary');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  // Mock activity feed
  const activityFeed = [
    { type: 'earthquake' as const, text: '47km S of Chile', time: '2min ago', magnitude: 5.2 },
    { type: 'lightning' as const, text: '847 strikes in Gulf of Mexico', time: '5min ago' },
    { type: 'earthquake' as const, text: '23km NE of Japan', time: '12min ago', magnitude: 4.1 },
    { type: 'lightning' as const, text: 'Storm cell forming over Amazon', time: '18min ago' },
    { type: 'earthquake' as const, text: '89km W of Indonesia', time: '24min ago', magnitude: 4.8 },
  ];

  const views: { view: UnrestView; icon: React.ElementType; label: string }[] = [
    { view: 'all', icon: Activity, label: 'All' },
    { view: 'lightning', icon: Zap, label: 'Lightning' },
    { view: 'seismic', icon: Activity, label: 'Seismic' },
    { view: 'storms', icon: Wind, label: 'Storms' },
    { view: 'volcanic', icon: Flame, label: 'Volcanic' },
    { view: 'extremes', icon: Thermometer, label: 'Extremes' },
  ];

  const showLightning = activeView === 'all' || activeView === 'lightning';
  const showSeismic = activeView === 'all' || activeView === 'seismic';
  const showStorms = activeView === 'all' || activeView === 'storms';
  const showVolcanic = activeView === 'all' || activeView === 'volcanic';

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
            Unrest
          </h1>
          <p className="text-base md:text-lg text-black/70 max-w-2xl">
            Earth's restless activity, live. Lightning strikes, earthquakes, storms, and volcanic alerts 
            from around the world.
          </p>
        </div>

        {/* View toggles */}
        <div className="bg-[#e5e5e5] rounded-xl p-1 inline-flex gap-1 mb-8">
          {views.map(({ view, icon, label }) => (
            <ViewToggle
              key={view}
              view={view}
              active={activeView === view}
              onClick={() => setActiveView(view)}
              icon={icon}
              label={label}
            />
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {showLightning && (
            <StatCard
              label="Lightning"
              value={summary?.lightning.strikesPerMinute || '—'}
              unit="/min"
              icon={Zap}
              color="text-yellow-500"
              subtext={summary ? `${summary.lightning.activeCells} active cells` : undefined}
            />
          )}
          {showSeismic && (
            <StatCard
              label="Earthquakes"
              value={summary?.seismic.eventsLast24h || '—'}
              unit="(24h)"
              icon={Activity}
              color="text-amber-500"
              subtext={summary ? `Largest: M${summary.seismic.largestMagnitude}` : undefined}
            />
          )}
          {showStorms && (
            <StatCard
              label="Active Storms"
              value={summary?.storms.activeCount || 0}
              icon={Wind}
              color="text-blue-500"
              subtext="Atlantic & Pacific"
            />
          )}
          {showVolcanic && (
            <StatCard
              label="Volcanic Alerts"
              value={summary?.volcanic.alertCount || 0}
              icon={Flame}
              color="text-red-500"
              subtext="Elevated activity"
            />
          )}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lightning widget */}
            {showLightning && (
              <LightningLive />
            )}

            {/* Placeholder for map when other views are active */}
            {(showStorms || showVolcanic) && activeView !== 'all' && (
              <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
                <div className="text-black/30 mb-4">
                  {activeView === 'storms' && <Wind size={48} />}
                  {activeView === 'volcanic' && <Flame size={48} />}
                </div>
                <h3 className="text-lg font-medium text-black/70 mb-2">
                  {activeView === 'storms' && 'Storm Tracking'}
                  {activeView === 'volcanic' && 'Volcanic Activity'}
                </h3>
                <p className="text-sm text-black/40 text-center max-w-md">
                  {activeView === 'storms' && 'Hurricane, typhoon, and cyclone tracking coming soon. Data from NHC and JTWC.'}
                  {activeView === 'volcanic' && 'Volcanic alert levels and eruption monitoring coming soon. Data from Smithsonian GVP.'}
                </p>
              </div>
            )}

            {/* Seismic Pulse */}
            {showSeismic && (
              <SeismicPulse compact={activeView === 'all'} />
            )}
          </div>

          {/* Right column - Activity feed & info */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-black/70 uppercase tracking-wider">
                  Recent Activity
                </h3>
                <button className="text-xs text-black/40 hover:text-black flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-0">
                {activityFeed.map((item, i) => (
                  <ActivityItem key={i} {...item} />
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-sm font-medium text-black/70 uppercase tracking-wider mb-4">
                Data Sources
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Zap size={16} className="text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-black">Lightning</div>
                    <div className="text-black/50">GOES-R GLM (Americas)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity size={16} className="text-amber-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-black">Seismic</div>
                    <div className="text-black/50">USGS + IRIS/FDSN</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wind size={16} className="text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-black">Storms</div>
                    <div className="text-black/50">NHC, JTWC (coming soon)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Flame size={16} className="text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-black">Volcanic</div>
                    <div className="text-black/50">Smithsonian GVP (coming soon)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Link to widgets */}
            <div className="bg-[#e5e5e5] rounded-xl p-4">
              <h3 className="text-sm font-medium text-black/70 uppercase tracking-wider mb-3">
                Add to Dashboard
              </h3>
              <p className="text-sm text-black/50 mb-4">
                These widgets are also available for your personal dashboard.
              </p>
              <div className="space-y-2">
                <a 
                  href="/observe/your-dashboard" 
                  className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-black/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-yellow-500" />
                    <span className="text-sm font-medium">Lightning Live</span>
                  </div>
                  <ChevronRight size={16} className="text-black/30" />
                </a>
                <a 
                  href="/observe/your-dashboard" 
                  className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-black/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-amber-500" />
                    <span className="text-sm font-medium">Seismic Pulse</span>
                  </div>
                  <ChevronRight size={16} className="text-black/30" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
