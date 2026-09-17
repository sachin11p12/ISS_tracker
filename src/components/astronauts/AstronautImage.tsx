'use client';

import React, { useState } from 'react';
import { User, Sparkles } from 'lucide-react';

interface AstronautImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  iconClassName?: string;
  priority?: boolean;
}

export function AstronautImage({
  src,
  alt,
  className = 'h-full w-full object-cover object-top',
  fallbackClassName = 'flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-400 dark:from-slate-900 dark:to-slate-950 dark:text-slate-600',
  iconClassName = 'h-20 w-20 stroke-[1.2]',
}: AstronautImageProps) {
  const [imgStage, setImgStage] = useState<'primary' | 'proxy' | 'local' | 'fallback'>('primary');

  const slug = alt.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const localSrc = `/images/astronauts/${slug}.svg`;

  // Determine current source based on fallback stage
  let currentSrc: string | undefined;
  if (imgStage === 'primary' && src) {
    currentSrc = src;
  } else if (imgStage === 'proxy' && src && src.startsWith('http')) {
    currentSrc = `/api/image-proxy?url=${encodeURIComponent(src)}`;
  } else if (imgStage === 'local' || (imgStage === 'primary' && !src)) {
    currentSrc = localSrc;
  }

  const handleError = () => {
    if (imgStage === 'primary' && src?.startsWith('http')) {
      // Try proxy next
      setImgStage('proxy');
    } else if (imgStage === 'proxy' || (imgStage === 'primary' && !src?.startsWith('http'))) {
      // Try local image next
      setImgStage('local');
    } else {
      // Final fallback to stylized card
      setImgStage('fallback');
    }
  };

  if (imgStage === 'fallback' || !currentSrc) {
    const initials = alt
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div className={fallbackClassName}>
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-tr from-cyan-500/20 to-blue-600/20 text-cyan-600 text-3xl font-black font-mono border-2 border-cyan-400/40 shadow-lg dark:text-cyan-300 dark:border-cyan-500/40 backdrop-blur-xs">
            {initials || <User className={iconClassName} />}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-mono font-bold dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            <Sparkles className="h-3 w-3" />
            <span>Active Astronaut</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`${alt}-${imgStage}`}
        src={currentSrc}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        loading="eager"
        onError={handleError}
      />
    </div>
  );
}

