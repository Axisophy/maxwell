// Comprehensive nuclide dataset for the Chart of Nuclides
// Data sourced from IAEA Nuclear Data Services and NNDC

export interface Nuclide {
    z: number;          // Atomic number (protons)
    n: number;          // Neutron number
    symbol: string;     // Element symbol
    name: string;       // Element name
    massNumber: number; // A = Z + N
    decay: DecayMode;   // Primary decay mode
    halfLife: string;   // Human readable half-life
    halfLifeSeconds: number | null; // Numeric for sorting (null = stable)
    abundance: number | null; // Natural abundance % (null if not naturally occurring)
    isStable: boolean;
    notes?: string;
  }
  
  export type DecayMode = 
    | 'stable' 
    | 'alpha' 
    | 'beta-' 
    | 'beta+' 
    | 'ec'      // Electron capture
    | 'sf'      // Spontaneous fission
    | 'p'       // Proton emission
    | 'n'       // Neutron emission
    | 'it'      // Isomeric transition
    | '2beta-'  // Double beta minus
    | 'cluster' // Cluster decay
    | 'unknown';
  
  export const DECAY_COLORS: Record<DecayMode, string> = {
    'stable': '#000000',     // Black for stable
    'alpha': '#FFD700',      // Gold/Yellow
    'beta-': '#00BFFF',      // Light blue
    'beta+': '#FF69B4',      // Pink
    'ec': '#FF69B4',         // Pink (same as beta+)
    'sf': '#32CD32',         // Lime green
    'p': '#FFA500',          // Orange
    'n': '#87CEEB',          // Sky blue
    'it': '#9370DB',         // Medium purple
    '2beta-': '#4169E1',     // Royal blue
    'cluster': '#8B4513',    // Saddle brown
    'unknown': '#808080',    // Gray
  };
  
  export const DECAY_LABELS: Record<DecayMode, string> = {
    'stable': 'Stable',
    'alpha': 'α decay',
    'beta-': 'β⁻ decay',
    'beta+': 'β⁺ decay',
    'ec': 'Electron capture',
    'sf': 'Spontaneous fission',
    'p': 'Proton emission',
    'n': 'Neutron emission',
    'it': 'Isomeric transition',
    '2beta-': 'Double β⁻',
    'cluster': 'Cluster decay',
    'unknown': 'Unknown',
  };
  
  // Magic numbers - nuclei with these numbers of protons or neutrons are extra stable
  export const MAGIC_NUMBERS = [2, 8, 20, 28, 50, 82, 126];
  
  // Element data for reference
  export const ELEMENTS: Record<number, { symbol: string; name: string }> = {
    0: { symbol: 'n', name: 'Neutron' },
    1: { symbol: 'H', name: 'Hydrogen' },
    2: { symbol: 'He', name: 'Helium' },
    3: { symbol: 'Li', name: 'Lithium' },
    4: { symbol: 'Be', name: 'Beryllium' },
    5: { symbol: 'B', name: 'Boron' },
    6: { symbol: 'C', name: 'Carbon' },
    7: { symbol: 'N', name: 'Nitrogen' },
    8: { symbol: 'O', name: 'Oxygen' },
    9: { symbol: 'F', name: 'Fluorine' },
    10: { symbol: 'Ne', name: 'Neon' },
    11: { symbol: 'Na', name: 'Sodium' },
    12: { symbol: 'Mg', name: 'Magnesium' },
    13: { symbol: 'Al', name: 'Aluminium' },
    14: { symbol: 'Si', name: 'Silicon' },
    15: { symbol: 'P', name: 'Phosphorus' },
    16: { symbol: 'S', name: 'Sulfur' },
    17: { symbol: 'Cl', name: 'Chlorine' },
    18: { symbol: 'Ar', name: 'Argon' },
    19: { symbol: 'K', name: 'Potassium' },
    20: { symbol: 'Ca', name: 'Calcium' },
    21: { symbol: 'Sc', name: 'Scandium' },
    22: { symbol: 'Ti', name: 'Titanium' },
    23: { symbol: 'V', name: 'Vanadium' },
    24: { symbol: 'Cr', name: 'Chromium' },
    25: { symbol: 'Mn', name: 'Manganese' },
    26: { symbol: 'Fe', name: 'Iron' },
    27: { symbol: 'Co', name: 'Cobalt' },
    28: { symbol: 'Ni', name: 'Nickel' },
    29: { symbol: 'Cu', name: 'Copper' },
    30: { symbol: 'Zn', name: 'Zinc' },
    31: { symbol: 'Ga', name: 'Gallium' },
    32: { symbol: 'Ge', name: 'Germanium' },
    33: { symbol: 'As', name: 'Arsenic' },
    34: { symbol: 'Se', name: 'Selenium' },
    35: { symbol: 'Br', name: 'Bromine' },
    36: { symbol: 'Kr', name: 'Krypton' },
    37: { symbol: 'Rb', name: 'Rubidium' },
    38: { symbol: 'Sr', name: 'Strontium' },
    39: { symbol: 'Y', name: 'Yttrium' },
    40: { symbol: 'Zr', name: 'Zirconium' },
    41: { symbol: 'Nb', name: 'Niobium' },
    42: { symbol: 'Mo', name: 'Molybdenum' },
    43: { symbol: 'Tc', name: 'Technetium' },
    44: { symbol: 'Ru', name: 'Ruthenium' },
    45: { symbol: 'Rh', name: 'Rhodium' },
    46: { symbol: 'Pd', name: 'Palladium' },
    47: { symbol: 'Ag', name: 'Silver' },
    48: { symbol: 'Cd', name: 'Cadmium' },
    49: { symbol: 'In', name: 'Indium' },
    50: { symbol: 'Sn', name: 'Tin' },
    51: { symbol: 'Sb', name: 'Antimony' },
    52: { symbol: 'Te', name: 'Tellurium' },
    53: { symbol: 'I', name: 'Iodine' },
    54: { symbol: 'Xe', name: 'Xenon' },
    55: { symbol: 'Cs', name: 'Caesium' },
    56: { symbol: 'Ba', name: 'Barium' },
    57: { symbol: 'La', name: 'Lanthanum' },
    58: { symbol: 'Ce', name: 'Cerium' },
    59: { symbol: 'Pr', name: 'Praseodymium' },
    60: { symbol: 'Nd', name: 'Neodymium' },
    61: { symbol: 'Pm', name: 'Promethium' },
    62: { symbol: 'Sm', name: 'Samarium' },
    63: { symbol: 'Eu', name: 'Europium' },
    64: { symbol: 'Gd', name: 'Gadolinium' },
    65: { symbol: 'Tb', name: 'Terbium' },
    66: { symbol: 'Dy', name: 'Dysprosium' },
    67: { symbol: 'Ho', name: 'Holmium' },
    68: { symbol: 'Er', name: 'Erbium' },
    69: { symbol: 'Tm', name: 'Thulium' },
    70: { symbol: 'Yb', name: 'Ytterbium' },
    71: { symbol: 'Lu', name: 'Lutetium' },
    72: { symbol: 'Hf', name: 'Hafnium' },
    73: { symbol: 'Ta', name: 'Tantalum' },
    74: { symbol: 'W', name: 'Tungsten' },
    75: { symbol: 'Re', name: 'Rhenium' },
    76: { symbol: 'Os', name: 'Osmium' },
    77: { symbol: 'Ir', name: 'Iridium' },
    78: { symbol: 'Pt', name: 'Platinum' },
    79: { symbol: 'Au', name: 'Gold' },
    80: { symbol: 'Hg', name: 'Mercury' },
    81: { symbol: 'Tl', name: 'Thallium' },
    82: { symbol: 'Pb', name: 'Lead' },
    83: { symbol: 'Bi', name: 'Bismuth' },
    84: { symbol: 'Po', name: 'Polonium' },
    85: { symbol: 'At', name: 'Astatine' },
    86: { symbol: 'Rn', name: 'Radon' },
    87: { symbol: 'Fr', name: 'Francium' },
    88: { symbol: 'Ra', name: 'Radium' },
    89: { symbol: 'Ac', name: 'Actinium' },
    90: { symbol: 'Th', name: 'Thorium' },
    91: { symbol: 'Pa', name: 'Protactinium' },
    92: { symbol: 'U', name: 'Uranium' },
    93: { symbol: 'Np', name: 'Neptunium' },
    94: { symbol: 'Pu', name: 'Plutonium' },
    95: { symbol: 'Am', name: 'Americium' },
    96: { symbol: 'Cm', name: 'Curium' },
    97: { symbol: 'Bk', name: 'Berkelium' },
    98: { symbol: 'Cf', name: 'Californium' },
    99: { symbol: 'Es', name: 'Einsteinium' },
    100: { symbol: 'Fm', name: 'Fermium' },
    101: { symbol: 'Md', name: 'Mendelevium' },
    102: { symbol: 'No', name: 'Nobelium' },
    103: { symbol: 'Lr', name: 'Lawrencium' },
    104: { symbol: 'Rf', name: 'Rutherfordium' },
    105: { symbol: 'Db', name: 'Dubnium' },
    106: { symbol: 'Sg', name: 'Seaborgium' },
    107: { symbol: 'Bh', name: 'Bohrium' },
    108: { symbol: 'Hs', name: 'Hassium' },
    109: { symbol: 'Mt', name: 'Meitnerium' },
    110: { symbol: 'Ds', name: 'Darmstadtium' },
    111: { symbol: 'Rg', name: 'Roentgenium' },
    112: { symbol: 'Cn', name: 'Copernicium' },
    113: { symbol: 'Nh', name: 'Nihonium' },
    114: { symbol: 'Fl', name: 'Flerovium' },
    115: { symbol: 'Mc', name: 'Moscovium' },
    116: { symbol: 'Lv', name: 'Livermorium' },
    117: { symbol: 'Ts', name: 'Tennessine' },
    118: { symbol: 'Og', name: 'Oganesson' },
  };
  
  // Helper to create nuclide entries
  function nuclide(
    z: number, 
    n: number, 
    decay: DecayMode, 
    halfLife: string, 
    halfLifeSeconds: number | null,
    abundance: number | null = null,
    notes?: string
  ): Nuclide {
    const elem = ELEMENTS[z] || { symbol: '?', name: 'Unknown' };
    return {
      z,
      n,
      symbol: elem.symbol,
      name: elem.name,
      massNumber: z + n,
      decay,
      halfLife,
      halfLifeSeconds,
      abundance,
      isStable: decay === 'stable',
      notes,
    };
  }
  
  // Time constants for half-life conversion
  const SECOND = 1;
  const MINUTE = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const YEAR = 31557600; // Julian year
  const KYEAR = YEAR * 1000;
  const MYEAR = YEAR * 1e6;
  const BYEAR = YEAR * 1e9;
  
  // Comprehensive nuclide data
  // Includes all stable isotopes and key radioactive ones
  export const NUCLIDES: Nuclide[] = [
    // Free neutron
    nuclide(0, 1, 'beta-', '10.2 min', 614, null, 'Free neutron decays to proton'),
    
    // Hydrogen (Z=1)
    nuclide(1, 0, 'stable', 'Stable', null, 99.9855, 'Protium - most common'),
    nuclide(1, 1, 'stable', 'Stable', null, 0.0145, 'Deuterium - heavy hydrogen'),
    nuclide(1, 2, 'beta-', '12.32 y', 12.32 * YEAR, null, 'Tritium - radioactive'),
    nuclide(1, 3, 'n', '139 ys', 139e-24, null),
    nuclide(1, 4, 'n', '86 ys', 86e-24, null),
    
    // Helium (Z=2)
    nuclide(2, 1, 'stable', 'Stable', null, 0.000137, 'Helium-3'),
    nuclide(2, 2, 'stable', 'Stable', null, 99.999863, 'Helium-4 - alpha particle'),
    nuclide(2, 4, 'beta-', '806 ms', 0.806, null),
    nuclide(2, 6, 'beta-', '119 ms', 0.119, null),
    
    // Lithium (Z=3)
    nuclide(3, 1, 'p', '91 ys', 91e-24, null),
    nuclide(3, 2, 'n', '370 ys', 370e-24, null),
    nuclide(3, 3, 'stable', 'Stable', null, 7.59, 'Lithium-6'),
    nuclide(3, 4, 'stable', 'Stable', null, 92.41, 'Lithium-7'),
    nuclide(3, 5, 'beta-', '839 ms', 0.839, null),
    nuclide(3, 6, 'beta-', '178 ms', 0.178, null),
    
    // Beryllium (Z=4)
    nuclide(4, 2, '2p', '92 ys', 92e-24, null),
    nuclide(4, 3, 'ec', '53.22 d', 53.22 * DAY, null, 'Be-7 - cosmogenic'),
    nuclide(4, 4, 'alpha', '67 as', 67e-18, null),
    nuclide(4, 5, 'stable', 'Stable', null, 100, 'Beryllium-9 - only stable isotope'),
    nuclide(4, 6, 'beta-', '1.51 My', 1.51 * MYEAR, null, 'Be-10 - cosmogenic dating'),
    nuclide(4, 7, 'beta-', '13.8 s', 13.8, null),
    
    // Boron (Z=5)
    nuclide(5, 3, 'p', '770 ys', 770e-24, null),
    nuclide(5, 4, 'beta+', '770 ms', 0.77, null),
    nuclide(5, 5, 'stable', 'Stable', null, 19.9, 'Boron-10'),
    nuclide(5, 6, 'stable', 'Stable', null, 80.1, 'Boron-11'),
    nuclide(5, 7, 'beta-', '20.2 ms', 0.0202, null),
    
    // Carbon (Z=6)
    nuclide(6, 4, 'beta+', '19.3 s', 19.3, null),
    nuclide(6, 5, 'beta+', '20.3 min', 20.3 * MINUTE, null),
    nuclide(6, 6, 'stable', 'Stable', null, 98.93, 'Carbon-12'),
    nuclide(6, 7, 'stable', 'Stable', null, 1.07, 'Carbon-13'),
    nuclide(6, 8, 'beta-', '5,730 y', 5730 * YEAR, null, 'Carbon-14 - radiocarbon dating'),
    nuclide(6, 9, 'beta-', '2.45 s', 2.45, null),
    
    // Nitrogen (Z=7)
    nuclide(7, 5, 'beta+', '11.0 ms', 0.011, null),
    nuclide(7, 6, 'ec', '9.97 min', 9.97 * MINUTE, null),
    nuclide(7, 7, 'stable', 'Stable', null, 99.636, 'Nitrogen-14'),
    nuclide(7, 8, 'stable', 'Stable', null, 0.364, 'Nitrogen-15'),
    nuclide(7, 9, 'beta-', '7.13 s', 7.13, null),
    
    // Oxygen (Z=8)
    nuclide(8, 5, 'beta+', '70.6 s', 70.6, null),
    nuclide(8, 6, 'beta+', '122 s', 122, null),
    nuclide(8, 7, 'beta+', '2.04 min', 2.04 * MINUTE, null),
    nuclide(8, 8, 'stable', 'Stable', null, 99.757, 'Oxygen-16'),
    nuclide(8, 9, 'stable', 'Stable', null, 0.038, 'Oxygen-17'),
    nuclide(8, 10, 'stable', 'Stable', null, 0.205, 'Oxygen-18 - paleoclimate proxy'),
    nuclide(8, 11, 'beta-', '26.9 s', 26.9, null),
    
    // Fluorine (Z=9)
    nuclide(9, 8, 'ec', '64.5 s', 64.5, null),
    nuclide(9, 9, 'beta+', '109.8 min', 109.8 * MINUTE, null, 'F-18 - PET scanning'),
    nuclide(9, 10, 'stable', 'Stable', null, 100, 'Fluorine-19 - only stable isotope'),
    nuclide(9, 11, 'beta-', '11.2 s', 11.2, null),
    
    // Neon (Z=10)
    nuclide(10, 8, 'ec', '1.67 s', 1.67, null),
    nuclide(10, 9, 'beta+', '17.2 s', 17.2, null),
    nuclide(10, 10, 'stable', 'Stable', null, 90.48, 'Neon-20'),
    nuclide(10, 11, 'stable', 'Stable', null, 0.27, 'Neon-21'),
    nuclide(10, 12, 'stable', 'Stable', null, 9.25, 'Neon-22'),
    nuclide(10, 13, 'beta-', '37.2 s', 37.2, null),
    
    // Sodium (Z=11)
    nuclide(11, 10, 'ec', '22.5 s', 22.5, null),
    nuclide(11, 11, 'beta+', '2.60 y', 2.60 * YEAR, null, 'Na-22 - positron source'),
    nuclide(11, 12, 'stable', 'Stable', null, 100, 'Sodium-23'),
    nuclide(11, 13, 'beta-', '15.0 h', 15.0 * HOUR, null, 'Na-24 - nuclear medicine'),
    
    // Magnesium (Z=12)
    nuclide(12, 11, 'beta+', '11.3 s', 11.3, null),
    nuclide(12, 12, 'stable', 'Stable', null, 78.99, 'Magnesium-24'),
    nuclide(12, 13, 'stable', 'Stable', null, 10.00, 'Magnesium-25'),
    nuclide(12, 14, 'stable', 'Stable', null, 11.01, 'Magnesium-26'),
    nuclide(12, 15, 'beta-', '9.46 min', 9.46 * MINUTE, null),
    nuclide(12, 16, 'beta-', '20.9 h', 20.9 * HOUR, null),
    
    // Aluminium (Z=13)
    nuclide(13, 12, 'beta+', '7.17 s', 7.17, null),
    nuclide(13, 13, 'beta+', '2.24 min', 2.24 * MINUTE, null),
    nuclide(13, 14, 'stable', 'Stable', null, 100, 'Aluminium-27'),
    nuclide(13, 15, 'beta-', '2.24 min', 2.24 * MINUTE, null),
    nuclide(13, 16, 'beta-', '6.56 min', 6.56 * MINUTE, null),
    
    // Silicon (Z=14)
    nuclide(14, 12, 'ec', '2.25 s', 2.25, null),
    nuclide(14, 13, 'beta+', '4.12 s', 4.12, null),
    nuclide(14, 14, 'stable', 'Stable', null, 92.223, 'Silicon-28'),
    nuclide(14, 15, 'stable', 'Stable', null, 4.685, 'Silicon-29'),
    nuclide(14, 16, 'stable', 'Stable', null, 3.092, 'Silicon-30'),
    nuclide(14, 17, 'beta-', '2.62 h', 2.62 * HOUR, null),
    nuclide(14, 18, 'beta-', '153 y', 153 * YEAR, null),
    
    // Phosphorus (Z=15)
    nuclide(15, 14, 'beta+', '4.14 s', 4.14, null),
    nuclide(15, 15, 'beta+', '2.50 min', 2.50 * MINUTE, null),
    nuclide(15, 16, 'stable', 'Stable', null, 100, 'Phosphorus-31'),
    nuclide(15, 17, 'beta-', '14.3 d', 14.3 * DAY, null, 'P-32 - radiotracer'),
    nuclide(15, 18, 'beta-', '25.3 d', 25.3 * DAY, null),
    
    // Sulfur (Z=16)
    nuclide(16, 15, 'beta+', '1.18 s', 1.18, null),
    nuclide(16, 16, 'stable', 'Stable', null, 94.99, 'Sulfur-32'),
    nuclide(16, 17, 'stable', 'Stable', null, 0.75, 'Sulfur-33'),
    nuclide(16, 18, 'stable', 'Stable', null, 4.25, 'Sulfur-34'),
    nuclide(16, 19, 'beta-', '87.5 d', 87.5 * DAY, null, 'S-35 - biochemistry tracer'),
    nuclide(16, 20, 'stable', 'Stable', null, 0.01, 'Sulfur-36'),
    
    // Chlorine (Z=17)
    nuclide(17, 17, 'ec', '3.01e5 y', 3.01e5 * YEAR, null),
    nuclide(17, 18, 'stable', 'Stable', null, 75.76, 'Chlorine-35'),
    nuclide(17, 19, 'beta-', '37.2 min', 37.2 * MINUTE, null, 'Cl-36'),
    nuclide(17, 20, 'stable', 'Stable', null, 24.24, 'Chlorine-37'),
    
    // Argon (Z=18)
    nuclide(18, 17, 'ec', '35.0 d', 35.0 * DAY, null),
    nuclide(18, 18, 'stable', 'Stable', null, 0.334, 'Argon-36'),
    nuclide(18, 19, 'ec', '35.0 d', 35.0 * DAY, null),
    nuclide(18, 20, 'stable', 'Stable', null, 0.063, 'Argon-38'),
    nuclide(18, 21, 'beta-', '269 y', 269 * YEAR, null, 'Ar-39'),
    nuclide(18, 22, 'stable', 'Stable', null, 99.604, 'Argon-40 - from K-40 decay'),
    nuclide(18, 23, 'beta-', '109 min', 109 * MINUTE, null),
    nuclide(18, 24, 'beta-', '33 y', 33 * YEAR, null),
    
    // Potassium (Z=19)
    nuclide(19, 19, 'ec', '7.64 min', 7.64 * MINUTE, null),
    nuclide(19, 20, 'stable', 'Stable', null, 93.258, 'Potassium-39'),
    nuclide(19, 21, 'beta-', '1.25e9 y', 1.25e9 * YEAR, 0.012, 'K-40 - radiometric dating'),
    nuclide(19, 22, 'stable', 'Stable', null, 6.730, 'Potassium-41'),
    nuclide(19, 23, 'beta-', '12.4 h', 12.4 * HOUR, null),
    
    // Calcium (Z=20)
    nuclide(20, 20, 'stable', 'Stable', null, 96.941, 'Calcium-40'),
    nuclide(20, 21, 'ec', '1.03e5 y', 1.03e5 * YEAR, null),
    nuclide(20, 22, 'stable', 'Stable', null, 0.647, 'Calcium-42'),
    nuclide(20, 23, 'stable', 'Stable', null, 0.135, 'Calcium-43'),
    nuclide(20, 24, 'stable', 'Stable', null, 2.086, 'Calcium-44'),
    nuclide(20, 25, 'beta-', '163 d', 163 * DAY, null),
    nuclide(20, 26, 'stable', 'Stable', null, 0.004, 'Calcium-46'),
    nuclide(20, 27, 'beta-', '4.54 d', 4.54 * DAY, null),
    nuclide(20, 28, '2beta-', '6.4e19 y', 6.4e19 * YEAR, 0.187, 'Calcium-48'),
    
    // Scandium (Z=21)
    nuclide(21, 23, 'beta+', '3.35 h', 3.35 * HOUR, null),
    nuclide(21, 24, 'stable', 'Stable', null, 100, 'Scandium-45'),
    nuclide(21, 25, 'beta-', '83.8 d', 83.8 * DAY, null),
    nuclide(21, 26, 'beta-', '3.35 d', 3.35 * DAY, null),
    
    // Titanium (Z=22)
    nuclide(22, 22, 'ec', '49 y', 49 * YEAR, null),
    nuclide(22, 24, 'stable', 'Stable', null, 8.25, 'Titanium-46'),
    nuclide(22, 25, 'stable', 'Stable', null, 7.44, 'Titanium-47'),
    nuclide(22, 26, 'stable', 'Stable', null, 73.72, 'Titanium-48'),
    nuclide(22, 27, 'stable', 'Stable', null, 5.41, 'Titanium-49'),
    nuclide(22, 28, 'stable', 'Stable', null, 5.18, 'Titanium-50'),
    
    // Vanadium (Z=23)
    nuclide(23, 25, 'ec', '330 d', 330 * DAY, null),
    nuclide(23, 26, 'ec', '16.0 d', 16.0 * DAY, null),
    nuclide(23, 27, 'ec', '1.6e17 y', 1.6e17 * YEAR, 0.250, 'Vanadium-50'),
    nuclide(23, 28, 'stable', 'Stable', null, 99.750, 'Vanadium-51'),
    
    // Chromium (Z=24)
    nuclide(24, 26, 'stable', 'Stable', null, 4.345, 'Chromium-50'),
    nuclide(24, 27, 'ec', '27.7 d', 27.7 * DAY, null, 'Cr-51 - radiotracer'),
    nuclide(24, 28, 'stable', 'Stable', null, 83.789, 'Chromium-52'),
    nuclide(24, 29, 'stable', 'Stable', null, 9.501, 'Chromium-53'),
    nuclide(24, 30, 'stable', 'Stable', null, 2.365, 'Chromium-54'),
    
    // Manganese (Z=25)
    nuclide(25, 27, 'ec', '312 d', 312 * DAY, null),
    nuclide(25, 28, 'ec', '3.7e6 y', 3.7e6 * YEAR, null),
    nuclide(25, 29, 'ec', '5.59 d', 5.59 * DAY, null),
    nuclide(25, 30, 'stable', 'Stable', null, 100, 'Manganese-55'),
    nuclide(25, 31, 'beta-', '2.58 h', 2.58 * HOUR, null),
    
    // Iron (Z=26)
    nuclide(26, 28, 'stable', 'Stable', null, 5.845, 'Iron-54'),
    nuclide(26, 29, 'ec', '2.74 y', 2.74 * YEAR, null, 'Fe-55'),
    nuclide(26, 30, 'stable', 'Stable', null, 91.754, 'Iron-56 - most stable nucleus'),
    nuclide(26, 31, 'stable', 'Stable', null, 2.119, 'Iron-57'),
    nuclide(26, 32, 'stable', 'Stable', null, 0.282, 'Iron-58'),
    nuclide(26, 33, 'beta-', '44.5 d', 44.5 * DAY, null, 'Fe-59'),
    nuclide(26, 34, 'beta-', '1.5e6 y', 1.5e6 * YEAR, null, 'Fe-60'),
    
    // Cobalt (Z=27)
    nuclide(27, 29, 'ec', '271 d', 271 * DAY, null, 'Co-56'),
    nuclide(27, 30, 'ec', '77.2 d', 77.2 * DAY, null, 'Co-57'),
    nuclide(27, 31, 'ec', '70.9 d', 70.9 * DAY, null),
    nuclide(27, 32, 'stable', 'Stable', null, 100, 'Cobalt-59'),
    nuclide(27, 33, 'beta-', '5.27 y', 5.27 * YEAR, null, 'Co-60 - gamma source'),
    
    // Nickel (Z=28)
    nuclide(28, 28, 'ec', '6.08 d', 6.08 * DAY, null),
    nuclide(28, 30, 'stable', 'Stable', null, 68.077, 'Nickel-58'),
    nuclide(28, 31, 'ec', '7.6e4 y', 7.6e4 * YEAR, null),
    nuclide(28, 32, 'stable', 'Stable', null, 26.223, 'Nickel-60'),
    nuclide(28, 33, 'stable', 'Stable', null, 1.140, 'Nickel-61'),
    nuclide(28, 34, 'stable', 'Stable', null, 3.635, 'Nickel-62'),
    nuclide(28, 35, 'beta-', '100 y', 100 * YEAR, null),
    nuclide(28, 36, 'stable', 'Stable', null, 0.926, 'Nickel-64'),
    
    // Copper (Z=29)
    nuclide(29, 33, 'beta+', '12.7 h', 12.7 * HOUR, null),
    nuclide(29, 34, 'stable', 'Stable', null, 69.15, 'Copper-63'),
    nuclide(29, 35, 'beta+', '12.7 h', 12.7 * HOUR, null, 'Cu-64 - PET imaging'),
    nuclide(29, 36, 'stable', 'Stable', null, 30.85, 'Copper-65'),
    nuclide(29, 38, 'beta-', '61.8 h', 61.8 * HOUR, null),
    
    // Zinc (Z=30)
    nuclide(30, 34, 'stable', 'Stable', null, 49.17, 'Zinc-64'),
    nuclide(30, 35, 'ec', '244 d', 244 * DAY, null),
    nuclide(30, 36, 'stable', 'Stable', null, 27.73, 'Zinc-66'),
    nuclide(30, 37, 'stable', 'Stable', null, 4.04, 'Zinc-67'),
    nuclide(30, 38, 'stable', 'Stable', null, 18.45, 'Zinc-68'),
    nuclide(30, 40, 'stable', 'Stable', null, 0.61, 'Zinc-70'),
    
    // Gallium (Z=31)
    nuclide(31, 36, 'ec', '78.3 h', 78.3 * HOUR, null, 'Ga-67 - SPECT imaging'),
    nuclide(31, 37, 'ec', '68.1 min', 68.1 * MINUTE, null, 'Ga-68 - PET imaging'),
    nuclide(31, 38, 'stable', 'Stable', null, 60.11, 'Gallium-69'),
    nuclide(31, 40, 'stable', 'Stable', null, 39.89, 'Gallium-71'),
    nuclide(31, 41, 'beta-', '14.1 h', 14.1 * HOUR, null),
    
    // Germanium (Z=32)
    nuclide(32, 38, 'stable', 'Stable', null, 20.52, 'Germanium-70'),
    nuclide(32, 39, 'ec', '11.4 d', 11.4 * DAY, null),
    nuclide(32, 40, 'stable', 'Stable', null, 27.45, 'Germanium-72'),
    nuclide(32, 41, 'stable', 'Stable', null, 7.76, 'Germanium-73'),
    nuclide(32, 42, 'stable', 'Stable', null, 36.52, 'Germanium-74'),
    nuclide(32, 44, '2beta-', '1.8e21 y', 1.8e21 * YEAR, 7.75, 'Germanium-76'),
    
    // Arsenic (Z=33)
    nuclide(33, 38, 'ec', '80.3 d', 80.3 * DAY, null),
    nuclide(33, 40, 'ec', '17.8 d', 17.8 * DAY, null),
    nuclide(33, 42, 'stable', 'Stable', null, 100, 'Arsenic-75'),
    nuclide(33, 44, 'beta-', '26.3 h', 26.3 * HOUR, null),
    
    // Selenium (Z=34)
    nuclide(34, 40, 'stable', 'Stable', null, 0.89, 'Selenium-74'),
    nuclide(34, 41, 'ec', '120 d', 120 * DAY, null, 'Se-75'),
    nuclide(34, 42, 'stable', 'Stable', null, 9.37, 'Selenium-76'),
    nuclide(34, 43, 'stable', 'Stable', null, 7.63, 'Selenium-77'),
    nuclide(34, 44, 'stable', 'Stable', null, 23.77, 'Selenium-78'),
    nuclide(34, 45, 'beta-', '6.5e4 y', 6.5e4 * YEAR, null),
    nuclide(34, 46, 'stable', 'Stable', null, 49.61, 'Selenium-80'),
    nuclide(34, 48, '2beta-', '1.0e20 y', 1.0e20 * YEAR, 8.73, 'Selenium-82'),
    
    // Bromine (Z=35)
    nuclide(35, 44, 'stable', 'Stable', null, 50.69, 'Bromine-79'),
    nuclide(35, 45, 'it', '4.42 h', 4.42 * HOUR, null),
    nuclide(35, 46, 'stable', 'Stable', null, 49.31, 'Bromine-81'),
    nuclide(35, 47, 'beta-', '35.3 h', 35.3 * HOUR, null),
    
    // Krypton (Z=36)
    nuclide(36, 42, 'stable', 'Stable', null, 0.35, 'Krypton-78'),
    nuclide(36, 44, 'stable', 'Stable', null, 2.29, 'Krypton-80'),
    nuclide(36, 45, 'ec', '2.1e5 y', 2.1e5 * YEAR, null, 'Kr-81'),
    nuclide(36, 46, 'stable', 'Stable', null, 11.59, 'Krypton-82'),
    nuclide(36, 47, 'stable', 'Stable', null, 11.50, 'Krypton-83'),
    nuclide(36, 48, 'stable', 'Stable', null, 56.99, 'Krypton-84'),
    nuclide(36, 49, 'beta-', '10.8 y', 10.8 * YEAR, null, 'Kr-85 - nuclear tracer'),
    nuclide(36, 50, 'stable', 'Stable', null, 17.28, 'Krypton-86'),
    
    // Rubidium (Z=37)
    nuclide(37, 48, 'stable', 'Stable', null, 72.17, 'Rubidium-85'),
    nuclide(37, 49, 'beta-', '4.9e10 y', 4.9e10 * YEAR, null),
    nuclide(37, 50, 'beta-', '4.92e10 y', 4.92e10 * YEAR, 27.83, 'Rb-87 - geochronology'),
    
    // Strontium (Z=38)
    nuclide(38, 46, 'stable', 'Stable', null, 0.56, 'Strontium-84'),
    nuclide(38, 48, 'stable', 'Stable', null, 9.86, 'Strontium-86'),
    nuclide(38, 49, 'stable', 'Stable', null, 7.00, 'Strontium-87'),
    nuclide(38, 50, 'stable', 'Stable', null, 82.58, 'Strontium-88'),
    nuclide(38, 51, 'beta-', '50.6 d', 50.6 * DAY, null, 'Sr-89'),
    nuclide(38, 52, 'beta-', '28.8 y', 28.8 * YEAR, null, 'Sr-90 - fallout product'),
    
    // Yttrium (Z=39)
    nuclide(39, 49, 'ec', '106.6 d', 106.6 * DAY, null, 'Y-88'),
    nuclide(39, 50, 'stable', 'Stable', null, 100, 'Yttrium-89'),
    nuclide(39, 51, 'beta-', '64 h', 64 * HOUR, null, 'Y-90 - radiotherapy'),
    nuclide(39, 52, 'beta-', '58.5 d', 58.5 * DAY, null),
    
    // Zirconium (Z=40)
    nuclide(40, 50, 'stable', 'Stable', null, 51.45, 'Zirconium-90'),
    nuclide(40, 51, 'stable', 'Stable', null, 11.22, 'Zirconium-91'),
    nuclide(40, 52, 'stable', 'Stable', null, 17.15, 'Zirconium-92'),
    nuclide(40, 53, 'beta-', '1.5e6 y', 1.5e6 * YEAR, null),
    nuclide(40, 54, 'stable', 'Stable', null, 17.38, 'Zirconium-94'),
    nuclide(40, 55, 'beta-', '64 d', 64 * DAY, null),
    nuclide(40, 56, '2beta-', '2.0e19 y', 2.0e19 * YEAR, 2.80, 'Zirconium-96'),
    
    // Niobium (Z=41)
    nuclide(41, 51, 'ec', '3.5e4 y', 3.5e4 * YEAR, null),
    nuclide(41, 52, 'stable', 'Stable', null, 100, 'Niobium-93'),
    nuclide(41, 53, 'beta-', '2.0e4 y', 2.0e4 * YEAR, null),
    nuclide(41, 54, 'beta-', '35.0 d', 35.0 * DAY, null),
    
    // Molybdenum (Z=42)
    nuclide(42, 50, 'stable', 'Stable', null, 14.53, 'Molybdenum-92'),
    nuclide(42, 51, 'ec', '4.0e3 y', 4.0e3 * YEAR, null),
    nuclide(42, 52, 'stable', 'Stable', null, 9.15, 'Molybdenum-94'),
    nuclide(42, 53, 'stable', 'Stable', null, 15.84, 'Molybdenum-95'),
    nuclide(42, 54, 'stable', 'Stable', null, 16.67, 'Molybdenum-96'),
    nuclide(42, 55, 'stable', 'Stable', null, 9.60, 'Molybdenum-97'),
    nuclide(42, 56, 'stable', 'Stable', null, 24.39, 'Molybdenum-98'),
    nuclide(42, 57, 'beta-', '66 h', 66 * HOUR, null, 'Mo-99 - medical isotope'),
    nuclide(42, 58, '2beta-', '7.1e18 y', 7.1e18 * YEAR, 9.82, 'Molybdenum-100'),
    
    // Technetium (Z=43) - no stable isotopes
    nuclide(43, 54, 'beta-', '4.2e6 y', 4.2e6 * YEAR, null),
    nuclide(43, 55, 'ec', '61 d', 61 * DAY, null),
    nuclide(43, 56, 'it', '6.01 h', 6.01 * HOUR, null, 'Tc-99m - most used medical isotope'),
    nuclide(43, 57, 'beta-', '2.1e5 y', 2.1e5 * YEAR, null, 'Tc-99'),
    
    // Ruthenium (Z=44)
    nuclide(44, 52, 'stable', 'Stable', null, 5.54, 'Ruthenium-96'),
    nuclide(44, 54, 'stable', 'Stable', null, 1.87, 'Ruthenium-98'),
    nuclide(44, 55, 'stable', 'Stable', null, 12.76, 'Ruthenium-99'),
    nuclide(44, 56, 'stable', 'Stable', null, 12.60, 'Ruthenium-100'),
    nuclide(44, 57, 'stable', 'Stable', null, 17.06, 'Ruthenium-101'),
    nuclide(44, 58, 'stable', 'Stable', null, 31.55, 'Ruthenium-102'),
    nuclide(44, 59, 'beta-', '39.3 d', 39.3 * DAY, null, 'Ru-103'),
    nuclide(44, 60, 'stable', 'Stable', null, 18.62, 'Ruthenium-104'),
    nuclide(44, 62, 'beta-', '373.6 d', 373.6 * DAY, null, 'Ru-106'),
    
    // Rhodium (Z=45)
    nuclide(45, 58, 'stable', 'Stable', null, 100, 'Rhodium-103'),
    
    // Palladium (Z=46)
    nuclide(46, 56, 'stable', 'Stable', null, 1.02, 'Palladium-102'),
    nuclide(46, 57, 'ec', '17.0 d', 17.0 * DAY, null, 'Pd-103'),
    nuclide(46, 58, 'stable', 'Stable', null, 11.14, 'Palladium-104'),
    nuclide(46, 59, 'stable', 'Stable', null, 22.33, 'Palladium-105'),
    nuclide(46, 60, 'stable', 'Stable', null, 27.33, 'Palladium-106'),
    nuclide(46, 61, 'beta-', '6.5e6 y', 6.5e6 * YEAR, null),
    nuclide(46, 62, 'stable', 'Stable', null, 26.46, 'Palladium-108'),
    nuclide(46, 64, 'stable', 'Stable', null, 11.72, 'Palladium-110'),
    
    // Silver (Z=47)
    nuclide(47, 58, 'ec', '418 y', 418 * YEAR, null),
    nuclide(47, 60, 'stable', 'Stable', null, 51.84, 'Silver-107'),
    nuclide(47, 62, 'stable', 'Stable', null, 48.16, 'Silver-109'),
    nuclide(47, 63, 'beta-', '249 d', 249 * DAY, null, 'Ag-110m'),
    nuclide(47, 64, 'beta-', '7.45 d', 7.45 * DAY, null),
    
    // Cadmium (Z=48)
    nuclide(48, 58, 'stable', 'Stable', null, 1.25, 'Cadmium-106'),
    nuclide(48, 60, 'stable', 'Stable', null, 0.89, 'Cadmium-108'),
    nuclide(48, 61, 'ec', '462 d', 462 * DAY, null, 'Cd-109'),
    nuclide(48, 62, 'stable', 'Stable', null, 12.49, 'Cadmium-110'),
    nuclide(48, 63, 'stable', 'Stable', null, 12.80, 'Cadmium-111'),
    nuclide(48, 64, 'stable', 'Stable', null, 24.13, 'Cadmium-112'),
    nuclide(48, 65, 'beta-', '9.3e15 y', 9.3e15 * YEAR, 12.22, 'Cadmium-113'),
    nuclide(48, 66, 'stable', 'Stable', null, 28.73, 'Cadmium-114'),
    nuclide(48, 67, 'beta-', '53.5 h', 53.5 * HOUR, null),
    nuclide(48, 68, '2beta-', '7.7e19 y', 7.7e19 * YEAR, 7.49, 'Cadmium-116'),
    
    // Indium (Z=49)
    nuclide(49, 62, 'ec', '2.80 d', 2.80 * DAY, null, 'In-111'),
    nuclide(49, 64, 'stable', 'Stable', null, 4.29, 'Indium-113'),
    nuclide(49, 65, 'it', '49.5 d', 49.5 * DAY, null),
    nuclide(49, 66, 'beta-', '4.4e14 y', 4.4e14 * YEAR, 95.71, 'Indium-115'),
    
    // Tin (Z=50) - magic number element
    nuclide(50, 62, 'stable', 'Stable', null, 0.97, 'Tin-112'),
    nuclide(50, 63, 'ec', '115 d', 115 * DAY, null),
    nuclide(50, 64, 'stable', 'Stable', null, 0.66, 'Tin-114'),
    nuclide(50, 65, 'stable', 'Stable', null, 0.34, 'Tin-115'),
    nuclide(50, 66, 'stable', 'Stable', null, 14.54, 'Tin-116'),
    nuclide(50, 67, 'stable', 'Stable', null, 7.68, 'Tin-117'),
    nuclide(50, 68, 'stable', 'Stable', null, 24.22, 'Tin-118'),
    nuclide(50, 69, 'stable', 'Stable', null, 8.59, 'Tin-119'),
    nuclide(50, 70, 'stable', 'Stable', null, 32.58, 'Tin-120'),
    nuclide(50, 71, 'beta-', '27.0 h', 27.0 * HOUR, null),
    nuclide(50, 72, 'stable', 'Stable', null, 4.63, 'Tin-122'),
    nuclide(50, 74, 'stable', 'Stable', null, 5.79, 'Tin-124'),
    nuclide(50, 76, 'beta-', '2.3e5 y', 2.3e5 * YEAR, null),
    
    // Antimony (Z=51)
    nuclide(51, 70, 'stable', 'Stable', null, 57.21, 'Antimony-121'),
    nuclide(51, 71, 'beta-', '2.70 d', 2.70 * DAY, null),
    nuclide(51, 72, 'stable', 'Stable', null, 42.79, 'Antimony-123'),
    nuclide(51, 73, 'beta-', '60.2 d', 60.2 * DAY, null, 'Sb-124'),
    nuclide(51, 74, 'beta-', '2.76 y', 2.76 * YEAR, null, 'Sb-125'),
    
    // Tellurium (Z=52)
    nuclide(52, 68, 'stable', 'Stable', null, 0.09, 'Tellurium-120'),
    nuclide(52, 70, 'stable', 'Stable', null, 2.55, 'Tellurium-122'),
    nuclide(52, 71, 'ec', '1.2e13 y', 1.2e13 * YEAR, 0.89, 'Tellurium-123'),
    nuclide(52, 72, 'stable', 'Stable', null, 4.74, 'Tellurium-124'),
    nuclide(52, 73, 'stable', 'Stable', null, 7.07, 'Tellurium-125'),
    nuclide(52, 74, 'stable', 'Stable', null, 18.84, 'Tellurium-126'),
    nuclide(52, 75, 'beta-', '9.4 h', 9.4 * HOUR, null),
    nuclide(52, 76, '2beta-', '2.2e24 y', 2.2e24 * YEAR, 31.74, 'Tellurium-128'),
    nuclide(52, 77, 'beta-', '69.6 min', 69.6 * MINUTE, null),
    nuclide(52, 78, '2beta-', '7.9e20 y', 7.9e20 * YEAR, 34.08, 'Tellurium-130'),
    
    // Iodine (Z=53)
    nuclide(53, 72, 'ec', '13.3 h', 13.3 * HOUR, null),
    nuclide(53, 73, 'ec', '4.18 d', 4.18 * DAY, null),
    nuclide(53, 74, 'stable', 'Stable', null, 100, 'Iodine-127'),
    nuclide(53, 76, 'beta-', '1.6e7 y', 1.6e7 * YEAR, null, 'I-129'),
    nuclide(53, 78, 'beta-', '8.02 d', 8.02 * DAY, null, 'I-131 - thyroid treatment'),
    
    // Xenon (Z=54)
    nuclide(54, 70, 'stable', 'Stable', null, 0.09, 'Xenon-124'),
    nuclide(54, 72, 'stable', 'Stable', null, 0.09, 'Xenon-126'),
    nuclide(54, 74, 'stable', 'Stable', null, 1.92, 'Xenon-128'),
    nuclide(54, 75, 'stable', 'Stable', null, 26.44, 'Xenon-129'),
    nuclide(54, 76, 'stable', 'Stable', null, 4.08, 'Xenon-130'),
    nuclide(54, 77, 'stable', 'Stable', null, 21.18, 'Xenon-131'),
    nuclide(54, 78, 'stable', 'Stable', null, 26.89, 'Xenon-132'),
    nuclide(54, 79, 'beta-', '5.25 d', 5.25 * DAY, null, 'Xe-133'),
    nuclide(54, 80, 'stable', 'Stable', null, 10.44, 'Xenon-134'),
    nuclide(54, 82, '2beta-', '2.2e21 y', 2.2e21 * YEAR, 8.87, 'Xenon-136'),
    
    // Caesium (Z=55)
    nuclide(55, 78, 'stable', 'Stable', null, 100, 'Caesium-133'),
    nuclide(55, 79, 'ec', '2.07 y', 2.07 * YEAR, null, 'Cs-134'),
    nuclide(55, 80, 'beta-', '2.3e6 y', 2.3e6 * YEAR, null, 'Cs-135'),
    nuclide(55, 82, 'beta-', '30.2 y', 30.2 * YEAR, null, 'Cs-137 - major fallout isotope'),
    
    // Barium (Z=56)
    nuclide(56, 74, 'stable', 'Stable', null, 0.11, 'Barium-130'),
    nuclide(56, 76, 'stable', 'Stable', null, 0.10, 'Barium-132'),
    nuclide(56, 77, 'ec', '10.5 y', 10.5 * YEAR, null),
    nuclide(56, 78, 'stable', 'Stable', null, 2.42, 'Barium-134'),
    nuclide(56, 79, 'stable', 'Stable', null, 6.59, 'Barium-135'),
    nuclide(56, 80, 'stable', 'Stable', null, 7.85, 'Barium-136'),
    nuclide(56, 81, 'stable', 'Stable', null, 11.23, 'Barium-137'),
    nuclide(56, 82, 'stable', 'Stable', null, 71.70, 'Barium-138'),
    nuclide(56, 84, 'beta-', '12.75 d', 12.75 * DAY, null, 'Ba-140'),
    
    // Lanthanum (Z=57)
    nuclide(57, 81, 'ec', '1.0e11 y', 1.0e11 * YEAR, 0.09, 'Lanthanum-138'),
    nuclide(57, 82, 'stable', 'Stable', null, 99.91, 'Lanthanum-139'),
    nuclide(57, 83, 'beta-', '1.68 d', 1.68 * DAY, null),
    
    // Cerium (Z=58)
    nuclide(58, 78, 'stable', 'Stable', null, 0.19, 'Cerium-136'),
    nuclide(58, 80, 'stable', 'Stable', null, 0.25, 'Cerium-138'),
    nuclide(58, 82, 'stable', 'Stable', null, 88.45, 'Cerium-140'),
    nuclide(58, 83, 'beta-', '32.5 d', 32.5 * DAY, null),
    nuclide(58, 84, 'stable', 'Stable', null, 11.11, 'Cerium-142'),
    nuclide(58, 86, 'beta-', '284 d', 284 * DAY, null, 'Ce-144'),
    
    // Praseodymium (Z=59)
    nuclide(59, 82, 'stable', 'Stable', null, 100, 'Praseodymium-141'),
    nuclide(59, 84, 'beta-', '13.6 d', 13.6 * DAY, null),
    
    // Neodymium (Z=60)
    nuclide(60, 82, 'stable', 'Stable', null, 27.15, 'Neodymium-142'),
    nuclide(60, 83, 'stable', 'Stable', null, 12.17, 'Neodymium-143'),
    nuclide(60, 84, 'alpha', '2.3e15 y', 2.3e15 * YEAR, 23.80, 'Neodymium-144'),
    nuclide(60, 85, 'stable', 'Stable', null, 8.29, 'Neodymium-145'),
    nuclide(60, 86, 'stable', 'Stable', null, 17.19, 'Neodymium-146'),
    nuclide(60, 88, 'stable', 'Stable', null, 5.76, 'Neodymium-148'),
    nuclide(60, 90, '2beta-', '6.7e18 y', 6.7e18 * YEAR, 5.64, 'Neodymium-150'),
    
    // Promethium (Z=61) - no stable isotopes
    nuclide(61, 84, 'ec', '363 d', 363 * DAY, null),
    nuclide(61, 86, 'beta-', '5.53 y', 5.53 * YEAR, null),
    nuclide(61, 87, 'beta-', '2.62 y', 2.62 * YEAR, null, 'Pm-147'),
    nuclide(61, 90, 'beta-', '53.1 h', 53.1 * HOUR, null),
    
    // Samarium (Z=62)
    nuclide(62, 82, 'stable', 'Stable', null, 3.07, 'Samarium-144'),
    nuclide(62, 85, 'alpha', '1.0e8 y', 1.0e8 * YEAR, 15.00, 'Samarium-147'),
    nuclide(62, 86, 'alpha', '7.0e15 y', 7.0e15 * YEAR, 11.24, 'Samarium-148'),
    nuclide(62, 87, 'stable', 'Stable', null, 13.82, 'Samarium-149'),
    nuclide(62, 88, 'stable', 'Stable', null, 7.38, 'Samarium-150'),
    nuclide(62, 89, 'beta-', '90 y', 90 * YEAR, null),
    nuclide(62, 90, 'stable', 'Stable', null, 26.75, 'Samarium-152'),
    nuclide(62, 91, 'beta-', '46.3 h', 46.3 * HOUR, null),
    nuclide(62, 92, 'stable', 'Stable', null, 22.75, 'Samarium-154'),
    
    // Europium (Z=63)
    nuclide(63, 88, 'ec', '13.5 y', 13.5 * YEAR, null),
    nuclide(63, 89, 'ec', '8.59 y', 8.59 * YEAR, null, 'Eu-152'),
    nuclide(63, 90, 'stable', 'Stable', null, 47.81, 'Europium-153'),
    nuclide(63, 91, 'beta-', '8.59 y', 8.59 * YEAR, null, 'Eu-154'),
    nuclide(63, 92, 'beta-', '4.76 y', 4.76 * YEAR, null, 'Eu-155'),
    
    // Gadolinium (Z=64)
    nuclide(64, 88, 'alpha', '1.1e14 y', 1.1e14 * YEAR, 0.20, 'Gadolinium-152'),
    nuclide(64, 89, 'ec', '240 d', 240 * DAY, null),
    nuclide(64, 90, 'stable', 'Stable', null, 2.18, 'Gadolinium-154'),
    nuclide(64, 91, 'stable', 'Stable', null, 14.80, 'Gadolinium-155'),
    nuclide(64, 92, 'stable', 'Stable', null, 20.47, 'Gadolinium-156'),
    nuclide(64, 93, 'stable', 'Stable', null, 15.65, 'Gadolinium-157'),
    nuclide(64, 94, 'stable', 'Stable', null, 24.84, 'Gadolinium-158'),
    nuclide(64, 96, 'stable', 'Stable', null, 21.86, 'Gadolinium-160'),
    
    // Terbium (Z=65)
    nuclide(65, 94, 'stable', 'Stable', null, 100, 'Terbium-159'),
    nuclide(65, 95, 'beta-', '72.3 d', 72.3 * DAY, null),
    
    // Dysprosium (Z=66)
    nuclide(66, 90, 'stable', 'Stable', null, 0.06, 'Dysprosium-156'),
    nuclide(66, 92, 'stable', 'Stable', null, 0.10, 'Dysprosium-158'),
    nuclide(66, 94, 'stable', 'Stable', null, 2.34, 'Dysprosium-160'),
    nuclide(66, 95, 'stable', 'Stable', null, 18.91, 'Dysprosium-161'),
    nuclide(66, 96, 'stable', 'Stable', null, 25.51, 'Dysprosium-162'),
    nuclide(66, 97, 'stable', 'Stable', null, 24.90, 'Dysprosium-163'),
    nuclide(66, 98, 'stable', 'Stable', null, 28.18, 'Dysprosium-164'),
    
    // Holmium (Z=67)
    nuclide(67, 96, 'ec', '4.6e3 y', 4.6e3 * YEAR, null),
    nuclide(67, 98, 'stable', 'Stable', null, 100, 'Holmium-165'),
    nuclide(67, 99, 'beta-', '26.8 h', 26.8 * HOUR, null, 'Ho-166'),
    
    // Erbium (Z=68)
    nuclide(68, 94, 'stable', 'Stable', null, 0.14, 'Erbium-162'),
    nuclide(68, 96, 'stable', 'Stable', null, 1.61, 'Erbium-164'),
    nuclide(68, 98, 'stable', 'Stable', null, 33.61, 'Erbium-166'),
    nuclide(68, 99, 'stable', 'Stable', null, 22.93, 'Erbium-167'),
    nuclide(68, 100, 'stable', 'Stable', null, 26.78, 'Erbium-168'),
    nuclide(68, 101, 'beta-', '9.40 d', 9.40 * DAY, null),
    nuclide(68, 102, 'stable', 'Stable', null, 14.93, 'Erbium-170'),
    
    // Thulium (Z=69)
    nuclide(69, 100, 'stable', 'Stable', null, 100, 'Thulium-169'),
    nuclide(69, 101, 'beta-', '128.6 d', 128.6 * DAY, null, 'Tm-170'),
    nuclide(69, 102, 'beta-', '1.92 y', 1.92 * YEAR, null),
    
    // Ytterbium (Z=70)
    nuclide(70, 98, 'stable', 'Stable', null, 0.13, 'Ytterbium-168'),
    nuclide(70, 99, 'ec', '32.0 d', 32.0 * DAY, null),
    nuclide(70, 100, 'stable', 'Stable', null, 3.05, 'Ytterbium-170'),
    nuclide(70, 101, 'stable', 'Stable', null, 14.28, 'Ytterbium-171'),
    nuclide(70, 102, 'stable', 'Stable', null, 21.83, 'Ytterbium-172'),
    nuclide(70, 103, 'stable', 'Stable', null, 16.13, 'Ytterbium-173'),
    nuclide(70, 104, 'stable', 'Stable', null, 31.83, 'Ytterbium-174'),
    nuclide(70, 105, 'beta-', '4.18 d', 4.18 * DAY, null),
    nuclide(70, 106, 'stable', 'Stable', null, 12.76, 'Ytterbium-176'),
    
    // Lutetium (Z=71)
    nuclide(71, 104, 'stable', 'Stable', null, 97.41, 'Lutetium-175'),
    nuclide(71, 105, 'beta-', '3.76e10 y', 3.76e10 * YEAR, 2.59, 'Lu-176 - geochronology'),
    nuclide(71, 106, 'beta-', '6.65 d', 6.65 * DAY, null, 'Lu-177 - radiotherapy'),
    
    // Hafnium (Z=72)
    nuclide(72, 102, 'stable', 'Stable', null, 0.16, 'Hafnium-174'),
    nuclide(72, 104, 'stable', 'Stable', null, 5.26, 'Hafnium-176'),
    nuclide(72, 105, 'stable', 'Stable', null, 18.60, 'Hafnium-177'),
    nuclide(72, 106, 'stable', 'Stable', null, 27.28, 'Hafnium-178'),
    nuclide(72, 107, 'stable', 'Stable', null, 13.62, 'Hafnium-179'),
    nuclide(72, 108, 'stable', 'Stable', null, 35.08, 'Hafnium-180'),
    nuclide(72, 110, 'beta-', '42.4 d', 42.4 * DAY, null),
    
    // Tantalum (Z=73)
    nuclide(73, 107, 'ec', '1.2e15 y', 1.2e15 * YEAR, 0.012, 'Tantalum-180'),
    nuclide(73, 108, 'stable', 'Stable', null, 99.988, 'Tantalum-181'),
    nuclide(73, 109, 'beta-', '114 d', 114 * DAY, null),
    
    // Tungsten (Z=74)
    nuclide(74, 106, 'stable', 'Stable', null, 0.12, 'Tungsten-180'),
    nuclide(74, 108, 'stable', 'Stable', null, 26.50, 'Tungsten-182'),
    nuclide(74, 109, 'stable', 'Stable', null, 14.31, 'Tungsten-183'),
    nuclide(74, 110, 'stable', 'Stable', null, 30.64, 'Tungsten-184'),
    nuclide(74, 112, 'alpha', '1.8e18 y', 1.8e18 * YEAR, 28.43, 'Tungsten-186'),
    nuclide(74, 113, 'beta-', '23.7 h', 23.7 * HOUR, null),
    
    // Rhenium (Z=75)
    nuclide(75, 110, 'stable', 'Stable', null, 37.40, 'Rhenium-185'),
    nuclide(75, 111, 'beta-', '90.6 h', 90.6 * HOUR, null, 'Re-186'),
    nuclide(75, 112, 'beta-', '4.12e10 y', 4.12e10 * YEAR, 62.60, 'Re-187 - geochronology'),
    nuclide(75, 113, 'beta-', '17.0 h', 17.0 * HOUR, null, 'Re-188'),
    
    // Osmium (Z=76)
    nuclide(76, 108, 'stable', 'Stable', null, 0.02, 'Osmium-184'),
    nuclide(76, 110, 'alpha', '2.0e15 y', 2.0e15 * YEAR, 1.59, 'Osmium-186'),
    nuclide(76, 111, 'stable', 'Stable', null, 1.96, 'Osmium-187'),
    nuclide(76, 112, 'stable', 'Stable', null, 13.24, 'Osmium-188'),
    nuclide(76, 113, 'stable', 'Stable', null, 16.15, 'Osmium-189'),
    nuclide(76, 114, 'stable', 'Stable', null, 26.26, 'Osmium-190'),
    nuclide(76, 115, 'beta-', '15.4 d', 15.4 * DAY, null),
    nuclide(76, 116, 'stable', 'Stable', null, 40.78, 'Osmium-192'),
    nuclide(76, 118, 'beta-', '6.0 y', 6.0 * YEAR, null),
    
    // Iridium (Z=77)
    nuclide(77, 114, 'stable', 'Stable', null, 37.3, 'Iridium-191'),
    nuclide(77, 115, 'beta-', '73.8 d', 73.8 * DAY, null, 'Ir-192'),
    nuclide(77, 116, 'stable', 'Stable', null, 62.7, 'Iridium-193'),
    nuclide(77, 117, 'beta-', '19.3 h', 19.3 * HOUR, null),
    
    // Platinum (Z=78)
    nuclide(78, 112, 'stable', 'Stable', null, 0.01, 'Platinum-190'),
    nuclide(78, 114, 'stable', 'Stable', null, 0.79, 'Platinum-192'),
    nuclide(78, 116, 'stable', 'Stable', null, 32.86, 'Platinum-194'),
    nuclide(78, 117, 'stable', 'Stable', null, 33.78, 'Platinum-195'),
    nuclide(78, 118, 'stable', 'Stable', null, 25.21, 'Platinum-196'),
    nuclide(78, 119, 'beta-', '19.9 h', 19.9 * HOUR, null),
    nuclide(78, 120, 'stable', 'Stable', null, 7.36, 'Platinum-198'),
    
    // Gold (Z=79)
    nuclide(79, 116, 'ec', '186 d', 186 * DAY, null),
    nuclide(79, 118, 'stable', 'Stable', null, 100, 'Gold-197'),
    nuclide(79, 119, 'beta-', '2.70 d', 2.70 * DAY, null, 'Au-198'),
    nuclide(79, 120, 'beta-', '3.14 d', 3.14 * DAY, null),
    
    // Mercury (Z=80)
    nuclide(80, 116, 'stable', 'Stable', null, 0.15, 'Mercury-196'),
    nuclide(80, 118, 'stable', 'Stable', null, 10.04, 'Mercury-198'),
    nuclide(80, 119, 'stable', 'Stable', null, 16.94, 'Mercury-199'),
    nuclide(80, 120, 'stable', 'Stable', null, 23.14, 'Mercury-200'),
    nuclide(80, 121, 'stable', 'Stable', null, 13.17, 'Mercury-201'),
    nuclide(80, 122, 'stable', 'Stable', null, 29.74, 'Mercury-202'),
    nuclide(80, 123, 'beta-', '46.6 d', 46.6 * DAY, null),
    nuclide(80, 124, 'stable', 'Stable', null, 6.82, 'Mercury-204'),
    
    // Thallium (Z=81)
    nuclide(81, 122, 'stable', 'Stable', null, 29.52, 'Thallium-203'),
    nuclide(81, 123, 'beta-', '3.78 y', 3.78 * YEAR, null),
    nuclide(81, 124, 'stable', 'Stable', null, 70.48, 'Thallium-205'),
    nuclide(81, 127, 'beta-', '4.77 min', 4.77 * MINUTE, null),
    
    // Lead (Z=82) - magic number element
    nuclide(82, 122, 'stable', 'Stable', null, 1.40, 'Lead-204'),
    nuclide(82, 124, 'stable', 'Stable', null, 24.10, 'Lead-206'),
    nuclide(82, 125, 'stable', 'Stable', null, 22.10, 'Lead-207'),
    nuclide(82, 126, 'stable', 'Stable', null, 52.40, 'Lead-208 - doubly magic'),
    nuclide(82, 127, 'beta-', '3.25 h', 3.25 * HOUR, null),
    nuclide(82, 128, 'beta-', '22.2 y', 22.2 * YEAR, null, 'Pb-210'),
    nuclide(82, 129, 'beta-', '36.1 min', 36.1 * MINUTE, null),
    nuclide(82, 130, 'beta-', '10.6 h', 10.6 * HOUR, null),
    nuclide(82, 132, 'beta-', '26.9 min', 26.9 * MINUTE, null),
    
    // Bismuth (Z=83)
    nuclide(83, 126, 'alpha', '2.0e19 y', 2.0e19 * YEAR, 100, 'Bi-209 - longest half-life measured'),
    nuclide(83, 127, 'beta-', '5.01 d', 5.01 * DAY, null),
    nuclide(83, 128, 'alpha', '60.6 min', 60.6 * MINUTE, null),
    nuclide(83, 130, 'beta-', '19.9 min', 19.9 * MINUTE, null),
    nuclide(83, 131, 'alpha', '45.6 min', 45.6 * MINUTE, null),
    
    // Polonium (Z=84) - all radioactive
    nuclide(84, 124, 'alpha', '102 y', 102 * YEAR, null),
    nuclide(84, 125, 'alpha', '138 d', 138 * DAY, null, 'Po-209'),
    nuclide(84, 126, 'alpha', '138 d', 138 * DAY, null, 'Po-210 - famously toxic'),
    nuclide(84, 128, 'alpha', '164 μs', 164e-6, null),
    nuclide(84, 130, 'alpha', '0.30 μs', 0.30e-6, null),
    nuclide(84, 132, 'alpha', '3.0 μs', 3.0e-6, null),
    
    // Astatine (Z=85) - all radioactive
    nuclide(85, 125, 'alpha', '8.1 h', 8.1 * HOUR, null, 'At-210'),
    nuclide(85, 126, 'ec', '7.21 h', 7.21 * HOUR, null, 'At-211 - potential radiotherapy'),
    nuclide(85, 130, 'alpha', '0.56 s', 0.56, null),
    nuclide(85, 132, 'alpha', '31.5 ms', 0.0315, null),
    
    // Radon (Z=86) - all radioactive
    nuclide(86, 125, 'ec', '2.4 h', 2.4 * HOUR, null),
    nuclide(86, 130, 'alpha', '14.6 ms', 0.0146, null),
    nuclide(86, 132, 'alpha', '55.6 s', 55.6, null),
    nuclide(86, 133, 'alpha', '24.4 min', 24.4 * MINUTE, null),
    nuclide(86, 134, 'alpha', '45 min', 45 * MINUTE, null),
    nuclide(86, 135, 'alpha', '3.82 d', 3.82 * DAY, null, 'Rn-222 - indoor air hazard'),
    
    // Francium (Z=87) - all radioactive
    nuclide(87, 134, 'alpha', '4.35 min', 4.35 * MINUTE, null),
    nuclide(87, 136, 'beta-', '22.0 min', 22.0 * MINUTE, null, 'Fr-223'),
    
    // Radium (Z=88) - all radioactive
    nuclide(88, 135, 'alpha', '11.4 d', 11.4 * DAY, null),
    nuclide(88, 136, 'alpha', '3.66 d', 3.66 * DAY, null),
    nuclide(88, 138, 'alpha', '1600 y', 1600 * YEAR, null, 'Ra-226 - Marie Curie'),
    nuclide(88, 140, 'beta-', '5.75 y', 5.75 * YEAR, null),
    
    // Actinium (Z=89) - all radioactive
    nuclide(89, 136, 'alpha', '10.0 d', 10.0 * DAY, null),
    nuclide(89, 138, 'beta-', '21.8 y', 21.8 * YEAR, null, 'Ac-227'),
    nuclide(89, 139, 'alpha', '6.15 h', 6.15 * HOUR, null),
    
    // Thorium (Z=90)
    nuclide(90, 138, 'alpha', '18.7 d', 18.7 * DAY, null),
    nuclide(90, 139, 'alpha', '1.91 y', 1.91 * YEAR, null),
    nuclide(90, 140, 'alpha', '7,340 y', 7340 * YEAR, null, 'Th-230'),
    nuclide(90, 141, 'beta-', '25.5 h', 25.5 * HOUR, null),
    nuclide(90, 142, 'alpha', '1.4e10 y', 1.4e10 * YEAR, 100, 'Th-232 - primordial'),
    nuclide(90, 144, 'beta-', '24.1 d', 24.1 * DAY, null),
    
    // Protactinium (Z=91)
    nuclide(91, 140, 'alpha', '3.28e4 y', 3.28e4 * YEAR, null, 'Pa-231'),
    nuclide(91, 141, 'beta-', '1.31 d', 1.31 * DAY, null),
    nuclide(91, 142, 'beta-', '27.0 d', 27.0 * DAY, null, 'Pa-233'),
    
    // Uranium (Z=92)
    nuclide(92, 140, 'alpha', '68.9 y', 68.9 * YEAR, null),
    nuclide(92, 141, 'alpha', '1.59e5 y', 1.59e5 * YEAR, null, 'U-233 - fissile'),
    nuclide(92, 142, 'alpha', '2.45e5 y', 2.45e5 * YEAR, null, 'U-234'),
    nuclide(92, 143, 'alpha', '7.0e8 y', 7.0e8 * YEAR, 0.72, 'U-235 - fissile, natural'),
    nuclide(92, 144, 'alpha', '2.34e7 y', 2.34e7 * YEAR, null, 'U-236'),
    nuclide(92, 146, 'alpha', '4.47e9 y', 4.47e9 * YEAR, 99.27, 'U-238 - primordial'),
    nuclide(92, 147, 'beta-', '23.5 min', 23.5 * MINUTE, null),
    
    // Neptunium (Z=93)
    nuclide(93, 143, 'ec', '396 d', 396 * DAY, null),
    nuclide(93, 144, 'alpha', '2.14e6 y', 2.14e6 * YEAR, null, 'Np-237'),
    nuclide(93, 145, 'beta-', '2.12 d', 2.12 * DAY, null),
    nuclide(93, 146, 'beta-', '2.35 d', 2.35 * DAY, null, 'Np-239'),
    
    // Plutonium (Z=94)
    nuclide(94, 142, 'ec', '2.87 y', 2.87 * YEAR, null),
    nuclide(94, 143, 'alpha', '87.7 y', 87.7 * YEAR, null),
    nuclide(94, 144, 'alpha', '8.00e7 y', 8.00e7 * YEAR, null, 'Pu-238 - RTG power'),
    nuclide(94, 145, 'alpha', '2.41e4 y', 2.41e4 * YEAR, null, 'Pu-239 - fissile'),
    nuclide(94, 146, 'alpha', '6,560 y', 6560 * YEAR, null, 'Pu-240'),
    nuclide(94, 147, 'beta-', '14.3 y', 14.3 * YEAR, null, 'Pu-241 - fissile'),
    nuclide(94, 148, 'alpha', '3.75e5 y', 3.75e5 * YEAR, null),
    nuclide(94, 150, 'alpha', '8.00e7 y', 8.00e7 * YEAR, null),
    
    // Americium (Z=95)
    nuclide(95, 146, 'alpha', '432 y', 432 * YEAR, null, 'Am-241 - smoke detectors'),
    nuclide(95, 147, 'alpha', '141 y', 141 * YEAR, null),
    nuclide(95, 148, 'alpha', '7,370 y', 7370 * YEAR, null, 'Am-243'),
    
    // Curium (Z=96)
    nuclide(96, 146, 'alpha', '340 d', 340 * DAY, null),
    nuclide(96, 147, 'alpha', '18.1 y', 18.1 * YEAR, null),
    nuclide(96, 148, 'alpha', '162 d', 162 * DAY, null, 'Cm-244'),
    nuclide(96, 149, 'alpha', '8,500 y', 8500 * YEAR, null),
    nuclide(96, 150, 'alpha', '4,730 y', 4730 * YEAR, null),
    nuclide(96, 151, 'alpha', '15.6 My', 15.6 * MYEAR, null, 'Cm-247'),
    nuclide(96, 152, 'alpha', '3.4e5 y', 3.4e5 * YEAR, null),
    
    // Berkelium (Z=97)
    nuclide(97, 150, 'alpha', '330 d', 330 * DAY, null),
    nuclide(97, 152, 'ec', '320 d', 320 * DAY, null, 'Bk-249'),
    
    // Californium (Z=98)
    nuclide(98, 151, 'alpha', '351 y', 351 * YEAR, null, 'Cf-249'),
    nuclide(98, 152, 'alpha', '13.1 y', 13.1 * YEAR, null, 'Cf-250'),
    nuclide(98, 153, 'alpha', '898 y', 898 * YEAR, null),
    nuclide(98, 154, 'alpha', '2.65 y', 2.65 * YEAR, null, 'Cf-252 - neutron source'),
    nuclide(98, 156, 'sf', '60 d', 60 * DAY, null),
    
    // Einsteinium (Z=99)
    nuclide(99, 153, 'alpha', '472 d', 472 * DAY, null),
    nuclide(99, 154, 'alpha', '276 d', 276 * DAY, null),
    nuclide(99, 155, 'alpha', '20.5 d', 20.5 * DAY, null, 'Es-254'),
    nuclide(99, 156, 'beta-', '39.8 d', 39.8 * DAY, null),
    
    // Fermium (Z=100)
    nuclide(100, 155, 'alpha', '100.5 d', 100.5 * DAY, null, 'Fm-255'),
    nuclide(100, 156, 'sf', '2.63 h', 2.63 * HOUR, null),
    nuclide(100, 157, 'alpha', '100.5 d', 100.5 * DAY, null, 'Fm-257'),
    
    // Mendelevium (Z=101)
    nuclide(101, 156, 'ec', '51.5 d', 51.5 * DAY, null),
    nuclide(101, 157, 'alpha', '78.1 min', 78.1 * MINUTE, null, 'Md-258'),
    
    // Nobelium (Z=102)
    nuclide(102, 157, 'alpha', '58 min', 58 * MINUTE, null, 'No-259'),
    
    // Lawrencium (Z=103)
    nuclide(103, 157, 'alpha', '4.0 h', 4.0 * HOUR, null),
    nuclide(103, 159, 'alpha', '11.0 h', 11.0 * HOUR, null, 'Lr-262'),
    
    // Rutherfordium (Z=104)
    nuclide(104, 157, 'alpha', '78 s', 78, null),
    nuclide(104, 163, 'alpha', '1.3 h', 1.3 * HOUR, null, 'Rf-267'),
    
    // Dubnium (Z=105)
    nuclide(105, 163, 'alpha', '28 h', 28 * HOUR, null, 'Db-268'),
    
    // Seaborgium (Z=106)
    nuclide(106, 163, 'alpha', '2.4 min', 2.4 * MINUTE, null, 'Sg-269'),
    
    // Bohrium (Z=107)
    nuclide(107, 163, 'alpha', '17 s', 17, null, 'Bh-270'),
    
    // Hassium (Z=108)
    nuclide(108, 161, 'alpha', '9.7 s', 9.7, null, 'Hs-269'),
    
    // Meitnerium (Z=109)
    nuclide(109, 169, 'alpha', '0.72 s', 0.72, null, 'Mt-278'),
    
    // Darmstadtium (Z=110)
    nuclide(110, 171, 'alpha', '11 s', 11, null, 'Ds-281'),
    
    // Roentgenium (Z=111)
    nuclide(111, 171, 'alpha', '26 s', 26, null, 'Rg-282'),
    
    // Copernicium (Z=112)
    nuclide(112, 173, 'alpha', '28 s', 28, null, 'Cn-285'),
    
    // Nihonium (Z=113)
    nuclide(113, 173, 'alpha', '2.0 s', 2.0, null, 'Nh-286'),
    
    // Flerovium (Z=114)
    nuclide(114, 175, 'alpha', '1.9 s', 1.9, null, 'Fl-289'),
    
    // Moscovium (Z=115)
    nuclide(115, 175, 'alpha', '0.65 s', 0.65, null, 'Mc-290'),
    
    // Livermorium (Z=116)
    nuclide(116, 177, 'alpha', '57 ms', 0.057, null, 'Lv-293'),
    
    // Tennessine (Z=117)
    nuclide(117, 177, 'alpha', '22 ms', 0.022, null, 'Ts-294'),
    
    // Oganesson (Z=118)
    nuclide(118, 176, 'alpha', '0.69 ms', 0.00069, null, 'Og-294'),
  ];
  
  // Utility functions
  export function getNuclide(z: number, n: number): Nuclide | undefined {
    return NUCLIDES.find(nuc => nuc.z === z && nuc.n === n);
  }
  
  export function getNuclidesForElement(z: number): Nuclide[] {
    return NUCLIDES.filter(nuc => nuc.z === z);
  }
  
  export function getStableNuclides(): Nuclide[] {
    return NUCLIDES.filter(nuc => nuc.isStable);
  }
  
  export function getNuclidesByDecay(decay: DecayMode): Nuclide[] {
    return NUCLIDES.filter(nuc => nuc.decay === decay);
  }
  
  // Chart bounds
  export const CHART_BOUNDS = {
    minZ: 0,
    maxZ: 118,
    minN: 0,
    maxN: 180,
  };