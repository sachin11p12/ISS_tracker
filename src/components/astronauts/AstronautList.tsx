'use client';

import React, { useState, useEffect } from 'react';
import { Astronaut, AstronautsData } from '@/types/iss';
import { AstronautCard } from '@/components/astronauts/AstronautCard';
import { fetchAstronauts } from '@/services/issService';
import { RadarLoader, Skeleton } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { Users, Search, Rocket, Filter } from 'lucide-react';

export function AstronautList() {
  const [data, setData] = useState<AstronautsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchAstronauts();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch space crew');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-6 text-center text-rose-300">
        <p className="text-sm font-semibold">{error || 'Could not retrieve space crew roster.'}</p>
      </div>
    );
  }

  // Filter astronauts
  const filteredPeople = data.people.filter((person) => {
    const matchesCraft =
      selectedCraft === 'all' ||
      person.craft.toLowerCase().includes(selectedCraft.toLowerCase());

    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.agency?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.nationality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCraft && matchesSearch;
  });

  const crafts = ['all', ...Object.keys(data.craftBreakdown)];

  return (
    <div className="space-y-6">
      {/* Header & Controls bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-mono flex items-center gap-2">
              People in Space Right Now
              <Badge variant="cyan" size="md" className="font-mono">
                {data.count} Human{data.count === 1 ? '' : 's'}
              </Badge>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Active space station expeditions &amp; orbital crews
            </p>
          </div>
        </div>

        {/* Search & Craft Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search astronaut, agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>

          {/* Craft filter buttons */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-1">
            {crafts.map((craft) => (
              <button
                key={craft}
                onClick={() => setSelectedCraft(craft)}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition-colors ${
                  selectedCraft === craft
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {craft.toUpperCase()}
                {craft !== 'all' && (
                  <span className="ml-1 text-[10px] text-cyan-500">
                    ({data.craftBreakdown[craft] || 0})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Astronauts */}
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <AstronautCard key={person.id} astronaut={person} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-8 text-center text-slate-400 font-mono text-xs">
          No astronauts found matching &quot;{searchQuery}&quot;.
        </div>
      )}
    </div>
  );
}
