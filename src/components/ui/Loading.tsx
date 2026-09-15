import React from 'react';
import { Radio, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RadarLoader({ message = 'Acquiring ISS Orbital Telemetry...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        {/* Concentric orbital rings */}
        <div className="absolute h-24 w-24 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute h-18 w-18 rounded-full border border-cyan-500/30" />
        <div className="absolute h-12 w-12 rounded-full border border-cyan-500/50" />
        <div className="absolute h-6 w-6 rounded-full bg-cyan-500/20" />
        <Orbit className="h-8 w-8 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
      </div>
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wide">
        <Radio className="h-4 w-4 animate-pulse text-cyan-400" />
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
        'animate-pulse rounded-md bg-slate-800/60 border border-slate-700/30',
        className
      )}
    />
  );
}
