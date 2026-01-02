'use client'

import { useState, useEffect } from 'react'

const heroImages = [
  {
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~large.jpg',
    title: 'Coronal Mass Ejection',
    date: 'June 20, 2013',
    description: 'A spectacular solar flare and prominence eruption captured by the Solar Dynamics Observatory.',
    credit: 'NASA/SDO',
  },
  {
    url: 'https://sdo.gsfc.nasa.gov/assets/img/browse/2012/08/31/20120831_003612_4096_0304.jpg',
    title: 'Magnificent Filament Eruption',
    date: 'August 31, 2012',
    description: 'One of the most spectacular eruptions ever recorded - a filament stretching hundreds of thousands of kilometres.',
    credit: 'NASA/SDO',
  },
  {
    url: 'https://sdo.gsfc.nasa.gov/assets/img/browse/2017/09/06/20170906_120600_4096_0131.jpg',
    title: 'X9.3 Solar Flare',
    date: 'September 6, 2017',
    description: 'The largest solar flare of Solar Cycle 24. X-class flares are the most powerful, capable of causing radio blackouts.',
    credit: 'NASA/SDO',
  },
  {
    url: 'https://sdo.gsfc.nasa.gov/assets/img/browse/2014/10/24/20141024_211200_4096_0171.jpg',
    title: 'Active Region Loops',
    date: 'October 24, 2014',
    description: 'Magnetic field lines trace graceful arcs above active regions, revealing the Sun\'s complex magnetic structure.',
    credit: 'NASA/SDO',
  },
]

export default function SunHeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Auto-advance slideshow every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
      setIsLoading(true)
      setHasError(false)
    }, 12000)
    return () => clearInterval(timer)
  }, [])

  // Fallback timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [currentIndex])

  const currentImage = heroImages[currentIndex]

  return (
    <div className="relative bg-black aspect-[16/9] md:aspect-[21/9]">
      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Hero Image */}
      <img
        src={currentImage.url}
        alt={currentImage.title}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <p className="text-white/60 text-xs font-mono uppercase tracking-wider mb-1">
          {currentImage.date}
        </p>
        <h3 className="text-white text-lg md:text-xl font-light mb-1">
          {currentImage.title}
        </h3>
        <p className="text-white/60 text-sm max-w-xl">
          {currentImage.description}
        </p>
        <p className="text-white/40 text-xs mt-2">
          Credit: {currentImage.credit}
        </p>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => {
              setCurrentIndex(i)
              setIsLoading(true)
              setHasError(false)
            }}
            aria-label={`View image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
