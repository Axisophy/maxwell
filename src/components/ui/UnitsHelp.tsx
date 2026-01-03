import Link from 'next/link';

// ============================================================================
// UNITS HELP COMPONENT
// Reusable contextual help links for unfamiliar units throughout MXWLL
// ============================================================================

interface UnitsHelpProps {
  /** The unit or concept being explained */
  unit: 'eV' | 'GeV' | 'MeV' | 'keV' | 'TeV' | 'natural-units' | 'astronomical' | 'si' | 'custom';
  /** Custom label (optional - defaults based on unit type) */
  label?: string;
  /** Custom href (optional - defaults based on unit type) */
  href?: string;
  /** Visual variant */
  variant?: 'inline' | 'block' | 'subtle';
  /** Additional className */
  className?: string;
}

const UNIT_CONFIG = {
  'eV': {
    label: 'Why electronvolts?',
    href: '/data/units#particle',
    description: 'Learn why particle physicists measure mass in energy units'
  },
  'GeV': {
    label: 'Why GeV instead of kg?',
    href: '/data/units#particle',
    description: 'Learn why particle physicists measure mass in energy units'
  },
  'MeV': {
    label: 'Why MeV instead of kg?',
    href: '/data/units#particle',
    description: 'Learn why particle physicists measure mass in energy units'
  },
  'keV': {
    label: 'Why keV?',
    href: '/data/units#particle',
    description: 'Learn about electronvolt units'
  },
  'TeV': {
    label: 'What are TeV?',
    href: '/data/units#particle',
    description: 'Learn about accelerator energy scales'
  },
  'natural-units': {
    label: 'What are natural units?',
    href: '/data/units#natural',
    description: 'Learn why physicists set c = ℏ = 1'
  },
  'astronomical': {
    label: 'Astronomical units explained',
    href: '/data/units#astronomical',
    description: 'Learn about parsecs, light-years, and solar masses'
  },
  'si': {
    label: 'SI units reference',
    href: '/data/units#si-base',
    description: 'The international system of units'
  },
  'custom': {
    label: 'Units explained',
    href: '/data/units',
    description: 'Units & Measurement reference'
  },
};

export function UnitsHelp({
  unit,
  label,
  href,
  variant = 'block',
  className = ''
}: UnitsHelpProps) {
  const config = UNIT_CONFIG[unit];
  const finalLabel = label || config.label;
  const finalHref = href || config.href;

  if (variant === 'inline') {
    return (
      <Link
        href={finalHref}
        className={`text-amber-400/60 hover:text-amber-400 transition-colors ${className}`}
        title={config.description}
      >
        {finalLabel}
      </Link>
    );
  }

  if (variant === 'subtle') {
    return (
      <Link
        href={finalHref}
        className={`text-xs text-white/30 hover:text-white/50 transition-colors ${className}`}
        title={config.description}
      >
        {finalLabel} →
      </Link>
    );
  }

  // Block variant (default)
  return (
    <div className={`bg-white/5 rounded-lg p-3 ${className}`}>
      <Link
        href={finalHref}
        className="flex items-center justify-between group"
      >
        <div>
          <div className="text-sm text-white/60 group-hover:text-white transition-colors">
            {finalLabel}
          </div>
          <div className="text-xs text-white/30">
            {config.description}
          </div>
        </div>
        <span className="text-white/30 group-hover:text-white/60 transition-colors">→</span>
      </Link>
    </div>
  );
}

// ============================================================================
// QUICK UNIT TOOLTIP
// For inline explanations without leaving the page
// ============================================================================

interface UnitTooltipProps {
  unit: string;
  children: React.ReactNode;
}

export function UnitTooltip({ unit, children }: UnitTooltipProps) {
  const tooltips: Record<string, string> = {
    'eV': '1 eV = 1.602×10⁻¹⁹ J — energy gained by an electron through 1 volt',
    'keV': '1 keV = 1,000 eV',
    'MeV': '1 MeV = 1,000,000 eV — typical nuclear energy scale',
    'GeV': '1 GeV = 10⁹ eV — proton mass ≈ 0.938 GeV',
    'TeV': '1 TeV = 10¹² eV — LHC collision energy scale',
    'AU': '1 AU = 149.6 million km — Earth-Sun distance',
    'ly': '1 light-year = 9.46×10¹² km',
    'pc': '1 parsec = 3.26 light-years',
    'M☉': '1 solar mass = 1.989×10³⁰ kg',
  };

  return (
    <span
      className="border-b border-dotted border-white/30 cursor-help"
      title={tooltips[unit] || unit}
    >
      {children}
    </span>
  );
}

// ============================================================================
// LEDGER FOOTER HELP
// Standardised help link for the bottom of data tables/ledgers
// ============================================================================

interface LedgerHelpProps {
  /** Primary unit being used in the ledger */
  primaryUnit: 'eV' | 'GeV' | 'MeV' | 'astronomical' | 'si';
  /** Optional additional context */
  context?: string;
}

export function LedgerHelp({ primaryUnit, context }: LedgerHelpProps) {
  const messages: Record<string, { question: string; answer: string }> = {
    'eV': {
      question: 'Unfamiliar with electronvolts?',
      answer: 'Learn why physicists use energy units for mass'
    },
    'GeV': {
      question: 'Why GeV instead of kilograms?',
      answer: 'E = mc² means mass and energy are interchangeable'
    },
    'MeV': {
      question: 'Why MeV instead of kilograms?',
      answer: 'Energy units are more practical at particle scales'
    },
    'astronomical': {
      question: 'Unfamiliar with these units?',
      answer: 'Learn about parsecs, light-years, and solar masses'
    },
    'si': {
      question: 'Need a units refresher?',
      answer: 'SI base units and prefixes explained'
    },
  };

  const config = messages[primaryUnit];
  const href = primaryUnit === 'astronomical'
    ? '/data/units#astronomical'
    : primaryUnit === 'si'
    ? '/data/units#si-base'
    : '/data/units#particle';

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <Link
        href={href}
        className="flex items-center gap-3 text-white/40 hover:text-white/60 transition-colors group"
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <span className="text-sm">{config.question}</span>
          <span className="text-xs text-white/30 ml-2 group-hover:text-white/40">
            {config.answer} →
          </span>
        </div>
      </Link>
      {context && (
        <p className="text-xs text-white/20 mt-1 ml-7">{context}</p>
      )}
    </div>
  );
}

export default UnitsHelp;
