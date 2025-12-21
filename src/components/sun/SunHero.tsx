'use client'

import { useState, useEffect } from 'react'

// Hero images from NASA archives (public domain)
const heroImages = [
  {
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~large.jpg',
    title: 'Coronal Mass Ejection',
    date: 'June 20, 2013',
    description: 'A spectacular solar flare and prominence eruption captured by the Solar Dynamics Observatory. The plasma reaches temperatures of millions of degrees.',
    credit: 'NASA/SDO',
  },
  {
    url: 'https://sdo.gsfc.nasa.gov/assets/img/browse/2012/08/31/20120831_003612_4096_0304.jpg',
    title: 'Magnificent Filament Eruption',
    date: 'August 31, 2012',
    description: 'One of the most spectacular eruptions ever recorded - a filament stretching hundreds of thousands of kilometers from the Sun\'s surface.',
    credit: 'NASA/SDO',
  },
  {
    url: 'https://sdo.gsfc.nasa.gov/assets/img/browse/2017/09/06/20170906_120600_4096_0131.jpg',
    title: 'X9.3 Solar Flare',
    date: 'September 6, 2017',
    description: 'The largest solar flare of Solar Cycle 24. X-class flares are the most powerful, capable of causing radio blackouts and geomagnetic storms.',
    credit: 'NASA/SDO',
  },
]

export default function SunHero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Auto-advance slideshow every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
      setIsLoading(true)
      setHasError(false)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  // Fallback timeout - if image doesn't load in 5 seconds, show anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 5000)
    return () => clearTimeout(timeout)
  }, [currentIndex])

  const currentImage = heroImages[currentIndex]

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] bg-black overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
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
      </div>

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 lg:px-12 pb-6 md:pb-8">
        <p className="text-white/60 text-xs font-mono uppercase tracking-wider mb-2">
          {currentImage.date}
        </p>
        <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-light mb-2">
          {currentImage.title}
        </h2>
        <p className="text-white/60 text-sm md:text-base max-w-2xl leading-relaxed">
          {currentImage.description}
        </p>
        <p className="text-white/40 text-xs mt-3">
          Credit: {currentImage.credit}
        </p>
      </div>

      {/* Slideshow navigation dots */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 right-4 md:right-8 lg:right-12 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => {
                setCurrentIndex(i)
                setIsLoading(true)
              }}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
