import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CollapsibleTree from '@/components/living-network/CollapsibleTree';
import { buildFullTree, kingdoms } from '@/lib/living-network/data';

export const metadata: Metadata = {
  title: 'The Living Network | MXWLL',
  description:
    'Explore the relationships between all living things - from bacteria to blue whales. An interactive map of life on Earth.',
};

export default function LivingNetworkPage() {
  const tree = buildFullTree();

  // Stats
  const totalSpecies = 2100000;
  const totalKingdoms = kingdoms.length;
  const yearsOfLife = 3.8;

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile top padding */}
      <div className="h-14 md:hidden" />

      <div className="px-4 md:px-8 lg:px-12 pt-6 md:pt-8 lg:pt-12 pb-16 md:pb-20 lg:pb-24">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Data', href: '/data' },
            { label: 'Living Network', href: '/data/living-network' },
          ]}
        />

        {/* Header */}
        <div className="mt-4 mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
            The Living Network
          </h1>
          <p className="text-base md:text-lg text-black max-w-2xl">
            Every living thing is your relative. This is the family tree - from the first cells 3.8
            billion years ago to the 2 million species alive today.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 md:gap-12 mb-8 md:mb-12 py-4 border-y border-black/10">
          <div>
            <div className="text-2xl md:text-3xl font-mono font-bold text-black">
              {totalSpecies.toLocaleString()}
            </div>
            <div className="text-xs font-medium text-black/50 uppercase tracking-wider">
              Species
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-mono font-bold text-black">{yearsOfLife}B</div>
            <div className="text-xs font-medium text-black/50 uppercase tracking-wider">Years</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-mono font-bold text-black">3</div>
            <div className="text-xs font-medium text-black/50 uppercase tracking-wider">
              Domains
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-mono font-bold text-black">
              {totalKingdoms}
            </div>
            <div className="text-xs font-medium text-black/50 uppercase tracking-wider">
              Kingdoms
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Tree explorer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-light text-black mb-4">Explore the Tree</h2>
              <CollapsibleTree
                data={tree}
                defaultExpanded={['life', 'eukarya']}
                linkPrefix="/data/living-network"
                maxLinkDepth={1} // Only kingdoms are clickable from here
              />
            </div>
          </div>

          {/* Kingdoms quick access */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-light text-black mb-4">Kingdoms</h2>
            <div className="space-y-3">
              {kingdoms.map(kingdom => (
                <Link
                  key={kingdom.id}
                  href={`/data/living-network/${kingdom.id}`}
                  className="block bg-white rounded-xl p-4 hover:ring-2 ring-black/10 transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: kingdom.color }}
                    />
                    <span className="font-sans text-black">{kingdom.name}</span>
                    <span className="ml-auto text-xs font-mono text-black/40">
                      {kingdom.speciesCount?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-black/50 mt-2 line-clamp-2">{kingdom.commonName}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Extinct note */}
        <div className="mt-8 p-4 bg-white/50 rounded-xl border border-black/5">
          <div className="flex items-center gap-2 text-sm text-black/50">
            <span className="italic">Italic names</span>
            <span>with</span>
            <span>†</span>
            <span>indicate extinct groups</span>
          </div>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  );
}
