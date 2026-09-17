import React from 'react';
import Link from 'next/link';
import { getAstronautsData } from '@/lib/astronautsData';
import { Astronaut } from '@/types/iss';
import { Badge } from '@/components/ui/Badge';
import { AstronautImage } from '@/components/astronauts/AstronautImage';
import {
  Rocket,
  Shield,
  Clock,
  Calendar,
  ExternalLink,
  ChevronLeft,
  Building,
  User,
  Users,
} from 'lucide-react';

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} | Astronaut Profile & Mission Telemetry`,
    description: `Real-time orbital mission details, days in space, spacecraft, and biography for ${decodedName}.`,
  };
}

export default async function AstronautDetailPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).trim();

  const astronautsData = await getAstronautsData();
  const people = astronautsData.people || [];

  // Find matching astronaut by name (case-insensitive)
  const astronaut: Astronaut | undefined = people.find(
    (p) =>
      p.name.toLowerCase() === decodedName.toLowerCase() ||
      p.id.toLowerCase() === decodedName.toLowerCase() ||
      p.name.toLowerCase().includes(decodedName.toLowerCase()) ||
      decodedName.toLowerCase().includes(p.name.toLowerCase())
  );

  if (!astronaut) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mb-4">
          <User className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mb-2">
          Astronaut Profile Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Could not find an active space crew member matching &quot;{decodedName}&quot;.
        </p>
        <Link
          href="/astronauts"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-cyan-500 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to All Astronauts</span>
        </Link>
      </div>
    );
  }

  const isTiangong = astronaut.station === 'Tiangong' || astronaut.craft.toLowerCase().includes('tiangong');

  // Fellow crew members on the same station
  const fellowCrew = people.filter(
    (p) => p.name.toLowerCase() !== astronaut.name.toLowerCase() && p.station === astronaut.station
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/astronauts"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-semibold text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>Back to Crew Roster</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant={isTiangong ? 'amber' : 'cyan'} size="md" className="font-mono font-bold">
            <Rocket className="h-3.5 w-3.5" />
            <span>{astronaut.station} Expedition</span>
          </Badge>
        </div>
      </div>

      {/* Main Profile Hero Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Big Portrait Photo */}
          <div className="relative min-h-[380px] md:min-h-[480px] md:col-span-5 bg-slate-100 dark:bg-slate-900 overflow-hidden">
            <AstronautImage
              src={astronaut.image}
              alt={astronaut.name}
              className="h-full w-full object-cover object-top"
            />

            {/* Gradient Overlay for photo contrast */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />

            {/* Overlay Badge for Flag & Nationality */}
            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-xs font-mono font-semibold text-white backdrop-blur-md border border-white/20">
              <span className="text-base" role="img" aria-label={astronaut.nationality}>
                {astronaut.flag || '🌍'}
              </span>
              <span>{astronaut.nationality}</span>
            </div>
          </div>

          {/* Right Column: Mission Details & Bio */}
          <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-7">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-cyan-50 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-800 border border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800/60">
                    {astronaut.agency || 'Space Agency'}
                  </span>
                  {astronaut.spacecraft && (
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-mono font-semibold text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">
                      Vehicle: {astronaut.spacecraft}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight dark:text-slate-100">
                  {astronaut.name}
                </h1>

                <div className="flex items-center gap-2 text-sm font-mono font-semibold text-cyan-700 dark:text-cyan-400">
                  <Shield className="h-4 w-4" />
                  <span>{astronaut.role || 'Flight Engineer'}</span>
                </div>
              </div>

              {/* Bio description */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-300">
                {astronaut.bio}
              </div>

              {/* Quick Stat Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Time in Space</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                    {astronaut.daysInSpace !== undefined ? `${astronaut.daysInSpace} Days` : 'In Flight'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Building className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Space Station</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                    {astronaut.station}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Launch Date</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 truncate">
                    {astronaut.launchDate || 'Active Mission'}
                  </div>
                </div>
              </div>
            </div>

            {/* External Links Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                {astronaut.url && (
                  <a
                    href={astronaut.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-semibold text-slate-800 shadow-2xs hover:border-cyan-400 hover:text-cyan-700 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-cyan-400"
                  >
                    <span>Wikipedia Profile</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {astronaut.instagram && (
                  <a
                    href={astronaut.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-semibold text-pink-600 shadow-2xs hover:bg-pink-50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                )}

                {astronaut.twitter && (
                  <a
                    href={astronaut.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X / Twitter</span>
                  </a>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400">
                NORAD Catalog Telemetry Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fellow Expedition Crew Members */}
      {fellowCrew.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              Fellow Crew Members on {astronaut.station}
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {fellowCrew.length} Other Astronaut{fellowCrew.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fellowCrew.map((crew) => (
              <Link
                key={crew.id}
                href={`/astronauts/${encodeURIComponent(crew.name)}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-cyan-400 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-500/50"
              >
                <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-cyan-200 dark:border-cyan-800/40">
                  <AstronautImage
                    src={crew.image}
                    alt={crew.name}
                    className="h-full w-full object-cover object-top"
                    fallbackClassName="flex h-full w-full items-center justify-center bg-cyan-100 text-cyan-700 text-xs font-bold dark:bg-cyan-950 dark:text-cyan-400"
                    iconClassName="h-6 w-6"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors dark:text-slate-100 dark:group-hover:text-cyan-400 truncate">
                    {crew.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                    {crew.role}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
