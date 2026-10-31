'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import gsap from 'gsap';
import { Sliders, Sun, Moon } from 'lucide-react';
import { ColorMode } from '../types/hero';
import { useSectionObserver } from '../hooks/useSectionObserver';
import { smoothScrollTo } from '../hooks/useSmoothScroll';

type DockIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

export interface DockItem {
  title: string;
  icon: DockIcon;
  onClick?: () => void;
  href?: string;
  sectionId?: string;
  className?: string;
}

export interface GlassDockProps extends React.HTMLAttributes<HTMLDivElement> {
  items: DockItem[];
  dockClassName?: string;
  accentColor?: string;
  colorMode?: ColorMode;
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
}

const MorphingIcon = ({
  type,
  isActive,
  isSectionActive = false,
  colorMode = 'dark',
  accentColor,
  onClick,
  onMouseEnter,
}: {
  type: string;
  isActive: boolean;
  isSectionActive?: boolean;
  colorMode?: ColorMode;
  accentColor?: string;
  onClick: () => void;
  onMouseEnter?: () => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const isDark = colorMode === 'dark';

  const runFallbackBounce = (button: HTMLElement) => {
    gsap
      .timeline()
      .to(button, { scale: 1.28, duration: 0.16, ease: 'back.out(2)' })
      .to(button, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)' });
  };

  const handleMouseEnter = () => {
    onMouseEnter && onMouseEnter();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (buttonRef.current) {
      runFallbackBounce(buttonRef.current);
    }
    onClick();
  };

  const commonBtnClass = cn(
    'cursor-target flex h-10 w-10 items-center justify-center rounded-xl p-2 transition-colors duration-200',
    isSectionActive
      ? 'font-bold'
      : isActive
      ? isDark
        ? 'text-white'
        : 'text-black'
      : isDark
      ? 'text-neutral-400 hover:text-white'
      : 'text-neutral-600 hover:text-black'
  );

  const activeStyle = isSectionActive && accentColor ? { color: accentColor } : undefined;

  if (type === 'home' || type === 'hero') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        style={activeStyle}
        className={cn('home', commonBtnClass)}
        aria-label="Home"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-none stroke-current"
          strokeWidth={isSectionActive ? 2.2 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            ref={pathRef}
            d="M3 18V10.5339C3 9.57062 3.46259 8.66591 4.24353 8.1019L10.2435 3.76856C11.2921 3.01128 12.7079 3.01128 13.7565 3.76856L19.7565 8.1019C20.5374 8.66591 21 9.57062 21 10.5339V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18Z"
          />
        </svg>
      </button>
    );
  }

  if (type === 'blog' || type === 'works' || type === 'projects') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        style={activeStyle}
        className={cn('blog', commonBtnClass)}
        aria-label="Works & Case Studies"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path
            ref={pathRef}
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
          />
        </svg>
      </button>
    );
  }

  if (type === 'marker' || type === 'about' || type === 'vision') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        style={activeStyle}
        className={cn('marker', commonBtnClass)}
        aria-label="About & Vision"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-none stroke-current"
          strokeWidth={isSectionActive ? 2.2 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            ref={pathRef}
            d="M12 21C12 21 9.39536 18.8605 7.3637 16C6.06474 14.1711 5 12.0475 5 10C5 6.134 8.134 3 12 3C15.866 3 19 6.134 19 10C19 12.0475 17.9353 14.1711 16.6363 16C14.6046 18.8605 12 21 12 21Z"
          />
        </svg>
      </button>
    );
  }

  if (type === 'skills' || type === 'stack' || type === 'tech' || type === 'capabilities') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        style={activeStyle}
        className={cn('skills', commonBtnClass)}
        aria-label="Skills & Capabilities"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-none stroke-current"
          strokeWidth={isSectionActive ? 2.2 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path ref={pathRef} d="M16 18L22 12L16 6M8 6L2 12L8 18" />
        </svg>
      </button>
    );
  }

  if (type === 'email' || type === 'contact') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        style={activeStyle}
        className={cn('email', commonBtnClass)}
        aria-label="Contact Email"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path
            ref={pathRef}
            d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
          />
        </svg>
      </button>
    );
  }

  if (type === 'theme' || type === 'mode') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        className={cn('theme', commonBtnClass)}
        aria-label="Toggle Dark / Light Mode"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-amber-400" />
        ) : (
          <Moon className="h-5 w-5 text-neutral-800" />
        )}
      </button>
    );
  }

  if (type === 'customizer' || type === 'customize') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        className={cn('customizer', commonBtnClass)}
        aria-label="Global Studio Customizer"
      >
        <Sliders className="h-5 w-5 text-cyan-400 transition-transform group-hover:rotate-45" />
      </button>
    );
  }

  if (type === 'github') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        className={cn('github', commonBtnClass)}
        aria-label="GitHub"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path
            ref={pathRef}
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </button>
    );
  }

  if (type === 'linkedin') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        className={cn('linkedin', commonBtnClass)}
        aria-label="LinkedIn"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path
            ref={pathRef}
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          />
        </svg>
      </button>
    );
  }

  if (type === 'x') {
    return (
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        className={cn('x', commonBtnClass)}
        aria-label="X / Twitter"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path
            ref={pathRef}
            d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
          />
        </svg>
      </button>
    );
  }

  return null;
};

