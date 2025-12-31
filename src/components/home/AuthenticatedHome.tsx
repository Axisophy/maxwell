'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

// User type content
const userTypes = [
  {
    id: 'curious',
    label: 'Just a curious person',
    content: {
      intro: "If you're just curious then you came to the right place! MXWLL has a huge amount of carefully curated visualisations, data streams, video and image feeds and a host of other stuff which should keep you occupied for hours.",
      prompt: "Why don't you start with:",
      links: [
        { href: '/observe/vital-signs', label: 'Check Earth\'s Vital Signs' },
        { href: '/observe/your-dashboard', label: 'Start observing via Your Dashboard' },
      ]
    }
  },
  {
    id: 'student',
    label: 'Student',
    content: {
      intro: "Whether you're studying physics, biology, chemistry or any other science, MXWLL gives you access to real data, interactive tools, and beautifully presented scientific literature that'll make your studies come alive.",
      prompt: "Get started with:",
      links: [
        { href: '/tools', label: 'Explore our scientific Tools' },
        { href: '/vault', label: 'Browse the Vault of scientific texts' },
        { href: '/data', label: 'Dive into real Data' },
      ]
    }
  },
  {
    id: 'researcher',
    label: 'Researcher or Scientist',
    content: {
      intro: "Even experts need a break from their own field. MXWLL lets you explore the wonders of disciplines beyond your own, beautifully presented. And if you'd like your work featured here, we'd love to hear from you.",
      prompt: "Explore or collaborate:",
      links: [
        { href: '/pulse', label: 'See what\'s new in the Pulse' },
        { href: '/observe/your-dashboard', label: 'Explore the Dashboard' },
        { href: '/collaborations', label: 'Collaborate with us' },
      ]
    }
  },
  {
    id: 'institution',
    label: 'Institution or Organisation',
    content: {
      intro: "Universities, research institutions, museums and science organisations - we're building partnerships to bring your work to curious audiences worldwide. Beautiful presentation, effortless engagement.",
      prompt: "Let's work together:",
      links: [
        { href: '/about/partnerships', label: 'Partnership opportunities' },
        { href: '/about/contact', label: 'Contact us' },
      ]
    }
  },
  {
    id: 'investor',
    label: 'Investor',
    content: {
      intro: "MXWLL is building the quality layer for science - a platform that combines beautiful design, live data, and deep content. We're seeking partners who share our vision for transforming how the world engages with science.",
      prompt: "Learn more:",
      links: [
        { href: '/about', label: 'About MXWLL' },
        { href: '/about/investment', label: 'Investment opportunities' },
      ]
    }
  },
]

// Explore sections with themed placeholder colors
const exploreSections = [
  {
    href: '/observe',
    label: 'Observe',
    description: 'Live windows into science happening right now',
    image: '/assets/homepage/homepage_explore_observe.jpg',
    placeholderGradient: 'from-orange-900 via-red-900 to-yellow-900',
  },
  {
    href: '/pulse',
    label: 'Pulse',
    description: 'Science news and partner highlights',
    image: '/assets/homepage/homepage_explore_pulse.jpg',
    placeholderGradient: 'from-emerald-900 via-teal-900 to-cyan-900',
  },
  {
    href: '/tools',
    label: 'Tools',
    description: 'Scientific instruments that actually work',
    image: '/assets/homepage/homepage_explore_tools.jpg',
    placeholderGradient: 'from-slate-700 via-slate-800 to-slate-900',
  },
  {
    href: '/data',
    label: 'Data',
    description: 'Reference datasets beautifully presented',
    image: '/assets/homepage/homepage_explore_data.jpg',
    placeholderGradient: 'from-cyan-900 via-blue-900 to-indigo-900',
  },
  {
    href: '/vault',
    label: 'Vault',
    description: '2,500 years of scientific texts',
    image: '/assets/homepage/homepage_explore_vault.jpg',
    placeholderGradient: 'from-amber-900 via-yellow-900 to-orange-900',
  },
  {
    href: '/play',
    label: 'Play',
    description: 'Games, simulations and explorations',
    image: '/assets/homepage/homepage_explore_play.jpg',
    placeholderGradient: 'from-purple-900 via-fuchsia-900 to-pink-900',
  },
]

