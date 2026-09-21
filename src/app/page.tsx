import React from 'react';
import { ISSMapWrapper } from '@/components/dashboard/ISSMapWrapper';
import { ISSStats } from '@/components/dashboard/ISSStats';
import { LiveStatus } from '@/components/dashboard/LiveStatus';
import { ISSLiveStream } from '@/components/dashboard/ISSLiveStream';
import { AstronautList } from '@/components/astronauts/AstronautList';
import { MissionFacts } from '@/components/dashboard/MissionFacts';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero / Live Status Bar with Live Space Camera on Right */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm" pulse dot>
                REAL-TIME TELEMETRY STREAM
              </Badge>
              <span className="text-xs text-slate-500 font-mono font-medium">
                NORAD #25544 &bull; INCLINATION 51.6°
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
              International Space Station <span className="text-cyan-600">Tracker</span>
            </h1>
            <p className="text-sm text-slate-600 font-normal">
              Live orbital tracking, instantaneous velocity and altitude data, and crew expedition roster.
            </p>
          </div>

          {/* Right side: Live Video Stream with option to watch live */}
          <div className="shrink-0">
            <ISSLiveStream />
          </div>
        </div>

        <LiveStatus />
      </section>

      {/* Main Interactive Map & 3D Globe Section */}
      <section>
        <ISSMapWrapper />
      </section>

      {/* Real-time Telemetry Cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 font-mono flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-600" />
          Live Telemetry &amp; Orbital State
        </h2>
        <ISSStats />
      </section>

      {/* People Currently in Space */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors">
        <AstronautList />
      </section>

      {/* Station Architecture & Engineering Facts */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors">
        <MissionFacts />
      </section>
    </div>
  );
}
