'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Orbit, Users, History, Activity, Play, Pause, RefreshCw, Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useISSStore } from '@/store/issStore';
import { formatTimeOnlyUTC, cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [utcTime, setUtcTime] = useState<string>('');
  const { isLive, toggleLive, unitSystem, setUnitSystem, isLoading } = useISSStore();

  useEffect(() => {
    const updateTime = () => setUtcTime(formatTimeOnlyUTC());
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { href: '/', label: 'Live Tracker', icon: Orbit },
    { href: '/astronauts', label: 'Crew in Space', icon: Users },
    { href: '/history', label: 'Orbital Specs', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Orbit className="h-5 w-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-100 font-mono">
                  ISS <span className="text-cyan-400">TRACKER</span>
                </span>
                <span className="hidden sm:inline-block rounded bg-cyan-950/80 px-1.5 py-0.5 text-[10px] font-mono font-medium text-cyan-400 border border-cyan-800/40">
                  ZARYA-25544
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide hidden sm:block">
                International Space Station Telemetry
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 border-l border-slate-800/80 pl-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-slate-800/90 text-cyan-400 shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Live Controls & Telemetry clock */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live UTC Clock */}
          <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/60 px-3 py-1.5 font-mono text-xs text-slate-300">
            <span className="text-slate-500">UTC</span>
            <span className="font-semibold text-cyan-300 tracking-wider">
              {utcTime || '00:00:00 UTC'}
            </span>
          </div>

          {/* Unit Toggle */}
          <button
            onClick={() => setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')}
            title={`Switch to ${unitSystem === 'metric' ? 'Imperial (mph, mi)' : 'Metric (km/h, km)'}`}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800/80 bg-slate-900/60 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:border-slate-700 hover:bg-slate-800 transition-colors"
          >
            <Gauge className="h-3.5 w-3.5 text-cyan-400" />
            <span className="uppercase font-semibold">{unitSystem === 'metric' ? 'KM / KM/H' : 'MI / MPH'}</span>
          </button>

          {/* Live Stream Status & Toggle */}
          <button
            onClick={toggleLive}
            title={isLive ? 'Pause real-time updates' : 'Resume live real-time stream'}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-mono font-medium transition-all',
              isLive
                ? 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'border-amber-700/60 bg-amber-950/40 text-amber-300 hover:bg-amber-900/40'
            )}
          >
            {isLive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="hidden sm:inline">LIVE</span>
                <Pause className="h-3 w-3 opacity-60" />
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="hidden sm:inline">PAUSED</span>
                <Play className="h-3 w-3 opacity-60" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 bg-slate-950/90 px-2 py-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors',
                isActive ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
