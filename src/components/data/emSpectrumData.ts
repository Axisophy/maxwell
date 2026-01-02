// Electromagnetic Spectrum Data
// Complete spectrum from radio waves to gamma rays with landmarks and applications

// Physical constants
export const SPEED_OF_LIGHT = 299792458; // m/s
export const PLANCK_CONSTANT = 6.62607015e-34; // J·s
export const PLANCK_EV = 4.135667696e-15; // eV·s

// Conversion functions
export function wavelengthToFrequency(wavelengthM: number): number {
  return SPEED_OF_LIGHT / wavelengthM;
}

export function frequencyToWavelength(frequencyHz: number): number {
  return SPEED_OF_LIGHT / frequencyHz;
}

export function frequencyToEnergy(frequencyHz: number): number {
  // Returns energy in eV
  return PLANCK_EV * frequencyHz;
}

export function wavelengthToEnergy(wavelengthM: number): number {
  return frequencyToEnergy(wavelengthToFrequency(wavelengthM));
}

export function energyToWavelength(energyEV: number): number {
  return (PLANCK_EV * SPEED_OF_LIGHT) / energyEV;
}

// Format wavelength for display
export function formatWavelength(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  } else if (meters >= 1) {
    return `${meters.toFixed(meters >= 10 ? 0 : 1)} m`;
  } else if (meters >= 0.01) {
    return `${(meters * 100).toFixed(1)} cm`;
  } else if (meters >= 0.001) {
    return `${(meters * 1000).toFixed(1)} mm`;
  } else if (meters >= 1e-6) {
    return `${(meters * 1e6).toFixed(meters >= 1e-5 ? 0 : 1)} μm`;
  } else if (meters >= 1e-9) {
    return `${(meters * 1e9).toFixed(meters >= 1e-8 ? 0 : 1)} nm`;
  } else if (meters >= 1e-12) {
    return `${(meters * 1e12).toFixed(1)} pm`;
  } else {
    return `${(meters * 1e15).toFixed(2)} fm`;
  }
}

// Format frequency for display
export function formatFrequency(hz: number): string {
  if (hz >= 1e21) {
    return `${(hz / 1e21).toFixed(1)} ZHz`;
  } else if (hz >= 1e18) {
    return `${(hz / 1e18).toFixed(1)} EHz`;
  } else if (hz >= 1e15) {
    return `${(hz / 1e15).toFixed(1)} PHz`;
  } else if (hz >= 1e12) {
    return `${(hz / 1e12).toFixed(hz >= 1e13 ? 0 : 1)} THz`;
  } else if (hz >= 1e9) {
    return `${(hz / 1e9).toFixed(hz >= 1e10 ? 0 : 1)} GHz`;
  } else if (hz >= 1e6) {
    return `${(hz / 1e6).toFixed(hz >= 1e7 ? 0 : 1)} MHz`;
  } else if (hz >= 1e3) {
    return `${(hz / 1e3).toFixed(hz >= 1e4 ? 0 : 1)} kHz`;
  } else {
    return `${hz.toFixed(0)} Hz`;
  }
}

// Format energy for display
export function formatEnergy(ev: number): string {
  if (ev >= 1e9) {
    return `${(ev / 1e9).toFixed(1)} GeV`;
  } else if (ev >= 1e6) {
    return `${(ev / 1e6).toFixed(1)} MeV`;
  } else if (ev >= 1e3) {
    return `${(ev / 1e3).toFixed(1)} keV`;
  } else if (ev >= 1) {
    return `${ev.toFixed(1)} eV`;
  } else if (ev >= 1e-3) {
    return `${(ev * 1e3).toFixed(1)} meV`;
  } else {
    return `${(ev * 1e6).toFixed(1)} μeV`;
  }
}

// Spectrum band type
export interface SpectrumBand {
  id: string;
  name: string;
  shortName: string;
  wavelengthMin: number; // meters (shorter wavelength = higher energy)
  wavelengthMax: number; // meters (longer wavelength = lower energy)
  color: string; // primary color for display
  gradientColors: string[]; // gradient colors
  description: string;
  mechanism: string; // how it's produced
  applications: string[];
  sources: string[]; // natural/artificial sources
  hazards: string[];
  funFact: string;
  subBands?: { name: string; range: string }[];
}

