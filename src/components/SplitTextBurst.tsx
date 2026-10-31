import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { spatialAudio } from '../hooks/useSpatialAudio';

interface SplitTextBurstProps {
  text?: string;
  roles?: string[];
  intervalMs?: number;
  tagline?: string;
  accentColor: string;
  isDark?: boolean;
  className?: string;
}

const DEFAULT_ROLES = [
  'Full Stack Developer',
  'GEN AI Enthusiast',
  'AI Engineer',
];

export const SplitTextBurst: React.FC<SplitTextBurstProps> = ({
  text,
  roles,
  intervalMs = 3500,
  tagline,
  accentColor,
  isDark = true,
  className = '',
}) => {
  const activeRoles = useMemo(() => {
    if (roles && roles.length > 0) return roles;
    if (text && text.trim().length > 0 && text !== 'FULL STACK DEVELOPER & AI SYSTEMS ARCHITECT') {
      return [text, ...DEFAULT_ROLES.filter((r) => r.toLowerCase() !== text.toLowerCase())];
    }
    return DEFAULT_ROLES;
  }, [roles, text]);

  const [roleIndex, setRoleIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const isAnimatingRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentText = activeRoles[roleIndex] || activeRoles[0];
  const characters = useMemo(() => Array.from(currentText), [currentText]);

  // Transition to next role using explosive 3D burst
  const transitionToNext = useCallback((isUserClick = false) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (chars.length === 0) {
      setRoleIndex((prev) => (prev + 1) % activeRoles.length);
      isAnimatingRef.current = false;
      return;
    }

    if (isUserClick) {
      spatialAudio.playTone(540, 'triangle', 0.14, 0.08);
    }

    // Phase 1: Explosive SplitText Burst Phase
    // Scatter characters outward in 3D space with randomized physics
    const tl = gsap.timeline({
      onComplete: () => {
        charsRef.current = [];
        setRoleIndex((prev) => (prev + 1) % activeRoles.length);
      },
    });

    tl.to(chars, {
      x: () => gsap.utils.random(-48, 48),
      y: () => gsap.utils.random(-36, 36),
      z: () => gsap.utils.random(-60, 80),
      rotation: () => gsap.utils.random(-28, 28),
      rotationX: () => gsap.utils.random(-45, 45),
      rotationY: () => gsap.utils.random(-45, 45),
      scale: () => gsap.utils.random(0.65, 1.4),
      opacity: 0,
      color: () => (Math.random() > 0.4 ? accentColor : isDark ? '#ffffff' : '#09090b'),
      filter: 'blur(4px)',
      duration: 0.32,
      ease: 'power3.out',
      stagger: {
        amount: 0.1,
        from: 'center',
      },
    });
  }, [activeRoles.length, accentColor, isDark]);

  // Phase 2: Snap-in animation when roleIndex changes
  useEffect(() => {
    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (chars.length === 0) return;

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      // Initial entrance on page load
      gsap.set(chars, {
        opacity: 0,
        y: 28,
        rotationX: -55,
        transformPerspective: 600,
      });

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.85,
        ease: 'back.out(2)',
        stagger: {
          amount: 0.3,
          from: 'start',
        },
        delay: 0.35,
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
      return;
    }

    // Elastic snap-in from burst cloud for new role characters
    gsap.set(chars, {
      opacity: 0,
      x: () => gsap.utils.random(-40, 40),
      y: () => gsap.utils.random(-30, 30),
      z: () => gsap.utils.random(-50, 60),
      rotation: () => gsap.utils.random(-24, 24),
      rotationX: () => gsap.utils.random(-35, 35),
      rotationY: () => gsap.utils.random(-35, 35),
      scale: 0.75,
      filter: 'blur(3px)',
      transformPerspective: 800,
    });

    gsap.to(chars, {
      opacity: 1,
      x: 0,
      y: 0,
      z: 0,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      color: '',
      filter: 'blur(0px)',
      duration: 0.82,
      ease: 'elastic.out(1.15, 0.42)',
      stagger: {
        amount: 0.14,
        from: 'center',
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  }, [roleIndex]);

  // Automatic timer interval to trigger kinetic burst transition
  useEffect(() => {
    if (activeRoles.length <= 1) return;

    const startInterval = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return;
        transitionToNext(false);
      }, intervalMs);
    };

    startInterval();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [transitionToNext, intervalMs, activeRoles.length]);

  const handleManualClick = () => {
    // Reset interval timer upon manual click
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) return;
        transitionToNext(false);
      }, intervalMs);
    }
    transitionToNext(true);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleManualClick}
      className={`group relative inline-flex flex-col items-center justify-center cursor-pointer select-none perspective-1000 ${className}`}
      title="Click or watch role switch dynamically"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleManualClick();
        }
      }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-[1px] leading-tight">
        {characters.map((char, index) => {
          const isSpace = char === ' ';
          return (
            <span
              key={`${roleIndex}-${index}-${char}`}
              ref={(el) => {
                charsRef.current[index] = el;
              }}
              className={`inline-block transition-colors duration-150 will-change-transform ${
                isSpace ? 'w-2 sm:w-3' : ''
              } font-mono text-xs sm:text-sm md:text-base font-semibold tracking-wider`}
              style={{
                display: 'inline-block',
                transformOrigin: '50% 50% -20px',
              }}
            >
              {isSpace ? '\u00A0' : char}
            </span>
          );
        })}
      </div>

      {tagline && (
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
          <span style={{ color: accentColor }}>[</span>
          <span>CLICK TO BURST PHYSICS</span>
          <span style={{ color: accentColor }}>]</span>
        </div>
      )}
    </div>
  );
};

export default SplitTextBurst;
