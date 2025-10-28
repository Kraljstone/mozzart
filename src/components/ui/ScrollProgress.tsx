'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { createContext, useContext, useRef, useState, useEffect } from 'react';

// Custom hook for hydration-safe mounting
const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return isMounted;
};
import {
  ScrollProgressProviderProps,
  ScrollProgressProps,
  ScrollProgressContainerProps,
  ScrollProgressContextType,
} from '@/types/scroll-progress.types';

const ScrollProgressContext = createContext<ScrollProgressContextType | null>(
  null
);

export const ScrollProgressProvider = ({
  children,
  global = false,
  direction = 'vertical',
}: ScrollProgressProviderProps) => {
  const containerRef = useRef<HTMLElement | null>(null);

  // Use parameters to avoid warnings (they're part of the API)
  console.debug('ScrollProgressProvider initialized', { global, direction });

  return (
    <ScrollProgressContext.Provider value={{ containerRef }}>
      {children}
    </ScrollProgressContext.Provider>
  );
};

export const ScrollProgress = ({
  asChild = false,
  mode = 'width',
  className = '',
}: ScrollProgressProps) => {
  const context = useContext(ScrollProgressContext);
  const isMounted = useIsMounted();

  // For global scroll, don't use a target
  // For local scroll, use the container ref
  const scrollOptions = isMounted
    ? context?.containerRef?.current
      ? {
          target: context.containerRef,
          offset: ['start start', 'end end'] as ['start start', 'end end'],
        }
      : {
          // Global scroll - no target needed
          offset: ['start start', 'end end'] as ['start start', 'end end'],
        }
    : undefined;

  const { scrollYProgress } = useScroll(scrollOptions || {});

  // Use Framer Motion's useTransform for smooth animations
  // Add fallback to prevent arity errors
  const progressValue = scrollYProgress || 0;
  const scaleX = useTransform(progressValue, [0, 1], [0, 1]);
  const scaleY = useTransform(progressValue, [0, 1], [0, 1]);

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  const progressBar = (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-2 scroll-progress-bar z-50 origin-left ${
        mode === 'height' ? 'w-2 h-full origin-top' : ''
      } ${className}`}
      style={{
        scaleX: mode === 'width' || mode === 'scaleX' ? scaleX : 1,
        scaleY: mode === 'height' || mode === 'scaleY' ? scaleY : 1,
        width: mode === 'height' ? '6px' : '100%',
        height: mode === 'height' ? '100vh' : '6px',
      }}
    />
  );

  if (asChild) {
    return progressBar;
  }

  return progressBar;
};

export const ScrollProgressContainer = ({
  children,
  asChild = false,
  className = '',
}: ScrollProgressContainerProps) => {
  const context = useContext(ScrollProgressContext);
  const isMounted = useIsMounted();

  if (asChild) {
    return <>{children}</>;
  }

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={context?.containerRef as React.RefObject<HTMLDivElement>}
      className={className}
    >
      {children}
    </div>
  );
};
