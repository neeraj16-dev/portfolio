/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ThemeTransitionProps {
  isTransitioning: boolean;
  targetMode: 'dark' | 'light';
  accentColor: string;
  onTransitionComplete?: () => void;
}

export const ThemeTransitionOverlay: React.FC<ThemeTransitionProps> = ({
  isTransitioning,
  targetMode,
  accentColor,
  onTransitionComplete,
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const isTargetDark = targetMode === 'dark';
  const overlayBackground = isTargetDark ? '#08080C' : '#FFFFFF';
  const overlayTextColor = isTargetDark ? '#F4F4F5' : '#09090B';

  return (
    <AnimatePresence onExitComplete={onTransitionComplete}>
      {isTransitioning && (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          aria-hidden="true"
        >
          {reducedMotion ? (
            /* Reduced Motion Fallback: Gentle Opacity Cross-fade */
            <motion.div
              key="reduced-fade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ backgroundColor: overlayBackground }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="font-mono text-xs uppercase tracking-widest px-4 py-2 border"
                style={{
                  color: overlayTextColor,
                  borderColor: `${accentColor}40`,
                  backgroundColor: isTargetDark ? '#0F1016' : '#F4F4F5',
                }}
              >
                [ THEME: {isTargetDark ? 'OBSIDIAN DARK' : 'TITANIUM LIGHT'} ]
              </div>
            </motion.div>
          ) : (
            /* Architectural Curtain / Page-Wipe with Dynamic Accent Leading Blade */
            <div className="relative h-full w-full">
              {/* Primary Sweep Curtain */}
              <motion.div
                key="primary-wipe"
                initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
                animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
                exit={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}
                transition={{
                  duration: 0.42,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ backgroundColor: overlayBackground }}
                className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12"
              >
                {/* Subtle Technical Grid Lines */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `linear-gradient(${isTargetDark ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isTargetDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                  }}
                />

                {/* Top Telemetry Header during transition */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-wider opacity-80">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span style={{ color: overlayTextColor }}>
                      SYSTEM // DISPLAY CALIBRATION
                    </span>
                  </div>
                  <span style={{ color: overlayTextColor }}>
                    [ REFRESH RATE: 60HZ / HIGH PRECISION ]
                  </span>
                </div>

                {/* Center Tactical Readout */}
                <div className="relative z-10 mx-auto flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.28, delay: 0.05 }}
                    className="flex flex-col items-center gap-2 px-6 py-4 border shadow-sm backdrop-blur-sm"
                    style={{
                      borderColor: `${accentColor}35`,
                      backgroundColor: isTargetDark ? '#0C0D13' : '#F9FAFB',
                    }}
                  >
                    <div
                      className="text-[10px] font-mono uppercase tracking-[0.25em]"
                      style={{ color: accentColor }}
                    >
                      Colorway Shift Executed
                    </div>
                    <div
                      className="text-sm font-semibold tracking-tight font-sans"
                      style={{ color: overlayTextColor }}
                    >
                      {isTargetDark ? 'Obsidian Dark' : 'Titanium Light'}
                    </div>
                    <div
                      className="text-[11px] font-mono opacity-60"
                      style={{ color: overlayTextColor }}
                    >
                      Target Palette Lock: {accentColor.toUpperCase()}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Technical Coordinates */}
                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono opacity-60">
                  <span style={{ color: overlayTextColor }}>
                    NODE: 01_SURFACE_CANVAS
                  </span>
                  <span style={{ color: overlayTextColor }}>
                    LATENCY: &lt;1.2MS
                  </span>
                </div>
              </motion.div>

              {/* High-Contrast Dynamic Leading Edge Blade */}
              <motion.div
                key="leading-blade"
                initial={{ left: '-20px', opacity: 0.9 }}
                animate={{ left: '100%', opacity: 1 }}
                exit={{ left: '105%', opacity: 0 }}
                transition={{
                  duration: 0.42,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute top-0 bottom-0 w-[3px]"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 16px 2px ${accentColor}`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
