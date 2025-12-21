import VitalSigns from '@/components/VitalSigns'

export const metadata = {
  title: 'Vital Signs | MXWLL',
  description: 'Earth\'s vital signs at a glance. Real-time scientific indicators including atmospheric CO₂, global temperature, seismic activity, solar weather, and more.',
}

export default function VitalSignsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />
      
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        {/* Page header - following Type F spec exactly */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
            Vital Signs
          </h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            Earth's vital signs at a glance. Key scientific indicators updated in real-time - 
            atmospheric CO₂, global temperature, seismic activity, solar weather, and more.
          </p>
        </div>
        
        {/* The Vital Signs component */}
        <VitalSigns />
        
        {/* Sources info */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="p-6 md:p-8 bg-white rounded-xl border border-transparent">
            <h2 className="text-xl md:text-2xl font-light text-black mb-2">
              About This Data
            </h2>
            <p className="text-base text-black/50">
              Vital Signs aggregates real-time data from trusted scientific sources including 
              NASA, NOAA, USGS, and international research institutions. Data refreshes every 
              5 minutes.
            </p>
          </div>
          
          <div className="p-6 md:p-8 bg-white rounded-xl border border-transparent">
            <h2 className="text-xl md:text-2xl font-light text-black mb-2">
              Data Sources
            </h2>
            <p className="text-base text-black/50">
              USGS Earthquakes, NASA GISS Temperature, NOAA Mauna Loa CO₂, NSIDC Sea Ice, 
              NOAA Space Weather, NASA JPL Near-Earth Objects, SpaceDevs Launch Data.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  )
}