import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorMode } from '../types/hero';
import { spatialAudio } from '../hooks/useSpatialAudio';

export interface SectionTransitEventDetail {
  targetId: string;
  label?: string;
  num?: string;
}

export interface SectionWarpBlurEventDetail {
  isWarping: boolean;
  direction: 'down' | 'up';
}

interface SectionTransitionOverlayProps {
  accentColor: string;
  colorMode?: ColorMode;
}

export const triggerSectionTransition = (targetId: string, label?: string, num?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<SectionTransitEventDetail>('section-transit-trigger', {
        detail: { targetId, label, num },
      })
    );
  }
};

const SECTION_MAP: Record<string, { num: string; title: string }> = {
  hero: { num: '01', title: 'HERO // VECTOR MATRIX' },
  about: { num: '02', title: 'ARCHITECTURE & VISION' },
  works: { num: '03', title: 'FEATURED CASE STUDIES' },
  contact: { num: '04', title: 'INQUIRIES & COMMUNICATIONS' },
};

// Procedural speed streak configuration for hyper-velocity motion blur
const SPEED_STREAKS = [
  { x: 3, width: 2, height: 260, delay: 0, speed: 0.32, opacity: 0.8 },
  { x: 8, width: 1, height: 180, delay: 0.04, speed: 0.28, opacity: 0.6 },
  { x: 14, width: 2.5, height: 320, delay: 0.02, speed: 0.35, opacity: 0.9 },
  { x: 21, width: 1.5, height: 210, delay: 0.06, speed: 0.3, opacity: 0.7 },
  { x: 29, width: 1, height: 160, delay: 0.01, speed: 0.26, opacity: 0.5 },
  { x: 37, width: 2, height: 280, delay: 0.05, speed: 0.34, opacity: 0.85 },
  { x: 44, width: 3, height: 360, delay: 0, speed: 0.38, opacity: 0.95 },
  { x: 52, width: 1.5, height: 220, delay: 0.03, speed: 0.29, opacity: 0.75 },
  { x: 61, width: 2, height: 290, delay: 0.02, speed: 0.33, opacity: 0.85 },
  { x: 68, width: 1, height: 170, delay: 0.07, speed: 0.27, opacity: 0.6 },
  { x: 76, width: 2.5, height: 340, delay: 0.01, speed: 0.36, opacity: 0.9 },
  { x: 83, width: 1.5, height: 240, delay: 0.04, speed: 0.31, opacity: 0.7 },
  { x: 91, width: 2, height: 270, delay: 0.03, speed: 0.32, opacity: 0.8 },
  { x: 97, width: 1, height: 190, delay: 0.05, speed: 0.28, opacity: 0.65 },
];

