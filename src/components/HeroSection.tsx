import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroConfig } from '../types/hero';
import { VectorWordmark } from './VectorWordmark';
import { SplitTextBurst } from './SplitTextBurst';

interface HeroSectionProps {
  config: HeroConfig;
  onOpenCustomizer?: () => void;
  onOpenRoadmap?: () => void;
  onToggleTheme?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isDark = config.colorMode === 'dark';
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Smooth entrance animation
      const entryTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      entryTl.fromTo(
        '.hero-center-content',
        { opacity: 0, scale: 0.94, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power2.out' },
        0.1
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isDark]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden select-none transition-colors duration-500"
      style={{
        backgroundColor: config.backgroundColor,
      }}
    >
      {/* Center Stage: Interactive Vector Wordmark + Role Burst Ticker */}
      <div className="hero-center-content relative z-10 my-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8 select-none touch-pan-y">
        {/* Vector Wordmark Canvas Stage */}
        <div className="w-full flex items-center justify-center touch-pan-y">
          <VectorWordmark
            text={config.wordmarkText || 'NEERAJ MAYEKAR'}
            font={{
              fontFamily: config.fontFamily || 'Inter, system-ui, sans-serif',
              fontWeight: config.fontWeight || 800,
              fontSize: `${isMobile ? Math.min(90, config.fontSize || 180) : (config.fontSize || 180)}px`,
              letterSpacing: config.letterSpacing || '-0.03em',
              textAlign: 'center',
            }}
            background="transparent"
            textColor={config.textColor || (isDark ? '#F8FAFC' : '#09090B')}
            shade={config.shadeColor || (isDark ? '#0F172A' : '#E2E8F0')}
            accent={config.accentColor || '#38BDF8'}
            colorMode={config.colorMode}
            reach={isMobile ? 180 : (config.reach || 320)}
            speed={config.speed || 55}
            damping={config.damping || 65}
            handles={{
              size: isMobile ? 32 : (config.handleSize || 109),
              spread: isMobile ? 16 : (config.handleSpread || 27),
              labels: isMobile ? false : (config.showLabels ?? true),
            }}
            style={{
              minHeight: isMobile ? 220 : 400,
            }}
            className="w-full"
          />
        </div>

        {/* Role Kicker Ticker */}
        <div className="mt-2 sm:mt-4 flex flex-col items-center justify-center">
          <SplitTextBurst
            roles={['Full Stack Developer', 'GEN AI Enthusiast', 'AI Engineer']}
            intervalMs={3200}
            accentColor={config.accentColor}
            isDark={isDark}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
