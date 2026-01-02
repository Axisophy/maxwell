'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import StandardModelChart from '@/components/data/StandardModelChart';
import {
  PARTICLES,
  DISCOVERY_TIMELINE,
  getParticle,
  type Particle,
} from '@/components/data/standardModelData';

// Dark theme breadcrumb
function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-white/30">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-white/50 hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Particle detail panel (appears when particle selected)
function ParticleDetail({
  particle,
  onClose
}: {
  particle: Particle;
  onClose: () => void;
}) {
  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-math text-white">{particle.symbol}</span>
          <div>
            <h3 className="text-lg font-light text-white">{particle.name}</h3>
            <p className="text-xs text-white/50 capitalize">{particle.type.replace('-', ' ')}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-2xl text-white/30 hover:text-white leading-none px-2"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
          <div className="bg-black rounded-lg p-3">
            <p className="text-[10px] text-white/50 uppercase mb-1">Mass</p>
            <p className="text-lg font-mono font-bold text-white">{particle.massDisplay}</p>
          </div>
          <div className="bg-black rounded-lg p-3">
            <p className="text-[10px] text-white/50 uppercase mb-1">Charge</p>
            <p className="text-lg font-mono font-bold text-white">{particle.chargeDisplay}</p>
          </div>
          <div className="bg-black rounded-lg p-3">
            <p className="text-[10px] text-white/50 uppercase mb-1">Spin</p>
            <p className="text-lg font-mono font-bold text-white">{particle.spinDisplay}</p>
          </div>
          <div className="bg-black rounded-lg p-3">
            <p className="text-[10px] text-white/50 uppercase mb-1">Generation</p>
            <p className="text-lg font-mono font-bold text-white">{particle.generation || '—'}</p>
          </div>
        </div>

        {/* Interactions */}
        <div className="mt-3 p-3 bg-black/50 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase mb-2">Interactions</p>
          <div className="flex flex-wrap gap-2">
            {particle.electromagnetic && (
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">Electromagnetic</span>
            )}
            {particle.weak && (
              <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded">Weak</span>
            )}
            {particle.strong && (
              <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">Strong</span>
            )}
            {particle.higgs && (
              <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">Higgs</span>
            )}
          </div>
        </div>

        {/* Discovery */}
        <div className="mt-3 p-3 bg-black/50 rounded-lg">
          <p className="text-[10px] text-white/50 uppercase mb-1">Discovery</p>
          <p className="text-sm text-white">{particle.discoveredYear} — {particle.discoveredAt}</p>
          {particle.discoveredBy && (
            <p className="text-xs text-white/40 mt-1">{particle.discoveredBy}</p>
          )}
        </div>

        {/* Notes */}
        {particle.notes && (
          <p className="mt-3 text-sm text-white/60">{particle.notes}</p>
        )}
      </div>
    </div>
  );
}

