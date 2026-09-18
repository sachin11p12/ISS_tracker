'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useISSStore } from '@/store/issStore';
import { fetchISSTelemetry } from '@/services/issService';

// Module-level singleton state to prevent duplicate intervals across components
let activeSubscribersCount = 0;
let globalIntervalId: ReturnType<typeof setInterval> | null = null;
let isGlobalFetching = false;

async function executeGlobalFetch(showLoading = false) {
  if (isGlobalFetching) return;
  isGlobalFetching = true;

  const store = useISSStore.getState();
  if (showLoading) {
    store.setLoading(true);
  }

  try {
    const payload = await fetchISSTelemetry();
    store.setTelemetryData(payload);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Telemetry link error';
    store.setError(errorMsg);
  } finally {
    isGlobalFetching = false;
  }
}

function startGlobalPolling(intervalMs: number) {
  if (globalIntervalId) clearInterval(globalIntervalId);
  globalIntervalId = setInterval(() => {
    const { isLive } = useISSStore.getState();
    if (isLive && document.visibilityState === 'visible') {
      executeGlobalFetch(false);
    }
  }, intervalMs);
}

function stopGlobalPolling() {
  if (globalIntervalId) {
    clearInterval(globalIntervalId);
    globalIntervalId = null;
  }
}

export function useISSLocation() {
  const telemetry = useISSStore((s) => s.telemetry);
  const locationDetails = useISSStore((s) => s.locationDetails);
  const lastUpdated = useISSStore((s) => s.lastUpdated);
  const isLoading = useISSStore((s) => s.isLoading);
  const error = useISSStore((s) => s.error);
  const isLive = useISSStore((s) => s.isLive);
  const refreshCount = useISSStore((s) => s.refreshCount);
  const pollingInterval = useISSStore((s) => s.pollingInterval);
  const toggleLive = useISSStore((s) => s.toggleLive);

  useEffect(() => {
    activeSubscribersCount++;

    // Initial fetch only if not already loaded
    if (!useISSStore.getState().telemetry) {
      executeGlobalFetch(true);
    }

    // Start single polling timer if not running
    if (isLive && !globalIntervalId) {
      startGlobalPolling(pollingInterval);
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && useISSStore.getState().isLive) {
        executeGlobalFetch(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      activeSubscribersCount--;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (activeSubscribersCount <= 0) {
        stopGlobalPolling();
        activeSubscribersCount = 0;
      }
    };
  }, [isLive, pollingInterval]);

  const refresh = useCallback(() => {
    return executeGlobalFetch(false);
  }, []);

  return {
    telemetry,
    locationDetails,
    lastUpdated,
    isLoading,
    error,
    isLive,
    refreshCount,
    refresh,
    toggleLive,
  };
}
