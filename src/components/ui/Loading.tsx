import React from 'react';
import { Radio, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RadarLoader({ message = 'Acquiring ISS Orbital Telemetry...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        {/* Concentric orbital rings */}
        <div className="absolute h-24 w-24 rounded-full border border-cyan-500/30 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute h-18 w-18 rounded-full border border-cyan-500/40" />
        <div className="absolute h-12 w-12 rounded-full border border-cyan-500/60" />
        <div className="absolute h-6 w-6 rounded-full bg-cyan-500/20" />
        <Orbit className="h-8 w-8 text-cyan-600 dark:text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
      </div>
      <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-mono text-sm tracking-wide">
        <Radio className="h-4 w-4 animate-pulse text-cyan-600 dark:text-cyan-400" />
        <span>{message}</span>
      </div>
      <p className="mt-2 text-xs text-slate-500">Contacting NORAD Satellite Catalog #25544</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200/80 border border-slate-300/60 dark:bg-slate-800/60 dark:border-slate-700/30',
        className
      )}
    />
  );
}