export const SPECTRUM_BANDS: SpectrumBand[] = [
  {
    id: 'radio',
    name: 'Radio Waves',
    shortName: 'Radio',
    wavelengthMin: 1e-3, // 1 mm (boundary with microwave)
    wavelengthMax: 1e5, // 100 km
    color: '#ef4444',
    gradientColors: ['#fca5a5', '#ef4444', '#b91c1c'],
    description: 'Longest wavelengths, lowest energy. Used for communication and astronomy.',
    mechanism: 'Accelerating charges in antennas, oscillating circuits, and astronomical phenomena.',
    applications: [
      'AM/FM radio broadcasting',
      'Television',
      'Two-way radio',
      'Radio astronomy',
      'MRI imaging',
      'Radar (some bands)',
    ],
    sources: ['Radio transmitters', 'Pulsars', 'Quasars', 'Cosmic microwave background', 'Jupiter magnetosphere'],
    hazards: ['Generally safe at normal exposure levels'],
    funFact: 'The cosmic microwave background—the afterglow of the Big Bang—has redshifted into the radio/microwave range.',
    subBands: [
      { name: 'ELF', range: '3–30 Hz' },
      { name: 'VLF', range: '3–30 kHz' },
      { name: 'LF', range: '30–300 kHz' },
      { name: 'MF', range: '300 kHz–3 MHz' },
      { name: 'HF', range: '3–30 MHz' },
      { name: 'VHF', range: '30–300 MHz' },
      { name: 'UHF', range: '300 MHz–3 GHz' },
    ],
  },
  {
    id: 'microwave',
    name: 'Microwaves',
    shortName: 'μwave',
    wavelengthMin: 1e-4, // 0.1 mm
    wavelengthMax: 1e-3, // 1 mm (some definitions extend to 1m)
    color: '#f97316',
    gradientColors: ['#fdba74', '#f97316', '#c2410c'],
    description: 'Between radio and infrared. Heats water molecules effectively.',
    mechanism: 'Klystrons, magnetrons, masers, and molecular rotational transitions.',
    applications: [
      'Microwave ovens',
      'WiFi (2.4 & 5 GHz)',
      'Bluetooth',
      '5G networks',
      'Satellite communication',
      'Radar systems',
    ],
    sources: ['Microwave ovens', 'Cell towers', 'CMB radiation', 'Molecular clouds in space'],
    hazards: ['Can heat body tissues', 'High power can cause burns', 'Cataracts with prolonged exposure'],
    funFact: 'Percy Spencer discovered microwave heating when a chocolate bar melted in his pocket near a radar set.',
    subBands: [
      { name: 'L band', range: '1–2 GHz' },
      { name: 'S band', range: '2–4 GHz' },
      { name: 'C band', range: '4–8 GHz' },
      { name: 'X band', range: '8–12 GHz' },
      { name: 'Ku band', range: '12–18 GHz' },
      { name: 'K band', range: '18–27 GHz' },
      { name: 'Ka band', range: '27–40 GHz' },
    ],
  },
  {
    id: 'infrared',
    name: 'Infrared',
    shortName: 'IR',
    wavelengthMin: 7e-7, // 700 nm (red edge of visible)
    wavelengthMax: 1e-4, // 0.1 mm (some definitions: 1mm)
    color: '#dc2626',
    gradientColors: ['#fca5a5', '#dc2626', '#991b1b'],
    description: 'Heat radiation. Everything above absolute zero emits infrared.',
    mechanism: 'Thermal radiation (blackbody), molecular vibrations, electronic transitions.',
    applications: [
      'Thermal imaging',
      'Night vision',
      'Remote controls',
      'Heat lamps',
      'Infrared spectroscopy',
      'Fiber optic communication',
    ],
    sources: ['All warm objects', 'The Sun', 'Fires', 'Human bodies', 'IR lasers', 'Dust clouds in space'],
    hazards: ['Can cause burns', 'Eye damage at high intensity', "Glassblowers' cataracts"],
    funFact: 'Pit vipers can "see" infrared using heat-sensing pit organs, detecting prey in complete darkness.',
    subBands: [
      { name: 'Near-IR', range: '0.7–1.4 μm' },
      { name: 'Short-wave IR', range: '1.4–3 μm' },
      { name: 'Mid-wave IR', range: '3–8 μm' },
      { name: 'Long-wave IR', range: '8–15 μm' },
      { name: 'Far-IR', range: '15–1000 μm' },
    ],
  },
  {
    id: 'visible',
    name: 'Visible Light',
    shortName: 'Visible',
    wavelengthMin: 3.8e-7, // 380 nm (violet)
    wavelengthMax: 7e-7, // 700 nm (red)
    color: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #22c55e, #eab308, #f97316, #ef4444)',
    gradientColors: ['#8b5cf6', '#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444'],
    description: 'The tiny window we evolved to see. Less than 0.0035% of the EM spectrum.',
    mechanism: 'Electronic transitions in atoms, incandescence, fluorescence, LEDs.',
    applications: [
      'Human vision',
      'Photography',
      'Displays',
      'Fiber optic networks',
      'Optical microscopy',
      'Photosynthesis',
    ],
    sources: ['The Sun', 'Light bulbs', 'LEDs', 'Lasers', 'Fires', 'Bioluminescence'],
    hazards: ['Bright light damages retinas', 'Blue light affects circadian rhythms', 'Laser eye damage'],
    funFact: "We're nearly blind—visible light is less than 0.0035% of the full EM spectrum.",
    subBands: [
      { name: 'Violet', range: '380–450 nm' },
      { name: 'Blue', range: '450–495 nm' },
      { name: 'Green', range: '495–570 nm' },
      { name: 'Yellow', range: '570–590 nm' },
      { name: 'Orange', range: '590–620 nm' },
      { name: 'Red', range: '620–700 nm' },
    ],
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet',
    shortName: 'UV',
    wavelengthMin: 1e-8, // 10 nm (vacuum UV)
    wavelengthMax: 3.8e-7, // 380 nm (visible edge)
    color: '#8b5cf6',
    gradientColors: ['#c4b5fd', '#8b5cf6', '#6d28d9'],
    description: 'Higher energy than visible. Causes sunburn and enables vitamin D synthesis.',
    mechanism: 'Electronic transitions, thermal radiation from hot objects, gas discharges.',
    applications: [
      'Sterilization',
      'Black lights',
      'Fluorescence analysis',
      'Lithography (chip making)',
      'Vitamin D production',
      'Forensics',
    ],
    sources: ['The Sun', 'UV lamps', 'Hot stars', 'Welding arcs', 'Some lasers'],
    hazards: ['Sunburn', 'Skin cancer', 'Cataracts', 'DNA damage', 'Immune suppression'],
    funFact: 'Bees can see UV light—many flowers have UV patterns invisible to us that guide bees to nectar.',
    subBands: [
      { name: 'UVA', range: '315–380 nm' },
      { name: 'UVB', range: '280–315 nm' },
      { name: 'UVC', range: '100–280 nm' },
      { name: 'Vacuum UV', range: '10–100 nm' },
    ],
  },
  {
    id: 'xray',
    name: 'X-Rays',
    shortName: 'X-ray',
    wavelengthMin: 1e-11, // 0.01 nm (hard X-ray)
    wavelengthMax: 1e-8, // 10 nm (soft X-ray)
    color: '#06b6d4',
    gradientColors: ['#67e8f9', '#06b6d4', '#0e7490'],
    description: 'Penetrating radiation that passes through soft tissue but is absorbed by bone.',
    mechanism: 'Inner electron transitions, bremsstrahlung, synchrotron radiation.',
    applications: [
      'Medical imaging',
      'CT scans',
      'X-ray crystallography',
      'Airport security',
      'Cancer treatment',
      'Industrial inspection',
    ],
    sources: ['X-ray tubes', 'Synchrotrons', 'Black holes', 'Neutron stars', 'Some supernovae'],
    hazards: ['DNA damage', 'Cancer risk', 'Radiation sickness at high doses', 'Fetal damage'],
    funFact: "Röntgen's first X-ray image was of his wife's hand. She reportedly said, 'I have seen my death.'",
    subBands: [
      { name: 'Soft X-ray', range: '0.1–10 nm' },
      { name: 'Hard X-ray', range: '0.01–0.1 nm' },
    ],
  },
  {
    id: 'gamma',
    name: 'Gamma Rays',
    shortName: 'γ-ray',
    wavelengthMin: 1e-14, // 0.01 pm
    wavelengthMax: 1e-11, // 10 pm
    color: '#22c55e',
    gradientColors: ['#86efac', '#22c55e', '#15803d'],
    description: 'Highest energy EM radiation. Produced by nuclear reactions and cosmic events.',
    mechanism: 'Nuclear transitions, matter-antimatter annihilation, extreme astrophysical events.',
    applications: [
      'Cancer radiotherapy',
      'Sterilization',
      'Gamma spectroscopy',
      'PET scans (positron annihilation)',
      'Food irradiation',
      'Gamma-ray astronomy',
    ],
    sources: ['Radioactive decay', 'Nuclear reactors', 'Gamma-ray bursts', 'Pulsars', 'Active galactic nuclei'],
    hazards: ['Severe tissue damage', 'Acute radiation syndrome', 'Cancer', 'Genetic damage', 'Death at high doses'],
    funFact: 'A gamma-ray burst can release more energy in seconds than the Sun will emit in its entire 10-billion-year lifetime.',
    subBands: [
      { name: 'Soft gamma', range: '10 pm – 0.1 nm' },
      { name: 'Hard gamma', range: '< 10 pm' },
    ],
  },
];