function isItemActive(item: DockItem, activeSectionId: string): boolean {
  if (item.sectionId) {
    return item.sectionId.toLowerCase() === activeSectionId.toLowerCase();
  }
  const type = item.title.toLowerCase();
  if (activeSectionId === 'hero' && (type === 'home' || type === 'hero')) return true;
  if (activeSectionId === 'about' && (type === 'marker' || type === 'about' || type === 'vision')) return true;
  if (activeSectionId === 'skills' && (type === 'skills' || type === 'stack' || type === 'tech' || type === 'capabilities')) return true;
  if (activeSectionId === 'works' && (type === 'blog' || type === 'works' || type === 'projects')) return true;
  if (activeSectionId === 'contact' && (type === 'email' || type === 'contact')) return true;
  return false;
}

export const GlassDock = React.forwardRef<HTMLDivElement, GlassDockProps>(
  (
    {
      items,
      className,
      dockClassName,
      accentColor,
      colorMode = 'dark',
      activeSection: controlledActiveSection,
      onSectionChange,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    // Stably derive target section IDs from item list
    const targetSectionIds = useMemo(() => {
      const ids: string[] = [];
      items.forEach((item) => {
        if (item.sectionId && !ids.includes(item.sectionId)) {
          ids.push(item.sectionId);
        }
      });
      return ids.length > 0 ? ids : ['hero', 'about', 'skills', 'works', 'contact'];
    }, [items]);

    // High-performance IntersectionObserver hook synchronization
    const observedSection = useSectionObserver(targetSectionIds, {
      onSectionChange,
    });

    const isDark = colorMode === 'dark';

    const currentActiveSection = controlledActiveSection || observedSection;

    const dockContainerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const entranceTlRef = useRef<gsap.core.Timeline | null>(null);
    const idlePulseTlRef = useRef<gsap.core.Timeline | null>(null);
    const idleTimerRef = useRef<NodeJS.Timeout | number | null>(null);

    const startIdlePulse = () => {
      if (idlePulseTlRef.current) {
        idlePulseTlRef.current.kill();
      }
      const gsapEngine = (window as unknown as { gsap?: typeof gsap }).gsap || gsap;
      if (!dockContainerRef.current) return;

      // Subtle scale pulse (1 -> 1.015 -> 1) every 3 seconds
      const tl = gsapEngine.timeline({ repeat: -1, repeatDelay: 1.8 });
      tl.to(dockContainerRef.current, {
        scale: 1.015,
        duration: 0.6,
        ease: 'sine.inOut',
      }).to(dockContainerRef.current, {
        scale: 1,
        duration: 0.6,
        ease: 'sine.inOut',
      });

      idlePulseTlRef.current = tl;
    };

    const stopIdlePulse = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      if (idlePulseTlRef.current) {
        idlePulseTlRef.current.kill();
        idlePulseTlRef.current = null;
      }
      const gsapEngine = (window as unknown as { gsap?: typeof gsap }).gsap || gsap;
      if (dockContainerRef.current) {
        gsapEngine.to(dockContainerRef.current, {
          scale: 1,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (idlePulseTlRef.current) {
        idlePulseTlRef.current.kill();
        idlePulseTlRef.current = null;
      }
      idleTimerRef.current = setTimeout(() => {
        startIdlePulse();
      }, 4000);
    };

    // 1. Mount entrance animation & idle pulse timer
    useEffect(() => {
      const gsapEngine = (window as unknown as { gsap?: typeof gsap }).gsap || gsap;

      if (dockContainerRef.current) {
        const entranceTl = gsapEngine.timeline();
        entranceTlRef.current = entranceTl;

        // Animate dock sliding up from y: 80px, opacity: 0
        entranceTl.fromTo(
          dockContainerRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'elastic.out(1, 0.5)',
          }
        );

        // Each dock item staggering 0.06s
        const validItems = itemRefs.current.filter(Boolean);
        if (validItems.length > 0) {
          entranceTl.fromTo(
            validItems,
            { y: 35, opacity: 0, scale: 0.7 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.9,
              stagger: 0.06,
              ease: 'elastic.out(1, 0.5)',
            },
            '-=0.9'
          );
        }
      }

      // 2. Start 4s idle timer on mount
      resetIdleTimer();

      return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (entranceTlRef.current) entranceTlRef.current.kill();
        if (idlePulseTlRef.current) idlePulseTlRef.current.kill();
        if (dockContainerRef.current) gsapEngine.killTweensOf(dockContainerRef.current);
        itemRefs.current.forEach((el) => {
          if (el) gsapEngine.killTweensOf(el);
        });
      };
    }, []);

    // 3. Item hover: scale target to 1.35, adjacent to 1.15 (macOS dock magnification)
    const handleItemHover = (index: number) => {
      stopIdlePulse();
      if (hoveredIndex !== null && index !== hoveredIndex) {
        setDirection(index > hoveredIndex ? 1 : -1);
      }
      setHoveredIndex(index);

      const gsapEngine = (window as unknown as { gsap?: typeof gsap }).gsap || gsap;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        let targetScale = 1;
        let targetY = 0;

        if (i === index) {
          targetScale = 1.35;
          targetY = -6;
        } else if (i === index - 1 || i === index + 1) {
          targetScale = 1.15;
          targetY = -3;
        }

        gsapEngine.to(el, {
          scale: targetScale,
          y: targetY,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };

    // On leave, spring back with elastic.out
    const handleDockMouseLeave = () => {
      setHoveredIndex(null);
      setDirection(0);

      const gsapEngine = (window as unknown as { gsap?: typeof gsap }).gsap || gsap;

      itemRefs.current.forEach((el) => {
        if (!el) return;
        gsapEngine.to(el, {
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: 'elastic.out(1, 0.45)',
          overwrite: 'auto',
        });
      });

      resetIdleTimer();
    };

    const getTooltipPosition = (index: number) => {
      return index * 48 + 12 - 28;
    };

    return (
      <div ref={ref} className={cn('w-max select-none', className)} {...props}>
        <div
          ref={dockContainerRef}
          className={cn(
            'glass-dock relative flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl transition-colors duration-300 will-change-transform',
            isDark
              ? 'border border-white/15 bg-[#0A0A0D]/85 shadow-[0_16px_36px_rgba(0,0,0,0.6)] backdrop-blur-2xl'
              : 'border border-neutral-300 bg-white/90 shadow-[0_16px_36px_rgba(0,0,0,0.12)] backdrop-blur-2xl',
            'justify-center',
            dockClassName
          )}
          onMouseEnter={stopIdlePulse}
          onMouseLeave={handleDockMouseLeave}
        >
          <AnimatePresence>
            {hoveredIndex !== null && items[hoveredIndex] && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: -50,
                  x: getTooltipPosition(hoveredIndex),
                }}
                exit={{ opacity: 0, scale: 0.92, y: 12 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                className="absolute top-0 left-0 pointer-events-none z-30"
              >
                <div
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap shadow-xl flex items-center justify-center border',
                    isDark
                      ? 'bg-[#121217] text-white border-white/15'
                      : 'bg-white text-neutral-900 border-neutral-300 shadow-md',
                    'min-w-[80px]'
                  )}
                  style={accentColor ? { borderColor: `${accentColor}60` } : undefined}
                >
                  <div className="relative h-4 flex items-center justify-center overflow-hidden w-full">
                    <AnimatePresence mode="popLayout" custom={direction}>
                      <motion.span
                        key={items[hoveredIndex].title}
                        custom={direction}
                        initial={{
                          x: direction > 0 ? 20 : -20,
                          opacity: 0,
                          filter: 'blur(3px)',
                        }}
                        animate={{
                          x: 0,
                          opacity: 1,
                          filter: 'blur(0px)',
                        }}
                        exit={{
                          x: direction > 0 ? -20 : 20,
                          opacity: 0,
                          filter: 'blur(3px)',
                        }}
                        transition={{
                          duration: 0.2,
                          ease: 'easeOut',
                        }}
                      >
                        {items[hoveredIndex].title}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {items.map((el, index) => {
            const Icon = el.icon;
            const isHovered = hoveredIndex === index;
            const isActiveSection = isItemActive(el, currentActiveSection);

            const handleClick = () => {
              if (el.onClick) {
                el.onClick();
              } else if (el.sectionId) {
                smoothScrollTo('#' + el.sectionId);
              } else if (el.href) {
                if (el.href.startsWith('http')) {
                  window.open(el.href, '_blank', 'noopener,noreferrer');
                } else {
                  window.location.href = el.href;
                }
              }
            };
            const type = el.title.toLowerCase();
            const isAnimated = [
              'home',
              'hero',
              'blog',
              'works',
              'projects',
              'marker',
              'about',
              'vision',
              'skills',
              'stack',
              'tech',
              'capabilities',
              'email',
              'contact',
              'theme',
              'mode',
              'customizer',
              'customize',
              'linkedin',
              'x',
              'github',
            ].includes(type);

            return (
              <div
                key={el.title}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                onMouseEnter={() => handleItemHover(index)}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) {
                    return;
                  }
                  handleClick();
                }}
                className={cn(
                  'relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center cursor-pointer rounded-xl transition-colors duration-200 will-change-transform',
                  el.className,
                  isActiveSection
                    ? isDark
                      ? 'bg-white/10'
                      : 'bg-black/5'
                    : isDark
                    ? 'hover:bg-white/10'
                    : 'hover:bg-black/5'
                )}
                role="button"
                tabIndex={0}
                aria-current={isActiveSection ? 'true' : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                  }
                }}
              >
                {/* Active Section Background Capsule (Sliding Pill) */}
                {isActiveSection && (
                  <motion.div
                    layoutId="dock-active-capsule"
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      backgroundColor: isDark
                        ? `${accentColor || '#38BDF8'}20`
                        : `${accentColor || '#0284C7'}16`,
                      border: `1px solid ${accentColor || '#38BDF8'}45`,
                      boxShadow: `0 0 14px ${accentColor || '#38BDF8'}22`,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}

                {/* Active Section Indicator Dot */}
                {isActiveSection && (
                  <motion.span
                    layoutId="dock-active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-2.5 rounded-full pointer-events-none"
                    style={{
                      backgroundColor: accentColor || '#38BDF8',
                      boxShadow: `0 0 6px ${accentColor || '#38BDF8'}`,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}

                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className="relative z-10"
                >
                  {isAnimated ? (
                    <MorphingIcon
                      type={type}
                      isActive={isHovered}
                      isSectionActive={isActiveSection}
                      accentColor={accentColor}
                      colorMode={colorMode}
                      onClick={handleClick}
                      onMouseEnter={() => {}}
                    />
                  ) : (
                    <Icon
                      style={isActiveSection && accentColor ? { color: accentColor } : undefined}
                      className={cn(
                        'h-[18px] w-[18px] transition-colors duration-200',
                        isActiveSection
                          ? ''
                          : isHovered
                          ? isDark
                            ? 'text-white'
                            : 'text-black'
                          : isDark
                          ? 'text-neutral-400'
                          : 'text-neutral-600'
                      )}
                    />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

GlassDock.displayName = 'GlassDock';
export default GlassDock;
