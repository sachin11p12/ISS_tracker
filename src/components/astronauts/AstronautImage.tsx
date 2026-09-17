'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AstronautImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  iconClassName?: string;
}

export function AstronautImage({
  src,
  alt,
  className = 'h-full w-full object-cover object-top',
  fallbackClassName = 'flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-400 dark:from-slate-900 dark:to-slate-950 dark:text-slate-600',
  iconClassName = 'h-20 w-20 stroke-[1.2]',
}: AstronautImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If image URL is remote (like wikimedia), route through our image proxy
  const resolvedSrc = src
    ? src.startsWith('http')
      ? `/api/image-proxy?url=${encodeURIComponent(src)}`
      : src
    : undefined;

  // If no src or error loading
  if (!resolvedSrc || hasError) {
    const initials = alt
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div className={fallbackClassName}>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800 text-2xl font-bold font-mono border border-cyan-300 shadow-xs dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800">
            {initials || <User className={iconClassName} />}
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">Flight Crew</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedSrc}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="eager"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 animate-pulse">
          <User className="h-12 w-12 text-slate-400 dark:text-slate-600" />
        </div>
      )}
    </div>
  );
}
