'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import StandardModelChart, { PARTICLES } from '@/components/data/StandardModelChart';
import { BreadcrumbFrame, breadcrumbItems, PageHeaderFrame } from '@/components/ui';
import { DataIcon } from '@/components/icons';

// Type colours matching chart
const TYPE_COLORS: Record<string, string> = {
  'quark': 'bg-blue-500',
  'lepton': 'bg-emerald-500',
  'gauge': 'bg-orange-400',
  'scalar': 'bg-amber-400',
  'graviton': 'bg-neutral-400',
};

// Discovery timeline with full details
const DISCOVERIES = [
  {
    year: 1897,
    particles: ['e'],
    event: 'Discovery of the electron',
    who: 'J.J. Thomson',
    where: 'Cavendish Laboratory, Cambridge',
    imageAlt: 'J.J. Thomson with cathode ray tube apparatus',
    description: "J.J. Thomson's discovery of the electron fundamentally changed our understanding of matter. Using cathode ray tubes, he demonstrated that \"cathode rays\" were actually streams of particles much smaller than atoms, each carrying the same negative charge.",
    details: "Thomson measured the charge-to-mass ratio of these particles and found it to be over 1,000 times larger than hydrogen ions, proving they were far lighter than any atom. This was the first subatomic particle ever discovered, earning Thomson the 1906 Nobel Prize in Physics.",
    technology: 'Cathode ray tubes with magnetic and electric field deflection plates allowed precise measurement of particle trajectories.',
  },
  {
    year: 1905,
    particles: ['γ'],
    event: 'Photon concept introduced',
    who: 'Albert Einstein',
    where: 'Bern Patent Office',
    imageAlt: 'Albert Einstein in 1905',
    description: "Einstein's \"miracle year\" paper on the photoelectric effect proposed that light consists of discrete quanta of energy — what we now call photons. This revolutionary idea explained why light below a certain frequency cannot eject electrons from metals, regardless of intensity.",
    details: "Building on Planck's quantum hypothesis, Einstein showed that each photon carries energy E = hν (where h is Planck's constant and ν is frequency). This work earned him the 1921 Nobel Prize and laid groundwork for quantum mechanics.",
    technology: 'Photoelectric experiments using metal plates and precise voltage measurements to detect ejected electrons.',
  },
  {
    year: 1936,
    particles: ['μ'],
    event: 'Muon discovered in cosmic rays',
    who: 'Carl Anderson & Seth Neddermeyer',
    where: 'California Institute of Technology',
    imageAlt: 'Cloud chamber showing particle tracks',
    description: "The muon was discovered unexpectedly while studying cosmic rays in cloud chambers on Pike's Peak. Anderson and Neddermeyer found particles that curved differently from electrons in magnetic fields, indicating a mass about 200 times greater.",
    details: "Initially called the \"mesotron\" (later shortened to \"meson\" then corrected to \"muon\"), this particle puzzled physicists — it didn't fit any theoretical prediction. Isidor Rabi famously asked \"Who ordered that?\" The muon's existence hinted at the pattern of particle generations we now understand.",
    technology: 'Cloud chambers at high altitude with strong magnetic fields to separate particle tracks by charge and mass.',
  },
  {
    year: 1956,
    particles: ['νₑ'],
    event: 'Neutrino detected',
    who: 'Clyde Cowan & Frederick Reines',
    where: 'Savannah River Nuclear Plant',
    imageAlt: 'The neutrino detector at Savannah River',
    description: 'The neutrino, proposed by Pauli in 1930 to explain missing energy in beta decay, was finally detected 26 years later. Cowan and Reines placed a detector near a nuclear reactor, which produces an enormous flux of antineutrinos.',
    details: 'Their detector used tanks of water with dissolved cadmium chloride. When an antineutrino struck a proton, it produced a positron and neutron. The positron annihilated immediately (two gamma rays), while the neutron was captured microseconds later by cadmium (more gamma rays). This distinctive double-flash signature confirmed the neutrino\'s existence.',
    technology: 'Scintillator tanks with photomultiplier tubes, positioned near a nuclear reactor producing 10¹³ antineutrinos per square centimetre per second.',
  },
  {
    year: 1962,
    particles: ['νμ'],
    event: 'Muon neutrino discovered',
    who: 'Leon Lederman, Melvin Schwartz, Jack Steinberger',
    where: 'Brookhaven National Laboratory',
    imageAlt: 'Spark chamber at Brookhaven',
    description: 'This experiment proved that neutrinos come in different types ("flavours"). The team created a beam of neutrinos from pion decay and showed these neutrinos only produced muons, never electrons, when they interacted.',
    details: 'Using the Alternating Gradient Synchrotron, they created the first neutrino beam by directing protons at a beryllium target. Pions produced in the collision decayed into muons and neutrinos. A 40-foot iron shield stopped everything except neutrinos, which then passed into a spark chamber detector.',
    technology: 'The first accelerator-produced neutrino beam and 10-ton aluminium spark chamber detector. Won the 1988 Nobel Prize.',
  },
  {
    year: 1968,
    particles: ['u', 'd', 's'],
    event: 'Quarks revealed via deep inelastic scattering',
    who: 'SLAC-MIT Collaboration',
    where: 'Stanford Linear Accelerator Center',
    imageAlt: 'SLAC End Station A detector',
    description: 'High-energy electrons fired at protons scattered at unexpected angles, revealing that protons are not fundamental but contain point-like constituents. This was direct evidence for quarks, four years after Gell-Mann and Zweig proposed them theoretically.',
    details: "The experiment was analogous to Rutherford's alpha scattering that revealed the atomic nucleus. Just as alpha particles bounced back from gold foil, high-energy electrons \"bounced\" off something hard inside protons. Bjorken scaling in the data confirmed these constituents behaved as free particles at high energies.",
    technology: '20 GeV electron beam from the 2-mile linear accelerator, massive magnetic spectrometers, and pioneering data analysis computing.',
  },
  {
    year: 1974,
    particles: ['c'],
    event: 'November Revolution — J/ψ discovered',
    who: 'Burton Richter (SLAC) & Samuel Ting (Brookhaven)',
    where: 'SLAC and Brookhaven, simultaneously',
    imageAlt: 'The sharp J/ψ resonance peak',
    description: 'In an extraordinary coincidence, two teams discovered the same particle independently within days. Richter found it in electron-positron collisions at SLAC; Ting found it in proton-beryllium collisions at Brookhaven. They named it J (Ting) and ψ (Richter) — both names stuck.',
    details: "The J/ψ is a bound state of a charm quark and anti-charm quark (charmonium). Its discovery confirmed the existence of the charm quark, predicted to explain why certain decays were suppressed. The particle's unusually long lifetime made it stand out as a sharp peak in the data.",
    technology: 'SPEAR electron-positron storage ring at SLAC; fixed-target proton beamline at Brookhaven with magnetic spectrometers.',
  },
  {
    year: 1975,
    particles: ['τ'],
    event: 'Tau lepton discovered',
    who: 'Martin Perl',
    where: 'SLAC SPEAR',
    imageAlt: 'Martin Perl at SLAC',
    description: "The tau was discovered at the SPEAR collider by detecting events with an electron, a muon, and missing energy — a signature that couldn't come from known particles. This revealed a third generation of leptons.",
    details: "Perl's team found 64 events of the form e⁺e⁻ → e± μ∓ + missing energy. The only explanation was pair production of a new heavy lepton (τ⁺τ⁻) that decayed independently to electrons or muons plus neutrinos. The tau was 17 times heavier than the muon.",
    technology: 'SPEAR e⁺e⁻ storage ring and the Mark I detector with drift chambers, time-of-flight counters, and lead-glass calorimeters.',
  },
  {
    year: 1977,
    particles: ['b'],
    event: 'Bottom quark discovered',
    who: 'Leon Lederman et al.',
    where: 'Fermilab',
    imageAlt: 'The Upsilon resonance discovery',
    description: 'A new particle, the Upsilon (Υ), was discovered as a bump in the muon-pair mass spectrum from proton-nucleus collisions. Like the J/ψ for charm, the Υ revealed a fifth quark — the bottom (or "beauty") quark.',
    details: 'The Υ is a bound state of bottom and anti-bottom quarks (bottomonium). Its discovery confirmed the theoretical prediction of a third generation of quarks to match the three generations of leptons (electron, muon, tau). It also implied the existence of a sixth quark — the top — to complete the pattern.',
    technology: '400 GeV proton beam on copper and platinum targets, with iron and beryllium absorbers to select muon pairs.',
  },
  {
    year: 1979,
    particles: ['g'],
    event: 'Gluon observed in three-jet events',
    who: 'TASSO, MARK-J, JADE, PLUTO collaborations',
    where: 'DESY, Hamburg',
    imageAlt: 'A three-jet event from PETRA',
    description: 'The gluon, carrier of the strong force, was discovered at the PETRA electron-positron collider. While most collisions produced two back-to-back jets of particles (quark-antiquark pairs), some events showed three distinct jets.',
    details: "The third jet couldn't be a quark — it had to be a gluon radiated by one of the quarks (like a photon from an accelerated electron). The angular distribution of these three-jet events matched QCD predictions precisely, confirming both the gluon's existence and the theory of the strong force.",
    technology: 'PETRA 30 GeV e⁺e⁻ collider with multiple general-purpose detectors, each providing independent confirmation.',
  },
  {
    year: 1983,
    particles: ['W', 'Z'],
    event: 'W and Z bosons discovered',
    who: 'Carlo Rubbia & Simon van der Meer',
    where: 'CERN SPS',
    imageAlt: 'The UA1 detector at CERN',
    description: "The carriers of the weak force were discovered at CERN's Super Proton Synchrotron, converted into a proton-antiproton collider. The W boson was found in January, the Z boson in June — both matching electroweak theory predictions exactly.",
    details: 'Finding these particles required inventing stochastic cooling to accumulate enough antiprotons. The W was identified by its decay to an electron (or muon) plus missing energy (neutrino). The Z appeared as a sharp peak in electron-positron or muon-antimuon mass spectra. Rubbia and van der Meer shared the 1984 Nobel Prize.',
    technology: 'Stochastic cooling to collect antiprotons; the UA1 detector with a central tracking chamber in a dipole magnet.',
  },
  {
    year: 1995,
    particles: ['t'],
    event: 'Top quark discovered',
    who: 'CDF and DØ Collaborations',
    where: 'Fermilab Tevatron',
    imageAlt: 'The CDF detector at Fermilab',
    description: 'The top quark, predicted since the bottom quark\'s discovery in 1977, was finally found 18 years later. At 173 GeV — as heavy as a tungsten atom — it required the highest-energy collider then available.',
    details: "The top quark is so massive it decays before hadronising, giving a unique experimental signature. Both Tevatron experiments found top quarks by searching for events with a W boson and bottom-quark jets. The top's enormous mass (40× heavier than the bottom) remains unexplained.",
    technology: 'Tevatron proton-antiproton collider at 1.8 TeV centre-of-mass energy; silicon vertex detectors to identify bottom quarks.',
  },
  {
    year: 2000,
    particles: ['ντ'],
    event: 'Tau neutrino directly observed',
    who: 'DONUT Collaboration',
    where: 'Fermilab',
    imageAlt: 'Nuclear emulsion from DONUT',
    description: 'The tau neutrino was the last Standard Model fermion discovered. Though its existence was inferred from tau lepton decays, direct observation required producing tau neutrinos and detecting them creating tau leptons.',
    details: 'The experiment used nuclear emulsions — photographic plates that record particle tracks with micron precision. A beam of neutrinos from charmed meson decays passed through iron and emulsion plates. Tau neutrinos occasionally produced tau leptons, which traveled about 1mm before decaying — a distinctive "kink" in the track.',
    technology: 'Nuclear emulsion as a high-resolution tracking detector; beam dump to produce tau neutrinos from charmed meson decays.',
  },
  {
    year: 2012,
    particles: ['H'],
    event: 'Higgs boson discovered',
    who: 'ATLAS and CMS Collaborations',
    where: 'CERN Large Hadron Collider',
    imageAlt: 'A Higgs boson candidate event at CMS',
    description: 'Nearly 50 years after Peter Higgs and others predicted it, the Higgs boson was discovered at CERN. The announcement on 4 July 2012 confirmed the mechanism that gives particles their mass.',
    details: 'The Higgs was found by searching for its decay products — the clearest signatures being two photons (H→γγ) or four leptons (H→ZZ→4ℓ). With a mass of 125 GeV and properties matching Standard Model predictions, this discovery completed the particle content of the theory. Higgs and Englert received the 2013 Nobel Prize.',
    technology: 'The 27 km LHC colliding protons at 7-8 TeV; ATLAS and CMS detectors each containing millions of sensors; worldwide computing grid to analyse petabytes of data.',
  },
];

