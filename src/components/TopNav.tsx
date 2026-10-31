import React from 'react';
import { motion } from 'framer-motion';
import { Send, Sliders, Volume2, VolumeX } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ColorMode } from '../types/hero';
import { triggerSectionTransition } from './SectionTransitionOverlay';
import { smoothScrollTo } from '../hooks/useSmoothScroll';
import { useSpatialAudio } from '../hooks/useSpatialAudio';

interface TopNavProps {
  brandName?: string;
  isCustomizerOpen?: boolean;
  isVisible?: boolean;
  colorMode: ColorMode;
  accentColor: string;
  onToggleColorMode: () => void;
  onToggleCustomizer?: () => void;
  onOpenRoadmap: () => void;
  onOpenContact: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  brandName = 'NEERAJ MAYEKAR',
  isCustomizerOpen,
  isVisible = true,
  colorMode,
  accentColor,
  onToggleColorMode,
  onToggleCustomizer,
  onOpenRoadmap,
  onOpenContact,
}) => {
  const isDark = colorMode === 'dark';
  const { isAudioEnabled, toggleAudio } = useSpatialAudio();

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isVisible ? 0 : -80,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        isDark
          ? 'border-white/10 bg-[#050505]/85 text-[#f4f4f5]'
          : 'border-neutral-200 bg-white/85 text-neutral-900 shadow-xs'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          className="cursor-target flex items-center gap-2 font-mono text-sm font-bold tracking-wider transition-opacity hover:opacity-80 sm:text-base"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs font-black text-white"
            style={{ backgroundColor: accentColor }}
          >
            NM
          </span>
          <span className="hidden font-mono text-xs tracking-widest uppercase sm:inline opacity-90">
            {brandName.split(' ')[0]} // ARCHITECT
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              triggerSectionTransition('hero', 'HERO // VECTOR MATRIX', '01');
              smoothScrollTo('#hero');
            }}
            className={`cursor-target group flex items-center gap-1 text-xs font-medium tracking-wide transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span>01 Hero</span>
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              triggerSectionTransition('about', 'ABOUT ME & VISION', '02');
              smoothScrollTo('#about');
            }}
            className={`cursor-target group flex items-center gap-1 text-xs font-medium tracking-wide transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span>02 About</span>
          </a>
          <a
            href="#skills"
            onClick={(e) => {
              e.preventDefault();
              triggerSectionTransition('skills', 'TECHNICAL CAPABILITIES', '03');
              smoothScrollTo('#skills');
            }}
            className={`cursor-target group flex items-center gap-1.5 text-xs font-medium tracking-wide transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-none stroke-current opacity-70 group-hover:opacity-100 transition-opacity"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 18L22 12L16 6M8 6L2 12L8 18" />
            </svg>
            <span>03 Skills</span>
          </a>
          <a
            href="#works"
            onClick={(e) => {
              e.preventDefault();
              triggerSectionTransition('works', 'FEATURED CASE STUDIES', '04');
              smoothScrollTo('#works');
            }}
            className={`cursor-target group flex items-center gap-1 text-xs font-medium tracking-wide transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <span>04 Works</span>
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              triggerSectionTransition('contact', 'INQUIRIES & COMMUNICATIONS', '05');
              smoothScrollTo('#contact');
            }}
            className={`cursor-target group flex items-center gap-1.5 text-xs font-medium tracking-wide transition-colors ${
              isDark ? 'text-neutral-200 hover:text-white' : 'text-neutral-900 hover:text-black'
            }`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span>05 Contact</span>
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Spatial Cinematic Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`cursor-target flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              isAudioEnabled
                ? isDark
                  ? 'border-white/15 bg-white/5 text-neutral-200 hover:text-white'
                  : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:text-black'
                : isDark
                ? 'border-white/5 bg-transparent text-neutral-500 hover:text-neutral-400'
                : 'border-neutral-200 bg-transparent text-neutral-400 hover:text-neutral-600'
            }`}
            title={isAudioEnabled ? 'Mute Spatial Audio Effects' : 'Enable Spatial Audio Effects'}
            aria-label={isAudioEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5" style={{ color: accentColor }} />
                <span className="hidden sm:inline text-[10px] font-mono tracking-wider">SFX</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[10px] font-mono tracking-wider opacity-60">MUTED</span>
              </>
            )}
          </button>

          <ThemeToggle
            mode={colorMode}
            onToggle={onToggleColorMode}
            accentColor={accentColor}
          />

          {onToggleCustomizer && (
            <button
              onClick={onToggleCustomizer}
              className={`cursor-target flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isDark
                  ? 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                  : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-black'
              }`}
              title="Open Global Customizer Studio"
            >
              <Sliders className="h-3.5 w-3.5" style={{ color: accentColor }} />
              <span className="hidden lg:inline text-[11px] font-mono">STUDIO</span>
            </button>
          )}

          <button
            onClick={onOpenContact}
            className={`cursor-target flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              isDark
                ? 'bg-white text-neutral-950 hover:bg-neutral-200'
                : 'bg-black text-white hover:bg-neutral-800 shadow-sm'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">Collaborate</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNav;
