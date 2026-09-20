'use client';

import React, { useState, useEffect } from 'react';
import { AstronautsData } from '@/types/iss';
import { AstronautCard } from '@/components/astronauts/AstronautCard';
import { fetchAstronauts } from '@/services/issService';
import { Skeleton } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { Users, Search } from 'lucide-react';

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
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
        <p className="text-sm font-semibold">{error || 'Could not retrieve space crew roster.'}</p>
      </div>
    );
  }

  const filteredPeople = data.people.filter((person) => {
    const matchesCraft =
      selectedCraft === 'all' ||
      person.craft.toLowerCase().includes(selectedCraft.toLowerCase()) ||
      person.station.toLowerCase().includes(selectedCraft.toLowerCase());

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
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-300">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-mono flex items-center gap-2">
              People in Space Right Now
              <Badge variant="cyan" size="md" className="font-mono">
                {data.count} Human{data.count === 1 ? '' : 's'}
              </Badge>
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Active space station expeditions &amp; orbital crews
            </p>
          </div>
        </div>

        {/* Search & Craft Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search astronaut, agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:outline-hidden font-mono shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            {crafts.map((craft) => (
              <button
                key={craft}
                onClick={() => setSelectedCraft(craft)}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  selectedCraft === craft
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-300 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {craft.toUpperCase()}
                {craft !== 'all' && (
                  <span className="ml-1 text-[10px] text-cyan-700">
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
        <div className="rounded-2xl border border-slate-200 bg-white/40 p-8 text-center text-slate-500 font-mono text-xs">
          No astronauts found matching &quot;{searchQuery}&quot;.
        </div>
      )}
    </div>
  );
}
