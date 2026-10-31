import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Layers, Database, Wrench } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import CircularCarousel from './CircularCarousel';
import { CIRCULAR_CAROUSEL_SKILLS, SKILL_CATEGORIES } from '../data/skillsLogos';
import { ColorMode } from '../types/hero';
import { TechItem } from '../types/tech';

interface SkillsSectionProps {
  accentColor: string;
  colorMode?: ColorMode;
  brandName?: string;
  capabilitiesTitle?: string;
  techCapabilities?: TechItem[];
  onOpenRoadmap?: () => void;
  onOpenContact?: () => void;
}

const categoryIcons = {
  languages: Code2,
  frameworks: Layers,
  databases: Database,
  tools: Wrench,
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  accentColor,
  colorMode = 'dark',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isDark = colorMode === 'dark';

  useEffect(() => {
    const gsapEngine = (window as unknown as { gsap?: typeof gsap }).gsap || gsap;
    const ScrollTriggerEngine =
      (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger || ScrollTrigger;

    if (gsapEngine && ScrollTriggerEngine) {
      gsapEngine.registerPlugin(ScrollTriggerEngine);
    }

    const ctx = (gsapEngine || gsap).context(() => {
      gsapEngine.fromTo(
        '.skills-divider-line',
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            once: true,
          },
        }
      );

      gsapEngine.fromTo(
        '.skills-portal-glow',
        { opacity: 0, scaleY: 0 },
        {
          opacity: isDark ? 0.16 : 0.08,
          scaleY: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );

      // Watermark Parallax Drift
      gsapEngine.to('.skills-watermark-num', {
        y: 110,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isDark]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-14 sm:pb-20 overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-[#08080A]/60 backdrop-blur-[2px] text-[#F4F4F5]'
          : 'bg-white/70 backdrop-blur-[2px] text-neutral-900'
      }`}
    >

      {/* Atmospheric Ambient Glow */}
      <div
        className="skills-portal-glow pointer-events-none absolute -top-40 left-1/2 h-[340px] w-[750px] -translate-x-1/2 rounded-full opacity-0 blur-[120px] transition-all duration-700"
        style={{ backgroundColor: accentColor }}
      />

      {/* Atmospheric Watermark */}
      <div
        className="skills-watermark-num pointer-events-none absolute right-4 sm:right-16 top-12 select-none font-mono text-[140px] sm:text-[260px] font-black leading-none opacity-[0.025] dark:opacity-[0.045] transition-opacity"
        aria-hidden="true"
      >
        03
      </div>

      <div className="skills-content-wrapper relative z-10 mx-auto max-w-7xl will-change-transform w-full">
        {/* Section Header */}
        <ScrollReveal delay={0.15} yOffset={25} threshold={0.15}>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">
                // 03 TECHNICAL STACK &amp; CAPABILITIES
              </span>
              <span className="h-1 w-6 rounded-xs bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            </div>
            <h2
              className={`mt-2 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-none ${
                isDark ? 'text-white' : 'text-neutral-950'
              }`}
            >
              Skills
            </h2>
          </div>
        </ScrollReveal>

        {/* 3D Circular Carousel directly below the skills text */}
        <ScrollReveal delay={0.25} yOffset={20} threshold={0.1}>
          <div
            className="-mt-2 sm:-mt-4 select-none pointer-events-none relative w-full h-[270px] sm:h-[330px] md:h-[380px]"
          >
            <CircularCarousel
              items={CIRCULAR_CAROUSEL_SKILLS}
              cardWidth={120}
              aspectRatio={1}
              gap={16}
              speed={14}
              tilt={-10}
              perspective={2000}
              fadeColor={isDark ? '#08080A' : '#FAFAFA'}
            />
          </div>
        </ScrollReveal>

        {/* Categorized Skills Breakdown (Languages, Frameworks, Databases, Tools) */}
        <ScrollReveal delay={0.2} yOffset={20} threshold={0.08}>
          <div className="mt-6 sm:mt-12 w-full">
            {/* Header bar for competencies */}
            <div className="flex items-center justify-between mb-5 sm:mb-6 pb-3 border-b border-red-500/40">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-red-500">
                  // CORE COMPETENCIES
                </span>
                <span className="h-1 w-5 rounded-xs bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              </div>
              <span className="font-mono text-[10px] sm:text-xs opacity-50 tracking-wider hidden sm:inline">
                STRUCTURED STACK BREAKDOWN
              </span>
            </div>

            {/* 4 Category Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {SKILL_CATEGORIES.map((category) => {
                const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons] || Code2;
                return (
                  <div
                    key={category.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between ${
                      isDark
                        ? 'border-white/10 bg-[#0E0E14]/80 hover:border-white/20 shadow-lg shadow-black/30'
                        : 'border-neutral-200/90 bg-white/90 hover:border-neutral-300 shadow-md shadow-neutral-200/40'
                    }`}
                  >
                    <div>
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-red-500/30">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-lg border transition-colors border-red-500/30 bg-red-500/10 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                          >
                            <IconComponent className="h-3.5 w-3.5 text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold tracking-tight text-red-500">
                              {category.title}
                            </h3>
                          </div>
                        </div>
                        <span
                          className="font-mono text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md border border-red-500/30 bg-red-500/10 text-red-400"
                        >
                          {category.skills.length}
                        </span>
                      </div>

                      {/* Skill Text Pills (no logos, only text) */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {category.skills.map((skillName) => (
                          <div
                            key={skillName}
                            data-cursor-label={skillName}
                            className={`cursor-target group/chip rounded-lg border px-3 py-1.5 transition-all duration-200 ${
                              isDark
                                ? 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.08] text-neutral-300 hover:text-white hover:scale-[1.03]'
                                : 'border-neutral-200 bg-black/[0.02] hover:border-neutral-300 hover:bg-black/[0.05] text-neutral-700 hover:text-black hover:scale-[1.03]'
                            }`}
                          >
                            <span className="font-mono text-xs font-medium tracking-wide">
                              {skillName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SkillsSection;

