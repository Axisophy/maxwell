'use client';

import Link from 'next/link';
import StandardModelChart from '@/components/data/StandardModelChart';

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

export default function StandardModelPage() {
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
          </p>
        </div>

        {/* Chart Frame */}
        <div className="mb-px">
          <StandardModelChart />
        </div>

        {/* Placeholder for controls/details - we'll add these later */}
        <div className="bg-[#1d1d1d] rounded-lg p-4">
          <p className="text-sm text-white/40">
            Controls and particle details will go here...
          </p>
        </div>

      </div>
    </main>
  );
}
