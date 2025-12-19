import { ApolloMission } from './types';

export const apolloMissions: ApolloMission[] = [
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    number: 11,
    landingSite: 'Sea of Tranquility',
    coordinates: [0.6744, 23.4731], // lat, lng
    date: '1969-07-20',
    crew: {
      commander: 'Neil Armstrong',
      lmpilot: 'Buzz Aldrin',
      cmpilot: 'Michael Collins',
    },
    duration: {
      surface: '21 hours 36 minutes',
      eva: '2 hours 31 minutes',
    },
    samples: 21.5,
    highlights: [
      'First human Moon landing',
      'First moonwalk',
      '"That\'s one small step for man..."',
      'Deployed seismometer and laser reflector',
    ],
  },
  {
    id: 'apollo-12',
    name: 'Apollo 12',
    number: 12,
    landingSite: 'Ocean of Storms',
    coordinates: [-3.0128, -23.4219],
    date: '1969-11-19',
    crew: {
      commander: 'Pete Conrad',
      lmpilot: 'Alan Bean',
      cmpilot: 'Richard Gordon',
    },
    duration: {
      surface: '31 hours 31 minutes',
      eva: '7 hours 45 minutes',
    },
    samples: 34.3,
    highlights: [
      'Precision landing near Surveyor 3',
      'Retrieved parts from Surveyor 3',
      'Two moonwalks',
      'Deployed ALSEP experiments',
    ],
  },
  {
    id: 'apollo-14',
    name: 'Apollo 14',
    number: 14,
    landingSite: 'Fra Mauro',
    coordinates: [-3.6453, -17.4714],
    date: '1971-02-05',
    crew: {
      commander: 'Alan Shepard',
      lmpilot: 'Edgar Mitchell',
      cmpilot: 'Stuart Roosa',
    },
    duration: {
      surface: '33 hours 31 minutes',
      eva: '9 hours 23 minutes',
    },
    samples: 42.3,
    highlights: [
      'First American in space returns to Moon',
      'Shepard hit golf balls on the Moon',
      'Used MET (Modular Equipment Transporter)',
      'Explored Cone Crater rim',
    ],
  },
  {
    id: 'apollo-15',
    name: 'Apollo 15',
    number: 15,
    landingSite: 'Hadley-Apennine',
    coordinates: [26.1322, 3.6339],
    date: '1971-07-30',
    crew: {
      commander: 'David Scott',
      lmpilot: 'James Irwin',
      cmpilot: 'Alfred Worden',
    },
    duration: {
      surface: '66 hours 55 minutes',
      eva: '18 hours 35 minutes',
    },
    samples: 77.3,
    roverDistance: 27.8,
    highlights: [
      'First use of Lunar Roving Vehicle',
      'Explored Hadley Rille',
      'Found the "Genesis Rock" (sample 15415)',
      'First deep space EVA (Worden)',
      'Galileo hammer-feather drop demonstration',
    ],
  },
  {
    id: 'apollo-16',
    name: 'Apollo 16',
    number: 16,
    landingSite: 'Descartes Highlands',
    coordinates: [-8.9734, 15.5011],
    date: '1972-04-21',
    crew: {
      commander: 'John Young',
      lmpilot: 'Charles Duke',
      cmpilot: 'Ken Mattingly',
    },
    duration: {
      surface: '71 hours 2 minutes',
      eva: '20 hours 14 minutes',
    },
    samples: 95.7,
    roverDistance: 26.7,
    highlights: [
      'Only highlands landing site',
      'Speed record: 18 km/h in rover',
      'Three moonwalks',
      'Deployed UV camera/spectrograph',
    ],
  },
  {
    id: 'apollo-17',
    name: 'Apollo 17',
    number: 17,
    landingSite: 'Taurus-Littrow',
    coordinates: [20.1908, 30.7717],
    date: '1972-12-11',
    crew: {
      commander: 'Eugene Cernan',
      lmpilot: 'Harrison Schmitt',
      cmpilot: 'Ronald Evans',
    },
    duration: {
      surface: '74 hours 59 minutes',
      eva: '22 hours 4 minutes',
    },
    samples: 110.5,
    roverDistance: 35.7,
    highlights: [
      'Last crewed Moon mission',
      'Only geologist on the Moon (Schmitt)',
      'Discovered orange soil (volcanic glass)',
      'Longest rover traverse',
      'Most samples collected',
    ],
  },
];

// Get mission by ID
export function getMissionById(id: string): ApolloMission | undefined {
  return apolloMissions.find(m => m.id === id);
}

// Get all landing site coordinates for markers
export function getLandingSiteCoordinates(): Array<{
  id: string;
  name: string;
  coordinates: [number, number];
}> {
  return apolloMissions.map(m => ({
    id: m.id,
    name: m.name,
    coordinates: m.coordinates,
  }));
}
