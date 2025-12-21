import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getTaxonById, kingdoms, getTaxonChildren } from '@/lib/living-network/data';
import VitalStats from '@/components/living-network/VitalStats';
import NotableMembers from '@/components/living-network/NotableMembers';
import KingdomPhylogeny from '@/components/living-network/KingdomPhylogeny';

interface PageProps {
  params: Promise<{ kingdom: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kingdom } = await params;
  const taxon = getTaxonById(kingdom);
  if (!taxon) return { title: 'Not Found | MXWLL' };

  return {
    title: `${taxon.name} | The Living Network | MXWLL`,
    description: taxon.description,
  };
}

export async function generateStaticParams() {
  return kingdoms.map(k => ({ kingdom: k.id }));
}

export default async function KingdomPage({ params }: PageProps) {
  const { kingdom } = await params;
  const taxon = getTaxonById(kingdom);

  if (!taxon || taxon.rank !== 'kingdom') {
    notFound();
  }

  const children = getTaxonChildren(taxon.id);
  const extinctChildren = children.filter(c => c.isExtinct);

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
            { label: taxon.name, href: `/data/living-network/${taxon.id}` },
          ]}
        />

        {/* Header */}
        <div className="flex items-start gap-4 mt-4 mb-8 md:mb-12">
          <span
            className="w-4 h-4 rounded-full mt-2 flex-shrink-0"
            style={{ backgroundColor: taxon.color }}
          />
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-2">
              {taxon.name}
            </h1>
            {taxon.commonName && (
              <div className="text-lg text-black/50 mb-4">{taxon.commonName}</div>
            )}
            <p className="text-base md:text-lg text-black max-w-2xl">{taxon.description}</p>
          </div>
        </div>

        {/* Vital stats */}
        <div className="mb-8 md:mb-12">
          <VitalStats taxon={taxon} />
        </div>

        {/* Phylogeny */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl font-light text-black mb-4">Phyla within {taxon.name}</h2>
          <KingdomPhylogeny kingdomId={taxon.id} />

          {/* Extinct groups note */}
          {extinctChildren.length > 0 && (
            <div className="mt-4 text-sm text-black/50">
              Includes {extinctChildren.length} extinct{' '}
              {extinctChildren.length === 1 ? 'group' : 'groups'}
              <span className="italic ml-1">(marked with †)</span>
            </div>
          )}
        </div>

        {/* Notable members */}
        {taxon.notableMembers && taxon.notableMembers.length > 0 && (
          <div className="mb-8 md:mb-12">
            <NotableMembers members={taxon.notableMembers} kingdomColor={taxon.color} />
          </div>
        )}

        {/* Timeline link */}
        {taxon.firstAppearance && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-light text-black mb-2">In Geological Time</h3>
            <p className="text-black/70 mb-4">
              {taxon.name} first appeared in the <strong>{taxon.firstAppearance.period}</strong>{' '}
              period, approximately {taxon.firstAppearance.mya} million years ago.
            </p>
            <Link
              href={`/data/time/${taxon.firstAppearance.periodSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-[#e6007e] transition-colors"
            >
              View {taxon.firstAppearance.period} period →
            </Link>
          </div>
        )}
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 md:hidden" />
    </main>
  );
}
