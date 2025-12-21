export default function NuclearFusion() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Explanation */}
      <div className="bg-white rounded-xl p-6">
        <h3 className="text-lg font-medium text-black mb-4">The Proton-Proton Chain</h3>
        <div className="space-y-4 text-sm text-black/70 leading-relaxed">
          <p>
            Every second, the Sun converts 600 million tons of hydrogen into 596 million
            tons of helium. The missing 4 million tons become pure energy via E=mc².
          </p>
          <p>
            This happens through the proton-proton chain reaction, where hydrogen nuclei
            fuse step-by-step into helium. The process requires temperatures above 15 million
            Kelvin and produces neutrinos that pass straight through the Sun.
          </p>
          <p>
            The energy released takes roughly 170,000 years to travel from the core to the
            surface, but only 8 minutes to reach Earth as sunlight.
          </p>
        </div>
      </div>

      {/* Reaction steps */}
      <div className="bg-[#1a1a1e] rounded-xl p-6 text-white">
        <h3 className="text-lg font-medium mb-4">Reaction Steps</h3>
        <div className="space-y-4 font-mono text-sm">
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-amber-400 mb-1">Step 1</p>
            <p className="text-white/80">¹H + ¹H → ²H + e⁺ + νₑ</p>
            <p className="text-xs text-white/50 mt-1">Two protons fuse, releasing a positron and neutrino</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-amber-400 mb-1">Step 2</p>
            <p className="text-white/80">²H + ¹H → ³He + γ</p>
            <p className="text-xs text-white/50 mt-1">Deuterium captures a proton, releasing gamma ray</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-amber-400 mb-1">Step 3</p>
            <p className="text-white/80">³He + ³He → ⁴He + 2¹H</p>
            <p className="text-xs text-white/50 mt-1">Two helium-3 nuclei fuse into helium-4</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/60">
              Net: 4¹H → ⁴He + 2e⁺ + 2νₑ + 26.7 MeV
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