export const SectionTransitionOverlay: React.FC<SectionTransitionOverlayProps> = ({
  accentColor,
  colorMode = 'dark',
}) => {
  const [transitState, setTransitState] = useState<{
    isActive: boolean;
    phase: 'closing' | 'locked' | 'opening';
    targetId: string;
    num: string;
    title: string;
    direction: 'down' | 'up';
  } | null>(null);

  const isDark = colorMode === 'dark';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleTransit = (e: Event) => {
      if (mediaQuery.matches) {
        const customEvent = e as CustomEvent<SectionTransitEventDetail>;
        const { targetId } = customEvent.detail || {};
        if (targetId) {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      const customEvent = e as CustomEvent<SectionTransitEventDetail>;
      const { targetId, label, num } = customEvent.detail || {};

      // Calculate direction relative to current scroll position
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      const targetEl = targetId ? document.getElementById(targetId) : null;
      const targetTop = targetEl ? targetEl.getBoundingClientRect().top + currentScroll : currentScroll;
      const direction: 'down' | 'up' = targetTop >= currentScroll ? 'down' : 'up';

      const mapped = SECTION_MAP[targetId?.toLowerCase()] || {
        num: num || '00',
        title: label || targetId?.toUpperCase() || 'SECTOR',
      };

      // Broadcast high-velocity motion blur start to whole page
      window.dispatchEvent(
        new CustomEvent<SectionWarpBlurEventDetail>('section-warp-motion-blur', {
          detail: { isWarping: true, direction },
        })
      );

      // Play subtle, spatial cinematic whoosh & sub-pulse
      spatialAudio.playSectionTransit(direction);

      // Phase 1: Closing Shutter & High-Velocity Motion Blur Streaks
      setTransitState({
        isActive: true,
        phase: 'closing',
        targetId: targetId || 'sector',
        num: num || mapped.num,
        title: label || mapped.title,
        direction,
      });

      // Phase 2: Horizon Laser Lock & Immediate Page Align
      const lockTimer = setTimeout(() => {
        setTransitState((prev) => (prev ? { ...prev, phase: 'locked' } : null));
        spatialAudio.playWaypointTick();

        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'auto' });
          }
        }
      }, 230);

      // Phase 3: Opening Shutter (Enter New Page with Motion Blur Snap)
      const openTimer = setTimeout(() => {
        setTransitState((prev) => (prev ? { ...prev, phase: 'opening' } : null));
      }, 340);

      // Phase 4: Settle & Broadcast Motion Blur Stop
      const finishTimer = setTimeout(() => {
        setTransitState(null);
        window.dispatchEvent(
          new CustomEvent<SectionWarpBlurEventDetail>('section-warp-motion-blur', {
            detail: { isWarping: false, direction },
          })
        );
      }, 560);

      return () => {
        clearTimeout(lockTimer);
        clearTimeout(openTimer);
        clearTimeout(finishTimer);
      };
    };

    window.addEventListener('section-transit-trigger', handleTransit);
    return () => {
      window.removeEventListener('section-transit-trigger', handleTransit);
    };
  }, []);

  if (!transitState?.isActive) return null;

  const shutterBg = isDark ? '#06060A' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
  const directionMultiplier = transitState.direction === 'down' ? -1 : 1;

  return (
    <>
      {/* SVG Motion Blur Filter Definition */}
      <svg
        className="pointer-events-none fixed -top-[9999px] -left-[9999px] h-0 w-0"
        aria-hidden="true"
      >
        <defs>
          <filter id="hyper-streak-blur" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0 16" />
          </filter>
          <filter id="shockwave-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>
        </defs>
      </svg>

      <div
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Cinematic Kinetic Warp Speed Streaks with Motion Blur */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {SPEED_STREAKS.map((streak, idx) => {
            const startY = directionMultiplier > 0 ? -400 : window.innerHeight + 200;
            const endY = directionMultiplier > 0 ? window.innerHeight + 400 : -500;

            return (
              <motion.div
                key={idx}
                initial={{
                  y: startY,
                  opacity: 0,
                  scaleY: 1.4,
                }}
                animate={{
                  y: endY,
                  opacity: [0, streak.opacity, 0],
                  scaleY: 2.2,
                }}
                transition={{
                  duration: streak.speed,
                  delay: streak.delay,
                  ease: 'easeIn',
                }}
                className="absolute origin-center will-change-transform"
                style={{
                  left: `${streak.x}%`,
                  width: `${streak.width}px`,
                  height: `${streak.height}px`,
                  filter: 'url(#hyper-streak-blur)',
                  background: `linear-gradient(180deg, transparent 0%, ${accentColor} 45%, #FFFFFF 50%, ${accentColor} 55%, transparent 100%)`,
                  boxShadow: `0 0 12px ${accentColor}`,
                }}
              />
            );
          })}
        </div>

        {/* Top Shutter Blade (Exit / Entry Horizon) */}
        <motion.div
          initial={{ y: '-100%' }}
          animate={transitState.phase === 'opening' ? { y: '-100%' } : { y: '0%' }}
          transition={{
            duration: transitState.phase === 'opening' ? 0.24 : 0.21,
            ease: transitState.phase === 'opening' ? [0.4, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
          }}
          className="absolute top-0 left-0 right-0 h-1/2 border-b flex flex-col justify-end items-center pb-4 z-10"
          style={{
            backgroundColor: shutterBg,
            borderColor,
          }}
        >
          {/* Micro Grid Overlay on Shutter */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${accentColor} 1px, transparent 0)`,
              backgroundSize: '28px 28px',
            }}
          />

          {/* Top Blade Telemetry Readout */}
          <div className="relative font-mono text-[10px] tracking-widest uppercase opacity-75 mb-2 flex items-center gap-2">
            <span style={{ color: accentColor }}>//</span>
            <span>HYPER-VELOCITY KINETIC BLUR</span>
            <span style={{ color: accentColor }}>[18PX MOTION BLUR]</span>
          </div>
        </motion.div>

        {/* Bottom Shutter Blade (Exit / Entry Horizon) */}
        <motion.div
          initial={{ y: '100%' }}
          animate={transitState.phase === 'opening' ? { y: '100%' } : { y: '0%' }}
          transition={{
            duration: transitState.phase === 'opening' ? 0.24 : 0.21,
            ease: transitState.phase === 'opening' ? [0.4, 0, 0.2, 1] : [0.16, 1, 0.3, 1],
          }}
          className="absolute bottom-0 left-0 right-0 h-1/2 border-t flex flex-col justify-start items-center pt-4 z-10"
          style={{
            backgroundColor: shutterBg,
            borderColor,
          }}
        >
          {/* Micro Grid Overlay on Shutter */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${accentColor} 1px, transparent 0)`,
              backgroundSize: '28px 28px',
            }}
          />

          {/* Bottom Blade Telemetry Readout */}
          <div className="relative font-mono text-[10px] tracking-widest uppercase opacity-75 mt-2 flex items-center gap-2">
            <span>TARGET SECTOR {transitState.num}</span>
            <span style={{ color: accentColor }}>// VECTOR LOCKED ({transitState.direction.toUpperCase()})</span>
          </div>
        </motion.div>

        {/* Center Laser Seam Beam, Shockwave Ripple & HUD Card */}
        <AnimatePresence>
          {(transitState.phase === 'closing' || transitState.phase === 'locked') && (
            <>
              {/* Kinetic Optical Shockwave Ripple */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0.8 }}
                animate={{ scale: 3.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full border pointer-events-none z-25"
                style={{
                  borderColor: accentColor,
                  boxShadow: `0 0 40px ${accentColor}`,
                  filter: 'url(#shockwave-blur)',
                }}
              />

              {/* Center Laser Line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 origin-center z-30"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
                }}
              />

              {/* Central Holographic HUD Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: transitState.direction === 'down' ? -15 : 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-3 text-center z-35"
              >
                <div
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-lg border font-mono text-xs tracking-wider uppercase shadow-2xl backdrop-blur-xl ${
                    isDark
                      ? 'bg-[#06060A]/95 border-white/20 text-white'
                      : 'bg-white/95 border-neutral-300 text-neutral-900'
                  }`}
                  style={{
                    borderColor: `${accentColor}90`,
                    boxShadow: `0 8px 36px ${accentColor}40`,
                  }}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-xs animate-ping"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] opacity-70">
                      {transitState.phase === 'closing'
                        ? 'HYPER-WARP EXIT // VELOCITY ACCELERATION'
                        : 'SECTOR ARRIVAL // DECELERATING MOTION BLUR'}
                    </span>
                    <span className="font-bold text-xs" style={{ color: accentColor }}>
                      [{transitState.num}] {transitState.title}
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SectionTransitionOverlay;