// Extended particle data for ledger
const PARTICLES_EXTENDED = [
  {
    id: 'up', symbol: 'u', name: 'up', type: 'quark', generation: 1,
    mass: '2.2 MeV/c²', charge: '+⅔', spin: '½', colorCharge: 'yes',
    interactions: 'strong, weak, EM, gravity',
    antiparticle: 'ū', theorized: 'Gell-Mann, Zweig (1964)', discovered: 'SLAC (1968)',
    weakIsospin: 'LH: +½, RH: 0', decays: 'stable'
  },
  {
    id: 'down', symbol: 'd', name: 'down', type: 'quark', generation: 1,
    mass: '4.7 MeV/c²', charge: '−⅓', spin: '½', colorCharge: 'yes',
    interactions: 'strong, weak, EM, gravity',
    antiparticle: 'd̄', theorized: 'Gell-Mann, Zweig (1964)', discovered: 'SLAC (1968)',
    weakIsospin: 'LH: −½, RH: 0', decays: 'stable in nuclei'
  },
  {
    id: 'charm', symbol: 'c', name: 'charm', type: 'quark', generation: 2,
    mass: '1.27 GeV/c²', charge: '+⅔', spin: '½', colorCharge: 'yes',
    interactions: 'strong, weak, EM, gravity',
    antiparticle: 'c̄', theorized: 'GIM (1970)', discovered: 'SLAC & Brookhaven (1974)',
    weakIsospin: 'LH: +½, RH: 0', decays: 'weak decay'
  },
  {
    id: 'strange', symbol: 's', name: 'strange', type: 'quark', generation: 2,
    mass: '95 MeV/c²', charge: '−⅓', spin: '½', colorCharge: 'yes',
    interactions: 'strong, weak, EM, gravity',
    antiparticle: 's̄', theorized: 'Gell-Mann, Zweig (1964)', discovered: 'SLAC (1968)',
    weakIsospin: 'LH: −½, RH: 0', decays: 'weak decay'
  },
  {
    id: 'top', symbol: 't', name: 'top', type: 'quark', generation: 3,
    mass: '173 GeV/c²', charge: '+⅔', spin: '½', colorCharge: 'yes',
    interactions: 'strong, weak, EM, gravity',
    antiparticle: 't̄', theorized: 'Kobayashi, Maskawa (1973)', discovered: 'Fermilab (1995)',
    weakIsospin: 'LH: +½, RH: 0', decays: 'W + b (before hadronisation)'
  },
  {
    id: 'bottom', symbol: 'b', name: 'bottom', type: 'quark', generation: 3,
    mass: '4.18 GeV/c²', charge: '−⅓', spin: '½', colorCharge: 'yes',
    interactions: 'strong, weak, EM, gravity',
    antiparticle: 'b̄', theorized: 'Kobayashi, Maskawa (1973)', discovered: 'Fermilab (1977)',
    weakIsospin: 'LH: −½, RH: 0', decays: 'weak decay'
  },
  {
    id: 'electron', symbol: 'e', name: 'electron', type: 'lepton', generation: 1,
    mass: '0.511 MeV/c²', charge: '−1', spin: '½', colorCharge: 'no',
    interactions: 'weak, EM, gravity',
    antiparticle: 'e⁺ (positron)', theorized: 'Stoney (1874)', discovered: 'Cambridge (1897)',
    weakIsospin: 'LH: −½, RH: 0', decays: 'stable'
  },
  {
    id: 'muon', symbol: 'μ', name: 'muon', type: 'lepton', generation: 2,
    mass: '105.7 MeV/c²', charge: '−1', spin: '½', colorCharge: 'no',
    interactions: 'weak, EM, gravity',
    antiparticle: 'μ⁺', theorized: '—', discovered: 'Caltech (1936)',
    weakIsospin: 'LH: −½, RH: 0', decays: 'e⁻ + ν̄ₑ + νμ'
  },
  {
    id: 'tau', symbol: 'τ', name: 'tau', type: 'lepton', generation: 3,
    mass: '1.777 GeV/c²', charge: '−1', spin: '½', colorCharge: 'no',
    interactions: 'weak, EM, gravity',
    antiparticle: 'τ⁺', theorized: '—', discovered: 'SLAC (1975)',
    weakIsospin: 'LH: −½, RH: 0', decays: 'various (hadrons, leptons)'
  },
  {
    id: 'electron-neutrino', symbol: 'νₑ', name: 'electron neutrino', type: 'lepton', generation: 1,
    mass: '< 1.0 eV/c²', charge: '0', spin: '½', colorCharge: 'no',
    interactions: 'weak, gravity',
    antiparticle: 'ν̄ₑ', theorized: 'Pauli (1930)', discovered: 'Savannah River (1956)',
    weakIsospin: 'LH: +½', decays: 'stable (oscillates)'
  },
  {
    id: 'muon-neutrino', symbol: 'νμ', name: 'muon neutrino', type: 'lepton', generation: 2,
    mass: '< 0.17 MeV/c²', charge: '0', spin: '½', colorCharge: 'no',
    interactions: 'weak, gravity',
    antiparticle: 'ν̄μ', theorized: '—', discovered: 'Brookhaven (1962)',
    weakIsospin: 'LH: +½', decays: 'stable (oscillates)'
  },
  {
    id: 'tau-neutrino', symbol: 'ντ', name: 'tau neutrino', type: 'lepton', generation: 3,
    mass: '< 18.2 MeV/c²', charge: '0', spin: '½', colorCharge: 'no',
    interactions: 'weak, gravity',
    antiparticle: 'ν̄τ', theorized: '—', discovered: 'Fermilab (2000)',
    weakIsospin: 'LH: +½', decays: 'stable (oscillates)'
  },
  {
    id: 'gluon', symbol: 'g', name: 'gluon', type: 'gauge', generation: null,
    mass: '0', charge: '0', spin: '1', colorCharge: 'yes (octet)',
    interactions: 'strong',
    antiparticle: 'g (self)', theorized: 'Gell-Mann et al. (1973)', discovered: 'DESY (1979)',
    weakIsospin: '0', decays: 'confined'
  },
  {
    id: 'photon', symbol: 'γ', name: 'photon', type: 'gauge', generation: null,
    mass: '0', charge: '0', spin: '1', colorCharge: 'no',
    interactions: 'electromagnetic',
    antiparticle: 'γ (self)', theorized: 'Einstein (1905)', discovered: 'Bern (1905)',
    weakIsospin: '0', decays: 'stable'
  },
  {
    id: 'w-boson', symbol: 'W', name: 'W boson', type: 'gauge', generation: null,
    mass: '80.4 GeV/c²', charge: '±1', spin: '1', colorCharge: 'no',
    interactions: 'weak',
    antiparticle: 'W⁺ ↔ W⁻', theorized: 'Glashow, Weinberg, Salam (1968)', discovered: 'CERN (1983)',
    weakIsospin: '±1', decays: 'leptons or quarks'
  },
  {
    id: 'z-boson', symbol: 'Z', name: 'Z boson', type: 'gauge', generation: null,
    mass: '91.2 GeV/c²', charge: '0', spin: '1', colorCharge: 'no',
    interactions: 'weak',
    antiparticle: 'Z (self)', theorized: 'Glashow, Weinberg, Salam (1968)', discovered: 'CERN (1983)',
    weakIsospin: '0', decays: 'fermion pairs'
  },
  {
    id: 'higgs', symbol: 'H', name: 'Higgs boson', type: 'scalar', generation: null,
    mass: '125.1 GeV/c²', charge: '0', spin: '0', colorCharge: 'no',
    interactions: 'weak, Higgs',
    antiparticle: 'H (self)', theorized: 'Higgs, Englert, Brout (1964)', discovered: 'CERN LHC (2012)',
    weakIsospin: '−½', decays: 'bb̄, WW, ττ, ZZ, γγ'
  },
];