export default function AuthenticatedHome() {
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  const toggleUser = (id: string) => {
    setExpandedUser(expandedUser === id ? null : id)
  }

  return (
    <main className="min-h-screen bg-black px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">
      {/* NO mobile top padding here - hero goes full bleed */}

      {/* HERO SECTION */}
      <section className="relative min-h-screen rounded-lg overflow-hidden border border-white/10 pt-20 md:pt-48 pb-12 md:pb-16 flex flex-col justify-end">
        {/* Hero image background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <Image
            src="/assets/homepage/homepage_hero_supernova.jpg"
            alt="Supernova remnant from JWST"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hero content - at bottom of section */}
        <div className="relative px-2 md:px-4">
          <h1
            className="text-white text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] mb-8 max-w-[85%]"
            style={{ letterSpacing: '-0.03em' }}
          >
            A digital laboratory
          </h1>
          <p className="text-white text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed max-w-4xl mb-8">
            MXWLL finds the signals, then builds the instruments to see them. We tell the living story of science.
          </p>
          <div className="text-white/80 text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-4xl space-y-4">
            <p>
              Science is not abstract. It is weather moving across oceans, starlight crossing millions of years, the quiet drift of tectonic plates beneath your feet. It is notebooks, satellites, supercomputers and hand-built experiments, all generating data that is too often hidden away in archives, PDFs and dashboards no one loves.
            </p>
            <p>
              MXWLL spends its time in those places. We search through observatories, missions, research groups and public institutions for the streams of data that actually matter - the elusive patterns that say something about the Earth, the universe and our place inside both. When we find them, we treat them as material. We model them, tune them, and build precise, beautiful interfaces around them.
            </p>
            <p>
              The result is a set of instruments rather than a website: live windows onto earthquakes, climate, deep time and distant galaxies; working tools that can be used by a curious twelve-year-old, a postgraduate researcher or a museum curator; reading rooms where ancient ideas sit alongside current papers and speculative futures. Everything is designed to feel calm, legible and quietly obsessive.
            </p>
            <p>
              MXWLL is not a feed and it is not a portal. It is a long-term project to give science the visual and editorial care it deserves - to make the machinery of the world visible, in real time, on devices you enjoy using.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT CAN MXWLL DO FOR YOU? SECTION */}
      <section className="mt-px bg-white text-black rounded-lg p-2 md:p-4">
        <div>
          <h2
            className="text-3xl md:text-5xl font-bold mb-8 pt-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            What can MXWLL<br />do for you?
          </h2>

          {/* User type buttons */}
          <div className="flex flex-col gap-px">
            {userTypes.map((userType) => {
              const isExpanded = expandedUser === userType.id

              return (
                <div key={userType.id}>
                  {/* Button - now a black frame */}
                  <button
                    onClick={() => toggleUser(userType.id)}
                    className="w-full p-2 md:p-4 bg-black rounded-lg flex items-center justify-between text-left group"
                  >
                    <span className="text-xl md:text-2xl text-white font-light">
                      {userType.label}
                    </span>
                    <span
                      className={`text-2xl text-white transition-transform ${
                        isExpanded ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {/* Expanded content - still black, now radiused */}
                  {isExpanded && (
                    <div className="bg-black text-white rounded-lg p-2 md:p-4 mt-px">
                      <div className="max-w-2xl">
                        <p className="text-base mb-6 leading-relaxed text-white/80">
                          {userType.content.intro}
                        </p>
                        <p className="font-medium mb-4 text-white">
                          {userType.content.prompt}
                        </p>
                        <div className="flex flex-col gap-3">
                          {userType.content.links.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="text-base text-white underline underline-offset-4 hover:no-underline"
                            >
                              {link.label} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="mt-px bg-white rounded-lg p-2 md:p-4">
        <div>
          <h2
            className="text-3xl md:text-5xl font-bold mb-8 pt-4 text-black"
            style={{ letterSpacing: '-0.02em' }}
          >
            Explore
          </h2>

          {/* Section grid - 6 items now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
            {exploreSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group relative aspect-square rounded-lg overflow-hidden bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-colors"
              >
                {/* Placeholder - will add graphics later */}
                <div className="absolute inset-0 flex flex-col justify-end p-2 md:p-4">
                  <h3
                    className="text-black text-2xl md:text-3xl font-light uppercase mb-2"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {section.label}
                  </h3>
                  <p className="text-black/50 text-sm md:text-base">
                    {section.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
