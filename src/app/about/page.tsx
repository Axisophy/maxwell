export default function AboutPage() {
  return (
    <div className="px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium mb-8">About</h1>
        
        <div className="space-y-6 text-[var(--text-secondary)]">
          <p className="text-lg text-[var(--text-primary)]">
            Science is happening everywhere, all the time. Stars are fusing. 
            Particles are decaying. Data is flowing. Mostly, you can&apos;t see it.
          </p>
          
          <p className="text-lg text-[var(--text-primary)]">
            We build windows.
          </p>
          
          <p>
            FRMI is a digital laboratory — a place where science happens in real time, 
            where tools actually work, where data is beautiful, and where every element 
            is designed with the care of a scientific instrument.
          </p>
          
          <p>
            Our feeds are live. Our data is real. Our instruments work. Our interfaces 
            are designed with the conviction that scientific tools deserve the same care 
            as musical instruments.
          </p>
          
          <p>
            This is not science communication. This is science, communicated.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--widget-border)]">
          <h2 className="text-sm font-medium mb-4">Contact</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            hello@frmi.ai
          </p>
        </div>
      </div>
    </div>
  )
}
