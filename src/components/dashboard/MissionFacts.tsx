import React from 'react';
import { ISS_MISSION_FACTS } from '@/constants/config';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Cpu, Scale, Maximize2, Orbit, ShieldAlert, Sparkles, Clock, Globe } from 'lucide-react';

export function MissionFacts() {
  const facts = [
    {
      icon: Orbit,
      label: 'Orbital Period',
      value: `~${ISS_MISSION_FACTS.orbitPeriodMinutes} Minutes`,
      sub: 'Completes 1 full revolution around Earth',
      color: 'text-cyan-400',
    },
    {
      icon: Globe,
      label: 'Orbits Per Day',
      value: `${ISS_MISSION_FACTS.orbitsPerDay} Orbits`,
      sub: 'Crew witnesses 16 sunrises & sunsets daily',
      color: 'text-emerald-400',
    },
    {
      icon: Scale,
      label: 'Station Mass',
      value: `${(ISS_MISSION_FACTS.massKg / 1000).toLocaleString()} Tonnes`,
      sub: `440,725 kg total on-orbit mass`,
      color: 'text-purple-400',
    },
    {
      icon: Maximize2,
      label: 'Structure Dimensions',
      value: `${ISS_MISSION_FACTS.lengthMeters}m x ${ISS_MISSION_FACTS.solarArraySpanMeters}m`,
      sub: 'Equivalent to a full American football field',
      color: 'text-amber-400',
    },
    {
      icon: Cpu,
      label: 'Habitable Volume',
      value: `${ISS_MISSION_FACTS.habitableVolumeM3} m³`,
      sub: 'Living space equal to a 6-bedroom house',
      color: 'text-blue-400',
    },
    {
      icon: Clock,
      label: 'Continuous Human Presence',
      value: 'Since Nov 2, 2000',
      sub: 'Over 25+ years of continuous habitability',
      color: 'text-rose-400',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Station Architecture &amp; Mission Specs
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Key physical and orbital engineering parameters of the ISS
          </p>
        </div>
        <Badge variant="outline" size="sm" className="hidden sm:inline-flex font-mono">
          Expedition Operations
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <Card key={idx} className="border-slate-800/80 bg-slate-950/60 hover:border-slate-700 transition-all">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg bg-slate-900/80 p-2.5 border border-slate-800 ${fact.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                    {fact.label}
                  </div>
                  <div className="text-base font-bold text-slate-100 font-mono mt-0.5">
                    {fact.value}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {fact.sub}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