// Spectrum landmarks - specific points of interest
export interface SpectrumLandmark {
  id: string;
  name: string;
  wavelength: number; // meters
  band: string; // which band it's in
  type: 'technology' | 'astronomy' | 'biology' | 'physics' | 'medical';
  description: string;
  icon?: string;
}

export const SPECTRUM_LANDMARKS: SpectrumLandmark[] = [
  // Radio
  { id: 'am-radio', name: 'AM Radio', wavelength: 300, band: 'radio', type: 'technology', description: '535–1705 kHz' },
  { id: 'fm-radio', name: 'FM Radio', wavelength: 3, band: 'radio', type: 'technology', description: '88–108 MHz' },
  { id: 'hydrogen-line', name: 'Hydrogen 21 cm', wavelength: 0.21, band: 'radio', type: 'astronomy', description: 'Used to map hydrogen in galaxies' },

  // Microwave
  { id: 'wifi-24', name: 'WiFi 2.4 GHz', wavelength: 0.125, band: 'microwave', type: 'technology', description: '12.5 cm wavelength' },
  { id: 'wifi-5', name: 'WiFi 5 GHz', wavelength: 0.06, band: 'microwave', type: 'technology', description: '6 cm wavelength' },
  { id: 'microwave-oven', name: 'Microwave Oven', wavelength: 0.122, band: 'microwave', type: 'technology', description: '2.45 GHz (12.2 cm)' },
  { id: 'cmb', name: 'CMB Peak', wavelength: 1.9e-3, band: 'microwave', type: 'astronomy', description: 'Cosmic Microwave Background peak at 160 GHz' },

  // Infrared
  { id: 'body-heat', name: 'Human Body Heat', wavelength: 10e-6, band: 'infrared', type: 'biology', description: 'Peak emission ~10 μm (37°C)' },
  { id: 'ir-remote', name: 'IR Remote Control', wavelength: 940e-9, band: 'infrared', type: 'technology', description: '940 nm LED' },
  { id: 'fiber-optic', name: 'Fiber Optic Telecom', wavelength: 1550e-9, band: 'infrared', type: 'technology', description: '1550 nm (C-band)' },

  // Visible
  { id: 'red-light', name: 'Red Light', wavelength: 650e-9, band: 'visible', type: 'physics', description: '~650 nm' },
  { id: 'green-light', name: 'Green Light', wavelength: 550e-9, band: 'visible', type: 'physics', description: '~550 nm (peak human sensitivity)' },
  { id: 'blue-light', name: 'Blue Light', wavelength: 470e-9, band: 'visible', type: 'physics', description: '~470 nm' },
  { id: 'sodium-d', name: 'Sodium D Line', wavelength: 589e-9, band: 'visible', type: 'physics', description: 'Yellow streetlight emission' },
  { id: 'chlorophyll', name: 'Chlorophyll Peak', wavelength: 680e-9, band: 'visible', type: 'biology', description: 'Red absorption band for photosynthesis' },

  // UV
  { id: 'uva-tanning', name: 'UVA (Tanning)', wavelength: 350e-9, band: 'ultraviolet', type: 'biology', description: 'Penetrates to dermis' },
  { id: 'uvb-sunburn', name: 'UVB (Sunburn)', wavelength: 300e-9, band: 'ultraviolet', type: 'biology', description: 'Causes sunburn and vitamin D' },
  { id: 'uvc-germicidal', name: 'UVC (Germicidal)', wavelength: 254e-9, band: 'ultraviolet', type: 'medical', description: '254 nm mercury lamp' },
  { id: 'euv-lithography', name: 'EUV Lithography', wavelength: 13.5e-9, band: 'ultraviolet', type: 'technology', description: 'Cutting-edge chip manufacturing' },

  // X-ray
  { id: 'chest-xray', name: 'Chest X-ray', wavelength: 5e-11, band: 'xray', type: 'medical', description: '~50 keV photons' },
  { id: 'ct-scan', name: 'CT Scan', wavelength: 2e-11, band: 'xray', type: 'medical', description: '~120 keV photons' },
  { id: 'xray-crystallography', name: 'X-ray Crystallography', wavelength: 1e-10, band: 'xray', type: 'physics', description: 'Cu Kα line at 0.154 nm' },

  // Gamma
  { id: 'pet-scan', name: 'PET Scan', wavelength: 2.4e-12, band: 'gamma', type: 'medical', description: '511 keV from positron annihilation' },
  { id: 'cobalt-60', name: 'Cobalt-60 Therapy', wavelength: 1e-12, band: 'gamma', type: 'medical', description: '1.17 & 1.33 MeV gamma rays' },
  { id: 'grb', name: 'Gamma-Ray Burst', wavelength: 1e-14, band: 'gamma', type: 'astronomy', description: 'Up to 10¹⁵ eV' },
];

