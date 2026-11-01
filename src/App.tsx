/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TargetCursor from './components/TargetCursor';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { ResumePage } from './components/ResumePage';
import { GlobalCustomizer } from './components/GlobalCustomizer';
import { SectionRoadmapModal } from './components/SectionRoadmapModal';
import { ContactModal } from './components/ContactModal';
import { GlassDock } from './components/GlassDock';
import { ThemeTransitionOverlay } from './components/ThemeTransitionOverlay';
import { ArchitecturalPreloader } from './components/ArchitecturalPreloader';
import { BackgroundParticles } from './components/BackgroundParticles';
import { SectionGateway } from './components/SectionGateway';
import { ViewportPageTransition } from './components/ViewportPageTransition';
import {
  SectionTransitionOverlay,
  triggerSectionTransition,
} from './components/SectionTransitionOverlay';
import {
  HeroConfig,
  DEFAULT_HERO_CONFIG,
  getThemeForMode,
  ColorMode,
} from './types/hero';
import { useSEO } from './hooks/useSEO';
import { useSmoothScroll, smoothScrollTo } from './hooks/useSmoothScroll';
import { spatialAudio } from './hooks/useSpatialAudio';

const STORAGE_KEY = 'interactive_portfolio_hero_config_v3';

export default function App() {
  useSmoothScroll();
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.wordmarkText === 'MAHIRAJ SOLANKI') {
          parsed.wordmarkText = 'NEERAJ MAYEKAR';
        }
        if (parsed.themeId !== 'white' && parsed.themeId !== 'black') {
          parsed.themeId = parsed.colorMode === 'dark' ? 'black' : 'white';
          const theme = getThemeForMode(parsed.themeId, parsed.colorMode || 'light');
          parsed.accentColor = theme.accentColor;
          parsed.secondaryAccent = theme.secondaryAccent;
          parsed.backgroundColor = theme.backgroundColor;
          parsed.shadeColor = theme.shadeColor;
          parsed.textColor = theme.textColor;
          parsed.backgroundGradient = theme.backgroundGradient;
        } else if (parsed.backgroundGradient && parsed.backgroundGradient.includes('radial-gradient')) {
          parsed.backgroundGradient = 'none';
        }
        if (parsed.colorMode === 'light' && (parsed.textColor === '#09090B' || !parsed.textColor)) {
          const theme = getThemeForMode(parsed.themeId || 'white', 'light');
          parsed.textColor = theme.textColor;
          parsed.shadeColor = theme.shadeColor;
        }
        if (!parsed.projects || !Array.isArray(parsed.projects) || parsed.projects.length === 0) {
          parsed.projects = DEFAULT_HERO_CONFIG.projects;
        }
        if (!parsed.techCapabilities || !Array.isArray(parsed.techCapabilities) || parsed.techCapabilities.length === 0) {
          parsed.techCapabilities = DEFAULT_HERO_CONFIG.techCapabilities;
        }
        if (!parsed.aboutCapabilitiesTitle) {
          parsed.aboutCapabilitiesTitle = DEFAULT_HERO_CONFIG.aboutCapabilitiesTitle;
        }
        if (parsed.contactEmail === 'princerajput.rk7@gmail.com' || !parsed.contactEmail) {
          parsed.contactEmail = 'neerajmayekar16@gmail.com';
        }
        return { ...DEFAULT_HERO_CONFIG, ...parsed };
      }
    } catch {
      // storage parsing fallback
    }
    return DEFAULT_HERO_CONFIG;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setPathname(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const [themeTransition, setThemeTransition] = useState<{
    isTransitioning: boolean;
    targetMode: ColorMode;
    accentColor: string;
  }>({
    isTransitioning: false,
    targetMode: heroConfig.colorMode,
    accentColor: heroConfig.accentColor,
  });

  const isDark = heroConfig.colorMode === 'dark';

  // Synchronize document <html> classes with active color mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Dynamic SEO, GEO, meta tags, OpenGraph & Schema.org sync
  useSEO({
    brandName: heroConfig.wordmarkText || 'Neeraj Mayekar',
    roleTagline: heroConfig.roleTagline || 'Full Stack Developer & AI Engineer',
    location: heroConfig.contactLocation || 'Mumbai, India',
    activeModal: isRoadmapOpen ? 'roadmap' : isContactOpen ? 'contact' : null,
  });


  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(heroConfig));
    } catch {
      // private browsing or quota limits
    }
  }, [heroConfig]);

  const triggerThemeTransition = (targetMode: ColorMode, targetAccent: string) => {
    setThemeTransition({
      isTransitioning: true,
      targetMode,
      accentColor: targetAccent,
    });
    setTimeout(() => {
      setThemeTransition((prev) => ({ ...prev, isTransitioning: false }));
    }, 450);
  };

  // Dark Mode / Light Mode toggle handler with exact theme rules
  const handleToggleColorMode = () => {
    const nextMode: ColorMode = heroConfig.colorMode === 'dark' ? 'light' : 'dark';
    const targetThemeId = nextMode === 'dark' ? 'black' : 'white';
    const updatedTheme = getThemeForMode(targetThemeId, nextMode);

    spatialAudio.playThemeChime(nextMode === 'dark');
    triggerThemeTransition(nextMode, updatedTheme.accentColor);

    setHeroConfig((prev) => ({
      ...prev,
      colorMode: nextMode,
      themeId: updatedTheme.id,
      accentColor: updatedTheme.accentColor,
      secondaryAccent: updatedTheme.secondaryAccent,
      backgroundColor: updatedTheme.backgroundColor,
      shadeColor: updatedTheme.shadeColor,
      textColor: updatedTheme.textColor,
      backgroundGradient: updatedTheme.backgroundGradient,
    }));
  };

  const handleCustomizerChange = (updated: HeroConfig) => {
    if (updated.colorMode !== heroConfig.colorMode) {
      triggerThemeTransition(updated.colorMode, updated.accentColor);
    }
    setHeroConfig(updated);
  };

  const handleResetHero = () => {
    setHeroConfig(DEFAULT_HERO_CONFIG);
  };

  if (pathname === '/resume') {
    return (
      <div
        className={`relative min-h-screen antialiased transition-colors duration-500 overflow-x-hidden ${
          isDark ? 'text-[#f4f4f5] selection:bg-white/20 selection:text-white' : 'text-neutral-900 selection:bg-black/15 selection:text-black'
        }`}
      >
        <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn />
        <ResumePage
          accentColor={heroConfig.accentColor}
          colorMode={heroConfig.colorMode}
          onBack={() => navigateTo('/')}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen antialiased transition-colors duration-500 overflow-x-hidden ${
        isDark ? 'text-[#f4f4f5] selection:bg-white/20 selection:text-white' : 'text-neutral-900 selection:bg-black/15 selection:text-black'
      }`}
      style={{
        backgroundColor: heroConfig.backgroundColor,
      }}
    >
      {/* Precision Interactive Target Reticle Cursor */}
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn />

      {/* Dynamic Theme Atmospheric Background Gradient Layer */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-700 ease-out"
        style={{
          background:
            heroConfig.backgroundGradient ||
            `radial-gradient(ellipse 85% 55% at 50% -15%, ${heroConfig.accentColor}25, ${heroConfig.backgroundColor} 100%)`,
        }}
      />

      {/* Global Interactive Spatial Particles Layer */}
      <BackgroundParticles
        accentColor={heroConfig.accentColor}
        colorMode={heroConfig.colorMode}
      />

      {/* Main Content Flow */}
      <motion.main
        animate={{
          opacity: isRoadmapOpen || isContactOpen ? 0.72 : 1,
          scale: isRoadmapOpen || isContactOpen ? 0.985 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 w-full"
      >
        {/* Section 01: Hero Section */}
        <ViewportPageTransition id="page-sec-hero">
          <HeroSection
            config={heroConfig}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            onOpenRoadmap={() => setIsRoadmapOpen(true)}
            onToggleTheme={handleToggleColorMode}
          />
        </ViewportPageTransition>

        {/* Sector Gateway 01 -> 02 */}
        <SectionGateway
          exitNum="01"
          exitLabel="HERO MATRIX"
          enterNum="02"
          enterLabel="ABOUT ME"
          accentColor={heroConfig.accentColor}
          colorMode={heroConfig.colorMode}
        />

        {/* Section 02: About Me (Biographical Narrative & Philosophies) */}
        <ViewportPageTransition id="page-sec-about">
          <AboutSection
            accentColor={heroConfig.accentColor}
            colorMode={heroConfig.colorMode}
            brandName={heroConfig.wordmarkText}
            quote={heroConfig.aboutQuote}
            bio={heroConfig.aboutBio}
            years={heroConfig.aboutYears}
            latency={heroConfig.aboutLatency}
            uptime={heroConfig.aboutUptime}
            deployments={heroConfig.aboutDeployments}
            imageSrc={heroConfig.aboutImageSrc === '/IMG_6368.PNG' ? '/card-front.png' : (heroConfig.aboutImageSrc || '/card-front.png')}
            onOpenRoadmap={() => setIsRoadmapOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
            onNavigateResume={() => navigateTo('/resume')}
          />
        </ViewportPageTransition>

        {/* Sector Gateway 02 -> 03 */}
        <SectionGateway
          exitNum="02"
          exitLabel="ABOUT ME"
          enterNum="03"
          enterLabel="TECHNICAL CAPABILITIES"
          accentColor={heroConfig.accentColor}
          colorMode={heroConfig.colorMode}
        />

        {/* Section 03: Technical Capabilities & Skills Workbench */}
        <ViewportPageTransition id="page-sec-skills">
          <SkillsSection
            accentColor={heroConfig.accentColor}
            colorMode={heroConfig.colorMode}
            brandName={heroConfig.wordmarkText}
            capabilitiesTitle={heroConfig.aboutCapabilitiesTitle}
            techCapabilities={heroConfig.techCapabilities}
            onOpenRoadmap={() => setIsRoadmapOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        </ViewportPageTransition>

        {/* Sector Gateway 03 -> 04 */}
        <SectionGateway
          exitNum="03"
          exitLabel="CAPABILITIES"
          enterNum="04"
          enterLabel="FEATURED PROJECTS"
          accentColor={heroConfig.accentColor}
          colorMode={heroConfig.colorMode}
        />

        {/* Section 04: Featured Projects */}
        <ViewportPageTransition id="page-sec-works">
          <ProjectsSection
            projects={heroConfig.projects}
            accentColor={heroConfig.accentColor}
            colorMode={heroConfig.colorMode}
            headline={heroConfig.worksHeadline}
            tagline={heroConfig.worksTagline}
            tiltStrength={heroConfig.worksTiltStrength}
            showMetrics={heroConfig.worksShowMetrics}
            onOpenRoadmap={() => setIsRoadmapOpen(true)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        </ViewportPageTransition>

        {/* Sector Gateway 04 -> 05 */}
        <SectionGateway
          exitNum="04"
          exitLabel="FEATURED PROJECTS"
          enterNum="05"
          enterLabel="INQUIRIES & CONTACT"
          accentColor={heroConfig.accentColor}
          colorMode={heroConfig.colorMode}
        />

        {/* Section 05: Contact & Colophon */}
        <ViewportPageTransition id="page-sec-contact">
          <ContactSection
            accentColor={heroConfig.accentColor}
            colorMode={heroConfig.colorMode}
            brandName={heroConfig.wordmarkText}
            directEmail={heroConfig.contactEmail}
            status={heroConfig.contactStatus}
            location={heroConfig.contactLocation}
            timezone={heroConfig.contactTimezone}
            sla={heroConfig.contactSLA}
            githubUrl={heroConfig.contactGithub}
            linkedinUrl={heroConfig.contactLinkedin}
            twitterUrl={heroConfig.contactTwitter}
            onOpenRoadmap={() => setIsRoadmapOpen(true)}
          />
        </ViewportPageTransition>
      </motion.main>

      {/* Floating Bottom GlassDock Quick Navigation & Actions */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-24px)] sm:max-w-[calc(100vw-32px)]">
        <GlassDock
          accentColor={heroConfig.accentColor}
          colorMode={heroConfig.colorMode}
          items={[
            {
              title: 'Home',
              sectionId: 'hero',
              icon: () => null,
            },
            {
              title: 'About',
              sectionId: 'about',
              icon: () => null,
            },
            {
              title: 'Skills',
              sectionId: 'skills',
              icon: () => null,
            },
            {
              title: 'Works',
              sectionId: 'works',
              icon: () => null,
            },
            {
              title: 'Contact',
              sectionId: 'contact',
              icon: () => null,
            },
            {
              title: 'Theme',
              icon: () => null,
              onClick: handleToggleColorMode,
            },
            /*
            // [CUSTOMIZER BUTTON - See notes.txt to re-enable]
            // To re-enable the Customizer button in the GlassDock UI, simply uncomment the block below:
            {
              title: 'Customizer',
              icon: () => null,
              className: 'hidden sm:flex',
              onClick: () => setIsCustomizerOpen((prev) => !prev),
            },
            */
          ]}
        />
      </div>

      {/* Floating Global Customizer Studio Drawer */}
      {isCustomizerOpen && (
        <GlobalCustomizer
          config={heroConfig}
          onChange={handleCustomizerChange}
          onReset={handleResetHero}
          onClose={() => setIsCustomizerOpen(false)}
          onReplayBoot={() => {
            setIsCustomizerOpen(false);
            setIsLoading(true);
          }}
        />
      )}

      {/* Cinematic Architectural Preloader / Boot Sequence */}
      {isLoading && (
        <ArchitecturalPreloader
          brandName={heroConfig.wordmarkText}
          roleTagline={heroConfig.roleTagline}
          accentColor={heroConfig.accentColor}
          isDark={isDark}
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Architectural Sector Navigation Warp & Laser Scan Overlay */}
      <SectionTransitionOverlay
        accentColor={heroConfig.accentColor}
        colorMode={heroConfig.colorMode}
      />

      {/* Global Page-Wipe & Cross-Fade Theme Transition Overlay */}
      <ThemeTransitionOverlay
        isTransitioning={themeTransition.isTransitioning}
        targetMode={themeTransition.targetMode}
        accentColor={themeTransition.accentColor}
        onTransitionComplete={() =>
          setThemeTransition((prev) => ({ ...prev, isTransitioning: false }))
        }
      />

      {/* Section-by-Section Roadmap Modal */}
      <SectionRoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        colorMode={heroConfig.colorMode}
        accentColor={heroConfig.accentColor}
      />

      {/* Contact & Inquiries Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        brandName={heroConfig.wordmarkText}
        colorMode={heroConfig.colorMode}
        accentColor={heroConfig.accentColor}
        directEmail={heroConfig.contactEmail}
      />
    </div>
  );
}
