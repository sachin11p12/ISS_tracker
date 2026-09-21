'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useISSStore } from '@/store/issStore';
import { RadarLoader } from '@/components/ui/Loading';
import { Map as MapIcon, Globe as GlobeIcon, Compass, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ISSMap = dynamic(() => import('@/components/dashboard/ISSMap'), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-[380px] sm:h-[420px] md:h-[460px] w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 shadow-md">
      <RadarLoader message="Initializing Leaflet Earth Projection Engine..." />
    </div>
  ),
});

const ISSGlobe = dynamic(() => import('@/components/dashboard/ISSGlobe'), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-[380px] sm:h-[420px] md:h-[460px] w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 shadow-md">
      <RadarLoader message="Initializing 3D Orbital Globe Engine..." />
    </div>
  ),
});

export function ISSMapWrapper() {
  const { viewMode, setViewMode, isMapExpanded, toggleMapExpanded } = useISSStore();

  return (
    <div className="space-y-3">
      {/* Header bar with Section Title, Size Toggle & [ MAP | GLOBE ] View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-cyan-600" />
          <h2 className="text-lg font-bold text-slate-900 font-mono tracking-tight">
            Live Orbital Trajectory {viewMode === 'globe' ? '3D Globe' : 'Map'}
          </h2>
          <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping ml-1" />
        </div>

        {/* Right side: Size toggle + [ MAP | GLOBE ] toggle */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Height / Expand Size Toggle Button */}
          <button
            onClick={toggleMapExpanded}
            title={isMapExpanded ? 'Compress height to compact size' : 'Expand height to wide full size'}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-700 shadow-2xs hover:border-cyan-400 hover:text-cyan-700 transition-all cursor-pointer"
          >
            {isMapExpanded ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-cyan-600" />
                <span>Compact Size</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-cyan-600" />
                <span>Wide View</span>
              </>
            )}
          </button>

          {/* View Switcher Pill Toggle: [ MAP | GLOBE ] */}
          <div className="inline-flex items-center rounded-2xl bg-slate-900 p-1 border border-slate-800 shadow-md">
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer',
                viewMode === 'map'
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>MAP</span>
            </button>
            <button
              onClick={() => setViewMode('globe')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer',
                viewMode === 'globe'
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <GlobeIcon className="h-3.5 w-3.5" />
              <span>GLOBE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active View Display */}
      {viewMode === 'globe' ? <ISSGlobe /> : <ISSMap />}
    </div>
  );
}