// Log scale helpers for ruler positioning
export const WAVELENGTH_RANGE = {
  min: 1e-14, // 0.01 pm (hard gamma)
  max: 1e5,   // 100 km (radio)
};

export function wavelengthToLogPosition(wavelength: number): number {
  // Returns 0-1 position on log scale (0 = shortest/gamma, 1 = longest/radio)
  const logMin = Math.log10(WAVELENGTH_RANGE.min);
  const logMax = Math.log10(WAVELENGTH_RANGE.max);
  const logWavelength = Math.log10(wavelength);
  return (logWavelength - logMin) / (logMax - logMin);
}

export function logPositionToWavelength(position: number): number {
  const logMin = Math.log10(WAVELENGTH_RANGE.min);
  const logMax = Math.log10(WAVELENGTH_RANGE.max);
  const logWavelength = logMin + position * (logMax - logMin);
  return Math.pow(10, logWavelength);
}

// Get band at a given wavelength
export function getBandAtWavelength(wavelength: number): SpectrumBand | null {
  return SPECTRUM_BANDS.find(
    band => wavelength >= band.wavelengthMin && wavelength <= band.wavelengthMax
  ) || null;
}

// Get visible color for a wavelength (visible range only)
export function wavelengthToVisibleColor(wavelength: number): string | null {
  const nm = wavelength * 1e9;
  if (nm < 380 || nm > 700) return null;

  if (nm < 440) {
    return `rgb(${Math.round(255 * (440 - nm) / 60)}, 0, 255)`;
  } else if (nm < 490) {
    return `rgb(0, ${Math.round(255 * (nm - 440) / 50)}, 255)`;
  } else if (nm < 510) {
    return `rgb(0, 255, ${Math.round(255 * (510 - nm) / 20)})`;
  } else if (nm < 580) {
    return `rgb(${Math.round(255 * (nm - 510) / 70)}, 255, 0)`;
  } else if (nm < 645) {
    return `rgb(255, ${Math.round(255 * (645 - nm) / 65)}, 0)`;
  } else {
    return 'rgb(255, 0, 0)';
  }
}

// Key numbers for display
export const SPECTRUM_STATS = {
  visibleFraction: 0.0035, // visible light as % of full spectrum
  speedOfLight: 299792458, // m/s
  visibleRange: '380–700 nm',
  fullRange: '10⁻¹⁴ m to 10⁵ m',
  ordersOfMagnitude: 19, // log10(10^5 / 10^-14)
};
