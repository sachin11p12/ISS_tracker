import React from 'react';
import { Astronaut } from '@/types/iss';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rocket, User, Shield, ExternalLink, Clock } from 'lucide-react';

interface AstronautCardProps {
  astronaut: Astronaut;
}

export function AstronautCard({ astronaut }: AstronautCardProps) {
  const isTiangong = astronaut.station === 'Tiangong' || astronaut.craft.toLowerCase().includes('tiangong');

  return (
    <Card
      glow
      interactive
      className="flex flex-col justify-between border-slate-200 bg-white hover:border-cyan-400 hover:shadow-md transition-all duration-300 group dark:border-slate-800/80 dark:bg-slate-950/80 dark:hover:border-cyan-500/40"
    >
      <div>
        {/* Header with craft badge, spacecraft, and flag */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-3 dark:border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant={isTiangong ? 'amber' : 'cyan'}
              size="sm"
              className="font-mono font-bold"
            >
              <Rocket className="h-3 w-3" />
              <span>{astronaut.station || astronaut.craft}</span>
            </Badge>

            {astronaut.spacecraft && astronaut.spacecraft !== astronaut.station && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800">
                {astronaut.spacecraft}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-mono text-slate-700 dark:text-slate-300">
            <span className="text-base" role="img" aria-label={astronaut.nationality}>
              {astronaut.flag || '🌍'}
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{astronaut.nationality}</span>
          </div>
        </div>

        {/* Astronaut Avatar/Photo, Name & Role */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {astronaut.image ? (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-cyan-300 shadow-xs dark:border-cyan-800/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={astronaut.image}
                  alt={astronaut.name}
                  className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 border border-cyan-300 group-hover:bg-cyan-200 transition-colors dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800/40 dark:group-hover:bg-cyan-900/50">
                <User className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors dark:text-slate-100 dark:group-hover:text-cyan-300 truncate">
                  {astronaut.name}
                </h4>
                {astronaut.url && (
                  <a
                    href={astronaut.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Wikipedia Profile"
                    className="text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <p className="text-xs text-cyan-700 dark:text-cyan-400 font-mono font-semibold flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span className="truncate">{astronaut.role || 'Flight Engineer'}</span>
              </p>
            </div>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {astronaut.bio}
          </p>
        </div>
      </div>

      {/* Agency & Days in space Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-mono text-slate-500 dark:border-slate-800/60 dark:text-slate-500">
        <div>
          <span>Agency: </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{astronaut.agency || 'International'}</span>
        </div>

        {astronaut.daysInSpace !== undefined && astronaut.daysInSpace > 0 && (
          <div className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400 font-semibold">
            <Clock className="h-3 w-3" />
            <span>{astronaut.daysInSpace}d in space</span>
          </div>
        )}
      </div>
    </Card>
  );
}
