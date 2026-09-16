import React from 'react';
import { Astronaut } from '@/types/iss';
import { Badge } from '@/components/ui/Badge';
import { Rocket, User, Shield, ExternalLink, Clock } from 'lucide-react';

interface AstronautCardProps {
  astronaut: Astronaut;
}

export function AstronautCard({ astronaut }: AstronautCardProps) {
  const isTiangong = astronaut.station === 'Tiangong' || astronaut.craft.toLowerCase().includes('tiangong');

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-cyan-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/90 dark:hover:border-cyan-500/50">
      {/* Top Large Astronaut Portrait Photo Banner */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        {astronaut.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={astronaut.image}
            alt={astronaut.name}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-400 dark:from-slate-900 dark:to-slate-950 dark:text-slate-600">
            <User className="h-20 w-20 stroke-[1.2]" />
          </div>
        )}

        {/* Subtle Dark Gradient Overlay at bottom of image for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Floating Badges on top of photo */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <Badge
            variant={isTiangong ? 'amber' : 'cyan'}
            size="sm"
            className="font-mono font-bold shadow-md backdrop-blur-md"
          >
            <Rocket className="h-3 w-3" />
            <span>{astronaut.station || astronaut.craft}</span>
          </Badge>

          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-mono font-semibold text-white shadow-md backdrop-blur-md border border-white/20">
            <span className="text-sm" role="img" aria-label={astronaut.nationality}>
              {astronaut.flag || '🌍'}
            </span>
            <span>{astronaut.nationality}</span>
          </div>
        </div>

        {/* Astronaut Name & Role Overlaid on bottom of photo */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-lg font-bold text-white tracking-tight drop-shadow-md group-hover:text-cyan-300 transition-colors">
              {astronaut.name}
            </h4>
            {astronaut.url && (
              <a
                href={astronaut.url}
                target="_blank"
                rel="noopener noreferrer"
                title="View Wikipedia Profile"
                className="rounded-full bg-white/20 p-1.5 text-white hover:bg-cyan-500 hover:text-white transition-colors backdrop-blur-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs font-mono text-cyan-300 font-medium drop-shadow-sm mt-0.5">
            <Shield className="h-3.5 w-3.5" />
            <span>{astronaut.role || 'Flight Engineer'}</span>
          </div>
        </div>
      </div>

      {/* Card Content & Bio */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Spacecraft assignment chip */}
          {astronaut.spacecraft && (
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">
              <span className="text-slate-400">Craft:</span>
              <span className="text-cyan-700 dark:text-cyan-400">{astronaut.spacecraft}</span>
            </div>
          )}

          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {astronaut.bio}
          </p>
        </div>

        {/* Agency and Days in Space Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-mono text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
          <div>
            <span className="text-slate-400">Agency: </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{astronaut.agency || 'International'}</span>
          </div>

          {astronaut.daysInSpace !== undefined && (
            <div className="flex items-center gap-1 font-semibold text-cyan-700 dark:text-cyan-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{astronaut.daysInSpace}d in space</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
