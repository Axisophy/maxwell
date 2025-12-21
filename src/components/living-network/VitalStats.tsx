import { Taxon } from '@/lib/living-network/types';

interface VitalStatsProps {
  taxon: Taxon;
}

export default function VitalStats({ taxon }: VitalStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Species count */}
      {taxon.speciesCount && (
        <div className="bg-white rounded-xl p-4">
          <div className="text-xs font-medium text-black/50 uppercase tracking-wider mb-1">
            Species
          </div>
          <div className="text-2xl font-mono font-bold text-black">
            {taxon.speciesCount.toLocaleString()}
          </div>
        </div>
      )}

      {/* Child groups */}
      {taxon.childGroupCount && (
        <div className="bg-white rounded-xl p-4">
          <div className="text-xs font-medium text-black/50 uppercase tracking-wider mb-1">
            {taxon.rank === 'kingdom' ? 'Phyla' : taxon.rank === 'phylum' ? 'Classes' : 'Groups'}
          </div>
          <div className="text-2xl font-mono font-bold text-black">
            {taxon.childGroupCount}
          </div>
        </div>
      )}

      {/* First appearance */}
      {taxon.firstAppearance && (
        <div className="bg-white rounded-xl p-4">
          <div className="text-xs font-medium text-black/50 uppercase tracking-wider mb-1">
            First Appeared
          </div>
          <div className="text-lg font-sans font-medium text-black">
            {taxon.firstAppearance.period}
          </div>
          <div className="text-sm font-mono text-black/50">
            {taxon.firstAppearance.mya} Ma
          </div>
        </div>
      )}

      {/* Status */}
      <div className="bg-white rounded-xl p-4">
        <div className="text-xs font-medium text-black/50 uppercase tracking-wider mb-1">
          Status
        </div>
        <div
          className={`text-lg font-sans font-medium ${taxon.isExtinct ? 'text-amber-600' : 'text-green-600'}`}
        >
          {taxon.isExtinct ? 'Extinct' : 'Extant'}
        </div>
        {taxon.isExtinct && taxon.lastAppearance && (
          <div className="text-sm font-mono text-black/50">
            Until {taxon.lastAppearance.mya} Ma
          </div>
        )}
      </div>
    </div>
  );
}
