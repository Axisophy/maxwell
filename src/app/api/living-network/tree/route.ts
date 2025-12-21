import { NextRequest, NextResponse } from 'next/server';
import { buildFullTree, buildTreeFromTaxon } from '@/lib/living-network/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const root = searchParams.get('root');
  const depth = parseInt(searchParams.get('depth') || '2', 10);

  try {
    if (root) {
      const tree = buildTreeFromTaxon(root, depth);
      if (!tree) {
        return NextResponse.json({ error: 'Taxon not found' }, { status: 404 });
      }
      return NextResponse.json(tree);
    } else {
      const tree = buildFullTree();
      return NextResponse.json(tree);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to build tree' }, { status: 500 });
  }
}
