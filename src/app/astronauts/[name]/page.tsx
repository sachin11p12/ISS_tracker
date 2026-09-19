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
  GraduationCap,
  Award,
  BookOpen,
  FileText,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  Activity,
  User,
} from 'lucide-react';

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} | Astronaut Profile, Education & Research Papers`,
    description: `Complete biography, educational qualifications, career achievements, and scientific research publications for astronaut ${decodedName}.`,
  };
}

function formatDaysDisplay(days?: number): string {
  if (days && days > 0) {
    return `${days} Days Total`;
  }
  return 'Active Mission (1st Flight)';
}

export default async function AstronautDetailPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).trim();

  const astronautsData = await getAstronautsData();
  const people = astronautsData.people || [];

  // Find matching astronaut by name or id (case-insensitive)
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
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4">
          <User className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold font-mono text-slate-900 mb-2">
          Astronaut Profile Not Found
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">
          Could not find an active space crew member matching &quot;{decodedName}&quot;.
        </p>
        <Link
          href="/astronauts"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-cyan-500 transition-colors cursor-pointer"
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
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/astronauts"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-semibold text-slate-700 shadow-2xs hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 text-cyan-600" />
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
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Portrait Photo */}
          <div className="relative min-h-[380px] md:min-h-[480px] md:col-span-5 bg-slate-100 overflow-hidden">
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
                  <span className="rounded-md bg-cyan-50 px-2.5 py-0.5 text-xs font-mono font-bold text-cyan-800 border border-cyan-200">
                    {astronaut.agency || 'Space Agency'}
                  </span>
                  {astronaut.spacecraft && (
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-mono font-semibold text-slate-700 border border-slate-200">
                      Vehicle: {astronaut.spacecraft}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {astronaut.name}
                </h1>

                <div className="flex items-center gap-2 text-sm font-mono font-semibold text-cyan-700">
                  <Shield className="h-4 w-4" />
                  <span>{astronaut.role || 'Flight Engineer'}</span>
                </div>
              </div>

              {/* Bio description */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs sm:text-sm leading-relaxed text-slate-700">
                {astronaut.bio}
              </div>

              {/* Personal & Mission Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {astronaut.birthDate && (
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-cyan-600" />
                      <span>Date of Birth</span>
                    </div>
                    <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                      {astronaut.birthDate}
                    </div>
                    {astronaut.birthPlace && (
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate flex items-center gap-1">
                        <MapPin className="h-3 w-3 inline text-slate-400" />
                        <span>{astronaut.birthPlace}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Clock className="h-3.5 w-3.5 text-cyan-600" />
                    <span>Time in Space</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                    {formatDaysDisplay(astronaut.daysInSpace)}
                  </div>
                  <div className="text-[11px] text-cyan-700 font-mono font-semibold mt-0.5">
                    {astronaut.daysInSpace && astronaut.daysInSpace > 0 ? `${(astronaut.daysInSpace * 24).toLocaleString()} Hours` : 'Current Flight'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Building className="h-3.5 w-3.5 text-cyan-600" />
                    <span>Space Station</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-900 mt-1">
                    {astronaut.station}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono font-semibold mt-0.5">
                    Active Roster
                  </div>
                </div>
              </div>

              {/* Spacewalk EVA Stat Banner (if available) */}
              {astronaut.spacewalks && (
                <div className="rounded-2xl bg-cyan-50/70 p-3.5 border border-cyan-200 text-xs font-mono text-cyan-900 flex items-start gap-3">
                  <Activity className="h-4 w-4 text-cyan-700 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-cyan-950">
                      Extravehicular Activity (EVA): {astronaut.spacewalks.count} Spacewalk{astronaut.spacewalks.count === 1 ? '' : 's'} ({astronaut.spacewalks.durationHours} Hours)
                    </div>
                    {astronaut.spacewalks.highlights && (
                      <div className="text-slate-600 mt-0.5 text-[11px]">
                        {astronaut.spacewalks.highlights}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* External Links Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                {astronaut.url && (
                  <a
                    href={astronaut.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-semibold text-slate-800 shadow-2xs hover:border-cyan-400 hover:text-cyan-700 transition-colors"
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
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-semibold text-pink-600 shadow-2xs hover:bg-pink-50 transition-colors"
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
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X / Twitter</span>
                  </a>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400">
                Official Roster Verified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Background & Qualifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Education Section (Left 6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-200">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-slate-900">
                Educational Background
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Academic degrees &amp; institutions
              </p>
            </div>
          </div>

          {astronaut.education && astronaut.education.length > 0 ? (
            <div className="space-y-3">
              {astronaut.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-cyan-300 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-lg border border-cyan-200">
                      {edu.degree}
                    </span>
                    {edu.year && (
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        {edu.year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold font-mono text-slate-900 mt-2">
                    {edu.field}
                  </h3>
                  <div className="text-xs font-mono text-slate-600 mt-1 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{edu.institution}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-xs font-mono text-slate-500 border border-slate-200">
              Comprehensive military and astronaut candidate flight training through {astronaut.agency}.
            </div>
          )}
        </div>

        {/* Qualifications & Career Highlights (Right 6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 border border-blue-200">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-slate-900">
                Qualifications &amp; Career
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Professional ratings &amp; specializations
              </p>
            </div>
          </div>

          {astronaut.qualifications && astronaut.qualifications.length > 0 ? (
            <ul className="space-y-2.5">
              {astronaut.qualifications.map((qual, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-mono text-slate-700 shadow-2xs"
                >
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{qual}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-xs font-mono text-slate-500 border border-slate-200">
              Certified orbital flight engineer and mission operations specialist.
            </div>
          )}
        </div>
      </div>

      {/* Major Achievements & Awards */}
      {astronaut.achievements && astronaut.achievements.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 border border-amber-200">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-slate-900">
                Key Achievements &amp; Mission Milestones
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Honors, records, and notable spaceflight milestones
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {astronaut.achievements.map((achieve, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-bold font-mono">
                  {idx + 1}
                </div>
                <p className="text-xs font-mono text-slate-700 leading-relaxed">
                  {achieve}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Publications & Research Papers */}
      {astronaut.researchPapers && astronaut.researchPapers.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-mono text-slate-900">
                  Scientific Publications &amp; Research Papers
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Peer-reviewed studies, microgravity experiments, and technical reports
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 hidden sm:inline-block">
              {astronaut.researchPapers.length} Publication{astronaut.researchPapers.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-3">
            {astronaut.researchPapers.map((paper, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-2xs hover:border-cyan-400 hover:bg-white transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-600" />
                      <span className="text-xs font-mono font-semibold text-cyan-800">
                        {paper.journal || 'Scientific Journal'}
                      </span>
                    </div>
                    {paper.year && (
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        {paper.year}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold font-mono text-slate-900 group-hover:text-cyan-800 transition-colors">
                    {paper.title}
                  </h3>

                  {paper.description && (
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {paper.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Peer-Reviewed &amp; Archived
                  </span>
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 px-3 py-1.5 text-xs font-mono font-bold text-cyan-700 border border-cyan-200 hover:bg-cyan-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Read Paper / Citation</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fellow Expedition Crew Members */}
      {fellowCrew.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-mono text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-600" />
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
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-cyan-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-cyan-200">
                  <AstronautImage
                    src={crew.image}
                    alt={crew.name}
                    className="h-full w-full object-cover object-top"
                    fallbackClassName="flex h-full w-full items-center justify-center bg-cyan-100 text-cyan-700 text-xs font-bold"
                    iconClassName="h-6 w-6"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                    {crew.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono truncate">
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
