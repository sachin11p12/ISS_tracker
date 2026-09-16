import React from 'react';
import { ISSMapWrapper } from '@/components/dashboard/ISSMapWrapper';
import { ISSStats } from '@/components/dashboard/ISSStats';
import { LiveStatus } from '@/components/dashboard/LiveStatus';
import { AstronautList } from '@/components/astronauts/AstronautList';
import { MissionFacts } from '@/components/dashboard/MissionFacts';
import { Compass, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero / Live Status Bar */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm" pulse dot>
                REAL-TIME TELEMETRY STREAM
              </Badge>
              <span className="text-xs text-slate-500 font-mono font-medium dark:text-slate-400">
                NORAD #25544 &bull; INCLINATION 51.6°
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-mono dark:text-slate-100">
              International Space Station <span className="text-cyan-600 dark:text-cyan-400">Tracker</span>
            </h1>
            <p className="text-sm text-slate-600 font-normal dark:text-slate-400">
              Live orbital tracking, instantaneous velocity and altitude data, and crew expedition roster.
            </p>
          </div>
        </div>

        <LiveStatus />
      </section>

      {/* Main Interactive Map Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-mono flex items-center gap-2 dark:text-slate-100">
            <Compass className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            Live Orbital Trajectory Map
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
            <span className="hidden sm:inline font-medium">Position updates continuously</span>
          </div>
        </div>

        <ISSMapWrapper />
      </section>

      {/* Real-time Telemetry Cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 font-mono flex items-center gap-2 dark:text-slate-100">
          <Activity className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Live Telemetry &amp; Orbital State
        </h2>
        <ISSStats />
      </section>

      {/* People Currently in Space */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800/80 dark:bg-slate-950/40 dark:shadow-none">
        <AstronautList />
      </section>

      {/* Station Architecture & Engineering Facts */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800/80 dark:bg-slate-950/40 dark:shadow-none">
        <MissionFacts />
      </section>
    </div>
  );
}
