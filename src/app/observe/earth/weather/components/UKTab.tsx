'use client'

import Image from 'next/image'

export default function UKTab() {
  return (
    <div className="space-y-6">
      {/* Current UK Weather */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            London
          </h3>
          <p className="text-2xl font-light text-black">12°C</p>
          <p className="text-xs text-black/50">Partly cloudy</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Manchester
          </h3>
          <p className="text-2xl font-light text-black">10°C</p>
          <p className="text-xs text-black/50">Light rain</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Edinburgh
          </h3>
          <p className="text-2xl font-light text-black">8°C</p>
          <p className="text-xs text-black/50">Overcast</p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-2">
            Cardiff
          </h3>
          <p className="text-2xl font-light text-black">11°C</p>
          <p className="text-xs text-black/50">Cloudy</p>
        </div>
      </div>

      {/* UK Radar */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          UK Rainfall Radar
        </h3>
        <div className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden max-w-2xl mx-auto">
          <Image
            src="https://www.metoffice.gov.uk/public/data/observation/ukrain/overview/latest_ukrain_composite.gif"
            alt="UK rainfall radar"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <p className="text-xs text-black/40 mt-2 text-center">Source: Met Office</p>
      </div>

      {/* UK Weather Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            Today&apos;s Outlook
          </h3>
          <p className="text-sm text-black/70 leading-relaxed">
            A band of rain will move eastwards across the UK today, followed by
            brighter spells and scattered showers from the west. Temperatures near
            average for the time of year. Winds fresh from the southwest.
          </p>
        </div>
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-3">
            Warnings
          </h3>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-black">Yellow Warning: Wind</p>
              <p className="text-xs text-black/50">
                Strong winds expected across northern Scotland on Saturday.
                Some disruption to travel possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UK Weather Stats */}
      <div className="bg-[#e5e5e5] rounded-xl p-5">
        <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
          UK Averages (Current Month)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">10°C</p>
            <p className="text-xs text-black/50">Avg Temperature</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">85mm</p>
            <p className="text-xs text-black/50">Avg Rainfall</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">8.5h</p>
            <p className="text-xs text-black/50">Daylight Hours</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-lg font-mono text-black">78%</p>
            <p className="text-xs text-black/50">Avg Humidity</p>
          </div>
        </div>
      </div>

      {/* Met Office Link */}
      <div className="bg-white rounded-xl p-5 text-center">
        <p className="text-sm text-black/50 mb-3">
          For detailed UK weather forecasts and warnings
        </p>
        <a
          href="https://www.metoffice.gov.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-blue-600 transition-colors"
        >
          Visit Met Office →
        </a>
      </div>
    </div>
  )
}
