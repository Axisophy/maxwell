// src/lib/dashboard/widget-components.ts
// Maps component names (from registry) to actual React components

import SolarDisk from '@/components/widgets/SolarDisk'
import HimawariLive from '@/components/widgets/HimawariLive'
import SpaceWeather from '@/components/widgets/SpaceWeather'
import AirQuality from '@/components/widgets/AirQuality'
import APOD from '@/components/widgets/APOD'
import AuroraForecast from '@/components/widgets/AuroraForecast'
import CO2Now from '@/components/widgets/CO2Now'
import DSCOVREpic from '@/components/widgets/DSCOVREpic'
import EarthquakesLive from '@/components/widgets/EarthquakesLive'
import ISSTracker from '@/components/widgets/ISSTracker'
import LaunchCountdown from '@/components/widgets/LaunchCountdown'
import LightTravel from '@/components/widgets/LightTravel'
import MoonPhase from '@/components/widgets/MoonPhase'
import NearEarthAsteroids from '@/components/widgets/NearEarthAsteroids'
import NuclearReactors from '@/components/widgets/NuclearReactors'
import UKEnergy from '@/components/widgets/UKEnergy'
import WorldPopulation from '@/components/widgets/WorldPopulation'
import TidesLive from '@/components/widgets/TidesLive'
import LightningLive from '@/components/widgets/LightningLive'
import SeismicPulse from '@/components/widgets/SeismicPulse'
import DeepSpaceNetwork from '@/components/widgets/DeepSpaceNetwork'
import LHCStatus from '@/components/widgets/LHCStatus'
import NeutrinoWatch from '@/components/widgets/NeutrinoWatch'
import SatellitesAbove from '@/components/widgets/SatellitesAbove'
import SolarCorona from '@/components/widgets/SolarCorona'
import CosmicRayMonitor from '@/components/widgets/CosmicRayMonitor'
import GravitationalWaves from '@/components/widgets/GravitationalWaves'
import ActiveFires from '@/components/widgets/ActiveFires'
import CosmicRaysThrough from '@/components/widgets/CosmicRaysThrough'
import EBirdLive from '@/components/widgets/eBirdLive'
import EuropeanRadiationMap from '@/components/widgets/EuropeanRadiationMap'
import GlacierWatch from '@/components/widgets/GlacierWatch'
import INaturalistLive from '@/components/widgets/iNaturalistLive'
import JWSTLatest from '@/components/widgets/JWSTLatest'
import MagneticField from '@/components/widgets/MagneticField'
import MarsRoverImages from '@/components/widgets/MarsRoverImages'
import OceanHydrophones from '@/components/widgets/OceanHydrophones'
import PollenForecast from '@/components/widgets/PollenForecast'
import SeismographGrid from '@/components/widgets/SeismographGrid'
import StarMap from '@/components/widgets/StarMap'
import WhatsBelowYou from '@/components/widgets/WhatsBelowYou'
import YourAirJourney from '@/components/widgets/YourAirJourney'
import YourBackgroundDose from '@/components/widgets/YourBackgroundDose'
import YourSkyWhenBorn from '@/components/widgets/YourSkyWhenBorn'

// Map component names (from registry) to actual components
// The key must match the 'component' field in WIDGET_REGISTRY
export const WIDGET_COMPONENTS: Record<string, React.ComponentType> = {
  'SolarDisk': SolarDisk,
  'HimawariLive': HimawariLive,
  'SpaceWeather': SpaceWeather,
  'AirQuality': AirQuality,
  'APOD': APOD,
  'AuroraForecast': AuroraForecast,
  'CO2Now': CO2Now,
  'DSCOVREpic': DSCOVREpic,
  'EarthquakesLive': EarthquakesLive,
  'ISSTracker': ISSTracker,
  'LaunchCountdown': LaunchCountdown,
  'LightTravel': LightTravel,
  'MoonPhase': MoonPhase,
  'NearEarthAsteroids': NearEarthAsteroids,
  'NuclearReactors': NuclearReactors,
  'UKEnergy': UKEnergy,
  'WorldPopulation': WorldPopulation,
  'TidesLive': TidesLive,
  'LightningLive': LightningLive,
  'SeismicPulse': SeismicPulse,
  'DeepSpaceNetwork': DeepSpaceNetwork,
  'LHCStatus': LHCStatus,
  'NeutrinoWatch': NeutrinoWatch,
  'SatellitesAbove': SatellitesAbove,
  'SolarCorona': SolarCorona,
  'CosmicRayMonitor': CosmicRayMonitor,
  'GravitationalWaves': GravitationalWaves,
  'ActiveFires': ActiveFires,
  'CosmicRaysThrough': CosmicRaysThrough,
  'EBirdLive': EBirdLive,
  'EuropeanRadiationMap': EuropeanRadiationMap,
  'GlacierWatch': GlacierWatch,
  'INaturalistLive': INaturalistLive,
  'JWSTLatest': JWSTLatest,
  'MagneticField': MagneticField,
  'MarsRoverImages': MarsRoverImages,
  'OceanHydrophones': OceanHydrophones,
  'PollenForecast': PollenForecast,
  'SeismographGrid': SeismographGrid,
  'StarMap': StarMap,
  'WhatsBelowYou': WhatsBelowYou,
  'YourAirJourney': YourAirJourney,
  'YourBackgroundDose': YourBackgroundDose,
  'YourSkyWhenBorn': YourSkyWhenBorn,
}

// Helper to check if a component exists
export function hasWidgetComponent(componentName: string): boolean {
  return componentName in WIDGET_COMPONENTS;
}

// Helper to get a component by name
export function getWidgetComponent(componentName: string): React.ComponentType | null {
  return WIDGET_COMPONENTS[componentName] || null;
}
