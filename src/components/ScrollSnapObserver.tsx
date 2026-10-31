import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Observer } from 'gsap/Observer';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ColorMode } from '../types/hero';
import { spatialAudio } from '../hooks/useSpatialAudio';

interface ScrollSnapObserverProps {
  accentColor: string;
  colorMode?: ColorMode;
}

const SECTIONS = ['#hero', '#about', '#skills', '#works', '#contact'];
const SECTION_LABELS: Record<string, string> = {
  '#hero': '01 // HERO',
  '#about': '02 // ABOUT',
  '#skills': '03 // SKILLS',
  '#works': '04 // WORKS',
  '#contact': '05 // CONTACT',
};

export const ScrollSnapObserver: React.FC<ScrollSnapObserverProps> = ({
  accentColor,
  colorMode = 'dark',
}) => {
  const isDark = colorMode === 'dark';
  const isAnimatingRef = useRef(false);
  const [isAnimatingState, setIsAnimatingState] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const chevronRef = useRef<HTMLDivElement>(null);
  const pulseTweenRef = useRef<gsap.core.Tween | null>(null);

  // Check which section is currently centered or at top of the viewport
  const getActiveSectionIndex = (): number => {
    if (typeof window === 'undefined') return 0;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let foundIndex = 0;
    for (let i = 0; i < SECTIONS.length; i++) {
      const el = document.querySelector(SECTIONS[i]);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollPos) {
          foundIndex = i;
        }
      }
    }
    return foundIndex;
  };

  // Perform debounced GSAP scrollTo transition to a section
  const scrollToSection = (targetSelector: string) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimatingState(true);

    // Pause idle pulse during transit
    if (pulseTweenRef.current) {
      pulseTweenRef.current.pause();
    }

    // Temporarily pause Lenis to avoid competing scroll targets
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.stop();
    }

    spatialAudio.playWaypointTick();

    const gsapEngine =
      (typeof window !== 'undefined' && (window as unknown as { gsap?: typeof gsap }).gsap) || gsap;
    const ScrollToEngine =
      (typeof window !== 'undefined' &&
        (window as unknown as { ScrollToPlugin?: typeof ScrollToPlugin }).ScrollToPlugin) ||
      ScrollToPlugin;

    if (gsapEngine && ScrollToEngine) {
      gsapEngine.registerPlugin(ScrollToEngine);
    }

    gsapEngine.to(window, {
      scrollTo: targetSelector,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsAnimatingState(false);
        if (typeof window !== 'undefined' && window.__lenis) {
          window.__lenis.start();
        }
        if (pulseTweenRef.current) {
          pulseTweenRef.current.resume();
        }
        setActiveIdx(getActiveSectionIndex());
      },
    });

    // Fallback debounce release timer
    setTimeout(() => {
      isAnimatingRef.current = false;
      setIsAnimatingState(false);
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.start();
      }
    }, 1150);
  };

  const handleScrollDown = () => {
    if (isAnimatingRef.current) return;

    const currentIdx = getActiveSectionIndex();
    const currentEl = document.querySelector(SECTIONS[currentIdx]) as HTMLElement | null;

    // Allow normal scroll within section if content overflows
    if (currentEl) {
      const rect = currentEl.getBoundingClientRect();
      const buffer = 35; // px threshold
      // If bottom of current section is still below viewport, allow normal scroll
      if (rect.bottom > window.innerHeight + buffer) {
        return;
      }
    }

    if (currentIdx < SECTIONS.length - 1) {
      const nextSection = SECTIONS[currentIdx + 1];
      scrollToSection(nextSection);
    }
  };

  const handleScrollUp = () => {
    if (isAnimatingRef.current) return;

    const currentIdx = getActiveSectionIndex();
    const currentEl = document.querySelector(SECTIONS[currentIdx]) as HTMLElement | null;

    // Allow normal scroll within section if content overflows
    if (currentEl) {
      const rect = currentEl.getBoundingClientRect();
      const buffer = 35;
      // If user has scrolled down into this section, allow normal scroll upward
      if (rect.top < -buffer) {
        return;
      }
    }

    if (currentIdx > 0) {
      const prevSection = SECTIONS[currentIdx - 1];
      scrollToSection(prevSection);
    }
  };

  // Set up GSAP Observer
  useEffect(() => {
    const gsapEngine =
      (typeof window !== 'undefined' && (window as unknown as { gsap?: typeof gsap }).gsap) || gsap;
    const ObserverEngine =
      (typeof window !== 'undefined' &&
        (window as unknown as { Observer?: typeof Observer }).Observer) ||
      Observer;
    const ScrollToEngine =
      (typeof window !== 'undefined' &&
        (window as unknown as { ScrollToPlugin?: typeof ScrollToPlugin }).ScrollToPlugin) ||
      ScrollToPlugin;

    if (gsapEngine && ObserverEngine) {
      gsapEngine.registerPlugin(ObserverEngine);
    }
    if (gsapEngine && ScrollToEngine) {
      gsapEngine.registerPlugin(ScrollToEngine);
    }

    if (!ObserverEngine || typeof ObserverEngine.create !== 'function') return;

    // Observer intercepts wheel and touch events
    // wheelSpeed: -1 unifies wheel down & swipe up to onUp
    const observer = ObserverEngine.create({
      type: 'wheel,touch',
      wheelSpeed: -1,
      tolerance: 20,
      preventDefault: false, // critical: allows normal scroll if content overflows
      onUp: () => handleScrollDown(),
      onDown: () => handleScrollUp(),
    });

    const updateActiveIndexOnScroll = () => {
      if (!isAnimatingRef.current) {
        setActiveIdx(getActiveSectionIndex());
      }
    };

    window.addEventListener('scroll', updateActiveIndexOnScroll, { passive: true });

    return () => {
      observer.kill();
      window.removeEventListener('scroll', updateActiveIndexOnScroll);
    };
  }, []);

  // Idle pulse loop for direction indicator arrow chevron
  useEffect(() => {
    const gsapEngine =
      (typeof window !== 'undefined' && (window as unknown as { gsap?: typeof gsap }).gsap) || gsap;
    if (!chevronRef.current) return;

    pulseTweenRef.current = gsapEngine.to(chevronRef.current, {
      y: 6,
      opacity: 0.45,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      if (pulseTweenRef.current) {
        pulseTweenRef.current.kill();
      }
    };
  }, []);

  const isAtEnd = activeIdx >= SECTIONS.length - 1;
  const nextTarget = isAtEnd ? SECTIONS[0] : SECTIONS[activeIdx + 1];

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1.5 select-none"
      aria-live="polite"
    >
      <button
        onClick={() => scrollToSection(nextTarget)}
        disabled={isAnimatingState}
        className={`pointer-events-auto cursor-target group flex items-center gap-2.5 rounded-lg border px-3 py-2 font-mono text-[11px] shadow-lg backdrop-blur-md transition-all will-change-transform ${
          isDark
            ? 'border-white/10 bg-[#0A0A0E]/80 text-neutral-300 hover:border-white/30 hover:bg-[#121218] hover:text-white'
            : 'border-neutral-200 bg-white/85 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-950'
        }`}
        title={isAtEnd ? 'Return to Top Matrix' : `Snap to ${SECTION_LABELS[nextTarget]}`}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-xs"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
          />
          <span className="font-semibold tracking-wider">
            {SECTION_LABELS[SECTIONS[activeIdx]] || '01 // HERO'}
          </span>
        </div>

        <span className="opacity-40">/</span>

        {/* Direction indicator arrow chevron with GSAP idle pulse loop */}
        <div
          ref={chevronRef}
          className="flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ color: accentColor }}
        >
          {isAtEnd ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </div>
      </button>
    </div>
  );
};