// Ledger section
function LedgerSection() {
  const [sortBy, setSortBy] = useState<'name' | 'mass' | 'charge' | 'type' | 'year'>('type');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedParticles = useMemo(() => {
    const sorted = [...PARTICLES].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'mass': return a.mass - b.mass;
        case 'charge': return a.charge - b.charge;
        case 'type': return a.type.localeCompare(b.type);
        case 'year': return a.discoveredYear - b.discoveredYear;
        default: return 0;
      }
    });
    return sortDir === 'desc' ? sorted.reverse() : sorted;
  }, [sortBy, sortDir]);

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const typeColors: Record<string, string> = {
    'quark': 'bg-red-500',
    'lepton': 'bg-blue-500',
    'gauge-boson': 'bg-green-500',
    'scalar-boson': 'bg-amber-500',
  };

  const SortHeader = ({ col, label }: { col: typeof sortBy; label: string }) => (
    <th
      onClick={() => handleSort(col)}
      className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-white/50 cursor-pointer hover:text-white transition-colors"
    >
      {label} {sortBy === col && (sortDir === 'asc' ? '↑' : '↓')}
    </th>
  );

  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">Particle Ledger</h2>
        <p className="text-sm text-white/50 mt-1">All 17 particles — click headers to sort</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 bg-black/20">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-white/50">
                Particle
              </th>
              <SortHeader col="type" label="Type" />
              <SortHeader col="mass" label="Mass" />
              <SortHeader col="charge" label="Charge" />
              <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-white/50">
                Spin
              </th>
              <SortHeader col="year" label="Discovered" />
              <th className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-white/50">
                Interactions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedParticles.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-math text-white">{p.symbol}</span>
                    <span className="text-white/60">{p.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${typeColors[p.type]}`} />
                    <span className="text-white/60 capitalize">{p.type.replace('-', ' ')}</span>
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-white/80">{p.massDisplay}</td>
                <td className="px-3 py-2 font-mono text-white/80">{p.chargeDisplay}</td>
                <td className="px-3 py-2 font-mono text-white/80">{p.spinDisplay}</td>
                <td className="px-3 py-2 font-mono text-white/60">{p.discoveredYear}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    {p.strong && <span className="w-2 h-2 rounded-full bg-red-500" title="Strong" />}
                    {p.electromagnetic && <span className="w-2 h-2 rounded-full bg-blue-500" title="EM" />}
                    {p.weak && <span className="w-2 h-2 rounded-full bg-amber-500" title="Weak" />}
                    {p.higgs && <span className="w-2 h-2 rounded-full bg-purple-500" title="Higgs" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Timeline section
function TimelineSection() {
  return (
    <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-xl font-light text-white uppercase">Discovery Timeline</h2>
        <p className="text-sm text-white/50 mt-1">1897–2012 — 115 years of discovery</p>
      </div>

      <div className="p-4">
        {/* Timeline visualization */}
        <div className="relative mb-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-green-500 via-amber-500 to-[#e6007e]"
              style={{ width: '100%' }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-white/30">
            <span>1897</span>
            <span>1950</span>
            <span>1983</span>
            <span>2012</span>
          </div>
        </div>

        {/* Timeline entries */}
        <div className="space-y-2">
          {DISCOVERY_TIMELINE.map((event, i) => {
            // Get particle symbols for this event
            const particleSymbols = event.particles
              .map(id => getParticle(id)?.symbol)
              .filter(Boolean)
              .join(', ');

            return (
              <div
                key={i}
                className="flex items-start gap-4 p-3 bg-black/30 rounded-lg hover:bg-black/40 transition-colors"
              >
                <div className="text-sm font-mono text-white/50 w-12 flex-shrink-0">
                  {event.year}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-math text-white">{particleSymbols}</span>
                    <span className="text-sm text-white/70">{event.event}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Main page
export default function StandardModelPage() {
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null);

  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        {/* Breadcrumb Frame */}
        <div className="mb-px">
          <div className="bg-[#1d1d1d] rounded-lg py-1 md:py-2 px-2 md:px-4">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Data', href: '/data' },
                { label: 'The Fabric', href: '/data/fabric' },
                { label: 'Standard Model' },
              ]}
            />
          </div>
        </div>

        {/* Header Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 mb-px">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white uppercase">
            The Standard Model
          </h1>
          <p className="text-sm md:text-base text-white/60 mt-2 max-w-2xl">
            The theoretical framework describing all known fundamental particles and three of the four fundamental forces.
            Everything we&apos;ve directly observed in the universe is made of these 17 particles.
          </p>
        </div>

        {/* Chart Frame - Hero */}
        <div className="mb-px">
          <StandardModelChart onSelectParticle={setSelectedParticle} />
        </div>

        {/* Selected particle detail */}
        {selectedParticle && (
          <div className="mb-px">
            <ParticleDetail
              particle={selectedParticle}
              onClose={() => setSelectedParticle(null)}
            />
          </div>
        )}

        {/* Ledger Section */}
        <div className="mb-px">
          <LedgerSection />
        </div>

        {/* Timeline Section */}
        <div className="mb-px">
          <TimelineSection />
        </div>

        {/* Context Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4 mb-px">
          <div className="max-w-3xl">
            <h2 className="text-xl font-light text-white uppercase mb-3">The Framework</h2>
            <p className="text-sm text-white/60 mb-4">
              The Standard Model is a <strong className="text-white">quantum field theory</strong> that
              describes the electromagnetic, weak, and strong nuclear forces, and classifies all known
              elementary particles. Developed between 1961–1979, it has survived every experimental
              test since.
            </p>

            <h2 className="text-xl font-light text-white uppercase mb-3 mt-6">The Three Generations</h2>
            <p className="text-sm text-white/60 mb-4">
              Fermions come in three <strong className="text-white">generations</strong> — identical
              except for mass. Only generation I particles are stable; heavier generations decay almost
              instantly. All ordinary matter is made entirely of first-generation particles: up quarks,
              down quarks, and electrons.
            </p>

            <h2 className="text-xl font-light text-white uppercase mb-3 mt-6">What&apos;s Missing</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-sm text-white/80">Gravity</div>
                <div className="text-xs text-white/40">No graviton in the SM</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-sm text-white/80">Dark Matter</div>
                <div className="text-xs text-white/40">~27% of universe</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-sm text-white/80">Dark Energy</div>
                <div className="text-xs text-white/40">~68% of universe</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-sm text-white/80">Neutrino Masses</div>
                <div className="text-xs text-white/40">Requires extensions</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-sm text-white/80">Matter Asymmetry</div>
                <div className="text-xs text-white/40">Why more matter?</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="text-sm text-white/80">Hierarchy Problem</div>
                <div className="text-xs text-white/40">Why is gravity weak?</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cross-References Frame */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
          <div className="text-sm text-white/40 uppercase tracking-wider mb-3">Related</div>
          <div className="flex flex-wrap gap-4 mb-6">
            <Link href="/data/fabric/forces" className="text-sm text-white/60 hover:text-white transition-colors">
              Fundamental Forces →
            </Link>
            <Link href="/data/fabric/constants" className="text-sm text-white/60 hover:text-white transition-colors">
              Physical Constants →
            </Link>
            <Link href="/data/fabric/spectrum" className="text-sm text-white/60 hover:text-white transition-colors">
              EM Spectrum →
            </Link>
            <Link href="/observe/detectors/lhc" className="text-sm text-white/60 hover:text-white transition-colors">
              LHC Status →
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">References</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/40">
              <div>
                <div className="text-white/50 mb-1">Particle Data</div>
                <div>PDG Review 2024</div>
              </div>
              <div>
                <div className="text-white/50 mb-1">Constants</div>
                <div>CODATA 2022</div>
              </div>
              <div>
                <div className="text-white/50 mb-1">Discovery History</div>
                <div>Nobel Prize Archive</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
