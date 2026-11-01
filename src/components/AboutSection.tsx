'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, type Variants } from 'framer-motion';
import { Github, Linkedin, FileText, ArrowUpRight } from 'lucide-react';
import { ColorMode } from '../types/hero';
import Lanyard from './Lanyard';

// LeetCode Official Silhouette SVG Icon
const LeetCodeIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382H10.617z" />
  </svg>
);

interface AboutSectionProps {
  accentColor: string;
  colorMode?: ColorMode;
  brandName?: string;
  quote?: string;
  bio?: string;
  years?: number;
  latency?: number;
  uptime?: number;
  deployments?: number;
  imageSrc?: string;
  onOpenRoadmap?: () => void;
  onOpenContact?: () => void;
  onNavigateResume?: () => void;
}

// ─── Subtle Framer Motion Reveal Variants ────────────────────────────────────
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const leftColContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const bioContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.06,
    },
  },
};

const bioParagraphVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const idCardColVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  accentColor,
  colorMode = 'dark',
  brandName = 'Neeraj Mayekar',
  bio,
  quote,
  imageSrc,
  onOpenRoadmap,
  onOpenContact,
  onNavigateResume,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isDark = colorMode === 'dark';

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateResume) {
      onNavigateResume();
    } else {
      window.history.pushState(null, '', '/resume');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  useEffect(() => {
    const gsapEngine = (window as unknown as { gsap?: typeof gsap }).gsap || gsap;
    const ScrollTriggerEngine =
      (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger || ScrollTrigger;

    if (gsapEngine && ScrollTriggerEngine) {
      gsapEngine.registerPlugin(ScrollTriggerEngine);
    }

    const ctx = (gsapEngine || gsap).context(() => {
      gsapEngine.fromTo(
        '.about-portal-glow',
        { opacity: 0 },
        {
          opacity: isDark ? 0.16 : 0.08,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isDark]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`relative min-h-screen w-full px-4 py-20 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-[#08080A]/95 text-[#F4F4F5]'
          : 'bg-white/95 text-neutral-900'
      }`}
    >

      {/* Atmospheric Theme Glow */}
      <div
        className="about-portal-glow pointer-events-none absolute -top-40 left-1/2 h-[340px] w-[750px] -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-700 will-change-transform transform-gpu"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor} 0%, transparent 70%)`,
          transform: 'translate3d(-50%, 0, 0)',
        }}
      />

      <div className="about-content-wrapper relative z-10 mx-auto w-full max-w-7xl">
        {/* Top Centered Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headerVariants}
          className="flex w-full flex-col items-center justify-center text-center"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">
              // 02 PROFILE &amp; IDENTITY
            </span>
            <span className="h-1 w-6 rounded-xs bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </div>

          <h2
            className={`mt-3 text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-neutral-950'
            }`}
          >
            The developer{' '}
            <span className="font-serif italic font-normal text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.35)]">
              behind the ideas.
            </span>
          </h2>
        </motion.div>

        {/* 2-Column Content Grid: Left Text & Skills, Right Hanging Card */}
        <div className="mt-14 grid w-full grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Bio Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-7 lg:col-span-7 w-full min-w-0"
          >
            {/* Primary Bio Narrative */}
            <div
              className={`space-y-5 text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              {/* Separate "Hello, I'm" and big bold "Neeraj \n Mayekar" */}
              <div className="space-y-1.5 mb-5">
                <span className="font-mono text-xl sm:text-2xl lg:text-3xl tracking-tight text-neutral-400 font-medium block">
                  Hello, I&apos;m
                </span>
                <div
                  className={`font-space font-bold tracking-tight text-4xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.92] ${
                    isDark ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  <span className="block">Neeraj</span>
                  <span className="block">Mayekar</span>
                </div>
              </div>

              <p>
                A Software Development &amp; AI Engineer who loves turning ideas into real, working products. I like building things fast. Using strong computer science basics alongside modern AI tools, I can quickly prototype an idea, test it, and turn it into reliable software without wasting time.
              </p>
              <p
                className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
              >
                I focus on the complete picture of how an app works. Instead of just playing with AI models, I enjoy connecting every part - designing clean backend APIs, setting up databases, running services in Docker, and polishing the final user interface. Whether that means building real-time data pipelines, smart search engines, or AI agents that verify their own work, I care about code that is fast, clean, and built to last.
              </p>
              <p
                className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}
              >
                I am currently pursuing my Master&apos;s in Computer Applications, working mainly with Python, Java, C++, and modern web tools. I&apos;m looking for engineering roles where I can move quickly, solve challenging problems, and build software that genuinely helps people.
              </p>
            </div>

            {/* Social & Professional Action Links Strip */}
            <div
              className="pt-2 flex flex-wrap items-center gap-3 sm:gap-3.5"
            >
              {/* GitHub Button */}
              <a
                href="https://github.com/neeraj16-dev"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="GitHub"
                className={`cursor-target group relative inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 active:scale-95 ${
                  isDark
                    ? 'border-white/10 bg-white/[0.04] text-neutral-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
                    : 'border-neutral-300 bg-black/[0.03] text-neutral-800 hover:border-neutral-400 hover:bg-black/[0.06] hover:text-black'
                }`}
              >
                <Github className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* LinkedIn Button */}
              <a
                href="https://linkedin.com/in/neerajmayekar"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="LinkedIn"
                className={`cursor-target group relative inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 active:scale-95 ${
                  isDark
                    ? 'border-white/10 bg-white/[0.04] text-neutral-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
                    : 'border-neutral-300 bg-black/[0.03] text-neutral-800 hover:border-neutral-400 hover:bg-black/[0.06] hover:text-black'
                }`}
              >
                <Linkedin className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* LeetCode Button */}
              <a
                href="https://leetcode.com/u/BlackLight__/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="LeetCode"
                className={`cursor-target group relative inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 active:scale-95 ${
                  isDark
                    ? 'border-white/10 bg-white/[0.04] text-neutral-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
                    : 'border-neutral-300 bg-black/[0.03] text-neutral-800 hover:border-neutral-400 hover:bg-black/[0.06] hover:text-black'
                }`}
              >
                <LeetCodeIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>LeetCode</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Resume Button */}
              <a
                href="/resume"
                onClick={handleResumeClick}
                data-cursor-label="Resume"
                className="cursor-target group relative inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 shadow-sm"
                style={{
                  borderColor: isDark ? `${accentColor}40` : `${accentColor}60`,
                  backgroundColor: isDark ? `${accentColor}12` : `${accentColor}18`,
                  color: isDark ? '#FFFFFF' : '#000000',
                }}
              >
                <FileText className="h-4 w-4 transition-transform group-hover:scale-110" style={{ color: accentColor }} />
                <span>Resume</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: accentColor }} />
              </a>
            </div>
          </motion.div>

          {/* Right Column: 3D Physics Lanyard ID Card */}
          <motion.div
            id="about-card-target"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={idCardColVariants}
            className="flex flex-col items-center justify-start lg:col-span-5 lg:pt-2 w-full min-w-0"
          >
            <div className="w-full max-w-[440px] mx-auto h-[420px] sm:h-[540px] lg:h-[600px] relative select-none">
              <Lanyard
                frontImage={imageSrc && imageSrc !== '/IMG_6368.PNG' ? imageSrc : '/card-front.png'}
                backImage="/card-back.png"
                strapImage="/band.png"
                cardColor="#0a0a0f"
                finish="glossy"
                metal="silver"
                orientation="portrait"
                interactive={true}
                intro={true}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
