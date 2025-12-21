export default function DataSources() {
  return (
    <div className="bg-[#e5e5e5] rounded-xl p-5">
      <h3 className="text-sm font-medium text-black/50 uppercase tracking-wider mb-4">
        Data Sources
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-black">Movebank</p>
          <p className="text-xs text-black/50">
            Global animal tracking database with 6+ billion locations across 6,500+ studies
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-black">OCEARCH</p>
          <p className="text-xs text-black/50">
            Shark tracking and ocean research organization
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-black">Sea Turtle Conservancy</p>
          <p className="text-xs text-black/50">
            Sea turtle research and tracking programs
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-black/10">
        <p className="text-xs text-black/40">
          Animal locations are updated every 15-60 minutes depending on the tracking device and species.
          All data is used with permission from research institutions.
        </p>
      </div>
    </div>
  )
}
