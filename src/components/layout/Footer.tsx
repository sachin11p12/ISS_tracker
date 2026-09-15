import React from 'react';
import Link from 'next/link';
import { Orbit, Radio, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { ISS_MISSION_FACTS } from '@/constants/config';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Mission info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Orbit className="h-5 w-5 text-cyan-400" />
              <span className="text-base font-bold text-slate-200 font-mono">
                INTERNATIONAL SPACE STATION
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-md">
              A multinational collaborative project involving NASA (United States), Roscosmos (Russia),
              JAXA (Japan), ESA (Europe), and CSA (Canada). Operating continuously in low Earth orbit since 1998.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Radio className="h-3.5 w-3.5 text-cyan-400" />
                NORAD ID: 25544
              </span>
              <span>&bull;</span>
              <span>Inclination: {ISS_MISSION_FACTS.orbitInclinationDeg}°</span>
              <span>&bull;</span>
              <span>Period: ~{ISS_MISSION_FACTS.orbitPeriodMinutes} min</span>
            </div>
          </div>

          {/* Telemetry Data Sources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Telemetry Feeds
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://wheretheiss.at"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="h-3 w-3 text-cyan-500" />
                  <span>WhereTheISS.at API</span>
                </a>
              </li>
              <li>
                <a
                  href="http://open-notify.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="h-3 w-3 text-cyan-500" />
                  <span>Open-Notify Astros API</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.nasa.gov/international-space-station/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="h-3 w-3 text-cyan-500" />
                  <span>NASA ISS Research</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Live ISS Dashboard
                </Link>
              </li>
              <li>
                <Link href="/astronauts" className="hover:text-cyan-400 transition-colors">
                  Astronauts &amp; Space Station Roster
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-cyan-400 transition-colors">
                  Orbital Mechanics &amp; Specifications
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800/60 pt-6 text-xs text-slate-500 sm:flex-row font-mono">
          <p>&copy; {new Date().getFullYear()} ISS Tracker. Real-time satellite telemetry.</p>
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>All orbital telemetry systems nominal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
