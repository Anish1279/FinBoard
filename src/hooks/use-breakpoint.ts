import { useState, useEffect, useCallback } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'laptop' | 'desktop';

const BREAKPOINTS: Record<Breakpoint, number> = {
  mobile: 0,
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
};

function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.laptop) return 'laptop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

export function useBreakpoint() {
  const [bp, setBp] = useState<Breakpoint>(() => getBreakpoint(window.innerWidth));

  const handleResize = useCallback(() => {
    setBp(getBreakpoint(window.innerWidth));
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return {
    breakpoint: bp,
    isMobile: bp === 'mobile',
    isTablet: bp === 'tablet',
    isLaptop: bp === 'laptop',
    isDesktop: bp === 'desktop',
    isMobileOrTablet: bp === 'mobile' || bp === 'tablet',
  };
}
