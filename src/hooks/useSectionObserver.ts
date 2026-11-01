import { useState, useEffect, useRef, useMemo } from 'react';

export interface SectionObserverOptions {
  rootMargin?: string;
  threshold?: number | number[];
  topOffset?: number;
  bottomOffset?: number;
  onSectionChange?: (sectionId: string) => void;
}

/**
 * High-performance, low-overhead IntersectionObserver hook for continuous scroll synchronization.
 * Uses a single Observer instance, requestAnimationFrame-batched state updates,
 * and boundary edge detection (top of document and bottom of document) to ensure
 * the active section indicator stays locked in perfect sync with the viewport.
 */
export function useSectionObserver(
  sectionIds: string[],
  options: SectionObserverOptions = {}
): string {
  const {
    rootMargin = '-15% 0px -25% 0px',
    threshold = [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    topOffset = 120,
    bottomOffset = 100,
    onSectionChange,
  } = options;

  // Stable section IDs representation to prevent unnecessary observer resets
  const sectionIdsKey = useMemo(() => sectionIds.join('|'), [sectionIds]);
  const stableSectionIds = useMemo(() => sectionIds, [sectionIdsKey]);

  const [activeSectionId, setActiveSectionId] = useState<string>(() => stableSectionIds[0] || 'hero');
  const activeSectionRef = useRef<string>(stableSectionIds[0] || 'hero');
  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;

  useEffect(() => {
    if (typeof window === 'undefined' || stableSectionIds.length === 0) return;

    const visibilityRatios = new Map<string, number>();
    let rafId: number | null = null;

    const commitActiveSection = (newId: string) => {
      if (newId && newId !== activeSectionRef.current) {
        activeSectionRef.current = newId;
        setActiveSectionId(newId);
        onSectionChangeRef.current?.(newId);
      }
    };

    const evaluateBestSection = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // 1. Extreme Top Boundary Guard
      if (scrollY < topOffset) {
        commitActiveSection(stableSectionIds[0]);
        return;
      }

      // 2. Extreme Bottom Boundary Guard
      if (scrollHeight - (scrollY + clientHeight) < bottomOffset) {
        commitActiveSection(stableSectionIds[stableSectionIds.length - 1]);
        return;
      }

      // 3. Greatest visibility ratio in viewport
      let highestRatio = 0;
      let highestId = activeSectionRef.current;

      visibilityRatios.forEach((ratio, id) => {
        if (ratio > highestRatio) {
          highestRatio = ratio;
          highestId = id;
        }
      });

      if (highestRatio > 0.05) {
        commitActiveSection(highestId);
      } else {
        // Fallback focal line check if elements are large and ratio is dispersed
        const focalLine = clientHeight * 0.35;
        for (const id of stableSectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= focalLine && rect.bottom > focalLine) {
              commitActiveSection(id);
              break;
            }
          }
        }
      }
    };

    const requestEvaluation = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        evaluateBestSection();
      });
    };

    // Initialize IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityRatios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        });
        requestEvaluation();
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    // Observe all valid section DOM nodes
    stableSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    // Lightweight boundary checks for top and bottom edges without reflows
    let scrollDebounce: number | null = null;
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY < topOffset) {
        commitActiveSection(stableSectionIds[0]);
        return;
      }
      const clientHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollHeight - (scrollY + clientHeight) < bottomOffset) {
        commitActiveSection(stableSectionIds[stableSectionIds.length - 1]);
        return;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    requestEvaluation();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [stableSectionIds, sectionIdsKey, rootMargin, topOffset, bottomOffset]);

  return activeSectionId;
}
