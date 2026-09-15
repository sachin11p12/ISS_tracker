'use client';

import dynamic from 'next/dynamic';
import { RadarLoader } from '@/components/ui/Loading';

const ISSMap = dynamic(() => import('@/components/dashboard/ISSMap'), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-[480px] w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl md:h-[580px] lg:h-[640px]">
      <RadarLoader message="Initializing Leaflet Earth Projection Engine..." />
    </div>
  ),
});

export function ISSMapWrapper() {
  return <ISSMap />;
}
