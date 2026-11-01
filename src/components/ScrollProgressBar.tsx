import React, { useEffect, useState, useRef } from 'react';
import { ColorMode } from '../types/hero';
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
  const [hoveredWaypoint, setHoveredWaypoint] = useState<string | null>(null);
  const isDark = colorMode === 'dark';

  // DOM node references for direct GPU-composited transform updates (zero layout reflows)
  const verticalBarRef = useRef<HTMLDivElement>(null);

  // Smooth LERP values
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
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

      // GPU Composited scaleY on vertical elevator track
      if (verticalBarRef.current) {
        verticalBarRef.current.style.transform = `scaleY(${p})`;
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

  const scrollToSection = (id: string) => {
    const waypoint = SECTIONS.find((s) => s.id === id);
    triggerSectionTransition(id, waypoint?.label, waypoint?.num);
    smoothScrollTo('#' + id);
  };

  const scrollToTop = () => {
    triggerSectionTransition('hero', 'HERO // VECTOR STAGE', '01');
    smoothScrollTo('#hero');
  };

  const activeWaypoint = SECTIONS.find((s) => s.id === activeSectionId) || SECTIONS[0];

  return (
    <>
      {/* Right-Edge Vertical Section Elevator Track (Desktop & Tablet) */}
      <div
        className={`fixed right-3.5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-5 pointer-events-auto transition-opacity duration-300 ${isScrolling || hoveredWaypoint ? 'opacity-100' : 'opacity-40 hover:opacity-100'
          }`}
        aria-label="Section elevator progress"
      >
        {/* Continuous hairline rail */}
        <div
          className="absolute right-[5px] top-1 bottom-1 w-[1px] pointer-events-none"
          style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          }}
        />

        {/* Dynamic vertical fill along rail (Smooth GPU scaleY) */}
        <div
          ref={verticalBarRef}
          className="absolute right-[5px] top-1 bottom-1 w-[2px] -translate-x-[0.5px] origin-top will-change-transform pointer-events-none"
          style={{
            transform: 'scaleY(0)',
            backgroundColor: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
          }}
        />

        {/* Section Waypoint Nodes */}
        {SECTIONS.map((sec) => {
          const isActive = sec.id === activeSectionId;
          const isHovered = hoveredWaypoint === sec.id;

          return (
            <div
              key={sec.id}
              className="group relative flex items-center gap-3 cursor-pointer select-none"
              onMouseEnter={() => setHoveredWaypoint(sec.id)}
              onMouseLeave={() => setHoveredWaypoint(null)}
              onClick={() => scrollToSection(sec.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  scrollToSection(sec.id);
                }
              }}
              aria-label={`Jump to ${sec.label}`}
            >
              {/* Flyout Hover Label */}
              <div
                className={`pointer-events-none transition-all duration-200 font-mono text-[10px] tracking-wider whitespace-nowrap px-2 py-0.5 rounded-sm border ${isHovered || (isActive && isScrolling)
                    ? 'opacity-100 -translate-x-1'
                    : 'opacity-0 translate-x-2'
                  } ${isDark
                    ? 'bg-[#101015]/95 border-white/15 text-white'
                    : 'bg-white/95 border-neutral-300 text-neutral-900 shadow-sm'
                  }`}
                style={
                  isActive
                    ? { borderColor: `${accentColor}80`, color: accentColor }
                    : undefined
                }
              >
                [{sec.num}] {sec.shortTitle}
              </div>

              {/* Waypoint Dot */}
              <div
                className="relative flex h-3 w-3 items-center justify-center transition-transform duration-200 group-hover:scale-125"
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-xs animate-ping opacity-60 pointer-events-none"
                    style={{ backgroundColor: accentColor }}
                  />
                )}

                <div
                  className={`h-2 w-2 rounded-xs border transition-all duration-200 ${isActive
                      ? 'scale-110 shadow-[0_0_8px]'
                      : 'scale-90 opacity-60 group-hover:opacity-100'
                    }`}
                  style={{
                    backgroundColor: isActive
                      ? accentColor
                      : isDark
                        ? '#18181B'
                        : '#FFFFFF',
                    borderColor: isActive
                      ? accentColor
                      : isDark
                        ? 'rgba(255, 255, 255, 0.4)'
                        : 'rgba(0, 0, 0, 0.4)',
                    boxShadow: isActive ? `0 0 10px ${accentColor}` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ScrollProgressBar;
