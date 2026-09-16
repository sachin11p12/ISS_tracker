import React from 'react';
import { Astronaut } from '@/types/iss';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rocket, User, Shield } from 'lucide-react';

interface AstronautCardProps {
  astronaut: Astronaut;
}

export function AstronautCard({ astronaut }: AstronautCardProps) {
  const isTiangong = astronaut.craft.toLowerCase().includes('tiangong') || astronaut.craft.toLowerCase().includes('shenzhou');

  return (
    <Card
      glow
      interactive
      className="flex flex-col justify-between border-slate-200 bg-white hover:border-cyan-400 hover:shadow-md transition-all duration-300 group dark:border-slate-800/80 dark:bg-slate-950/80 dark:hover:border-cyan-500/40"
    >
      <div>
        {/* Header with craft badge and flag */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-3 dark:border-slate-800/60">
          <Badge
            variant={isTiangong ? 'amber' : 'cyan'}
            size="sm"
            className="font-mono font-bold"
          >
            <Rocket className="h-3 w-3" />
            <span>{astronaut.craft}</span>
          </Badge>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
            <span className="text-base" role="img" aria-label={astronaut.nationality}>
              {astronaut.flag || '🌍'}
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{astronaut.nationality}</span>
          </div>
        </div>

        {/* Astronaut Name & Role */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 border border-cyan-300 group-hover:bg-cyan-200 transition-colors dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800/40 dark:group-hover:bg-cyan-900/50">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors dark:text-slate-100 dark:group-hover:text-cyan-300">
                {astronaut.name}
              </h4>
              <p className="text-xs text-cyan-700 dark:text-cyan-400 font-mono font-semibold flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {astronaut.role || 'Expedition Crew Member'}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {astronaut.bio}
          </p>
        </div>
      </div>

      {/* Agency Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-mono text-slate-500 dark:border-slate-800/60 dark:text-slate-500">
        <span>Agency:</span>
        <span className="font-bold text-slate-700 dark:text-slate-300">{astronaut.agency || 'International'}</span>
      </div>
    </Card>
  );
}
