'use client';

import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import { formatTimeOnlyUTC } from '@/lib/utils';

export function UtcClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(formatTimeOnlyUTC());
    const timer = setInterval(() => {
      setTime(formatTimeOnlyUTC());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 px-2.5 py-1.5 font-mono text-xs text-slate-700 shadow-2xs">
      <Radio className="h-3 w-3 text-cyan-500 animate-pulse" />
      <span className="text-[10px] font-bold text-slate-400">UTC</span>
      <span className="font-bold text-cyan-700 tracking-wider">
        {time || '00:00:00'}
      </span>
    </div>
  );
}
