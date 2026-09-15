import React from 'react';
import { Astronaut } from '@/types/iss';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rocket, User, Shield, Sparkles } from 'lucide-react';

interface AstronautCardProps {
  astronaut: Astronaut;
}

export function AstronautCard({ astronaut }: AstronautCardProps) {
  const isTiangong = astronaut.craft.toLowerCase().includes('tiangong') || astronaut.craft.toLowerCase().includes('shenzhou');

  return (
    <Card
      glow
      interactive
      className="flex flex-col justify-between border-slate-800/80 bg-slate-950/80 hover:border-cyan-500/40 transition-all duration-300 group"
    >
      <div>
        {/* Header with craft badge and flag */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800/60 pb-3 mb-3">
          <Badge
            variant={isTiangong ? 'amber' : 'cyan'}
            size="sm"
            className="font-mono"
          >
            <Rocket className="h-3 w-3" />
            <span>{astronaut.craft}</span>
          </Badge>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
            <span className="text-base" role="img" aria-label={astronaut.nationality}>
              {astronaut.flag || '🌍'}
            </span>
            <span className="text-slate-400">{astronaut.nationality}</span>
          </div>
        </div>

        {/* Astronaut Name & Role */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 group-hover:bg-cyan-900/50 transition-colors">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {astronaut.name}
              </h4>
              <p className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {astronaut.role || 'Expedition Crew Member'}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            {astronaut.bio}
          </p>
        </div>
      </div>

      {/* Agency Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 text-[11px] font-mono text-slate-500">
        <span>Agency:</span>
        <span className="font-semibold text-slate-300">{astronaut.agency || 'International'}</span>
      </div>
    </Card>
  );
}
