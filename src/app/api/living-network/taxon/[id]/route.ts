import { NextRequest, NextResponse } from 'next/server';
import { getTaxonById, getTaxonChildren } from '@/lib/living-network/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taxon = getTaxonById(id);

  if (!taxon) {
    return NextResponse.json({ error: 'Taxon not found' }, { status: 404 });
  }

  const children = getTaxonChildren(taxon.id);

  return NextResponse.json({
    ...taxon,
    children: children.map(c => ({
      id: c.id,
      name: c.name,
      rank: c.rank,
      isExtinct: c.isExtinct,
      speciesCount: c.speciesCount,
    })),
  });
}
