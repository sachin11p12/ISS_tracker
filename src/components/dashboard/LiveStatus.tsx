'use client';

import React from 'react';
import { Radio, RefreshCw, Globe2, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useISSLocation } from '@/hooks/useISSLocation';
import { formatTimestampUTC } from '@/lib/utils';

export function LiveStatus() {
  const { telemetry, locationDetails, isLoading, error, refresh, isLive, refreshCount } = useISSLocation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 backdrop-blur-md">
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
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Globe2 className="h-4 w-4 text-cyan-400" />
          <span>Overflying:</span>
          <span className="font-semibold text-cyan-300">
            {locationDetails?.country
              ? `${locationDetails.country} ${locationDetails.countryCode ? `(${locationDetails.countryCode})` : ''}`
              : locationDetails?.waterBodyName || 'Earth Orbit'}
          </span>
        </div>
      </div>

      {/* Timestamp & Manual Sync */}
      <div className="flex items-center gap-3">
        {telemetry && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Packet:</span>
            <span className="text-slate-200">
              {formatTimestampUTC(telemetry.timestamp)}
            </span>
          </div>
        )}

        <button
          onClick={() => refresh()}
          disabled={isLoading}
          title="Manual Telemetry Sync"
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-slate-700 hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-3 w-3 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync</span>
        </button>
      </div>
    </div>
  );
}
