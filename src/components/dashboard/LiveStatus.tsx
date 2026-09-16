'use client';

import React from 'react';
import { RefreshCw, Globe2, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useISSLocation } from '@/hooks/useISSLocation';
import { formatTimestampUTC } from '@/lib/utils';

export function LiveStatus() {
  const { telemetry, locationDetails, isLoading, error, refresh, isLive } = useISSLocation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/60 dark:shadow-none">
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
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
          <Globe2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>Overflying:</span>
          <span className="font-semibold text-cyan-700 dark:text-cyan-300">
            {locationDetails?.country
              ? `${locationDetails.country} ${locationDetails.countryCode ? `(${locationDetails.countryCode})` : ''}`
              : locationDetails?.waterBodyName || 'Earth Orbit'}
          </span>
        </div>
      </div>

      {/* Timestamp & Manual Sync */}
      <div className="flex items-center gap-3">
        {telemetry && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span className="hidden sm:inline">Packet:</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {formatTimestampUTC(telemetry.timestamp)}
            </span>
          </div>
        )}

        <button
          onClick={() => refresh()}
          disabled={isLoading}
          title="Manual Telemetry Sync"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-mono text-slate-700 hover:border-slate-300 hover:bg-slate-200 disabled:opacity-50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
        >
          <RefreshCw className={`h-3 w-3 text-cyan-600 dark:text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline font-medium">Sync</span>
        </button>
      </div>
    </div>
  );
}
