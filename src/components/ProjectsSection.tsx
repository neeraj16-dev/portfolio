import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorMode } from '../types/hero';
import { FEATURED_PROJECTS, FeaturedProject } from '../data/featuredProjectsData';
import { FeaturedProjectCard } from './FeaturedProjectCard';

type FilterCategory = 'ALL' | 'AI' | 'ML' | 'SDE' | 'Client Based';

const FILTER_CATEGORIES: FilterCategory[] = ['ALL', 'AI', 'ML', 'SDE', 'Client Based'];

interface ProjectsSectionProps {
  projects?: any;
  accentColor?: string;
  colorMode?: ColorMode;
  headline?: string;
  tagline?: string;
  tiltStrength?: number;
  showMetrics?: boolean;
  onOpenRoadmap?: () => void;
  onOpenContact?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  accentColor = '#ef4444',
  colorMode = 'dark',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isDark = colorMode === 'dark';
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');

  // Filtered projects list
  const filteredProjects =
    activeFilter === 'ALL'
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.categories.includes(activeFilter));

  // Count helper
  const getCategoryCount = (category: FilterCategory) => {
    if (category === 'ALL') return FEATURED_PROJECTS.length;
    return FEATURED_PROJECTS.filter((p) => p.categories.includes(category)).length;
  };

  // Ensure ScrollTrigger is registered
  useEffect(() => {
    const ScrollTriggerPlugin =
      (typeof window !== 'undefined' &&
        (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger) ||
      ScrollTrigger;

    if (ScrollTriggerPlugin && gsap) {
      gsap.registerPlugin(ScrollTriggerPlugin);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects-divider-line',
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

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      });
      revealTl.fromTo(
        '.projects-headline',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Watermark Parallax Drift
      gsap.to('.projects-watermark-num', {
        y: 125,
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
      id="works"
      className={`relative min-h-screen px-4 py-24 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-[#060608] text-[#F4F4F5]'
          : 'bg-neutral-50 text-neutral-900'
      }`}
    >

      {/* Atmospheric Spatial Red Glow */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-[350px] w-[700px] rounded-full opacity-15 transition-opacity duration-700 will-change-transform transform-gpu"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.8) 0%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      {/* Atmospheric Parallax Numeric Watermark */}
      <div
        className="projects-watermark-num pointer-events-none absolute left-4 sm:left-14 top-12 select-none font-mono text-[140px] sm:text-[260px] font-black leading-none opacity-[0.025] dark:opacity-[0.045] transition-opacity will-change-transform transform-gpu"
        aria-hidden="true"
      >
        04
      </div>

      <div className="projects-content-wrapper relative z-10 mx-auto max-w-7xl will-change-transform">
        {/* Section Headline */}
        <div className="projects-headline flex flex-col items-center justify-center text-center opacity-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-red-500">
              // 04 FEATURED PROJECTS
            </span>
            <span className="h-1 w-6 rounded-xs bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </div>
          <h2
            className={`mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-none ${
              isDark ? 'text-white' : 'text-neutral-950'
            }`}
          >
            Featured Projects
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl font-normal">
            Production-grade distributed systems, generative AI pipelines, and high-performance full-stack architectures.
          </p>
        </div>

        {/* Filter Bar: AI, ML, SDE, ALL, Client Based */}
        <div className="mt-12 mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {FILTER_CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat);
            const isActive = activeFilter === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`cursor-target font-mono text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 select-none border ${
                  isActive
                    ? 'bg-red-600 text-white font-bold border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.45)] scale-105'
                    : isDark
                    ? 'bg-neutral-950/80 text-neutral-400 border-white/10 hover:text-white hover:border-red-500/40 hover:bg-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:text-black hover:border-red-500/40'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive
                      ? 'bg-black/30 text-white'
                      : isDark
                      ? 'bg-neutral-900 text-neutral-400'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Cards Container */}
        <div className="space-y-8 sm:space-y-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <FeaturedProjectCard
                  project={project}
                  accentColor="#ef4444"
                  isDark={isDark}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom subtle indicator */}
        <div className="mt-16 text-center">
          <p className="font-mono text-xs text-neutral-500 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            Showing {filteredProjects.length} of {FEATURED_PROJECTS.length} curated engineering deliverables
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
