import React, { useEffect, useState, useRef } from 'react';
import { ColorMode } from '../types/hero';
import { ArrowUp } from 'lucide-react';
import { triggerSectionTransition } from './SectionTransitionOverlay';
import { smoothScrollTo } from '../hooks/useSmoothScroll';

interface ScrollProgressBarProps {
  accentColor: string;
  colorMode?: ColorMode;
}

interface SectionWaypoint {
  id: string;
  num: string;
  label: string;
  shortTitle: string;
}

const SECTIONS: SectionWaypoint[] = [
  { id: 'hero', num: '01', label: 'HERO // VECTOR STAGE', shortTitle: 'HERO' },
  { id: 'about', num: '02', label: 'ABOUT ME & VISION', shortTitle: 'ABOUT' },
  { id: 'skills', num: '03', label: 'TECHNICAL CAPABILITIES', shortTitle: 'SKILLS' },
  { id: 'works', num: '04', label: 'FEATURED WORKS', shortTitle: 'WORKS' },
  { id: 'contact', num: '05', label: 'INQUIRIES & CONTACT', shortTitle: 'CONTACT' },
];

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  accentColor,
  colorMode = 'dark',
}) => {
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const isDark = colorMode === 'dark';

  // DOM node references for direct GPU-composited transform updates (zero layout reflows)
  const barRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const percentageTextRef = useRef<HTMLSpanElement>(null);

  // Smooth LERP values
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastDisplayedPctRef = useRef(-1);
  const idleTimerRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef(false);

  useEffect(() => {
    // Computes target scroll ratio
    const computeTarget = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;
      return maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    };

    // The LERP Animation Engine
    const updateMotion = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;

      // Smooth inertia easing factor (0.13 = butter-smooth with zero perceptible latency)
      if (Math.abs(diff) > 0.0002) {
        currentProgressRef.current += diff * 0.13;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;

      // 1. GPU Composited scaleX on horizontal bar
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`;
      }

      // 2. Hardware-accelerated translate3d on traveling diamond reticle
      if (reticleRef.current) {
        const xPos = p * window.innerWidth;
        reticleRef.current.style.transform = `translate3d(${xPos}px, -50%, 0) translate3d(-50%, 0, 0) rotate(45deg)`;
      }



      // 4. Update numeric display only when integer value actually advances
      const intPct = Math.round(p * 100);
      if (intPct !== lastDisplayedPctRef.current) {
        lastDisplayedPctRef.current = intPct;
        if (percentageTextRef.current) {
          percentageTextRef.current.textContent = `${String(intPct).padStart(2, '0')}%`;
        }
        setIsNearBottom(intPct >= 88);
      }

      // Continue animation if still interpolating or scrolling
      if (Math.abs(targetProgressRef.current - currentProgressRef.current) > 0.0001) {
        rafIdRef.current = requestAnimationFrame(updateMotion);
      } else {
        isLoopRunningRef.current = false;
      }
    };

    const startLoop = () => {
      if (!isLoopRunningRef.current) {
        isLoopRunningRef.current = true;
        rafIdRef.current = requestAnimationFrame(updateMotion);
      }
    };

    const updateActiveSection = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // 1. Boundary: Near top -> hero
      if (scrollTop < 120) {
        setActiveSectionId((prev) => (prev !== 'hero' ? 'hero' : prev));
        return;
      }

      // 2. Boundary: Near bottom -> contact
      if (scrollHeight - (scrollTop + clientHeight) < 120) {
        setActiveSectionId((prev) => (prev !== 'contact' ? 'contact' : prev));
        return;
      }

      // 3. Scan section DOM nodes using getBoundingClientRect()
      const focalLine = clientHeight * 0.38;
      let currentId = 'hero';

      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalLine && rect.bottom > focalLine) {
            currentId = sec.id;
            break;
          }
          if (rect.top <= focalLine) {
            currentId = sec.id;
          }
        }
      }

      setActiveSectionId((prev) => (prev !== currentId ? currentId : prev));
    };

    let isScrollingActive = false;
    const handleScroll = () => {
      targetProgressRef.current = computeTarget();
      startLoop();

      if (!isScrollingActive) {
        isScrollingActive = true;
        setIsScrolling(true);
      }

      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        isScrollingActive = false;
        setIsScrolling(false);
      }, 500);
    };

    const handleResize = () => {
      targetProgressRef.current = computeTarget();
      startLoop();
    };

    const handleTransit = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId: string }>;
      if (customEvent.detail?.targetId) {
        const targetId = customEvent.detail.targetId.replace('#', '');
        if (SECTIONS.some((s) => s.id === targetId)) {
          setActiveSectionId(targetId);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('section-transit-trigger', handleTransit);

    // IntersectionObserver for backup section visibility detection
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSectionId((prev) => (prev !== visibleEntry.target.id ? visibleEntry.target.id : prev));
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.1,
      }
    );

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    // Initial position trigger
    targetProgressRef.current = computeTarget();
    currentProgressRef.current = targetProgressRef.current;
    startLoop();
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('section-transit-trigger', handleTransit);
      observer.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);



  const scrollToTop = () => {
    triggerSectionTransition('hero', 'HERO // VECTOR STAGE', '01');
    smoothScrollTo('#hero');
  };

  const activeWaypoint = SECTIONS.find((s) => s.id === activeSectionId) || SECTIONS[0];

  return (
    <>
      {/* Top Precision Laser Track */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[3px] w-full pointer-events-none select-none overflow-visible"
        aria-hidden="true"
      >
        {/* Background track with millimeter graduation marks */}
        <div
          className="absolute inset-0 h-full w-full opacity-30"
          style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        />

        {/* Graduation tick marks at 10% intervals */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-40">
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-[1px] -translate-y-0.5"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
              }}
            />
          ))}
        </div>

        {/* Primary Laser Stream (Smooth GPU ScaleX) */}
        <div
          ref={barRef}
          className="h-full w-full origin-left will-change-transform"
          style={{
            transform: 'scaleX(0)',
            background: `linear-gradient(90deg, ${accentColor}30 0%, ${accentColor} 80%, #FFFFFF 100%)`,
            boxShadow: `0 0 10px ${accentColor}, 0 0 18px ${accentColor}`,
          }}
        />

        {/* Traveling Diamond Emitter Reticle (Smooth GPU Translate3d) */}
        <div
          ref={reticleRef}
          className="absolute left-0 top-1/2 h-2.5 w-2.5 will-change-transform border transition-transform duration-75 ease-out"
          style={{
            transform: 'translate3d(0px, -50%, 0) translate3d(-50%, 0, 0) rotate(45deg)',
            backgroundColor: '#FFFFFF',
            borderColor: accentColor,
            boxShadow: `0 0 12px ${accentColor}, 0 0 20px ${accentColor}`,
          }}
        />
      </div>

      {/* Floating Top-Right Telemetry Badge */}
      <div
        className={`fixed top-3 right-4 sm:right-6 z-40 flex items-center gap-2 font-mono text-[11px] transition-all duration-300 pointer-events-auto ${
          isScrolling ? 'opacity-100 scale-100' : 'opacity-60 hover:opacity-100 scale-95'
        }`}
      >
        <div
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border backdrop-blur-md shadow-lg transition-colors ${
            isDark
              ? 'bg-[#0A0A0E]/85 border-white/10 text-white'
              : 'bg-white/90 border-neutral-300 text-neutral-900'
          }`}
          style={{
            borderColor: isScrolling ? `${accentColor}70` : undefined,
          }}
        >
          {/* Live Caliper Section Indicator */}
          <span
            className="inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase text-[10px]"
            style={{ color: accentColor }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <span>
              {activeWaypoint.num} // {activeWaypoint.shortTitle}
            </span>
          </span>

          <span
            className="inline-block opacity-30 font-light"
            aria-hidden="true"
          >
            |
          </span>

          {/* Tabular Progress Percentage */}
          <span
            ref={percentageTextRef}
            className="font-bold tracking-tight tabular-nums min-w-[34px]"
          >
            00%
          </span>

          {/* Quick Back-to-Top Button when scrolled deep */}
          {isNearBottom && (
            <button
              onClick={scrollToTop}
              title="Return to top"
              className="cursor-target ml-1 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider hover:underline transition-transform active:scale-95"
              style={{ color: accentColor }}
            >
              <ArrowUp className="h-3 w-3 stroke-[2.5]" />
              <span className="hidden xs:inline">TOP</span>
            </button>
          )}
        </div>
      </div>

    </>
  );
};

export default ScrollProgressBar;
