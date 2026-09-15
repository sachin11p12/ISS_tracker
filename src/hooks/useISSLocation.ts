'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useISSStore } from '@/store/issStore';
import { fetchISSTelemetry } from '@/services/issService';

export function useISSLocation() {
  const {
    telemetry,
    locationDetails,
    lastUpdated,
    isLoading,
    error,
    isLive,
    refreshCount,
    pollingInterval,
    setTelemetryData,
    setLoading,
    setError,
    toggleLive,
  } = useISSStore();

  const isMountedRef = useRef<boolean>(true);
  const isFetchingRef = useRef<boolean>(false);

  const fetchTelemetry = useCallback(async (showLoading = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (showLoading) {
      setLoading(true);
    }

    try {
      const payload = await fetchISSTelemetry();
      if (isMountedRef.current) {
        setTelemetryData(payload);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const errorMsg = err instanceof Error ? err.message : 'Telemetry link error';
        setError(errorMsg);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [setLoading, setTelemetryData, setError]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchTelemetry(true);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchTelemetry]);

  // Interval polling
  useEffect(() => {
    if (!isLive) return;

    const intervalId = setInterval(() => {
      fetchTelemetry(false);
    }, pollingInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [isLive, pollingInterval, fetchTelemetry]);

  // Handle visibility change to save bandwidth when tab is backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLive) {
        fetchTelemetry(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLive, fetchTelemetry]);

  return {
    telemetry,
    locationDetails,
    lastUpdated,
    isLoading,
    error,
    isLive,
    refreshCount,
    refresh: () => fetchTelemetry(false),
    toggleLive,
  };
}
