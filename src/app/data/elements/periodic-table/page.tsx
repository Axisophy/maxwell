'use client';

import React from 'react';
import Link from 'next/link';
import PeriodicTable from '@/components/data/elements/PeriodicTable';
import { ELEMENTS, CATEGORY_LABELS, ElementCategory } from '@/components/data/elements/elementsData';
import { PageShell, BreadcrumbFrame, PageHeaderFrame, breadcrumbItems } from '@/components/ui';
import { DataIcon } from '@/components/icons';

// Stats for the header
const STATS = [
  {
    label: 'Elements',
    value: '118',
    note: 'Confirmed'
  },
  {
    label: 'Naturally Occurring',
    value: '94',
    note: 'Found in nature'
  },
  {
    label: 'Synthetic',
    value: '24',
    note: 'Created in labs'
  },
  {
    label: 'Noble Gases',
    value: '7',
    note: 'Group 18'
  },
];

// Category counts
const getCategoryCounts = () => {
  const counts: Record<ElementCategory, number> = {
    'alkali-metal': 0,
    'alkaline-earth': 0,
    'transition-metal': 0,
    'post-transition-metal': 0,
    'metalloid': 0,
    'nonmetal': 0,
    'halogen': 0,
    'noble-gas': 0,
    'lanthanide': 0,
    'actinide': 0,
  };

  ELEMENTS.forEach(e => {
    counts[e.category]++;
  });

  return counts;
};

export default function PeriodicTablePage() {
  const categoryCounts = getCategoryCounts();

  return (
    <PageShell>
      <BreadcrumbFrame
        variant="light"
        icon={<DataIcon className="w-4 h-4" />}
        items={breadcrumbItems(
          ['MXWLL', '/'],
          ['Data', '/data'],
          ['Elements', '/data/elements'],
          ['Periodic Table']
        )}
      />

      <PageHeaderFrame
        variant="light"
        title="The Periodic Table"
        description="118 elements arranged by atomic number and electron configuration. The table reveals patterns in properties that repeat periodically — elements in the same column share chemical behaviours."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-px">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg p-3 md:p-4">
            <div className="text-[10px] md:text-xs text-black/50 uppercase tracking-wider mb-1">
              {stat.label}
            </div>
            <div className="text-2xl md:text-3xl font-bold text-black tabular-nums">
              {stat.value}
            </div>
            <div className="text-xs text-black/40 mt-1">
              {stat.note}
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Frame */}
      <div className="bg-white rounded-lg p-4 mb-px">
        <PeriodicTable />
      </div>

      {/* Understanding Section */}
      <div className="bg-white rounded-lg p-4 mb-px">
        <h2 className="text-xl md:text-2xl font-light text-black uppercase mb-4">
          Understanding the Table
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-black rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">Periods (Rows)</h3>
            <p className="text-sm text-white/60">
              Each row represents an electron shell. Elements in the same period
              have the same number of electron shells. Moving left to right,
              atomic number increases and properties change systematically.
            </p>
          </div>

          <div className="bg-black rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">Groups (Columns)</h3>
            <p className="text-sm text-white/60">
              Elements in the same group have similar chemical properties because
              they have the same number of valence electrons. Group 1 elements
              are highly reactive; Group 18 elements are inert.
            </p>
          </div>

          <div className="bg-black rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">Blocks</h3>
            <p className="text-sm text-white/60">
              The table divides into s, p, d, and f blocks based on which orbital
              the outermost electron occupies. s-block (Groups 1-2), p-block (13-18),
              d-block (transition metals), f-block (lanthanides/actinides).
            </p>
          </div>

          <div className="bg-black rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">Periodic Trends</h3>
            <p className="text-sm text-white/60">
              Properties like electronegativity, atomic radius, and ionisation energy
              follow predictable patterns. Electronegativity increases left-to-right
              and bottom-to-top. Atomic radius decreases left-to-right.
            </p>
          </div>
        </div>
      </div>

      {/* Element Categories */}
      <div className="bg-white rounded-lg p-4 mb-px">
        <h2 className="text-xl md:text-2xl font-light text-black uppercase mb-4">
          Element Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-px">
          {(Object.entries(CATEGORY_LABELS) as [ElementCategory, string][]).map(([key, label]) => (
            <div key={key} className="bg-black rounded-lg p-3 border border-white/10">
              <div className="text-sm font-medium text-white mb-1">{label}</div>
              <div className="text-2xl font-bold text-white/80 tabular-nums">
                {categoryCounts[key]}
              </div>
              <div className="text-xs text-white/40">elements</div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Context */}
      <div className="bg-white rounded-lg p-4 mb-px">
        <h2 className="text-xl md:text-2xl font-light text-black uppercase mb-4">
          A Brief History
        </h2>

        <div className="prose prose-sm max-w-none text-black/70">
          <p>
            The periodic table was independently proposed by Dmitri Mendeleev and
            Lothar Meyer in 1869. Mendeleev arranged elements by atomic mass and
            noticed recurring patterns in their properties. Crucially, he left gaps
            for undiscovered elements and accurately predicted their properties.
          </p>
          <p className="mt-3">
            The modern table arranges elements by atomic number (proton count) rather
            than mass, following Henry Moseley&apos;s 1913 work with X-ray spectroscopy.
            This resolved anomalies like tellurium and iodine, which are reversed
            by mass but correctly ordered by atomic number.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">1869</div>
            <div className="text-xs text-black/40">Mendeleev&apos;s table</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">1913</div>
            <div className="text-xs text-black/40">Moseley&apos;s ordering</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">2016</div>
            <div className="text-xs text-black/40">Period 7 completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">118</div>
            <div className="text-xs text-black/40">Elements confirmed</div>
          </div>
        </div>
      </div>

      {/* Cross-References Frame */}
      <div className="bg-white rounded-lg p-4">
        <div className="text-sm text-black/40 uppercase tracking-wider mb-3">Related</div>
        <div className="flex flex-wrap gap-4 mb-6">
          <Link href="/data/elements/nuclides" className="text-sm text-black/60 hover:text-black transition-colors">
            Chart of Nuclides →
          </Link>
          <Link href="/data/elements/trends" className="text-sm text-black/60 hover:text-black transition-colors">
            Element Trends →
          </Link>
          <Link href="/data/elements/bonds" className="text-sm text-black/60 hover:text-black transition-colors">
            Chemical Bonds →
          </Link>
          <Link href="/data/fabric/particles" className="text-sm text-black/60 hover:text-black transition-colors">
            Standard Model →
          </Link>
        </div>

        <div className="pt-4 border-t border-black/10">
          <div className="text-[10px] text-black/30 uppercase tracking-wider mb-2">Data Sources</div>
          <div className="text-xs text-black/40">
            IUPAC Periodic Table · NIST Atomic Spectra Database · CRC Handbook of Chemistry and Physics
          </div>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </PageShell>
  );
}
