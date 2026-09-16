import React from 'react';
import { AstronautList } from '@/components/astronauts/AstronautList';
import { Users, Globe2, ShieldCheck, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Crew in Space | Astronauts & Taikonauts Roster',
  description: 'Detailed roster of all humans currently living and working aboard orbital stations.',
};

export default function AstronautsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-mono text-cyan-800 dark:border-cyan-800/50 dark:bg-cyan-950/40 dark:text-cyan-300">
          <Rocket className="h-3.5 w-3.5" />
          <span>HUMAN SPACEFLIGHT PROGRAM</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight sm:text-4xl dark:text-slate-100">
          Active Space <span className="text-cyan-600 dark:text-cyan-400">Expeditions</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Discover all astronauts and taikonauts currently orbiting Earth aboard the International Space Station
          (ISS) and Tiangong Space Station.
        </p>
      </div>

      {/* Overview summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-100 p-2.5 text-cyan-700 border border-cyan-300 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-800/40">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase">Operational Habitats</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">ISS &amp; Tiangong</div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2.5 text-purple-700 border border-purple-300 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase">Primary Agencies</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">NASA, Roscosmos, CMSA, ESA</div>
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/40">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase">Science Experiments</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">Microgravity &amp; Biology</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main interactive astronaut roster list */}
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/40 dark:shadow-none">
        <AstronautList />
      </div>
    </div>
  );
}
