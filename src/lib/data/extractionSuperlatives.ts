// Superlative extraction sites - largest pits and deepest mines

export interface SuperlativeSite {
  id: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  category: 'largest-pit' | 'deepest' | 'oldest' | 'highest-altitude';
  material: string;
  materialId: string;
  stats: { label: string; value: string }[];
  fact?: string;
  imageUrl?: string;
}

export const LARGEST_PITS: SuperlativeSite[] = [
  {
    id: 'bingham-canyon',
    name: 'Bingham Canyon Mine',
    location: 'Utah',
    country: 'USA',
    lat: 40.523,
    lng: -112.151,
    category: 'largest-pit',
    material: 'Copper',
    materialId: 'copper',
    stats: [
      { label: 'Width', value: '4.5 km' },
      { label: 'Depth', value: '1.2 km' },
      { label: 'Since', value: '1906' },
    ],
    fact: 'Visible from space. Has produced more copper than any mine in history.',
  },
  {
    id: 'escondida',
    name: 'Escondida Mine',
    location: 'Atacama Desert',
    country: 'Chile',
    lat: -24.2667,
    lng: -69.0667,
    category: 'largest-pit',
    material: 'Copper',
    materialId: 'copper',
    stats: [
      { label: 'Production', value: '5.4 Mt/year' },
      { label: 'Since', value: '1990' },
    ],
    fact: "World's largest copper mine by production volume.",
  },
  {
    id: 'chuquicamata',
    name: 'Chuquicamata',
    location: 'Atacama',
    country: 'Chile',
    lat: -22.2833,
    lng: -68.9,
    category: 'largest-pit',
    material: 'Copper',
    materialId: 'copper',
    stats: [
      { label: 'Size', value: '4.3 × 3 km' },
      { label: 'Depth', value: '1 km' },
    ],
    fact: 'One of the largest open-pit mines ever excavated.',
  },
  {
    id: 'muruntau',
    name: 'Muruntau Gold Mine',
    location: 'Navoi Region',
    country: 'Uzbekistan',
    lat: 41.5167,
    lng: 64.5667,
    category: 'largest-pit',
    material: 'Gold',
    materialId: 'gold',
    stats: [
      { label: 'Size', value: '3.5 × 2.5 km' },
      { label: 'Depth', value: '600 m' },
    ],
    fact: 'Largest open-pit gold mine in the world.',
  },
];

export const DEEPEST_MINES: SuperlativeSite[] = [
  {
    id: 'mponeng',
    name: 'Mponeng Gold Mine',
    location: 'Gauteng',
    country: 'South Africa',
    lat: -26.4167,
    lng: 27.4167,
    category: 'deepest',
    material: 'Gold',
    materialId: 'gold',
    stats: [
      { label: 'Depth', value: '4.0 km' },
      { label: 'Rock temp', value: '66°C' },
    ],
    fact: 'Ice slurry is pumped down to cool the air to survivable temperatures.',
  },
  {
    id: 'tautona',
    name: 'TauTona Mine',
    location: 'Gauteng',
    country: 'South Africa',
    lat: -26.4,
    lng: 27.4333,
    category: 'deepest',
    material: 'Gold',
    materialId: 'gold',
    stats: [{ label: 'Depth', value: '3.9 km' }],
  },
  {
    id: 'savuka',
    name: 'Savuka Mine',
    location: 'Gauteng',
    country: 'South Africa',
    lat: -26.41,
    lng: 27.42,
    category: 'deepest',
    material: 'Gold',
    materialId: 'gold',
    stats: [{ label: 'Depth', value: '3.7 km' }],
  },
  {
    id: 'driefontein',
    name: 'Driefontein Mine',
    location: 'Gauteng',
    country: 'South Africa',
    lat: -26.405,
    lng: 27.415,
    category: 'deepest',
    material: 'Gold',
    materialId: 'gold',
    stats: [{ label: 'Depth', value: '3.4 km' }],
  },
  {
    id: 'kusasalethu',
    name: 'Kusasalethu Mine',
    location: 'Gauteng',
    country: 'South Africa',
    lat: -26.42,
    lng: 27.41,
    category: 'deepest',
    material: 'Gold',
    materialId: 'gold',
    stats: [{ label: 'Depth', value: '3.3 km' }],
  },
];

export function getSuperlativeSiteById(id: string): SuperlativeSite | undefined {
  return [...LARGEST_PITS, ...DEEPEST_MINES].find(s => s.id === id);
}
