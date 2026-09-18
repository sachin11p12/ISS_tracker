'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Orbit, Users, History, Play, Pause, Gauge, Radio } from 'lucide-react';
import { useISSStore } from '@/store/issStore';
import { formatTimeOnlyUTC, cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [utcTime, setUtcTime] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  const { isLive, toggleLive, unitSystem, setUnitSystem } = useISSStore();


  useEffect(() => {
    setMounted(true);
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

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-950/90 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 lg:px-8">
        {/* Left: Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/15 group-hover:shadow-cyan-500/30 transition-all">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950">
                <Orbit className="h-5 w-5 text-cyan-600 dark:text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
                  ISS <span className="text-cyan-600 dark:text-cyan-400">TRACKER</span>
                </span>
                <span className="hidden sm:inline-block rounded-md bg-cyan-50 dark:bg-cyan-950/80 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
                  NORAD 25544
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wide hidden lg:block">
                International Space Station Telemetry
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Centered Segmented Navigation Pills Bar */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl bg-slate-100/90 p-1 border border-slate-200/80 dark:bg-slate-900/90 dark:border-slate-800/80 shadow-2xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-mono font-semibold transition-all',
                  active
                    ? 'bg-white text-cyan-700 shadow-xs border border-slate-200/80 dark:bg-slate-800 dark:text-cyan-300 dark:border-slate-700/80'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400')} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Live Controls & Telemetry Clock */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Live UTC Clock */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 px-2.5 py-1.5 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 shadow-2xs">
            <Radio className="h-3 w-3 text-cyan-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400">UTC</span>
            <span className="font-bold text-cyan-700 dark:text-cyan-300 tracking-wider">
              {mounted && utcTime ? utcTime : '00:00:00'}
            </span>
          </div>

          {/* Unit Toggle */}
          <button
            onClick={() => setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')}
            title={`Switch to ${unitSystem === 'metric' ? 'Imperial (mph, mi)' : 'Metric (km/h, km)'}`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-200/70 transition-all dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
          >
            <Gauge className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="uppercase">{unitSystem === 'metric' ? 'KM / KM/H' : 'MI / MPH'}</span>
          </button>


          {/* Live Stream Status & Toggle */}
          <button
            onClick={toggleLive}
            title={isLive ? 'Pause real-time updates' : 'Resume live real-time stream'}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer shadow-2xs',
              isLive
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40'
                : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/40'
            )}
          >
            {isLive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="hidden sm:inline">LIVE</span>
                <Pause className="h-3 w-3 opacity-70" />
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="hidden sm:inline">PAUSED</span>
                <Play className="h-3 w-3 opacity-70" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-200/80 bg-white/95 px-2 py-1.5 dark:border-slate-800/80 dark:bg-slate-950/95">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isLinkActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-mono font-semibold transition-colors',
                active
                  ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400')} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

