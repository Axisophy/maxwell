'use client';

import React from 'react';
import NuclideChart from './NuclideChart';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function NuclidesPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Page intro - only shows on larger screens or can scroll past */}
      <div className="bg-white border-b border-black/10">
        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="max-w-4xl">
            <Breadcrumb
              items={[
                { label: 'MXWLL', href: '/' },
                { label: 'Data', href: '/data' },
                { label: 'Chart of Nuclides' },
              ]}
              theme="light"
              className="mb-2"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
              Chart of Nuclides
            </h1>
            <p className="text-base md:text-lg text-black/70 max-w-2xl">
              Every known isotope of every element, mapped by protons and neutrons. 
              The periodic table shows 118 elements — this chart shows over 3,000 distinct nuclei.
              Stable isotopes form the "valley of stability" running diagonally through the chart.
            </p>
          </div>
        </div>
      </div>

      {/* The chart - explicit height for canvas rendering */}
      <div className="h-[500px] md:h-[600px] lg:h-[700px]" style={{ maxHeight: '800px' }}>
        <NuclideChart className="h-full" />
      </div>

      {/* Educational footer */}
      <div className="bg-white border-t border-black/10">
        <div className="px-4 md:px-8 lg:px-12 py-6">
          <div className="max-w-4xl">
            <h2 className="text-lg font-medium text-black mb-4">Understanding the Chart</h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm text-black/70">
              <div>
                <h3 className="font-medium text-black mb-2">What is a nuclide?</h3>
                <p>
                  A nuclide is a specific combination of protons (Z) and neutrons (N) in an atomic nucleus. 
                  While the periodic table groups atoms by proton count alone (elements), nuclides distinguish 
                  between isotopes — atoms with the same proton count but different neutron counts.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-black mb-2">The Valley of Stability</h3>
                <p>
                  Stable nuclides cluster along a diagonal "valley" where the balance of protons and neutrons 
                  creates a stable nuclear configuration. Light elements prefer equal numbers (N ≈ Z), 
                  while heavy elements need more neutrons to remain stable.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-black mb-2">Magic Numbers</h3>
                <p>
                  Nuclei with "magic" numbers of protons or neutrons (2, 8, 20, 28, 50, 82, 126) are 
                  exceptionally stable. These correspond to filled nuclear shells, similar to electron 
                  shells in atoms. Lead-208 is "doubly magic" with 82 protons and 126 neutrons.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-black mb-2">Decay Modes</h3>
                <p>
                  Unstable nuclides decay toward stability. Neutron-rich nuclei undergo β⁻ decay 
                  (neutron → proton), while proton-rich nuclei undergo β⁺ decay or electron capture. 
                  Very heavy nuclei often undergo α decay, emitting helium-4 nuclei.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-black/10">
              <h3 className="font-medium text-black mb-2">Data Sources</h3>
              <p className="text-sm text-black/50">
                Nuclear data compiled from the IAEA Nuclear Data Services, National Nuclear Data Center (NNDC), 
                and Atomic Mass Evaluation (AME2020). This visualization includes approximately 3,300 known nuclides.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}