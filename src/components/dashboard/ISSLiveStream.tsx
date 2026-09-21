'use client';

import React, { useState } from 'react';
import { Tv, X, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function ISSLiveStream() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-start md:items-end">
      {/* Trigger Button (Right side of Tracker Title) */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-rose-50/60 px-3.5 py-2.5 shadow-sm hover:shadow-md hover:border-rose-400 transition-all duration-300 cursor-pointer text-left"
        >
          {/* Pulsing red live indicator */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-600"></span>
          </span>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700">
                Live Space Camera
              </span>
              <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-mono font-black text-white uppercase tracking-widest shadow-xs">
                LIVE
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Watch Live Earth Views
            </span>
          </div>

          <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm group-hover:scale-105 group-hover:bg-rose-700 transition-transform">
            <Tv className="h-4 w-4" />
          </div>
        </button>
      ) : (
        /* Expanded Live Stream Player Card */
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all animate-in fade-in zoom-in-95 duration-300">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600"></span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-800">
                ISS HD Earth Live Stream
              </span>
              <Badge variant="rose" size="sm" className="font-mono text-[10px]">
                NASA HDEV
              </Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize stream"
                className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Embedded Video Player */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/awQzjn72bI0?autoplay=1&si=tNl1b9mTjSUzAHTG"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          {/* Player Footer & Status */}
          <div className="flex items-center justify-between bg-white px-4 py-2 text-[11px] font-mono text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Radio className="h-3 w-3 text-rose-600" />
              <span>Direct downlink from ISS external cameras</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Hide Live Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
