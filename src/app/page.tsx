import React from 'react';
import { ISSMapWrapper } from '@/components/dashboard/ISSMapWrapper';
import { ISSStats } from '@/components/dashboard/ISSStats';
import { LiveStatus } from '@/components/dashboard/LiveStatus';
import { AstronautList } from '@/components/astronauts/AstronautList';
import { MissionFacts } from '@/components/dashboard/MissionFacts';
import { Orbit, Compass, Users, Sparkles, Activity, ShieldCheck, MapPin } from 'lucide-react';
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
              <span className="text-xs text-slate-400 font-mono">
                NORAD #25544 &bull; INCLINATION 51.6°
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100 font-mono">
              International Space Station <span className="text-cyan-400">Tracker</span>
            </h1>
            <p className="text-sm text-slate-400">
              Live orbital tracking, instantaneous velocity and altitude data, and crew expedition roster.
            </p>
          </div>
        </div>

        <LiveStatus />
      </section>

      {/* Main Interactive Map Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
            <Compass className="h-5 w-5 text-cyan-400" />
            Live Orbital Trajectory Map
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="hidden sm:inline">Position updates continuously</span>
          </div>
        </div>

        <ISSMapWrapper />
      </section>

      {/* Real-time Telemetry Cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          Live Telemetry &amp; Orbital State
        </h2>
        <ISSStats />
      </section>

      {/* People Currently in Space */}
      <section className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 backdrop-blur-md">
        <AstronautList />
      </section>

      {/* Station Architecture & Engineering Facts */}
      <section className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 backdrop-blur-md">
        <MissionFacts />
      </section>
    </div>
  );
}
