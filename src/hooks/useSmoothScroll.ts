import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export const useSmoothScroll = () => {
  useEffect(() => {
    // If reduced motion is requested, disable Lenis and rely on standard scroll
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      infinite: false,
      prevent: (node) => {
        if (!node || typeof (node as Element).closest !== 'function') return false;
        return Boolean(
          (node as Element).closest(
            '[data-lenis-prevent], aside, [role="dialog"], [data-modal], .overscroll-contain'
          )
        );
      },
    });

    window.__lenis = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Run Lenis in GSAP ticker loop for synchronized 60/120fps motion
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
};

export const smoothScrollTo = (target: string | HTMLElement, offset: number = 0) => {
  if (typeof window !== 'undefined' && window.__lenis) {
    window.__lenis.scrollTo(target, {
      offset,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
