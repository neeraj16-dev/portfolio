import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ColorMode } from '../types/hero';

interface SectionGatewayProps {
  exitNum?: string;
  exitLabel?: string;
  enterNum?: string;
  enterLabel?: string;
  accentColor: string;
  colorMode?: ColorMode;
  themeId?: string;
  showLiquidWave?: boolean;
}

export const SectionGateway: React.FC<SectionGatewayProps> = ({
  accentColor,
  colorMode = 'dark',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = colorMode === 'dark';

  useEffect(() => {
    const ScrollTriggerPlugin =
      (typeof window !== 'undefined' &&
        (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger) ||
      ScrollTrigger;

    if (ScrollTriggerPlugin && gsap) {
      gsap.registerPlugin(ScrollTriggerPlugin);
    }

    const ctx = gsap.context(() => {
      // Laser horizon seam expansion
      gsap.fromTo(
        '.gateway-laser-line',
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 95%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [accentColor]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-0 select-none pointer-events-none z-30 flex items-center justify-center -my-[0.5px]"
      aria-hidden="true"
    >
      {/* Background ambient glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-80 rounded-full blur-[50px] opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Laser Horizon Line with Central Diamond */}
      <div className="relative flex items-center justify-center w-full px-4 sm:px-8">
        <div
          className="gateway-laser-line h-[1.5px] w-full max-w-6xl origin-center"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />

        {/* Central Caliper Diamond Node */}
        <div
          className="absolute left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 border"
          style={{
            backgroundColor: isDark ? '#09090D' : '#FFFFFF',
            borderColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
      </div>
    </div>
  );
};

export default SectionGateway;
