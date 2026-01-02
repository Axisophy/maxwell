import Link from 'next/link';
import { ArrowLeft, Map, Globe, ExternalLink } from 'lucide-react';

export default function MoonDataPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-full md:max-w-[720px] lg:max-w-[800px] md:mx-auto">
          {/* Back link */}
          <Link
            href="/data"
            className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Data
          </Link>

          {/* Header */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
            The Moon
          </h1>
          <p className="text-lg md:text-xl text-black/70 mb-8">
            Earth&apos;s only natural satellite, 384,400 km away.
          </p>

          {/* Quick links to atlas */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link
              href="/observe/moon"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
            >
              <Map className="w-4 h-4" />
              Explore the Atlas
            </Link>
          </div>

          {/* Key facts */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-light text-black mb-6">
              Key Facts
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FactCard label="Diameter" value="3,474 km" note="27% of Earth" />
              <FactCard label="Mass" value="7.35 x 10^22 kg" note="1.2% of Earth" />
              <FactCard label="Distance" value="384,400 km" note="Average" />
              <FactCard label="Orbital Period" value="27.3 days" note="Sidereal" />
              <FactCard label="Surface Gravity" value="1.62 m/s^2" note="16.6% of Earth" />
              <FactCard label="Age" value="4.51 billion years" note="plus/minus 10 million" />
            </div>
          </section>

          {/* Formation */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-light text-black mb-4">
              Formation
            </h2>
            <p className="text-base md:text-lg text-black/80 leading-relaxed mb-4">
              The Moon formed approximately 4.51 billion years ago, likely from debris
              ejected when a Mars-sized body called Theia collided with the early Earth.
              This Giant Impact Hypothesis explains why the Moon&apos;s composition is similar
              to Earth&apos;s outer layers and why it has a relatively small iron core.
            </p>
            <p className="text-base md:text-lg text-black/80 leading-relaxed">
              After formation, the Moon was much closer to Earth - perhaps only
              20,000-30,000 km away. It has been slowly spiraling outward ever since,
              currently receding at about 3.8 cm per year.
            </p>
          </section>

          {/* Surface */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-light text-black mb-4">
              Surface
            </h2>
            <p className="text-base md:text-lg text-black/80 leading-relaxed mb-4">
              The lunar surface is divided into two main terrain types: the dark
              <strong> maria</strong> (Latin for &ldquo;seas&rdquo;) and the bright
              <strong> highlands</strong> (terrae). The maria are actually vast
              plains of solidified basaltic lava that filled ancient impact basins
              between 3.9 and 3.0 billion years ago.
            </p>
            <p className="text-base md:text-lg text-black/80 leading-relaxed">
              The surface is covered in <strong>regolith</strong> - a layer of
              fine rocky debris created by billions of years of meteorite impacts.
              This grey powder ranges from 4 to 15 metres deep.
            </p>
          </section>

          {/* Exploration */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-light text-black mb-4">
              Human Exploration
            </h2>
            <p className="text-base md:text-lg text-black/80 leading-relaxed mb-6">
              Twelve people have walked on the Moon, all American astronauts during
              NASA&apos;s Apollo programme between 1969 and 1972. They spent a combined
              80 hours on the surface and brought back 382 kg of lunar samples.
            </p>

            <div className="space-y-4">
              <MissionCard
                mission="Apollo 11"
                date="July 1969"
                crew="Armstrong, Aldrin"
                note="First lunar landing"
                href="/observe/moon"
              />
              <MissionCard
                mission="Apollo 12"
                date="November 1969"
                crew="Conrad, Bean"
                note="Precision landing near Surveyor 3"
                href="/observe/moon"
              />
              <MissionCard
                mission="Apollo 14"
                date="February 1971"
                crew="Shepard, Mitchell"
                note="Fra Mauro highlands"
                href="/observe/moon"
              />
              <MissionCard
                mission="Apollo 15"
                date="July 1971"
                crew="Scott, Irwin"
                note="First lunar rover"
                href="/observe/moon"
              />
              <MissionCard
                mission="Apollo 16"
                date="April 1972"
                crew="Young, Duke"
                note="Descartes highlands"
                href="/observe/moon"
              />
              <MissionCard
                mission="Apollo 17"
                date="December 1972"
                crew="Cernan, Schmitt"
                note="Last crewed mission"
                href="/observe/moon"
              />
            </div>
          </section>

          {/* Robotic exploration */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-light text-black mb-4">
              Robotic Missions
            </h2>
            <p className="text-base md:text-lg text-black/80 leading-relaxed mb-4">
              The Moon has been visited by spacecraft from multiple nations.
              The Soviet Luna programme achieved many firsts: first flyby (1959),
              first impact, first far-side images, first soft landing, and first
              robotic sample return.
            </p>
            <p className="text-base md:text-lg text-black/80 leading-relaxed">
              Recent missions include China&apos;s Chang&apos;e programme (including the
              far side landing in 2019), India&apos;s Chandrayaan missions, and various
              commercial landers. NASA&apos;s Lunar Reconnaissance Orbiter has been
              mapping the Moon in extraordinary detail since 2009.
            </p>
          </section>

          {/* Links */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-light text-black mb-4">
              External Resources
            </h2>
            <div className="space-y-2">
              <ExternalLinkCard
                label="NASA Moon Portal"
                href="https://moon.nasa.gov"
              />
              <ExternalLinkCard
                label="Lunar Reconnaissance Orbiter Camera"
                href="https://www.lroc.asu.edu"
              />
              <ExternalLinkCard
                label="Apollo Lunar Surface Journal"
                href="https://www.hq.nasa.gov/alsj/"
              />
              <ExternalLinkCard
                label="NASA's Scientific Visualization Studio"
                href="https://svs.gsfc.nasa.gov/Gallery/moonphase.html"
              />
            </div>
          </section>

          {/* Related */}
          <section>
            <h2 className="text-xl md:text-2xl font-light text-black mb-4">
              Related
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/observe/dashboard"
                className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm hover:border-black transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/data/fabric/spectrum"
                className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm hover:border-black transition-colors"
              >
                EM Spectrum
              </Link>
              <Link
                href="/data/fabric/constants"
                className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm hover:border-black transition-colors"
              >
                Constants
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  );
}

// Fact card component
function FactCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="bg-white rounded-xl p-4">
      <p className="text-xs text-black/50 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-mono font-medium">{value}</p>
      <p className="text-xs text-black/40">{note}</p>
    </div>
  );
}

// Mission card component
function MissionCard({
  mission,
  date,
  crew,
  note,
  href,
}: {
  mission: string;
  date: string;
  crew: string;
  note: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
    >
      <div>
        <p className="font-medium">{mission}</p>
        <p className="text-sm text-black/50">{crew}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono">{date}</p>
        <p className="text-xs text-black/40">{note}</p>
      </div>
    </Link>
  );
}

// External link component
function ExternalLinkCard({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
    >
      <span className="text-sm">{label}</span>
      <ExternalLink className="w-4 h-4 text-black/40" />
    </a>
  );
}
