'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Orbit,
  Zap,
  Flame,
  Shield,
  Activity,
  Cpu,
  Wind,
  Radio,
  Layers,
  Compass,
  Eye,
  Globe,
  Wrench,
  Clock,
  Calendar,
  ChevronRight,
  Atom,
  Droplets,
  Thermometer,
  Gauge,
  BatteryCharging,
  CheckCircle2,
  Info,
  Sparkles,
  Box,
  Rocket,
  ArrowUpRight,
} from 'lucide-react';
import { useISSStore } from '@/store/issStore';

type ActiveTab = 'mechanics' | 'subsystems' | 'modules' | 'robotics' | 'timeline';

export function OrbitalSpecsView() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mechanics');
  const { unitSystem, setUnitSystem } = useISSStore();

  const isMetric = unitSystem === 'metric';

  // Unit conversion helpers
  const speed = isMetric ? '27,600 km/h (7.66 km/s)' : '17,150 mph (4.76 mi/s)';
  const alt = isMetric ? '418 – 422 km' : '260 – 262 miles';
  const mass = isMetric ? '444,615 kg (444.6 tonnes)' : '980,200 lbs (490 tons)';
  const length = isMetric ? '109.0 meters (357.6 ft)' : '357.6 feet (109 m)';
  const trussWidth = isMetric ? '73.0 meters (239.5 ft)' : '239.5 feet (73 m)';
  const habitableVol = isMetric ? '388 m³ (13,700 cu ft)' : '13,700 cu ft (388 m³)';
  const pressVol = isMetric ? '916 m³ (32,350 cu ft)' : '32,350 cu ft (916 m³)';
  const solarArea = isMetric ? '2,400 m² (25,830 sq ft)' : '25,830 sq ft (2,400 m²)';

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        {/* Subtle decorative background gradient */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-100 px-3 py-1 text-xs font-mono font-bold text-cyan-800 border border-cyan-300">
                <Rocket className="h-3.5 w-3.5 text-cyan-700" />
                NORAD CATALOG #25544
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-xs font-mono font-semibold text-slate-700 border border-slate-200">
                INTERNATIONAL CALLSIGN: ALPHA
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-mono font-bold text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                OPERATIONAL SINCE 1998
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
              Orbital Specs &amp; <span className="text-cyan-600">Technical Architecture</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Comprehensive engineering compendium, orbital mechanics formulas, environmental life support telemetry, modular architecture, and historical timeline of humanity&apos;s foremost microgravity research laboratory.
            </p>
          </div>

          {/* Quick Unit Switcher & Live Link Action */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-2xs">
              <span className="text-xs font-mono font-semibold text-slate-500 px-2">Units:</span>
              <button
                onClick={() => setUnitSystem('metric')}
                className={`rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                  isMetric
                    ? 'bg-white text-cyan-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                METRIC (KM)
              </button>
              <button
                onClick={() => setUnitSystem('imperial')}
                className={`rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                  !isMetric
                    ? 'bg-white text-cyan-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                IMPERIAL (MI)
              </button>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-mono font-bold text-white shadow-md hover:bg-cyan-500 transition-all cursor-pointer"
            >
              <span>View Live Tracker</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 6 Quick Telemetry Stat Cards Bar */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-slate-100">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Gauge className="h-3.5 w-3.5 text-cyan-600" />
              <span>Orbital Speed</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-1 truncate">
              {isMetric ? '27,600 km/h' : '17,150 mph'}
            </div>
            <div className="text-[10px] text-cyan-700 font-mono font-semibold">7.66 km/s (Mach 25)</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Compass className="h-3.5 w-3.5 text-blue-600" />
              <span>Inclination</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-1">
              51.64°
            </div>
            <div className="text-[10px] text-blue-700 font-mono font-semibold">Global Groundtrack</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Orbital Period</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-1">
              92.68 min
            </div>
            <div className="text-[10px] text-emerald-700 font-mono font-semibold">15.54 Orbits / Day</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>Mean Altitude</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-1 truncate">
              {isMetric ? '420 km' : '261 miles'}
            </div>
            <div className="text-[10px] text-indigo-700 font-mono font-semibold">Low Earth Orbit</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Solar Power</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-1">
              120 kW
            </div>
            <div className="text-[10px] text-amber-700 font-mono font-semibold">8 SAW + iROSA Arrays</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Box className="h-3.5 w-3.5 text-purple-600" />
              <span>Station Mass</span>
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-1 truncate">
              {isMetric ? '444.6 tonnes' : '980k lbs'}
            </div>
            <div className="text-[10px] text-purple-700 font-mono font-semibold">Largest Orbit Structure</div>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('mechanics')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'mechanics'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <Orbit className="h-4 w-4" />
          <span>1. Orbital Mechanics &amp; Physics</span>
        </button>

        <button
          onClick={() => setActiveTab('subsystems')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'subsystems'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>2. Engineering Subsystems</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'modules'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>3. Module Anatomy (16 Modules)</span>
        </button>

        <button
          onClick={() => setActiveTab('robotics')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'robotics'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <Wrench className="h-4 w-4" />
          <span>4. Robotics &amp; EVA Spacewalks</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>5. Assembly Timeline (1998 – 2030)</span>
        </button>
      </div>

      {/* Tab 1: Orbital Mechanics & Physics */}
      {activeTab === 'mechanics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orbital Inclination 51.6° */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-200">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-mono">51.64° Orbital Inclination</h3>
                  <p className="text-xs text-slate-500 font-mono">Geopolitical &amp; Launch Physics</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The ISS orbits at a precise inclination of <strong>51.64 degrees</strong> relative to Earth&apos;s equatorial plane. This design choice was negotiated to enable direct launch insertions from Russia&apos;s high-latitude Baikonur Cosmodrome (45.9°N) while remaining accessible to NASA launches from Kennedy Space Center (28.5°N).
              </p>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Earth Surface Coverage:</span>
                  <span className="font-bold text-cyan-700">90% of Human Population</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Max North/South Latitude:</span>
                  <span className="font-bold text-slate-800">51.64° N to 51.64° S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ascending Node Drift:</span>
                  <span className="font-bold text-slate-800">~5.0° West per Day</span>
                </div>
              </div>
            </div>

            {/* Orbital Velocity & Period */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 border border-blue-200">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-mono">Keplerian Orbital Velocity</h3>
                  <p className="text-xs text-slate-500 font-mono">7.66 km/s • 92.68 Min Period</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To maintain a stable circular orbit at ~420 km altitude without falling into Earth or escaping into deep space, the ISS travels at <strong>{speed}</strong>. The centrifugal force from this velocity precisely counters Earth&apos;s gravity (g ≈ 8.7 m/s² at altitude).
              </p>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vis-Viva Velocity (v):</span>
                  <span className="font-bold text-blue-700">√(μ / r) ≈ 7,660 m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Earth Orbits / 24h:</span>
                  <span className="font-bold text-slate-800">15.54 Revolutions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Day/Night Cycle:</span>
                  <span className="font-bold text-slate-800">45m Sunlight / 45m Shadow</span>
                </div>
              </div>
            </div>

            {/* Atmospheric Drag & Orbital Reboost */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 border border-rose-200">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-mono">Drag Decay &amp; Reboost</h3>
                  <p className="text-xs text-slate-500 font-mono">Thermospheric Friction Management</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Even at 420 km, trace neutral atoms in the thermosphere generate drag (F_drag = 0.5 · ρ · v² · C_D · A), decaying the orbit by ~1.5 to 2.5 km per month. Docked Progress and Cygnus cargo freighters conduct periodic Delta-V reboost burns.
              </p>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Annual Propellant:</span>
                  <span className="font-bold text-rose-700">~3,500 – 4,000 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Debris Maneuver (DAM):</span>
                  <span className="font-bold text-slate-800">&gt;35 Performed to Date</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Solar Max Altitude:</span>
                  <span className="font-bold text-slate-800">Maintained above 410 km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Foundations & Deep Specs Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-mono text-slate-900 flex items-center gap-2">
              <Atom className="h-5 w-5 text-cyan-600" />
              Orbital Mechanics Formulas &amp; Physical Constants
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 rounded-2xl bg-slate-50 p-5 border border-slate-200">
                <h4 className="text-sm font-bold font-mono text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-600 text-white text-xs">1</span>
                  Orbital Period Formula (Kepler&apos;s Third Law)
                </h4>
                <div className="rounded-xl bg-white p-3 font-mono text-xs text-cyan-800 border border-slate-200 shadow-2xs font-semibold">
                  T = 2π √( r³ / GM_earth ) = 2π √((R_earth + h)³ / μ)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Where R_earth = 6,371 km, h = 420 km, giving orbital radius r = 6,791 km. With Earth gravitational parameter μ = 3.986004418 × 10¹⁴ m³/s², the computed period T ≈ 5,561 seconds = 92.68 minutes.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-5 border border-slate-200">
                <h4 className="text-sm font-bold font-mono text-slate-900 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-600 text-white text-xs">2</span>
                  Line-of-Sight Footprint Horizon Radius
                </h4>
                <div className="rounded-xl bg-white p-3 font-mono text-xs text-cyan-800 border border-slate-200 shadow-2xs font-semibold">
                  d_horizon = R_earth × arccos( R_earth / (R_earth + h) ) ≈ 2,280 km
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  From 420 km altitude, astronauts aboard the Cupola view an Earth circular horizon disc radius of ~2,280 km (~1,416 miles), creating a visual communication line-of-sight footprint diameter of approximately ~4,560 km.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Engineering Subsystems */}
      {activeTab === 'subsystems' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ECLSS Life Support */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-mono">ECLSS Life Support System</h3>
                <p className="text-xs text-slate-500 font-mono">Atmosphere &amp; 98% Water Closed Loop</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The Environmental Control and Life Support System (ECLSS) maintains a sea-level 101.3 kPa (14.7 psi) Earth atmosphere (78% N₂, 21% O₂). Key subsystems include:
            </p>

            <ul className="space-y-2 text-xs text-slate-700 font-mono">
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Oxygen Generation System (OGS):</strong> Electrolyzes recycled water (2H₂O → 2H₂ + O₂) generating up to 9.2 kg of breathable oxygen per day.
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Carbon Dioxide Removal (CDRA) &amp; Sabatier:</strong> Scrubbed CO₂ is combined with hydrogen (CO₂ + 4H₂ → CH₄ + 2H₂O), producing water and venting methane.
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Water Recovery System (WRS):</strong> Urine Processor Assembly (UPA) and Water Processor Assembly (WPA) recycle ~98% of crew urine, sweat, and condensation into ultra-pure water.
                </div>
              </li>
            </ul>
          </div>


          {/* Electrical Power System (EPS) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 border border-amber-200">
                <BatteryCharging className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-mono">Electrical Power Architecture</h3>
                <p className="text-xs text-slate-500 font-mono">120 kW • Solar Arrays &amp; Lithium-Ion Batteries</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Eight primary Solar Array Wings (SAWs) plus roll-out iROSA arrays span <strong>{solarArea}</strong>. The Solar Alpha Rotary Joints (SARJ) rotate 360° continuously to keep photovoltaic panels aligned with the sun.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 font-mono">
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <Zap className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Primary Bus (160V DC):</strong> Unregulated solar power is transmitted at 160V DC to minimize cable mass, then stepped down by DC-to-DC Converter Units (DDCUs) to 124V DC.
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <Zap className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Li-Ion Battery Storage:</strong> Upgraded from Ni-H2 to 24 Lithium-Ion Battery Orbital Replacement Units (ORUs) powering the entire station during 35-minute eclipse passes.
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <Zap className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>iROSA Upgrades:</strong> Roll-Out Solar Arrays installed on existing wings increase total station power output by ~30% for advanced commercial payload racks.
                </div>
              </li>
            </ul>
          </div>

          {/* Active Thermal Control (ATCS) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 border border-sky-200">
                <Thermometer className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-mono">Active Thermal Control (ATCS)</h3>
                <p className="text-xs text-slate-500 font-mono">Water Cabins &amp; Liquid Ammonia Radiators</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In space, temperatures oscillate between +121°C (+250°F) in sunlight to -157°C (-250°F) in shadow. The dual-loop Active Thermal Control System rejects heat from avionics and human metabolic output into deep space.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 font-mono">
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <Wind className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Internal Water Loop (IATCS):</strong> Circulates non-toxic distilled water inside pressurized modules to collect rack heat.
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <Wind className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>External Ammonia Loop (EATCS):</strong> Liquid anhydrous ammonia transfers heat to 3 giant radiator panels on the S1 and P1 trusses, radiating thermal energy into the 3 Kelvin cosmic background.
                </div>
              </li>
            </ul>
          </div>

          {/* Guidance, Navigation & Control (GNC) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-mono">GNC &amp; Gyroscopes (CMGs)</h3>
                <p className="text-xs text-slate-500 font-mono">Zero-Propellant Momentum Attitude Control</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Station orientation in 3D space is primarily governed by four large <strong>Control Moment Gyroscopes (CMGs)</strong> mounted on the Z1 truss, each spinning at 6,600 RPM.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 font-mono">
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <Compass className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Non-Propulsive Steering:</strong> Gimbaling the CMG rotor axes generates gyroscopic torque to steer the 445-tonne station without expending valuable hydrazine propellant.
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                <Compass className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Momentum Desaturation:</strong> When CMGs reach momentum saturation, Russian thrusters or magnetic torquers pulse to desaturate the gyroscopes.
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Module Anatomy */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono text-slate-600">
            <strong>Architecture Summary:</strong> The ISS consists of 16 pressurized modules spanning <strong>{pressVol}</strong> across the US, European (ESA), Japanese (JAXA), Russian (Roscosmos), and Commercial space sectors.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Zarya (FGB)',
                agency: 'Roscosmos / NASA',
                launched: 'Nov 20, 1998',
                type: 'Functional Cargo Block',
                desc: 'First ISS module launched. Provided initial propulsion, electrical power, and orientation control during early station assembly.',
                tag: 'Foundation Core',
              },
              {
                name: 'Unity (Node 1)',
                agency: 'NASA',
                launched: 'Dec 4, 1998',
                type: 'Connecting Node',
                desc: 'First US-built component. Features 6 Common Berthing Mechanism (CBM) ports connecting the Russian segment to US modules.',
                tag: 'Central Nexus',
              },
              {
                name: 'Zvezda (Service Module)',
                agency: 'Roscosmos',
                launched: 'Jul 12, 2000',
                type: 'Habitation & Propulsion',
                desc: 'The structural and functional centerpiece of the Russian segment. Houses the station primary altitude thrusters and early crew quarters.',
                tag: 'Russian Core',
              },
              {
                name: 'Destiny Laboratory',
                agency: 'NASA',
                launched: 'Feb 7, 2001',
                type: 'Research Facility',
                desc: 'Primary US microgravity research laboratory. Features 24 standard payload racks supporting biotechnology, fluid physics, and combustion.',
                tag: 'US Science Hub',
              },
              {
                name: 'Quest Joint Airlock',
                agency: 'NASA',
                launched: 'Jul 12, 2001',
                type: 'EVA Airlock',
                desc: 'Primary airlock for spacewalks using both US Extravehicular Mobility Units (EMU) and Russian Orlan spacesuits.',
                tag: 'Spacewalk Portal',
              },
              {
                name: 'Harmony (Node 2)',
                agency: 'ESA / NASA',
                launched: 'Oct 23, 2007',
                type: 'Utility & Berthing Hub',
                desc: 'Central utility hub connecting the US Destiny Lab, European Columbus, and Japanese Kibo modules. Features IDA docking ports for Crew Dragon.',
                tag: 'Docking Port',
              },
              {
                name: 'Columbus Laboratory',
                agency: 'ESA (Europe)',
                launched: 'Feb 7, 2008',
                type: 'Research Facility',
                desc: 'Europe premier microgravity laboratory. Supports fluid science, physiology, and biology with external exposure platforms.',
                tag: 'ESA Laboratory',
              },
              {
                name: 'Kibo (JEM)',
                agency: 'JAXA (Japan)',
                launched: '2008 – 2009',
                type: 'Laboratory & Airlock',
                desc: 'Largest single ISS module. Includes a pressurized laboratory, an Exposed Facility (EF) scientific porch, and its own dedicated robotic arm.',
                tag: 'JAXA Mega-Module',
              },
              {
                name: 'Tranquility (Node 3)',
                agency: 'ESA / NASA',
                launched: 'Feb 8, 2010',
                type: 'Life Support & Gym',
                desc: 'Houses advanced ECLSS air revitalization and water recycling systems, the Waste & Hygiene Compartment, and the ARED exercise equipment.',
                tag: 'ECLSS Hub',
              },
              {
                name: 'Cupola',
                agency: 'ESA / NASA',
                launched: 'Feb 8, 2010',
                type: 'Observation Dome',
                desc: 'Seven-window observation module offering 360-degree panoramic views of Earth and incoming visiting spacecraft during robotic capture.',
                tag: 'Observation Deck',
              },
              {
                name: 'Poisk (MRM-2)',
                agency: 'Roscosmos',
                launched: 'Nov 10, 2009',
                type: 'Research & EVA Airlock',
                desc: 'Multi-purpose Russian research module and Soyuz/Progress docking port, also utilized for Russian spacewalk egress.',
                tag: 'Docking & Science',
              },
              {
                name: 'Rassvet (MRM-1)',
                agency: 'Roscosmos / NASA',
                launched: 'May 14, 2010',
                type: 'Cargo & Docking',
                desc: 'Delivered by Space Shuttle Atlantis (STS-132). Provides cargo storage and nadir docking for Russian Soyuz spacecraft.',
                tag: 'Cargo & Docking',
              },
              {
                name: 'Leonardo (PMM)',
                agency: 'ASI / NASA',
                launched: 'Feb 24, 2011',
                type: 'Permanent Multi-Purpose',
                desc: 'Converted Multi-Purpose Logistics Module permanently attached to Node 1 for excess payload rack storage and spare equipment.',
                tag: 'Logistics Storage',
              },
              {
                name: 'BEAM (Bigelow Expandable)',
                agency: 'Commercial / NASA',
                launched: 'Apr 8, 2016',
                type: 'Inflatable Habitat',
                desc: 'First expandable habitat tested on orbit. Provides thermal insulation and radiation shielding demonstration data.',
                tag: 'Inflatable Tech',
              },
              {
                name: 'Bishop Airlock',
                agency: 'Nanoracks / Commercial',
                launched: 'Dec 6, 2020',
                type: 'Commercial Airlock',
                desc: 'First commercial airlock attached to the ISS. Five times larger than Quest, deployed for CubeSat launches and external payload transfers.',
                tag: 'Commercial Gateway',
              },
              {
                name: 'Nauka (MLM-U)',
                agency: 'Roscosmos',
                launched: 'Jul 21, 2021',
                type: 'Multipurpose Laboratory',
                desc: 'Major Russian research laboratory equipped with crew quarters, life support, and the European Robotic Arm (ERA).',
                tag: 'Russian Science Lab',
              },
            ].map((mod, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-cyan-300 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {mod.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{mod.launched}</span>
                  </div>
                  <h4 className="text-sm font-bold font-mono text-slate-900">{mod.name}</h4>
                  <div className="text-[11px] font-mono font-semibold text-slate-500">{mod.agency} • {mod.type}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Robotics & EVA Spacewalks */}
      {activeTab === 'robotics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Canadarm2 & Dextre */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-200">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-mono">Canadarm2 (SSRMS) &amp; Dextre</h3>
                  <p className="text-xs text-slate-500 font-mono">Canadian Space Agency (CSA)</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Space Station Remote Manipulator System (Canadarm2) is a 17.6-meter (57.7 ft) robotic arm with 7 motorized joints capable of moving up to 116,000 kg (255,000 lbs) payloads.
              </p>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs font-mono text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Degree of Freedom:</span>
                  <span className="font-bold text-slate-800">7 Rotational Joints</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">End Effectors (LEE):</span>
                  <span className="font-bold text-cyan-700">Can inchworm across PDGF pins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dextre (SPDM):</span>
                  <span className="font-bold text-slate-800">Two-armed dexterous handyman</span>
                </div>
              </div>
            </div>

            {/* EVA Spacewalk Operations */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 border border-blue-200">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-mono">Extravehicular Activity (EVA)</h3>
                  <p className="text-xs text-slate-500 font-mono">Spacesuit Systems &amp; Prebreathe Protocol</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Over 270+ spacewalks totaling over 1,700 hours have been conducted for station assembly and maintenance. Astronauts operate at 29.6 kPa (4.3 psi) inside US Extravehicular Mobility Units (EMUs).
              </p>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs font-mono text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Prebreathe Protocol:</span>
                  <span className="font-bold text-blue-700">100% O₂ purge to prevent the bends</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Average EVA Duration:</span>
                  <span className="font-bold text-slate-800">6.5 to 8.0 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SAFER Jetpack:</span>
                  <span className="font-bold text-slate-800">Cold-gas emergency tether rescue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Milestone Timeline */}
      {activeTab === 'timeline' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-mono text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              Chronological Station Evolution &amp; Future De-orbit Plan
            </h3>
            <p className="text-xs text-slate-500 font-mono">1998 to 2030 Mission Lifecycle</p>
          </div>

          <div className="relative border-l-2 border-cyan-200 ml-4 space-y-8 pl-6">
            {[
              {
                year: 'Nov 1998',
                title: 'First Component (Zarya Launch)',
                desc: 'Russian Proton rocket launches the Zarya FGB module from Baikonur, marking the official birth of the International Space Station program.',
              },
              {
                year: 'Dec 1998',
                title: 'Unity Node 1 Mated (STS-88)',
                desc: 'Space Shuttle Endeavour captures Zarya and connects Node 1 Unity, establishing the first physical international link in orbit.',
              },
              {
                year: 'Nov 2000',
                title: 'Expedition 1 Permanent Human Habitation',
                desc: 'Astronaut Bill Shepherd (NASA) and Cosmonauts Yuri Gidzenko and Sergei Krikalev board the station, beginning 25+ years of uninterrupted human spaceflight.',
              },
              {
                year: '2001 – 2007',
                title: 'Truss Backbone & US Destiny Lab',
                desc: 'Destiny Laboratory, Quest Airlock, and the 109-meter Integrated Truss Structure (P1 through S6) are installed with massive solar arrays.',
              },
              {
                year: '2008 – 2010',
                title: 'European Columbus & Japanese Kibo Labs',
                desc: 'ESA Columbus lab and JAXA Kibo mega-module are installed. Cupola observation module opens its seven windows in 2010.',
              },
              {
                year: '2011',
                title: 'Assembly Complete & AMS-02 Detector',
                desc: 'Final Space Shuttle flights deliver the Alpha Magnetic Spectrometer (AMS-02) particle physics detector. Core assembly officially completed.',
              },
              {
                year: '2020 – 2021',
                title: 'Commercial Crew & Nauka MLM Arrival',
                desc: 'SpaceX Crew Dragon begins operational NASA commercial astronaut flights. Russian Nauka laboratory module docks after 15 years in development.',
              },
              {
                year: '2026 (Present)',
                title: 'iROSA Upgrades & Continuous Research',
                desc: 'Roll-Out Solar Arrays deployed. Active multi-agency crew conducts over 3,000 active scientific investigations in quantum physics, oncology, and deep space exploration.',
              },
              {
                year: '2030 – 2031 (Target)',
                title: 'Transition to Commercial Stations & Safe De-orbit',
                desc: 'NASA plans safe controlled atmospheric re-entry using a specialized US Deorbit Vehicle (USDDV), targeting the uninhabited South Pacific Ocean (Point Nemo) as commercial space stations take over Low Earth Orbit research.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-cyan-500 group-hover:bg-cyan-500 transition-colors shadow-xs" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-lg border border-cyan-300">
                    {item.year}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 font-mono">{item.title}</h4>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
