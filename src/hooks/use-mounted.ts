import { useState, useEffect } from 'react';

/**
 * A robust hook to ensure components only render client-side after hydration.
 * Top-tier practice to avoid layout shifts and hydration errors with ResizeObservers
 * (e.g., used internally by Recharts' ResponsiveContainer).
 */
export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
