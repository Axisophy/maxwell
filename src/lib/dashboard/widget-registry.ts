// src/lib/dashboard/widget-registry.ts
// Central configuration file defining all available widgets

export type WidgetCategory = 
  | 'solar-space'
  | 'earth-geology'
  | 'climate-environment'
  | 'life-ecology'
  | 'physics-particles'
  | 'astronomy'
  | 'personal'
  | 'infrastructure';

export interface WidgetDefinition {
  id: string;
  title: string;
  description: string;
  source: string;
  status: 'live' | 'ok' | 'error' | 'loading';
  categories: WidgetCategory[];
  component: string;
}

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
  'solar-disk': {
    id: 'solar-disk',
    title: 'Solar Disk',
    description: 'Real-time imagery of the Sun from NASA\'s Solar Dynamics Observatory. Switch between wavelengths to see different layers of the solar atmosphere.',
    source: 'NASA Solar Dynamics Observatory',
    status: 'live',
    categories: ['solar-space', 'astronomy'],
    component: 'SolarDisk'
  },
  'nuclear-reactors': {
    id: 'nuclear-reactors',
    title: 'Nuclear Reactors',
    description: 'Live nuclear power output from UK, France, and US. Global statistics show all 440 operating reactors worldwide and 62 under construction.',
    source: 'Carbon Intensity API (UK), RTE éCO2mix (France), NRC (US), IAEA PRIS (Global)',
    status: 'live',
    categories: ['infrastructure', 'climate-environment'],
    component: 'NuclearReactors'
  },
  'uk-energy': {
    id: 'uk-energy',
    title: 'UK Energy',
    description: 'Live carbon intensity and generation mix for Great Britain\'s electricity grid. Shows how clean the grid is right now and what\'s generating the power.',
    source: 'National Grid ESO via Carbon Intensity API',
    status: 'live',
    categories: ['climate-environment', 'infrastructure'],
    component: 'UKEnergy'
  },
  'tides': {
    id: 'tides',
    title: 'Tides',
    description: 'Tide predictions for coastal locations worldwide, calculated using simplified harmonic analysis. Shows high and low tide times, current water level, and a 24-hour tide curve.',
    source: 'Harmonic calculation from tidal constants. Approximate predictions only - not for navigation.',
    status: 'ok',
    categories: ['earth-geology', 'personal'],
    component: 'TidesLive'
  },
  'world-population': {
    id: 'world-population',
    title: 'World Population',
    description: 'Live estimate of Earth\'s human population, calculated from UN World Population Prospects 2024 data. The counter shows births and deaths happening in real time.',
    source: 'UN World Population Prospects 2024',
    status: 'ok',
    categories: ['infrastructure'],
    component: 'WorldPopulation'
  },
  'launch-countdown': {
    id: 'launch-countdown',
    title: 'Next Launch',
    description: 'Countdown to the next rocket launch worldwide. Shows mission details, launch provider, and location.',
    source: 'The Space Devs Launch Library',
    status: 'live',
    categories: ['solar-space', 'astronomy'],
    component: 'LaunchCountdown'
  },
  'light-travel': {
    id: 'light-travel',
    title: 'Light Travel',
    description: 'How far has light traveled since you opened this widget? A real-time counter showing the distance light covers at 299,792,458 metres per second.',
    source: 'Calculation based on the speed of light in vacuum',
    status: 'live',
    categories: ['physics-particles'],
    component: 'LightTravel'
  },
  'moon-phase': {
    id: 'moon-phase',
    title: 'Moon Phase',
    description: 'Current lunar phase with illumination percentage. The Moon completes a full cycle every 29.5 days.',
    source: 'Calculated using SunCalc library',
    status: 'ok',
    categories: ['astronomy'],
    component: 'MoonPhase'
  },
  'near-earth-asteroids': {
    id: 'near-earth-asteroids',
    title: 'Near-Earth Asteroids',
    description: 'Upcoming asteroid close approaches to Earth. Distance shown in lunar distances (LD).',
    source: 'NASA JPL Small-Body Database',
    status: 'live',
    categories: ['astronomy', 'solar-space'],
    component: 'NearEarthAsteroids'
  },
  'pacific-disc': {
    id: 'pacific-disc',
    title: 'Pacific Disc',
    description: 'Full-disc Earth imagery from the Himawari-9 satellite, showing the Pacific Ocean and Asia-Pacific region. Updated every 10 minutes.',
    source: 'NICT Japan / Himawari-9',
    status: 'live',
    categories: ['earth-geology', 'climate-environment'],
    component: 'PacificDisc'
  },
  'space-weather': {
    id: 'space-weather',
    title: 'Space Weather',
    description: 'Current space weather conditions including geomagnetic activity (Kp index), solar wind speed, and X-ray flux levels.',
    source: 'NOAA Space Weather Prediction Center',
    status: 'live',
    categories: ['solar-space'],
    component: 'SpaceWeather'
  },
  'iss-tracker': {
    id: 'iss-tracker',
    title: 'ISS Tracker',
    description: 'Real-time position of the International Space Station, orbiting at approximately 420 km altitude and 27,600 km/h.',
    source: 'Where The ISS At / Open Notify',
    status: 'live',
    categories: ['solar-space', 'astronomy'],
    component: 'ISSTracker'
  },
  'earthquakes': {
    id: 'earthquakes',
    title: 'Earthquakes',
    description: 'Real-time seismic activity showing earthquakes magnitude 4.5 and above. Colour indicates severity.',
    source: 'USGS Earthquake Hazards Program',
    status: 'live',
    categories: ['earth-geology'],
    component: 'EarthquakesLive'
  },
  'lightning': {
    id: 'lightning',
    title: 'Lightning Live',
    description: 'Real-time lightning activity across the Americas. Yellow dots show recent strikes, with brightness indicating intensity.',
    source: 'GOES-R GLM Lightning Data',
    status: 'live',
    categories: ['climate-environment', 'earth-geology'],
    component: 'LightningLive'
  },
  'seismic-pulse': {
    id: 'seismic-pulse',
    title: 'Seismic Pulse',
    description: 'Live seismograph traces from monitoring stations worldwide. Green waveforms show ground motion in real time.',
    source: 'IRIS/FDSN Seismic Network',
    status: 'live',
    categories: ['earth-geology'],
    component: 'SeismicPulse'
  },
  'air-quality': {
    id: 'air-quality',
    title: 'Air Quality',
    description: 'Current air quality index based on your location. Shows PM2.5 levels and comparison to WHO guidelines.',
    source: 'OpenAQ',
    status: 'live',
    categories: ['climate-environment', 'personal'],
    component: 'AirQuality'
  },
  'aurora-forecast': {
    id: 'aurora-forecast',
    title: 'Aurora Forecast',
    description: 'Will you see aurora tonight? Based on geomagnetic activity forecasts and your latitude.',
    source: 'NOAA Space Weather Prediction Center',
    status: 'live',
    categories: ['solar-space', 'personal'],
    component: 'AuroraForecast'
  },
  'co2-now': {
    id: 'co2-now',
    title: 'CO₂ Now',
    description: 'Current atmospheric carbon dioxide concentration measured at Mauna Loa Observatory, Hawaii.',
    source: 'NOAA Global Monitoring Laboratory',
    status: 'ok',
    categories: ['climate-environment'],
    component: 'CO2Now'
  },
  'earth-from-l1': {
    id: 'earth-from-l1',
    title: 'Earth from L1',
    description: 'DSCOVR orbits the L1 Lagrange point, 1.5 million km from Earth, where it always sees the sunlit side of our planet.',
    source: 'NASA DSCOVR EPIC Camera',
    status: 'live',
    categories: ['earth-geology', 'astronomy'],
    component: 'EarthFromL1'
  },
  // deep-space-network deprecated - NASA removed public XML feed
  'lhc-status': {
    id: 'lhc-status',
    title: 'LHC Status',
    description: 'The Large Hadron Collider is a 27km ring beneath Geneva that accelerates protons to 99.9999991% the speed of light.',
    source: 'CERN',
    status: 'live',
    categories: ['physics-particles'],
    component: 'LHCStatus'
  },
  'neutrino-watch': {
    id: 'neutrino-watch',
    title: 'Neutrino Watch',
    description: 'IceCube is a cubic kilometer of Antarctic ice instrumented with 5,160 optical sensors detecting neutrinos.',
    source: 'IceCube Neutrino Observatory',
    status: 'live',
    categories: ['physics-particles'],
    component: 'NeutrinoWatch'
  },
  'satellites-above': {
    id: 'satellites-above',
    title: 'Satellites Above',
    description: 'Every tracked satellite currently overhead-GPS, Starlink, weather satellites, the ISS.',
    source: 'N2YO Satellite Database',
    status: 'live',
    categories: ['solar-space', 'personal'],
    component: 'SatellitesAbove'
  },
  'solar-corona': {
    id: 'solar-corona',
    title: 'Solar Corona',
    description: 'SOHO\'s coronagraph creates an artificial eclipse to reveal the sun\'s outer atmosphere.',
    source: 'SOHO/LASCO, ESA & NASA',
    status: 'live',
    categories: ['solar-space'],
    component: 'SolarCorona'
  },
  'cosmic-rays': {
    id: 'cosmic-rays',
    title: 'Cosmic Rays',
    description: 'Cosmic rays from supernovae constantly bombard Earth. Neutron monitors worldwide track this invisible shower.',
    source: 'Neutron Monitor Database (NMDB)',
    status: 'live',
    categories: ['physics-particles'],
    component: 'CosmicRayMonitor'
  },
  'gravitational-waves': {
    id: 'gravitational-waves',
    title: 'Gravitational Waves',
    description: 'LIGO\'s twin 4km laser interferometers detect spacetime ripples from colliding black holes.',
    source: 'LIGO Scientific Collaboration',
    status: 'live',
    categories: ['physics-particles', 'astronomy'],
    component: 'GravitationalWaves'
  },
  'active-fires': {
    id: 'active-fires',
    title: 'Active Fires',
    description: 'Real-time global wildfire monitoring from NASA\'s FIRMS. Thermal anomalies detected in the last 24 hours.',
    source: 'NASA FIRMS',
    status: 'live',
    categories: ['earth-geology', 'climate-environment'],
    component: 'ActiveFires'
  },
  'webb-telescope': {
    id: 'webb-telescope',
    title: 'Webb Telescope',
    description: 'The latest publicly released images from the James Webb Space Telescope.',
    source: 'Space Telescope Science Institute',
    status: 'live',
    categories: ['astronomy'],
    component: 'WebbTelescope'
  },
  'mars-rover': {
    id: 'mars-rover',
    title: 'Mars Rover',
    description: 'The latest photographs from NASA\'s Mars rovers-Curiosity and Perseverance.',
    source: 'NASA Mars Exploration Program',
    status: 'live',
    categories: ['astronomy', 'solar-space'],
    component: 'MarsRover'
  },
  'european-radiation': {
    id: 'european-radiation',
    title: 'European Radiation',
    description: 'Real-time gamma dose rates from over 5,500 monitoring stations across Europe.',
    source: 'EURDEP',
    status: 'live',
    categories: ['climate-environment'],
    component: 'EuropeanRadiationMap'
  },
  'glacier-watch': {
    id: 'glacier-watch',
    title: 'Glacier Watch',
    description: 'Global glacier monitoring-tracking mass balance changes as Earth\'s ice responds to climate.',
    source: 'WGMS',
    status: 'live',
    categories: ['climate-environment', 'earth-geology'],
    component: 'GlacierWatch'
  },
  'ebird-live': {
    id: 'ebird-live',
    title: 'eBird Live',
    description: 'Recent bird observations from the world\'s largest biodiversity citizen science project.',
    source: 'Cornell Lab of Ornithology',
    status: 'live',
    categories: ['life-ecology'],
    component: 'EBirdLive'
  },
  'inaturalist-live': {
    id: 'inaturalist-live',
    title: 'iNaturalist Live',
    description: 'Real-time nature observations from citizen scientists worldwide.',
    source: 'iNaturalist',
    status: 'live',
    categories: ['life-ecology'],
    component: 'INaturalistLive'
  },
  'ocean-hydrophones': {
    id: 'ocean-hydrophones',
    title: 'Ocean Hydrophones',
    description: 'Listen to the deep ocean-underwater microphones capturing whale songs, earthquakes, and ship traffic.',
    source: 'Ocean Networks Canada / MBARI',
    status: 'live',
    categories: ['earth-geology', 'life-ecology'],
    component: 'OceanHydrophones'
  },
  'seismograph-grid': {
    id: 'seismograph-grid',
    title: 'Seismograph Grid',
    description: 'Live seismic waveforms from monitoring stations worldwide. Watch the Earth breathe.',
    source: 'IRIS Seismic Network',
    status: 'live',
    categories: ['earth-geology'],
    component: 'SeismographGrid'
  },
  'magnetic-field': {
    id: 'magnetic-field',
    title: 'Magnetic Field',
    description: 'Earth\'s magnetic field protects us from solar wind. Visualise real-time geomagnetic data.',
    source: 'NOAA NCEI',
    status: 'live',
    categories: ['earth-geology', 'solar-space'],
    component: 'MagneticField'
  },
  'pollen-forecast': {
    id: 'pollen-forecast',
    title: 'Pollen Forecast',
    description: 'Current pollen levels at your location-tree, grass, and weed pollen counts.',
    source: 'Pollen API',
    status: 'live',
    categories: ['climate-environment', 'personal', 'life-ecology'],
    component: 'PollenForecast'
  },
  'star-map': {
    id: 'star-map',
    title: 'Star Map',
    description: 'The night sky above you right now-stars, planets, and constellations visible from your location.',
    source: 'Astronomical Calculation',
    status: 'ok',
    categories: ['astronomy', 'personal'],
    component: 'StarMap'
  },
  'air-journey': {
    id: 'air-journey',
    title: 'Air Journey',
    description: 'Where has the air you\'re breathing been? Back-trajectory analysis of air masses arriving at your location.',
    source: 'NOAA HYSPLIT Model',
    status: 'ok',
    categories: ['climate-environment', 'personal'],
    component: 'AirJourney'
  },
  'your-background-dose': {
    id: 'your-background-dose',
    title: 'Your Background Dose',
    description: 'Calculate your personal annual radiation exposure-from cosmic rays, radon, and medical scans.',
    source: 'Calculation based on UNSCEAR data',
    status: 'ok',
    categories: ['physics-particles', 'personal'],
    component: 'YourBackgroundDose'
  },
  'cosmic-rays-through': {
    id: 'cosmic-rays-through',
    title: 'Cosmic Rays Through You',
    description: 'Right now, cosmic ray muons are passing through your body. Calculate how many.',
    source: 'NMDB + Calculation',
    status: 'ok',
    categories: ['physics-particles', 'personal'],
    component: 'CosmicRaysThrough'
  },
  'volcano-watch': {
    id: 'volcano-watch',
    title: 'Volcano Watch',
    description: 'Currently erupting and active volcanoes worldwide. Alert levels from the Smithsonian Global Volcanism Program.',
    source: 'Smithsonian Global Volcanism Program',
    status: 'live',
    categories: ['earth-geology'],
    component: 'VolcanoWatch'
  },
  'meteor-watch': {
    id: 'meteor-watch',
    title: 'Meteor Watch',
    description: 'Active and upcoming meteor showers. See peak rates, moon conditions, and best viewing times.',
    source: 'International Meteor Organization',
    status: 'live',
    categories: ['astronomy', 'personal'],
    component: 'MeteorWatch'
  },
  'aircraft-above': {
    id: 'aircraft-above',
    title: 'Aircraft Above',
    description: 'Real-time aircraft currently flying overhead. See callsigns, altitudes, and estimated passengers.',
    source: 'OpenSky Network',
    status: 'live',
    categories: ['infrastructure', 'personal'],
    component: 'AircraftAbove'
  },
  'ships-live': {
    id: 'ships-live',
    title: 'Ships Live',
    description: 'Ships and vessels in your area via AIS tracking. Cargo ships, tankers, and passenger ferries.',
    source: 'AIS Data',
    status: 'live',
    categories: ['infrastructure', 'personal'],
    component: 'ShipsLive'
  }
};

// Helper to get all widget IDs
export const ALL_WIDGET_IDS = Object.keys(WIDGET_REGISTRY);

// Helper to get widgets by category
export function getWidgetsByCategory(category: WidgetCategory): string[] {
  return Object.entries(WIDGET_REGISTRY)
    .filter(([_, widget]) => widget.categories.includes(category))
    .map(([id]) => id);
}
