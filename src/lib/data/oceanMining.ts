// Ocean Mining Data - Clarion-Clipperton Zone and polymetallic nodules

export interface OceanZone {
  id: string;
  name: string;
  area: string;
  depth: string;
  resources: string[];
  description: string;
  coordinates: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export const CLARION_CLIPPERTON: OceanZone = {
  id: 'clarion-clipperton',
  name: 'Clarion-Clipperton Zone',
  area: '4.5 million km²',
  depth: '4,000-6,000m',
  resources: ['manganese', 'nickel', 'cobalt', 'copper'],
  description:
    'A region of the Pacific Ocean floor the size of the continental United States, covered in polymetallic nodules rich in critical minerals.',
  coordinates: {
    north: 20,
    south: 5,
    east: -115,
    west: -160,
  },
};

export interface NoduleElement {
  element: string;
  percent: number;
  materialId?: string;
}

export const NODULE_COMPOSITION: NoduleElement[] = [
  { element: 'Manganese', percent: 27, materialId: 'manganese' },
  { element: 'Iron', percent: 6, materialId: 'iron' },
  { element: 'Nickel', percent: 1.3, materialId: 'nickel' },
  { element: 'Copper', percent: 1.1, materialId: 'copper' },
  { element: 'Cobalt', percent: 0.2, materialId: 'cobalt' },
];

export const OCEAN_MINING_CONTROVERSY = {
  pro: 'Critical minerals needed for energy transition with less land disturbance than terrestrial mining.',
  con: 'Deep-sea ecosystems are poorly understood. Mining could destroy habitats that took millennia to develop.',
  quote:
    'We face a choice between damaging land ecosystems or damaging ocean ecosystems we barely understand.',
};

export interface OceanMiningCompany {
  name: string;
  country: string;
  status: 'exploring' | 'testing' | 'licensed';
  sponsoringState?: string;
}

export const OCEAN_MINING_COMPANIES: OceanMiningCompany[] = [
  { name: 'The Metals Company', country: 'Canada', status: 'testing', sponsoringState: 'Nauru' },
  { name: 'UK Seabed Resources', country: 'UK', status: 'exploring', sponsoringState: 'UK' },
  { name: 'Global Sea Mineral Resources', country: 'Belgium', status: 'exploring', sponsoringState: 'Belgium' },
  { name: 'China Minmetals', country: 'China', status: 'exploring', sponsoringState: 'China' },
];

export const OCEAN_MINING_TIMELINE = [
  { year: 1970, event: 'First polymetallic nodule discoveries documented' },
  { year: 1982, event: 'UN Convention on the Law of the Sea establishes deep seabed as "common heritage of mankind"' },
  { year: 1994, event: 'International Seabed Authority (ISA) established' },
  { year: 2021, event: 'Nauru triggers "two-year rule" demanding mining regulations' },
  { year: 2023, event: 'ISA fails to agree on mining code, applications possible anyway' },
  { year: 2024, event: 'First commercial mining license applications expected' },
];
