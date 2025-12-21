'use client';

import { useEffect, useState } from 'react';
import CollapsibleTree from './CollapsibleTree';
import { TreeNode } from '@/lib/living-network/types';

interface KingdomPhylogenyProps {
  kingdomId: string;
}

export default function KingdomPhylogeny({ kingdomId }: KingdomPhylogenyProps) {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTree() {
      try {
        const res = await fetch(`/api/living-network/tree?root=${kingdomId}&depth=2`);
        const data = await res.json();
        setTree(data);
      } catch (error) {
        console.error('Failed to fetch tree:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTree();
  }, [kingdomId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-black/50">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
        Loading phylogeny...
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-black/50">
        Failed to load phylogeny
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 md:p-6">
      <CollapsibleTree
        data={tree}
        defaultExpanded={[kingdomId]}
        linkPrefix="/data/living-network"
        maxLinkDepth={2}
      />
    </div>
  );
}
