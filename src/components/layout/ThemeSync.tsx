'use client';

import { useEffect } from 'react';
import { useISSStore } from '@/store/issStore';

export function ThemeSync() {
  const { theme } = useISSStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  return null;
}
