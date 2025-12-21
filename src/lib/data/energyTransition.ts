// Energy Transition Data - demand projections and EV materials

export interface DemandProjection {
  materialId: string;
  name: string;
  current: number;
  unit: string;
  multiplier: number;
  targetYear: number;
}

export const DEMAND_PROJECTIONS: DemandProjection[] = [
  { materialId: 'lithium', name: 'Lithium', current: 82, unit: 'kt/year', multiplier: 42, targetYear: 2040 },
  { materialId: 'graphite', name: 'Graphite', current: 1100, unit: 'kt/year', multiplier: 25, targetYear: 2040 },
  { materialId: 'cobalt', name: 'Cobalt', current: 140, unit: 'kt/year', multiplier: 21, targetYear: 2040 },
  { materialId: 'nickel', name: 'Nickel', current: 2500, unit: 'kt/year', multiplier: 19, targetYear: 2040 },
  { materialId: 'rare-earths', name: 'Rare Earths', current: 240, unit: 'kt/year', multiplier: 7, targetYear: 2040 },
  { materialId: 'copper', name: 'Copper', current: 25000, unit: 'kt/year', multiplier: 3, targetYear: 2040 },
];

export interface EVMaterial {
  materialId: string;
  name: string;
  amount: string;
  component: string;
}

export const EV_MATERIALS: EVMaterial[] = [
  { materialId: 'lithium', name: 'Lithium', amount: '8-12 kg', component: 'Battery' },
  { materialId: 'cobalt', name: 'Cobalt', amount: '14 kg', component: 'Battery cathode' },
  { materialId: 'nickel', name: 'Nickel', amount: '40 kg', component: 'Battery cathode' },
  { materialId: 'graphite', name: 'Graphite', amount: '50 kg', component: 'Battery anode' },
  { materialId: 'copper', name: 'Copper', amount: '80 kg', component: 'Motor & wiring' },
  { materialId: 'rare-earths', name: 'Rare Earths', amount: '2 kg', component: 'Motor magnets' },
];

export const EV_TOTAL_MINERALS = '~200 kg';

export interface WindTurbineMaterial {
  materialId: string;
  name: string;
  amount: string;
  component: string;
}

export const WIND_TURBINE_MATERIALS: WindTurbineMaterial[] = [
  { materialId: 'rare-earths', name: 'Rare Earths', amount: '335 kg', component: 'Generator magnets' },
  { materialId: 'neodymium', name: 'Neodymium', amount: '600 kg', component: 'Permanent magnets' },
  { materialId: 'copper', name: 'Copper', amount: '2,000 kg', component: 'Wiring' },
  { materialId: 'iron', name: 'Iron/Steel', amount: '~150 tonnes', component: 'Tower & nacelle' },
];

export const ENERGY_TRANSITION_FACTS = [
  'An EV uses 4x more copper than a combustion vehicle',
  'A 3MW wind turbine contains 335kg of rare earth magnets',
  'Solar panels require silver for electrical contacts',
  'Battery storage is limited by lithium, cobalt, and nickel supplies',
  'The energy transition could require more mining than all of human history',
];
