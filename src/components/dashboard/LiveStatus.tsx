'use client';

import React from 'react';
import { RefreshCw, Globe2, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useISSLocation } from '@/hooks/useISSLocation';
import { formatTimestampUTC } from '@/lib/utils';

export function LiveStatus() {
  const { telemetry, locationDetails, isLoading, error, refresh, isLive } = useISSLocation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors">
      <div className="flex flex-wrap items-center gap-3">
        {/* Connection status indicator */}
        {error ? (
          <Badge variant="rose" dot pulse size="md">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Connection Interrupted</span>
          </Badge>
        ) : isLive ? (
          <Badge variant="emerald" dot pulse size="md">
            <span>NORAD #25544 LIVE TELEMETRY</span>
          </Badge>
        ) : (
          <Badge variant="amber" dot size="md">
            <span>STREAM PAUSED</span>
          </Badge>
        )}

        {/* Current Ground Track Area */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
          <Globe2 className="h-4 w-4 text-cyan-600" />
          <span className="text-slate-500">Overflying:</span>
          <span className="font-bold text-cyan-700">
            {locationDetails?.country
              ? `${locationDetails.country} ${locationDetails.countryCode ? `(${locationDetails.countryCode})` : ''}`
              : locationDetails?.waterBodyName || 'Earth Orbit'}
          </span>
        </div>
      </div>

      {/* Timestamp & Manual Sync */}
      <div className="flex items-center gap-3">
        {telemetry && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Packet:</span>
            <span className="text-slate-800 font-semibold">
              {formatTimestampUTC(telemetry.timestamp)}
            </span>
          </div>
        )}

        <button
          onClick={() => refresh()}
          disabled={isLoading}
          title="Manual Telemetry Sync"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-700 hover:border-slate-300 hover:bg-slate-100 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 text-cyan-600 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline font-bold">Sync</span>
        </button>
      </div>
    </div>
  );
}
