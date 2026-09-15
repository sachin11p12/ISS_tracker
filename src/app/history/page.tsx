import React from 'react';
import { ISS_MISSION_FACTS } from '@/constants/config';
import { Card, CardHeader, CardTitle, CardValue } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { History, Compass, Orbit, Zap, Shield, Cpu, Flame, Info, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Orbital Specs & History | ISS Mission Information',
  description: 'Technical orbital mechanics, history, and scientific architecture of the International Space Station.',
};

export default function HistoryPage() {
  const timeline = [
    {
      year: '1998',
      title: 'First Module Launch (Zarya)',
      desc: 'The Zarya control module was launched atop a Russian Proton rocket on November 20, 1998, establishing the foundation of the ISS.',
    },
    {
      year: '2000',
      title: 'Expedition 1 Crew Arrives',
      desc: 'Astronaut William Shepherd and Cosmonauts Yuri Gidzenko and Sergei Krikalev became the first crew to live on the ISS on November 2, 2000.',
    },
    {
      year: '2001',
      title: 'Destiny Laboratory Installed',
      desc: 'The US Destiny Laboratory was attached, drastically expanding the station\'s capability for cutting-edge scientific research in microgravity.',
    },
    {
      year: '2011',
      title: 'Assembly Complete',
      desc: 'With the installation of the AMS-02 particle physics detector and the Leonardo module, primary construction of the station was declared complete.',
    },
    {
      year: 'Present',
      title: 'Continuous Scientific Breakthroughs',
      desc: 'Hosting over 3,000 scientific experiments across physics, biology, material sciences, human physiology, and deep space exploration technologies.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/50 bg-cyan-950/40 px-3 py-1 text-xs font-mono text-cyan-300">
          <History className="h-3.5 w-3.5" />
          <span>NORAD CATALOG #25544</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight sm:text-4xl">
          Orbital Mechanics &amp; <span className="text-cyan-400">History</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Understanding the physics, timeline, and engineering principles behind humanity&apos;s greatest cooperative laboratory in Low Earth Orbit.
        </p>
      </div>

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card glow className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle>
              <Orbit className="h-4 w-4 text-cyan-400" />
              Orbital Inclination (51.6°)
            </CardTitle>
          </CardHeader>
          <p className="text-xs leading-relaxed text-slate-300">
            The ISS orbits at an inclination of 51.6 degrees relative to Earth&apos;s equator. This specific angle allows launch vehicles from both the Baikonur Cosmodrome in Kazakhstan and Kennedy Space Center in Florida to reach the station directly.
          </p>
        </Card>

        <Card glow className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle>
              <Zap className="h-4 w-4 text-amber-400" />
              Solar Power Architecture
            </CardTitle>
          </CardHeader>
          <p className="text-xs leading-relaxed text-slate-300">
            Eight large solar wings containing 262,400 solar cells generate between 84 to 120 kilowatts of usable power. The arrays continually rotate to track the Sun as the station flies around the globe.
          </p>
        </Card>

        <Card glow className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle>
              <Flame className="h-4 w-4 text-rose-400" />
              Atmospheric Drag &amp; Reboost
            </CardTitle>
          </CardHeader>
          <p className="text-xs leading-relaxed text-slate-300">
            Even at 420 km altitude, traces of atmospheric drag slowly decay the station&apos;s orbit by ~2 km per month. Regular reboost burns using Progress or Cygnus cargo spacecraft maintain orbital safety.
          </p>
        </Card>
      </div>

      {/* Assembly Timeline */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 backdrop-blur-md">
        <h3 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2 mb-6">
          <History className="h-5 w-5 text-cyan-400" />
          Station Evolution Timeline
        </h3>

        <div className="relative border-l border-cyan-800/40 ml-4 space-y-8 pl-6">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors" />
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {item.year}
                </span>
                <h4 className="text-base font-bold text-slate-100">{item.title}</h4>
              </div>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-2xl">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
