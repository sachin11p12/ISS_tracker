'use client';

import React from 'react';
import { Gauge, Navigation, Compass, Sun, Moon, Radio, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardValue } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Loading';
import { useISSLocation } from '@/hooks/useISSLocation';
import { useISSStore } from '@/store/issStore';
import {
  formatLatitude,
  formatLongitude,
  formatSpeed,
  formatAltitude,
  formatFootprint,
} from '@/lib/utils';

export function ISSStats() {
  const { telemetry, isLoading } = useISSLocation();
  const { unitSystem } = useISSStore();

  if (isLoading && !telemetry) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!telemetry) {
    return null;
  }

  const isDaylight = telemetry.visibility === 'daylight';
  const machNumber = (telemetry.velocity / 1234.8).toFixed(1);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Velocity / Speed */}
      <Card glow className="group hover:border-cyan-400">
        <CardHeader>
          <CardTitle>
            <Gauge className="h-4 w-4 text-cyan-600" />
            Orbital Velocity
          </CardTitle>
          <Badge variant="cyan" size="sm">
            Mach {machNumber}
          </Badge>
        </CardHeader>
        <CardValue>{formatSpeed(telemetry.velocity, unitSystem)}</CardValue>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Relative to Earth</span>
          <span className="text-cyan-700 font-semibold flex items-center">
            ~7.66 km/s <ArrowUpRight className="h-3 w-3 inline ml-0.5" />
          </span>
        </div>
      </Card>

      {/* Altitude */}
      <Card glow className="group hover:border-blue-400">
        <CardHeader>
          <CardTitle>
            <Navigation className="h-4 w-4 text-blue-600" />
            Altitude (LEO)
          </CardTitle>
          <Badge variant="purple" size="sm">
            Thermosphere
          </Badge>
        </CardHeader>
        <CardValue>{formatAltitude(telemetry.altitude, unitSystem)}</CardValue>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Low Earth Orbit</span>
          <span className="text-blue-600 font-semibold">Stable Orbit</span>
        </div>
      </Card>

      {/* Coordinates */}
      <Card glow className="group hover:border-emerald-400">
        <CardHeader>
          <CardTitle>
            <Compass className="h-4 w-4 text-emerald-600" />
            Coordinates
          </CardTitle>
          <Badge variant="emerald" size="sm">
            Sub-Satellite Point
          </Badge>
        </CardHeader>
        <div className="space-y-1">
          <div className="text-lg font-bold font-mono text-emerald-700">
            {formatLatitude(telemetry.latitude)}
          </div>
          <div className="text-lg font-bold font-mono text-emerald-600">
            {formatLongitude(telemetry.longitude)}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Inclination</span>
          <span className="text-emerald-700 font-semibold">51.64°</span>
        </div>
      </Card>

      {/* Solar Illumination & Footprint */}
      <Card glow className="group hover:border-amber-400">
        <CardHeader>
          <CardTitle>
            {isDaylight ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
            Orbital Visibility
          </CardTitle>
          <Badge variant={isDaylight ? 'amber' : 'purple'} size="sm" dot>
            {isDaylight ? 'Daylight' : 'In Earth Shadow'}
          </Badge>
        </CardHeader>
        <CardValue className="text-xl">
          {isDaylight ? 'Solar Power Active' : 'Battery Storage'}
        </CardValue>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Radio className="h-3 w-3 text-amber-500" />
            Footprint:
          </span>
          <span className="text-amber-700 font-semibold">
            {formatFootprint(telemetry.footprint, unitSystem)}
          </span>
        </div>
      </Card>
    </div>
  );
}
