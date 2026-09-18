'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useISSStore } from '@/store/issStore';
import { formatCoordinates, formatSpeed, formatAltitude, formatFootprint } from '@/lib/utils';
import { RotateCw, Compass, Crosshair, ZoomIn, ZoomOut, Layers, Eye, Play, Pause, Radio } from 'lucide-react';
import { WORLD_CONTINENTS } from '@/lib/globeLandData';

export default function ISSGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Globe orientation (yaw = longitude rotation, pitch = latitude tilt)
  const rotationRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0 });
  const zoomRef = useRef<number>(1);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const autoRotateRef = useRef<boolean>(true);
  const isAutoCenteringRef = useRef<boolean>(false);

  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showOrbit, setShowOrbit] = useState<boolean>(true);
  const [showGraticule, setShowGraticule] = useState<boolean>(true);
  const [showDayNight, setShowDayNight] = useState<boolean>(true);

  const {
    telemetry,
    trail,
    locationDetails,
    unitSystem,
    isLive,
    showFootprint,
    setShowFootprint,
  } = useISSStore();

  // Smoothly center on ISS
  const centerOnISS = useCallback(() => {
    if (!telemetry) return;
    isAutoCenteringRef.current = true;
    autoRotateRef.current = false;
    setAutoRotate(false);

    // Target yaw and pitch to bring (lat, lng) to the center
    const targetYaw = -telemetry.longitude * (Math.PI / 180) + Math.PI / 2;
    const targetPitch = telemetry.latitude * (Math.PI / 180);

    const startYaw = rotationRef.current.yaw;
    const startPitch = rotationRef.current.pitch;
    const startTime = performance.now();
    const duration = 800; // ms

    const animateCenter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      rotationRef.current.yaw = startYaw + (targetYaw - startYaw) * ease;
      rotationRef.current.pitch = startPitch + (targetPitch - startPitch) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateCenter);
      } else {
        isAutoCenteringRef.current = false;
      }
    };

    requestAnimationFrame(animateCenter);
  }, [telemetry]);

  // Handle user drag interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      autoRotateRef.current = false;
      setAutoRotate(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;

      const sensitivity = 0.005 / zoomRef.current;
      rotationRef.current.yaw += dx * sensitivity;
      rotationRef.current.pitch = Math.max(
        -Math.PI / 2 + 0.05,
        Math.min(Math.PI / 2 - 0.05, rotationRef.current.pitch + dy * sensitivity)
      );

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      zoomRef.current = Math.max(0.6, Math.min(3.5, zoomRef.current * zoomFactor));
    };

    // Touch events for mobile/tablet
    let lastTouchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        autoRotateRef.current = false;
        setAutoRotate(false);
      } else if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - lastMousePosRef.current.x;
        const dy = e.touches[0].clientY - lastMousePosRef.current.y;
        const sensitivity = 0.006 / zoomRef.current;

        rotationRef.current.yaw += dx * sensitivity;
        rotationRef.current.pitch = Math.max(
          -Math.PI / 2 + 0.05,
          Math.min(Math.PI / 2 - 0.05, rotationRef.current.pitch + dy * sensitivity)
        );

        lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (lastTouchDist > 0) {
          const factor = dist / lastTouchDist;
          zoomRef.current = Math.max(0.6, Math.min(3.5, zoomRef.current * factor));
        }
        lastTouchDist = dist;
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      lastTouchDist = 0;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);

      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Set initial orientation on ISS load
  useEffect(() => {
    if (telemetry && rotationRef.current.yaw === 0 && rotationRef.current.pitch === 0) {
      rotationRef.current.yaw = -telemetry.longitude * (Math.PI / 180) + Math.PI / 2;
      rotationRef.current.pitch = telemetry.latitude * (Math.PI / 180) * 0.5;
    }
  }, [telemetry]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    // Projection mathematics from (lat, lng) to 3D Sphere & 2D Screen
    const project = (latDeg: number, lngDeg: number, altitudeRadiusRatio: number = 1.0) => {
      const lat = latDeg * (Math.PI / 180);
      const lng = lngDeg * (Math.PI / 180);

      // 3D Cartesian on unit sphere
      const x0 = Math.cos(lat) * Math.sin(lng);
      const y0 = Math.sin(lat);
      const z0 = Math.cos(lat) * Math.cos(lng);

      // Apply Yaw (around Y axis)
      const cosYaw = Math.cos(rotationRef.current.yaw);
      const sinYaw = Math.sin(rotationRef.current.yaw);
      const x1 = x0 * cosYaw + z0 * sinYaw;
      const y1 = y0;
      const z1 = -x0 * sinYaw + z0 * cosYaw;

      // Apply Pitch (around X axis)
      const cosPitch = Math.cos(rotationRef.current.pitch);
      const sinPitch = Math.sin(rotationRef.current.pitch);
      const x2 = x1;
      const y2 = y1 * cosPitch - z1 * sinPitch;
      const z2 = y1 * sinPitch + z1 * cosPitch;

      const width = canvas.width;
      const height = canvas.height;
      const baseRadius = (Math.min(width, height) / 2) * 0.72 * zoomRef.current;
      const R = baseRadius * altitudeRadiusRatio;

      const screenX = width / 2 + x2 * R;
      const screenY = height / 2 - y2 * R;
      const isVisible = z2 > 0; // On front hemisphere

      return { screenX, screenY, isVisible, z: z2, R: baseRadius };
    };

    const render = () => {
      if (!isRunning) return;

      // Handle Resize / High DPI
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = (Math.min(width, height) / 2) * 0.72 * zoomRef.current;

      // Clear Canvas & draw clean light space gradient
      ctx.clearRect(0, 0, width, height);

      // Deep space subtle background gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius * 2.2);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(0.5, '#f1f5f9');
      bgGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Auto-rotation increment
      if (autoRotateRef.current && !isDraggingRef.current && !isAutoCenteringRef.current) {
        rotationRef.current.yaw += 0.0015;
      }

      // Outer Atmosphere Glow
      const atmoGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.95, centerX, centerY, radius * 1.15);
      atmoGlow.addColorStop(0, 'rgba(14, 165, 233, 0.35)');
      atmoGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.12)');
      atmoGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = atmoGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Earth Ocean Sphere Base
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip(); // Clip to globe circle

      // Ocean 3D spherical gradient shading
      const oceanGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      oceanGrad.addColorStop(0, '#38bdf8');
      oceanGrad.addColorStop(0.4, '#0284c7');
      oceanGrad.addColorStop(0.85, '#0369a1');
      oceanGrad.addColorStop(1, '#075985');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Graticule Lines (Latitude & Longitude Grid)
      if (showGraticule) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.75;

        // Longitude meridians
        for (let lng = -180; lng < 180; lng += 30) {
          ctx.beginPath();
          let first = true;
          for (let lat = -90; lat <= 90; lat += 3) {
            const p = project(lat, lng);
            if (p.isVisible) {
              if (first) {
                ctx.moveTo(p.screenX / dpr, p.screenY / dpr);
                first = false;
              } else {
                ctx.lineTo(p.screenX / dpr, p.screenY / dpr);
              }
            } else {
              first = true;
            }
          }
          ctx.stroke();
        }

        // Latitude parallels
        for (let lat = -75; lat <= 75; lat += 15) {
          ctx.beginPath();
          let first = true;
          for (let lng = -180; lng <= 180; lng += 3) {
            const p = project(lat, lng);
            if (p.isVisible) {
              if (first) {
                ctx.moveTo(p.screenX / dpr, p.screenY / dpr);
                first = false;
              } else {
                ctx.lineTo(p.screenX / dpr, p.screenY / dpr);
              }
            } else {
              first = true;
            }
          }
          if (lat === 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; // Equator highlight
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 0.75;
          } else {
            ctx.stroke();
          }
        }
      }

      // Draw World Continents & Landmass Polygons
      ctx.fillStyle = '#22c55e'; // Vibrant terrestrial green
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 0.5;

      WORLD_CONTINENTS.forEach((polygon) => {
        ctx.beginPath();
        let first = true;
        let anyVisible = false;

        for (let i = 0; i < polygon.length; i++) {
          const [lng, lat] = polygon[i];
          const p = project(lat, lng);
          if (p.isVisible) {
            anyVisible = true;
            if (first) {
              ctx.moveTo(p.screenX / dpr, p.screenY / dpr);
              first = false;
            } else {
              ctx.lineTo(p.screenX / dpr, p.screenY / dpr);
            }
          } else {
            first = true;
          }
        }

        if (anyVisible) {
          ctx.fillStyle = '#86efac';
          ctx.fill();
          ctx.strokeStyle = '#16a34a';
          ctx.stroke();
        }
      });

      // Day / Night Terminator Shading (from solar coords)
      if (showDayNight && telemetry && telemetry.solar_lat !== undefined) {
        const sunLat = telemetry.solar_lat * (Math.PI / 180);
        const sunLng = telemetry.solar_lon * (Math.PI / 180);

        // Sun 3D Vector
        const sx0 = Math.cos(sunLat) * Math.sin(sunLng);
        const sy0 = Math.sin(sunLat);
        const sz0 = Math.cos(sunLat) * Math.cos(sunLng);

        const cosYaw = Math.cos(rotationRef.current.yaw);
        const sinYaw = Math.sin(rotationRef.current.yaw);
        const sx1 = sx0 * cosYaw + sz0 * sinYaw;
        const sy1 = sy0;
        const sz1 = -sx0 * sinYaw + sz0 * cosYaw;

        const cosPitch = Math.cos(rotationRef.current.pitch);
        const sinPitch = Math.sin(rotationRef.current.pitch);
        const sx = sx1;
        const sy = sy1 * cosPitch - sz1 * sinPitch;

        // Shadow gradient covering nighttime hemisphere
        const nightGrad = ctx.createRadialGradient(
          centerX - sx * radius * 0.8,
          centerY + sy * radius * 0.8,
          radius * 0.2,
          centerX - sx * radius * 0.8,
          centerY + sy * radius * 0.8,
          radius * 1.8
        );
        nightGrad.addColorStop(0, 'rgba(15, 23, 42, 0.7)');
        nightGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.4)');
        nightGrad.addColorStop(0.8, 'rgba(15, 23, 42, 0.05)');
        nightGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = nightGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Orbit Trail on Globe Surface
      if (trail && trail.length > 1) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        let first = true;
        trail.forEach((pt) => {
          const p = project(pt.lat, pt.lng);
          if (p.isVisible) {
            if (first) {
              ctx.moveTo(p.screenX / dpr, p.screenY / dpr);
              first = false;
            } else {
              ctx.lineTo(p.screenX / dpr, p.screenY / dpr);
            }
          } else {
            first = true;
          }
        });
        ctx.stroke();
      }

      // Draw ISS Ground Footprint Circle on Sphere
      if (showFootprint && telemetry) {
        const footRadiusDeg = (telemetry.footprint / 111) * 0.5; // Approx degree radius
        ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        let first = true;
        for (let angle = 0; angle <= 360; angle += 10) {
          const rad = angle * (Math.PI / 180);
          const fLat = telemetry.latitude + Math.sin(rad) * footRadiusDeg;
          const fLng = telemetry.longitude + (Math.cos(rad) * footRadiusDeg) / Math.cos(telemetry.latitude * (Math.PI / 180));
          const p = project(fLat, fLng);
          if (p.isVisible) {
            if (first) {
              ctx.moveTo(p.screenX / dpr, p.screenY / dpr);
              first = false;
            } else {
              ctx.lineTo(p.screenX / dpr, p.screenY / dpr);
            }
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore(); // End globe clip

      // Globe Rim Edge Border
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 3D Inclined Keplerian Orbit Ring (51.64° inclination)
      if (showOrbit && telemetry) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();

        const orbitAltitudeRatio = 1.15; // Raised orbit altitude ring
        const inclination = 51.64 * (Math.PI / 180);

        for (let u = 0; u <= 360; u += 3) {
          const uRad = u * (Math.PI / 180);
          // Parametric orbit in plane
          const xOrb = Math.cos(uRad);
          const yOrb = Math.sin(uRad) * Math.sin(inclination);
          const zOrb = Math.sin(uRad) * Math.cos(inclination);

          // Convert back to lat/lng
          const latDeg = Math.asin(yOrb) * (180 / Math.PI);
          const lngDeg = Math.atan2(xOrb, zOrb) * (180 / Math.PI) + telemetry.longitude;

          const p = project(latDeg, lngDeg, orbitAltitudeRatio);
          if (u === 0) {
            ctx.moveTo(p.screenX / dpr, p.screenY / dpr);
          } else {
            ctx.lineTo(p.screenX / dpr, p.screenY / dpr);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw ISS Satellite in 3D Space (Floating above Earth)
      if (telemetry) {
        const issGround = project(telemetry.latitude, telemetry.longitude, 1.0);
        const issElevated = project(telemetry.latitude, telemetry.longitude, 1.15); // Floating in orbit

        if (issElevated.isVisible || issGround.isVisible) {
          const gx = issGround.screenX / dpr;
          const gy = issGround.screenY / dpr;
          const ex = issElevated.screenX / dpr;
          const ey = issElevated.screenY / dpr;

          // Vertical altitude stalk from ground to satellite
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(gx, gy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.setLineDash([]);

          // Ground target dot
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Pulsing Satellite Marker Beacon
          const timeSec = performance.now() / 1000;
          const pulse = (Math.sin(timeSec * 4) + 1) / 2; // 0 to 1

          // Outer Radar Ring
          ctx.strokeStyle = `rgba(14, 165, 233, ${0.8 - pulse * 0.6})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ex, ey, 14 + pulse * 12, 0, Math.PI * 2);
          ctx.stroke();

          // Satellite Core Badge
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(ex, ey, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Mini solar array graphic inside marker
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(ex - 7, ey - 2, 4, 4);
          ctx.fillRect(ex + 3, ey - 2, 4, 4);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex, ey, 2, 0, Math.PI * 2);
          ctx.fill();

          // Satellite Label Tag
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          const tagText = 'ISS (ZARYA-25544)';
          ctx.font = 'bold 11px monospace';
          const textWidth = ctx.measureText(tagText).width;

          const tagX = ex + 14;
          const tagY = ey - 10;
          ctx.beginPath();
          ctx.roundRect(tagX, tagY, textWidth + 12, 22, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.fillText(tagText, tagX + 6, tagY + 15);
        }
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [telemetry, trail, showFootprint, showOrbit, showGraticule, showDayNight]);

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-md md:h-[580px] lg:h-[640px]">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing touch-none select-none"
      />

      {/* Floating Control Badges (Top Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 font-mono text-xs font-semibold text-slate-800 backdrop-blur-md border border-slate-200 shadow-sm">
          <Radio className="h-3.5 w-3.5 text-cyan-600 animate-pulse" />
          <span>3D ORBITAL GLOBE</span>
          <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] text-cyan-800 font-bold border border-cyan-300">
            60 FPS
          </span>
        </div>

        {telemetry && (
          <div className="hidden sm:block rounded-xl bg-white/90 p-2.5 font-mono text-xs text-slate-700 backdrop-blur-md border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Position:</span>
              <span className="font-bold text-slate-900">{formatCoordinates(telemetry.latitude, telemetry.longitude)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Altitude:</span>
              <span className="font-bold text-cyan-700">{formatAltitude(telemetry.altitude, unitSystem)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Velocity:</span>
              <span className="font-bold text-slate-900">{formatSpeed(telemetry.velocity, unitSystem)}</span>
            </div>
            {locationDetails && (
              <div className="flex justify-between gap-4 pt-1 border-t border-slate-100">
                <span className="text-slate-400">Over:</span>
                <span className="font-bold text-emerald-700 truncate max-w-[140px]">
                  {locationDetails.country || locationDetails.waterBodyName || 'Orbit'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Interactive Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        {/* Auto-Rotate Toggle */}
        <button
          onClick={() => {
            const next = !autoRotate;
            setAutoRotate(next);
            autoRotateRef.current = next;
          }}
          title={autoRotate ? 'Pause Globe Auto-Rotation' : 'Resume Globe Auto-Rotation'}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 px-3 py-1.5 font-mono text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md hover:bg-slate-100 transition-all cursor-pointer"
        >
          {autoRotate ? (
            <>
              <Pause className="h-3.5 w-3.5 text-cyan-600" />
              <span>Rotate: ON</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 text-slate-400" />
              <span>Rotate: OFF</span>
            </>
          )}
        </button>

        {/* Center on ISS Button */}
        <button
          onClick={centerOnISS}
          title="Center view on ISS position"
          className="flex items-center gap-1.5 rounded-xl border border-cyan-300 bg-cyan-50/95 px-3 py-1.5 font-mono text-xs font-bold text-cyan-800 shadow-sm backdrop-blur-md hover:bg-cyan-100 transition-all cursor-pointer"
        >
          <Crosshair className="h-3.5 w-3.5 text-cyan-600" />
          <span>Center ISS</span>
        </button>

        {/* Layer & Feature Toggles Pill */}
        <div className="flex items-center gap-1 rounded-xl bg-white/90 p-1 border border-slate-200 shadow-sm backdrop-blur-md">
          <button
            onClick={() => setShowOrbit(!showOrbit)}
            title="Toggle 51.6° Orbit Ring"
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all cursor-pointer ${
              showOrbit ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Orbit
          </button>
          <button
            onClick={() => setShowGraticule(!showGraticule)}
            title="Toggle Lat/Lng Grid"
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all cursor-pointer ${
              showGraticule ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setShowDayNight(!showDayNight)}
            title="Toggle Day/Night Shading"
            className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all cursor-pointer ${
              showDayNight ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sun
          </button>
        </div>
      </div>

      {/* Bottom Right Zoom Buttons */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => {
            zoomRef.current = Math.min(3.5, zoomRef.current * 1.2);
          }}
          title="Zoom In"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-md hover:bg-slate-100 transition-all cursor-pointer"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            zoomRef.current = Math.max(0.6, zoomRef.current / 1.2);
          }}
          title="Zoom Out"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-md hover:bg-slate-100 transition-all cursor-pointer"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 rounded-xl bg-white/80 px-3 py-1 text-[11px] font-mono text-slate-500 backdrop-blur-md border border-slate-200">
        <span>💡 Click &amp; drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
}
