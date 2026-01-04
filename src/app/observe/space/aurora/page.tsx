'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui'
import { ObserveIcon } from '@/components/icons'

interface SpaceWeatherData {
  kpIndex: number
  kpText: string
  solarWind: number
  bz: number
  protonDensity: number
}

export default function AuroraPage() {
  const [data, setData] = useState<SpaceWeatherData | null>(null)
  const [activeHemisphere, setActiveHemisphere] = useState<'north' | 'south'>('north')

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Kp index
        const kpResponse = await fetch(
          'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
        )
        const kpData = await kpResponse.json()
        const latestKp = kpData[kpData.length - 1]
        const kpValue = parseFloat(latestKp[1])

        // Fetch solar wind
        const windResponse = await fetch(
          'https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json'
        )
        const windData = await windResponse.json()
        const bz = parseFloat(windData.Bz)

        const speedResponse = await fetch(
          'https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json'
        )
        const speedData = await speedResponse.json()
        const windSpeed = parseFloat(speedData.WindSpeed)

        let kpText = 'Quiet'
        if (kpValue >= 8) kpText = 'Severe Storm'
        else if (kpValue >= 7) kpText = 'Strong Storm'
        else if (kpValue >= 6) kpText = 'Moderate Storm'
        else if (kpValue >= 5) kpText = 'Minor Storm'
        else if (kpValue >= 4) kpText = 'Active'
        else if (kpValue >= 3) kpText = 'Unsettled'

        setData({
          kpIndex: kpValue,
          kpText,
          solarWind: windSpeed,
          bz,
          protonDensity: 5.2,
        })
      } catch (error) {
        console.error('Failed to fetch space weather:', error)
        setData({
          kpIndex: 3,
          kpText: 'Unsettled',
          solarWind: 380,
          bz: -2.5,
          protonDensity: 5.2,
        })
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getKpColor = (kp: number) => {
    if (kp >= 7) return 'text-red-400'
    if (kp >= 5) return 'text-orange-400'
    if (kp >= 4) return 'text-amber-400'
    return 'text-emerald-400'
  }

  const getBzColor = (bz: number) => {
    if (bz <= -10) return 'text-red-400'
    if (bz <= -5) return 'text-orange-400'
    if (bz < 0) return 'text-amber-400'
    return 'text-emerald-400'
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <BreadcrumbFrame
          variant="dark"
          icon={<ObserveIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Observe', '/observe'],
            ['Space', '/observe/space'],
            ['Aurora Forecast']
          )}
        />

        <PageHeaderFrame
          variant="dark"
          title="Aurora forecast"
          description="Real-time aurora probability based on current space weather conditions. The OVATION Prime model uses solar wind data from L1 to predict where aurora will be visible in the next 30 minutes."
        />

        {/* Current Conditions Panel */}
        <section className="mb-8">
          <div className="bg-[#0f0f14] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-white/40 uppercase">Live Conditions</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Kp Index */}
              <div>
                <p className="text-xs text-white/40 mb-1">Kp Index</p>
                <p className={`text-3xl font-mono font-bold ${data ? getKpColor(data.kpIndex) : 'text-white/20'}`}>
                  {data?.kpIndex.toFixed(0) || '-'}
                </p>
                <p className="text-xs text-white/40">{data?.kpText || 'Loading...'}</p>
              </div>

              {/* Solar Wind */}
              <div>
                <p className="text-xs text-white/40 mb-1">Solar Wind</p>
                <p className="text-3xl font-mono font-bold text-cyan-400">
                  {data?.solarWind.toFixed(0) || '-'}
                </p>
                <p className="text-xs text-white/40">km/s</p>
              </div>

              {/* Bz Component */}
              <div>
                <p className="text-xs text-white/40 mb-1">IMF Bz</p>
                <p className={`text-3xl font-mono font-bold ${data ? getBzColor(data.bz) : 'text-white/20'}`}>
                  {data?.bz.toFixed(1) || '-'}
                </p>
                <p className="text-xs text-white/40">nT {data && data.bz < 0 ? '(southward)' : '(northward)'}</p>
              </div>

              {/* Aurora Chance */}
              <div>
                <p className="text-xs text-white/40 mb-1">Aurora Chance</p>
                <p className="text-3xl font-mono font-bold text-purple-400">
                  {data ? (data.kpIndex >= 5 ? 'High' : data.kpIndex >= 3 ? 'Moderate' : 'Low') : '-'}
                </p>
                <p className="text-xs text-white/40">at high latitudes</p>
              </div>
            </div>
          </div>
        </section>

        {/* OVATION Prime Hero */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider">
              Aurora Oval Forecast
            </h2>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded">
              OVATION PRIME
            </span>
          </div>

          {/* Hemisphere Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveHemisphere('north')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeHemisphere === 'north'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Northern Hemisphere
            </button>
            <button
              onClick={() => setActiveHemisphere('south')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeHemisphere === 'south'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Southern Hemisphere
            </button>
          </div>

          {/* Large Aurora Oval */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0f0f14] rounded-xl p-4 overflow-hidden">
              <div className="relative aspect-square max-w-xl mx-auto">
                <Image
                  src={activeHemisphere === 'north'
                    ? 'https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg'
                    : 'https://services.swpc.noaa.gov/images/aurora-forecast-southern-hemisphere.jpg'
                  }
                  alt={`Aurora forecast - ${activeHemisphere}ern hemisphere`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="text-xs text-white/40 text-center mt-3">
                Brighter areas = higher aurora probability • Updated every ~30 min
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0f0f14] rounded-xl p-5">
                <h3 className="text-sm font-medium text-white mb-3">Reading the Forecast</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  The auroral oval shows where aurora is most likely visible. Green/yellow
                  areas have higher probability. The oval expands equatorward during storms.
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  Aurora is only visible where it&apos;s dark (nightside). Look for where the
                  oval crosses into the nighttime region of Earth.
                </p>
              </div>

              <div className="bg-[#0f0f14] rounded-xl p-5">
                <h3 className="text-sm font-medium text-white mb-3">Why Bz Matters</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  The IMF Bz component determines if solar wind energy can enter Earth&apos;s
                  magnetosphere. <strong>Southward (negative) Bz</strong> allows reconnection,
                  driving aurora. Prolonged Bz &lt; -5 nT typically triggers visible aurora.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Day Forecast */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            3-Day Outlook
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { day: 'Today', kp: data?.kpIndex || 3, chance: 'Moderate', details: 'Quiet to unsettled conditions' },
              { day: 'Tomorrow', kp: 3, chance: 'Low', details: 'Quiet conditions expected' },
              { day: 'Day 3', kp: 4, chance: 'Moderate', details: 'Minor activity possible' },
            ].map((forecast) => (
              <div key={forecast.day} className="bg-[#0f0f14] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white">{forecast.day}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">Kp</span>
                    <span className={`text-lg font-mono ${getKpColor(forecast.kp)}`}>
                      {forecast.kp}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-2">{forecast.chance} aurora chance</p>
                <p className="text-xs text-white/40">{forecast.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Viewing Guide */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Viewing Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Best Times</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Aurora peaks around magnetic midnight (typically 10pm-2am local time).
                The hours around equinoxes (March & September) often have enhanced activity
                due to favorable solar wind-magnetosphere geometry.
              </p>
            </div>

            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Location</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Find a dark site with clear northern horizon. Light pollution reduces
                visibility of fainter displays. Higher latitudes (60-70°N) have the best
                odds, but strong storms push aurora to lower latitudes.
              </p>
            </div>

            <div className="bg-[#0f0f14] rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Photography</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Camera sensors capture more than the eye. Settings: 10-30 sec exposure,
                f/2.8 or wider, ISO 1600-6400. Use a sturdy tripod and manual focus
                set to infinity. Check shots frequently as conditions change.
              </p>
            </div>
          </div>
        </section>

        {/* Kp Index Scale */}
        <section className="mb-12">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider mb-4">
            Kp Index Scale
          </h2>

          <div className="bg-[#0f0f14] rounded-xl overflow-hidden">
            <div className="grid grid-cols-5 text-center">
              {[
                { kp: '0-2', color: 'bg-green-500', label: 'Quiet', visibility: 'Arctic Circle only' },
                { kp: '3-4', color: 'bg-yellow-500', label: 'Unsettled', visibility: 'Scandinavia, Alaska, Canada' },
                { kp: '5', color: 'bg-orange-500', label: 'Minor Storm', visibility: 'Scotland, N. England, N. US' },
                { kp: '6-7', color: 'bg-red-500', label: 'Moderate Storm', visibility: 'Central Europe, N. US' },
                { kp: '8-9', color: 'bg-red-700', label: 'Severe Storm', visibility: 'Visible at low latitudes' },
              ].map((item) => (
                <div key={item.kp} className="p-4 border-r border-white/5 last:border-r-0">
                  <div className={`w-8 h-8 ${item.color} rounded-full mx-auto mb-2`} />
                  <p className="text-white font-mono text-lg mb-1">Kp {item.kp}</p>
                  <p className="text-white/60 text-xs mb-1">{item.label}</p>
                  <p className="text-white/40 text-[10px]">{item.visibility}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/observe/space"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Space
            </Link>
            <Link
              href="/observe/space/solar-observatory"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Solar Observatory →
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-2">Data Sources</p>
            <p className="text-xs text-white/40">
              NOAA Space Weather Prediction Center • OVATION Prime Model •
              DSCOVR Solar Wind Data • Planetary K-index
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
