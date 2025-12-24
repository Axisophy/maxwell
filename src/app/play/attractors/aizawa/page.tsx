import WidgetFrame from '@/components/WidgetFrame'
import AizawaAttractor from '@/components/widgets/AizawaAttractor'

export const metadata = {
  title: 'Aizawa Attractor | MXWLL',
  description: 'Explore the Aizawa strange attractor - a toroidal chaotic system discovered by Yoji Aizawa.',
}

export default function AizawaAttractorPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      <div className="px-4 md:px-8 lg:px-12 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-lg mx-auto">
          <WidgetFrame
            title="Aizawa Attractor"
            status="ok"
            description="A strange attractor discovered by Yoji Aizawa. Creates toroidal chaotic patterns that twist and fold through three-dimensional space. Adjust the six parameters (a–f) to explore different chaotic regimes."
            source="Mathematical simulation"
          >
            <AizawaAttractor />
          </WidgetFrame>
        </div>
      </div>
    </main>
  )
}
