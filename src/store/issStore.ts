import { create } from 'zustand';
import { ISSTelemetry, ISSTrailPoint, GeocodedLocation, UnitSystem, MapLayerType } from '@/types/iss';
import { APP_CONFIG } from '@/constants/config';

interface ISSStoreState {
  // Telemetry state
  telemetry: ISSTelemetry | null;
  locationDetails: GeocodedLocation | null;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  isLive: boolean;
  refreshCount: number;

  // Orbit Trail
  trail: ISSTrailPoint[];

  // User UI Preferences
  unitSystem: UnitSystem;
  mapLayer: MapLayerType;
  isAutoCenter: boolean;
  showFootprint: boolean;
  showOrbitTrail: boolean;
  pollingInterval: number;

  // Actions
  setTelemetryData: (payload: { telemetry: ISSTelemetry; locationDetails?: GeocodedLocation; lastUpdated: string }) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  toggleLive: () => void;
  setUnitSystem: (units: UnitSystem) => void;
  setMapLayer: (layer: MapLayerType) => void;
  setIsAutoCenter: (center: boolean) => void;
  setShowFootprint: (show: boolean) => void;
  setShowOrbitTrail: (show: boolean) => void;
  setPollingInterval: (interval: number) => void;
  clearTrail: () => void;
}

export const useISSStore = create<ISSStoreState>((set) => ({
  telemetry: null,
  locationDetails: null,
  lastUpdated: null,
  isLoading: true,
  error: null,
  isLive: true,
  refreshCount: 0,
  trail: [],

  unitSystem: 'metric',
  mapLayer: 'dark',
  isAutoCenter: true,
  showFootprint: true,
  showOrbitTrail: true,
  pollingInterval: APP_CONFIG.POLLING_INTERVAL_MS,

  setTelemetryData: ({ telemetry, locationDetails, lastUpdated }) =>
    set((state) => {
      const newPoint: ISSTrailPoint = {
        lat: telemetry.latitude,
        lng: telemetry.longitude,
        timestamp: telemetry.timestamp,
        altitude: telemetry.altitude,
        velocity: telemetry.velocity,
      };

      // Keep recent trail points within configured limit
      const updatedTrail = [...state.trail, newPoint].slice(-APP_CONFIG.MAX_TRAIL_POINTS);

      return {
        telemetry,
        locationDetails: locationDetails || state.locationDetails,
        lastUpdated,
        isLoading: false,
        error: null,
        trail: updatedTrail,
        refreshCount: state.refreshCount + 1,
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  toggleLive: () => set((state) => ({ isLive: !state.isLive })),
  setUnitSystem: (unitSystem) => set({ unitSystem }),
  setMapLayer: (mapLayer) => set({ mapLayer }),
  setIsAutoCenter: (isAutoCenter) => set({ isAutoCenter }),
  setShowFootprint: (showFootprint) => set({ showFootprint }),
  setShowOrbitTrail: (showOrbitTrail) => set({ showOrbitTrail }),
  setPollingInterval: (pollingInterval) => set({ pollingInterval }),
  clearTrail: () => set({ trail: [] }),
}));