// Particle Ledger component
function ParticleLedger() {
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'generation' | 'mass'>('type');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null);

  const sortedParticles = useMemo(() => {
    const sorted = [...PARTICLES_EXTENDED].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'type': return a.type.localeCompare(b.type);
        case 'generation': return (a.generation || 99) - (b.generation || 99);
        case 'mass': {
          const parseM = (m: string) => {
            if (m.startsWith('<')) return 0;
            const num = parseFloat(m);
            if (m.includes('GeV')) return num * 1000;
            if (m.includes('eV') && !m.includes('MeV')) return num / 1000;
            return num;
          };
          return parseM(a.mass) - parseM(b.mass);
        }
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

  return (
    <div className="space-y-px">
      <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
        <h2 className="text-xl md:text-2xl font-light text-white uppercase">Particle Ledger</h2>
        <p className="text-xs md:text-sm text-white/50 mt-1">All 17 particles with full properties — click headers to sort, rows to expand</p>
      </div>

      {/* Table header */}
      <div className="bg-[#1d1d1d] rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-2 md:p-3 bg-black/30 text-[9px] md:text-[10px] uppercase tracking-wider text-white/50">
          <div className="col-span-3">Particle</div>
          <button
            onClick={() => handleSort('type')}
            className="col-span-2 text-left hover:text-white transition-colors"
          >
            Type {sortBy === 'type' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
          <div className="col-span-2 hidden md:block">Mass</div>
          <div className="col-span-1">Charge</div>
          <div className="col-span-1">Spin</div>
          <button
            onClick={() => handleSort('generation')}
            className="col-span-1 text-left hover:text-white transition-colors hidden md:block"
          >
            Gen {sortBy === 'generation' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
          <div className="col-span-2 md:col-span-1 text-right">Found</div>
        </div>
      </div>

      {/* Table rows */}
      {sortedParticles.map((p) => (
        <div key={p.id} className="bg-[#1d1d1d] rounded-lg overflow-hidden">
          <button
            onClick={() => setSelectedParticle(selectedParticle === p.id ? null : p.id)}
            className="w-full grid grid-cols-12 gap-2 p-2 md:p-3 items-center hover:bg-white/5 transition-colors text-left"
          >
            <div className="col-span-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded ${TYPE_COLORS[p.type]}`} />
              <span className="font-stix text-base md:text-lg text-white">{p.symbol}</span>
              <span className="text-xs text-white/60 hidden sm:inline">{p.name}</span>
            </div>
            <div className="col-span-2 text-xs text-white/60 capitalize">{p.type}</div>
            <div className="col-span-2 hidden md:block font-mono text-xs text-white/80">{p.mass}</div>
            <div className="col-span-1 font-stix text-sm text-white/80">{p.charge}</div>
            <div className="col-span-1 font-stix text-sm text-white/80">{p.spin}</div>
            <div className="col-span-1 hidden md:block text-xs text-white/60">{p.generation || '—'}</div>
            <div className="col-span-2 md:col-span-1 text-right text-xs text-white/60">
              {p.discovered.split(' ')[0].replace(/[()]/g, '')}
            </div>
          </button>

          {/* Expanded details */}
          {selectedParticle === p.id && (
            <div className="border-t border-white/10 p-2 md:p-4 bg-black/20 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Mass</div>
                  <div className="font-mono text-white">{p.mass}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Electric Charge</div>
                  <div className="font-stix text-white">{p.charge} e</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Spin</div>
                  <div className="font-stix text-white">{p.spin} ℏ</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Color Charge</div>
                  <div className="text-white">{p.colorCharge}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Weak Isospin</div>
                  <div className="font-stix text-white text-[11px]">{p.weakIsospin}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Interactions</div>
                  <div className="text-white">{p.interactions}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Antiparticle</div>
                  <div className="font-stix text-white">{p.antiparticle}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Decays</div>
                  <div className="text-white">{p.decays}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5">
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Theorized</div>
                  <div className="text-white">{p.theorized}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase mb-1">Discovered</div>
                  <div className="text-white">{p.discovered}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Units help link */}
      <div className="bg-[#1d1d1d] rounded-lg p-3 md:p-4">
        <Link
          href="/data/units#particle"
          className="flex items-center gap-3 text-white/40 hover:text-white/60 transition-colors group"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <span className="text-sm">Why GeV instead of kilograms?</span>
            <span className="text-xs text-white/30 ml-2 group-hover:text-white/40 transition-colors">
              E = mc² means mass and energy are interchangeable →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

// Discovery Timeline component
function DiscoveryTimeline() {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  return (
    <div className="space-y-px">
      <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
        <h2 className="text-xl md:text-2xl font-light text-white uppercase">Discovery Timeline</h2>
        <p className="text-xs md:text-sm text-white/50 mt-1">
          1897–2012 — 115 years of particle discovery. Click to learn more about each breakthrough.
        </p>
      </div>

      {DISCOVERIES.map((d) => (
        <div key={d.year} className="bg-[#1d1d1d] rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedYear(expandedYear === d.year ? null : d.year)}
            className="w-full flex items-start gap-3 md:gap-4 p-2 md:p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="text-lg md:text-xl font-mono text-white/40 w-12 md:w-16 flex-shrink-0">
              {d.year}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-stix text-base md:text-lg text-white">
                  {d.particles.join(' ')}
                </span>
                <span className="text-xs md:text-sm text-white/70">{d.event}</span>
              </div>
              <div className="text-[10px] md:text-xs text-white/40">
                {d.who} · {d.where}
              </div>
            </div>
            <div className={`w-5 h-5 flex items-center justify-center text-white/30 transition-transform ${expandedYear === d.year ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Expanded content */}
          {expandedYear === d.year && (
            <div className="border-t border-white/10 p-2 md:p-4 bg-black/20">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Image placeholder */}
                <div className="w-full md:w-48 h-32 md:h-36 bg-black/40 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <div className="text-center p-4">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Image</div>
                    <div className="text-xs text-white/50">{d.imageAlt}</div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-sm text-white/70">{d.description}</p>
                  <p className="text-sm text-white/60">{d.details}</p>
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Technology</div>
                    <p className="text-xs text-white/50">{d.technology}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Main page component
export default function StandardModelPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="px-2 md:px-4 pt-2 md:pt-4 pb-4 md:pb-8">

        <BreadcrumbFrame
          variant="dark"
          icon={<DataIcon className="w-4 h-4" />}
          items={breadcrumbItems(
            ['MXWLL', '/'],
            ['Data', '/data'],
            ['The Fabric', '/data/fabric'],
            ['Standard Model']
          )}
        />

        <PageHeaderFrame
          variant="dark"
          title="The Standard Model"
          description="The theoretical framework describing all known fundamental particles and three of the four fundamental forces — our most complete picture of nature at its smallest scales."
        />

        {/* Hero Image Frame */}
        <div className="bg-[#1d1d1d] rounded-lg overflow-hidden mb-px">
          <div className="relative aspect-[21/9] md:aspect-[3/1] bg-black/40">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Hero Image</div>
                <div className="text-sm text-white/50">Particle collision event or CERN accelerator tunnel</div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-4">
              <p className="text-[10px] md:text-xs text-white/60">
                A proton-proton collision event at the Large Hadron Collider, where the Higgs boson was discovered in 2012.
              </p>
            </div>
          </div>
        </div>

        {/* Chart Frame */}
        <StandardModelChart className="mb-px" />

        {/* Ledger Section */}
        <div className="mb-px">
          <ParticleLedger />
        </div>

        {/* Timeline Section */}
        <div className="mb-px">
          <DiscoveryTimeline />
        </div>

        {/* Composite Particles Section */}
        <div className="space-y-px mb-px">
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h2 className="text-xl md:text-2xl font-light text-white uppercase">Composite Particles</h2>
            <p className="text-xs md:text-sm text-white/50 mt-1">How quarks combine to form hadrons</p>
          </div>

          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <p className="text-xs md:text-sm text-white/60 max-w-2xl">
              Quarks never exist in isolation — they're confined by the strong force into composite particles called hadrons.
              The two main families are baryons (three quarks) and mesons (quark-antiquark pairs).
            </p>
          </div>

          {/* Baryons */}
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h3 className="text-base md:text-lg font-light text-white mb-2">Baryons</h3>
            <p className="text-xs text-white/50 mb-3">Three quarks bound together. Includes all "ordinary" matter.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              {[
                { name: 'Proton', quarks: 'uud', charge: '+1', mass: '938 MeV', note: 'Stable' },
                { name: 'Neutron', quarks: 'udd', charge: '0', mass: '940 MeV', note: '~10 min half-life' },
                { name: 'Lambda', quarks: 'uds', charge: '0', mass: '1116 MeV', note: 'Contains strange' },
                { name: 'Omega⁻', quarks: 'sss', charge: '−1', mass: '1672 MeV', note: 'Three strange quarks' },
              ].map((p, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-2 md:p-3">
                  <div className="text-xs md:text-sm text-white font-medium">{p.name}</div>
                  <div className="font-stix text-base md:text-lg text-blue-400 my-1">{p.quarks}</div>
                  <div className="text-[9px] md:text-[10px] text-white/40 space-y-0.5">
                    <div>Charge: <span className="font-stix">{p.charge}</span></div>
                    <div>Mass: {p.mass}</div>
                    <div>{p.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mesons */}
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h3 className="text-base md:text-lg font-light text-white mb-2">Mesons</h3>
            <p className="text-xs text-white/50 mb-3">Quark-antiquark pairs. Unstable, mediate nuclear forces.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
              {[
                { name: 'Pion (π⁺)', quarks: 'ud̄', charge: '+1', mass: '140 MeV', note: 'Nuclear force carrier' },
                { name: 'Kaon (K⁺)', quarks: 'us̄', charge: '+1', mass: '494 MeV', note: 'Contains strange' },
                { name: 'J/ψ', quarks: 'cc̄', charge: '0', mass: '3097 MeV', note: 'Charmonium' },
                { name: 'Upsilon (Υ)', quarks: 'bb̄', charge: '0', mass: '9460 MeV', note: 'Bottomonium' },
              ].map((p, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-2 md:p-3">
                  <div className="text-xs md:text-sm text-white font-medium">{p.name}</div>
                  <div className="font-stix text-base md:text-lg text-blue-400 my-1">{p.quarks}</div>
                  <div className="text-[9px] md:text-[10px] text-white/40 space-y-0.5">
                    <div>Charge: <span className="font-stix">{p.charge}</span></div>
                    <div>Mass: {p.mass}</div>
                    <div>{p.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exotic Hadrons */}
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h3 className="text-base md:text-lg font-light text-white mb-2">Exotic Hadrons</h3>
            <p className="text-xs text-white/50 mb-3">Recently discovered states with unusual quark configurations.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {[
                { name: 'Tetraquarks', desc: 'Four quarks (e.g., cc̄ud̄). First confirmed by LHCb in 2021.' },
                { name: 'Pentaquarks', desc: 'Five quarks (e.g., uudcc̄). Discovered at LHCb in 2015.' },
              ].map((p, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-2 md:p-3">
                  <div className="text-xs md:text-sm text-white font-medium">{p.name}</div>
                  <div className="text-[10px] md:text-xs text-white/50 mt-1">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Antiparticles Section */}
        <div className="space-y-px mb-px">
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h2 className="text-xl md:text-2xl font-light text-white uppercase">Antiparticles</h2>
            <p className="text-xs md:text-sm text-white/50 mt-1">Every particle has an antimatter counterpart</p>
          </div>

          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <p className="text-xs md:text-sm text-white/60 max-w-2xl">
              For every particle, there exists an antiparticle with identical mass but opposite charge and quantum numbers.
              When a particle meets its antiparticle, they annihilate — converting their mass entirely into energy.
            </p>
          </div>

          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px">
              {[
                { particle: 'Electron (e⁻)', anti: 'Positron (e⁺)', note: 'First antiparticle discovered (1932)' },
                { particle: 'Proton (p)', anti: 'Antiproton (p̄)', note: 'Discovered at Berkeley (1955)' },
                { particle: 'Neutrino (ν)', anti: 'Antineutrino (ν̄)', note: 'May be its own antiparticle' },
                { particle: 'Up quark (u)', anti: 'Anti-up (ū)', note: 'Charge: +⅔ → −⅔' },
                { particle: 'Photon (γ)', anti: 'Photon (γ)', note: 'Its own antiparticle' },
                { particle: 'Higgs (H)', anti: 'Higgs (H)', note: 'Its own antiparticle' },
              ].map((p, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-2 md:p-3">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <span className="text-[10px] md:text-xs text-white">{p.particle}</span>
                    <span className="text-white/30">↔</span>
                    <span className="text-[10px] md:text-xs text-white">{p.anti}</span>
                  </div>
                  <div className="text-[9px] md:text-[10px] text-white/40">{p.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="bg-black/30 rounded-lg p-3 md:p-4">
              <h3 className="text-xs md:text-sm font-medium text-amber-400 mb-2">The Matter-Antimatter Mystery</h3>
              <p className="text-[10px] md:text-xs text-white/50">
                The Big Bang should have produced equal amounts of matter and antimatter, which would have annihilated completely.
                Yet our universe is made almost entirely of matter. This asymmetry — one of the biggest unsolved problems in physics —
                requires CP violation beyond what the Standard Model predicts.
              </p>
            </div>
          </div>
        </div>

        {/* Beyond Standard Model Section */}
        <div className="space-y-px mb-px">
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h2 className="text-xl md:text-2xl font-light text-white uppercase">Beyond the Standard Model</h2>
            <p className="text-xs md:text-sm text-white/50 mt-1">Hypothetical particles and unsolved problems</p>
          </div>

          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <p className="text-xs md:text-sm text-white/60 max-w-2xl">
              The Standard Model is incomplete. It doesn't include gravity, can't explain dark matter or dark energy,
              and has no mechanism for neutrino masses. Several theoretical particles have been proposed to address these gaps.
            </p>
          </div>

          {/* Graviton */}
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="bg-black/30 rounded-lg p-3 md:p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-neutral-500 flex items-center justify-center flex-shrink-0">
                  <span className="font-stix text-xl md:text-2xl text-neutral-900">G</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg text-white">Graviton</h3>
                  <p className="text-[10px] md:text-xs text-white/50 mb-2">Spin-2 · Mass: 0 · Charge: 0</p>
                  <p className="text-xs md:text-sm text-white/60">
                    The hypothetical carrier of the gravitational force. Required by quantum field theory to quantise gravity,
                    but not yet detected. Extremely weak coupling makes direct observation essentially impossible with current technology.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Matter Candidates */}
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h3 className="text-base md:text-lg font-light text-white mb-3">Dark Matter Candidates</h3>
            <p className="text-xs text-white/50 mb-3">Particles proposed to explain the 27% of the universe we can't see.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              {[
                {
                  name: 'WIMPs',
                  full: 'Weakly Interacting Massive Particles',
                  desc: 'Heavy particles (~10–1000 GeV) interacting via weak force. Predicted by supersymmetry.',
                  status: 'Increasingly constrained'
                },
                {
                  name: 'Axions',
                  full: 'Pseudo-Goldstone Bosons',
                  desc: 'Ultra-light particles (~10⁻⁵ eV) originally proposed to solve the strong CP problem.',
                  status: 'Leading candidate'
                },
                {
                  name: 'Sterile Neutrinos',
                  full: 'Right-Handed Neutrinos',
                  desc: 'Heavy neutrinos that interact only via gravity. Could explain neutrino masses too.',
                  status: 'Viable'
                },
                {
                  name: 'Primordial Black Holes',
                  full: 'Formed in Early Universe',
                  desc: 'Not particles, but small black holes formed before nucleosynthesis.',
                  status: 'Partially constrained'
                },
              ].map((p, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-2 md:p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-xs md:text-sm text-white font-medium">{p.name}</div>
                    <span className="text-[8px] md:text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/40 flex-shrink-0">{p.status}</span>
                  </div>
                  <div className="text-[9px] text-white/30 mb-2">{p.full}</div>
                  <p className="text-[10px] md:text-xs text-white/50">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supersymmetry */}
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h3 className="text-base md:text-lg font-light text-white mb-3">Supersymmetric Partners</h3>
            <p className="text-xs text-white/50 mb-3">Predicted by supersymmetry — every SM particle has a heavier "superpartner".</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-px">
              {[
                { name: 'Selectron', partner: 'Electron', symbol: 'ẽ' },
                { name: 'Squark', partner: 'Quark', symbol: 'q̃' },
                { name: 'Gluino', partner: 'Gluon', symbol: 'g̃' },
                { name: 'Photino', partner: 'Photon', symbol: 'γ̃' },
                { name: 'Wino', partner: 'W boson', symbol: 'W̃' },
                { name: 'Higgsino', partner: 'Higgs', symbol: 'H̃' },
              ].map((p, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-2 text-center">
                  <div className="font-stix text-base md:text-lg text-white/60">{p.symbol}</div>
                  <div className="text-[8px] md:text-[10px] text-white/40">{p.name}</div>
                </div>
              ))}
            </div>
            <p className="text-[10px] md:text-xs text-white/40 mt-2">
              None have been detected at the LHC. If they exist, they're heavier than ~1 TeV.
            </p>
          </div>
        </div>

        {/* Framework Section */}
        <div className="space-y-px mb-px">
          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <h2 className="text-xl md:text-2xl font-light text-white uppercase">The Framework</h2>
            <p className="text-xs md:text-sm text-white/60 mt-2 max-w-2xl">
              The Standard Model is a quantum field theory developed between 1961–1979. It describes the electromagnetic,
              weak, and strong nuclear forces, and classifies all known elementary particles. It has survived every
              experimental test — yet we know it's incomplete.
            </p>
          </div>

          <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-px">
              {[
                { value: '17', label: 'Particles' },
                { value: '4', label: 'Forces' },
                { value: '3', label: 'Generations' },
                { value: '19', label: 'Free parameters' },
                { value: '~5%', label: 'Of universe explained' },
                { value: '0', label: 'Gravitons found' },
              ].map((stat, i) => (
                <div key={i} className="bg-black/30 rounded-lg p-2 md:p-3 text-center">
                  <div className="text-base md:text-xl font-mono text-white">{stat.value}</div>
                  <div className="text-[8px] md:text-[10px] text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cross-References */}
        <div className="bg-[#1d1d1d] rounded-lg p-2 md:p-4">
          <div className="text-xs md:text-sm text-white/40 uppercase tracking-wider mb-3">Related</div>
          <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
            <Link href="/data/fabric/forces" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Fundamental Forces →
            </Link>
            <Link href="/data/fabric/constants" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Physical Constants →
            </Link>
            <Link href="/data/fabric/spectrum" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              EM Spectrum →
            </Link>
            <Link href="/data/units" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Units & Measurement →
            </Link>
            <Link href="/observe/detectors/lhc" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              LHC Status →
            </Link>
            <Link href="/observe/detectors" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Particle Detectors →
            </Link>
          </div>

          <div className="pt-3 md:pt-4 border-t border-white/10">
            <div className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-wider mb-2">References</div>
            <div className="text-[10px] md:text-xs text-white/40">
              Particle Data Group (PDG) Review 2024 · CODATA 2022 · CERN Document Server · Nobel Prize Archive
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
