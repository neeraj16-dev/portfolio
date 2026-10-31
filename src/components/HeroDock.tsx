import React, { useRef, useState } from 'react';
import {
  FolderCode,
  User,
  Cpu,
  Layers,
  Briefcase,
  Mail,
  Sliders,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';
import { smoothScrollTo } from '../hooks/useSmoothScroll';
import { triggerSectionTransition } from './SectionTransitionOverlay';

interface HeroDockProps {
  accentColor?: string;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onOpenRoadmap?: () => void;
  onOpenCustomizer?: () => void;
}

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export const HeroDock: React.FC<HeroDockProps> = ({
  accentColor = '#38BDF8',
  isDark = true,
  onToggleTheme,
  onOpenRoadmap,
  onOpenCustomizer,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const items: DockItem[] = [
    {
      id: 'home',
      label: 'System Home',
      icon: <FolderCode className="h-5 w-5" />,
      action: () => {
        smoothScrollTo('#hero');
      },
    },
    {
      id: 'about',
      label: 'Identity / About',
      icon: <User className="h-5 w-5" />,
      action: () => {
        triggerSectionTransition('about', 'ARCHITECTURE & VISION', '02');
        smoothScrollTo('#about');
      },
    },
    {
      id: 'skills',
      label: 'Core Stack',
      icon: <Cpu className="h-5 w-5" />,
      action: () => {
        triggerSectionTransition('skills', 'SYSTEM SPECIFICATIONS', '03');
        smoothScrollTo('#skills');
      },
    },
    {
      id: 'projects',
      label: 'Production Works',
      icon: <Layers className="h-5 w-5" />,
      action: () => {
        triggerSectionTransition('projects', 'FLAGSHIP DEPLOYMENTS', '04');
        smoothScrollTo('#projects');
      },
    },
    {
      id: 'experience',
      label: 'Career Milestones',
      icon: <Briefcase className="h-5 w-5" />,
      action: () => {
        triggerSectionTransition('experience', 'CHRONOLOGY & IMPACT', '05');
        smoothScrollTo('#experience');
      },
    },
    {
      id: 'roadmap',
      label: 'Mission Roadmap',
      icon: <Compass className="h-5 w-5" />,
      action: () => {
        if (onOpenRoadmap) onOpenRoadmap();
      },
    },
    {
      id: 'contact',
      label: 'Get In Touch',
      icon: <Mail className="h-5 w-5" />,
      action: () => {
        triggerSectionTransition('contact', 'INITIATE CONTACT', '06');
        smoothScrollTo('#contact');
      },
    },
    {
      id: 'customizer',
      label: 'Studio Tuning',
      icon: <Sliders className="h-5 w-5" />,
      action: () => {
        if (onOpenCustomizer) onOpenCustomizer();
      },
    },
    {
      id: 'theme',
      label: isDark ? 'Light Mode' : 'Dark Mode',
      icon: isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-sky-400" />,
      action: () => {
        if (onToggleTheme) onToggleTheme();
      },
    },
  ];

  // Magnification curve matching portfolio-madhav
  const getScaleAndY = (index: number) => {
    if (hoveredIdx === null) return { scale: 1, y: 0 };
    const distance = Math.abs(hoveredIdx - index);
    if (distance === 0) return { scale: 1.38, y: -14 };
    if (distance === 1) return { scale: 1.2, y: -7 };
    if (distance === 2) return { scale: 1.08, y: -3 };
    return { scale: 1, y: 0 };
  };

  return (
    <section
      id="dock"
      className="relative z-30 flex items-center justify-center select-none"
      onMouseLeave={() => setHoveredIdx(null)}
    >
      <div
        ref={dockRef}
        className="dock-container relative flex items-end gap-2.5 rounded-2xl border px-3.5 py-2.5 shadow-2xl transition-all duration-300"
        style={{
          backgroundColor: isDark ? 'rgba(12, 12, 16, 0.72)' : 'rgba(255, 255, 255, 0.78)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: isDark
            ? '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
            : '0 16px 32px rgba(0,0,0,0.12)',
        }}
      >
        {items.map((item, index) => {
          const { scale, y } = getScaleAndY(index);
          const isCurrentHover = hoveredIdx === index;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredIdx(index)}
            >
              {/* Tooltip on hover */}
              {isCurrentHover && (
                <div
                  className="pointer-events-none absolute -top-10 z-50 whitespace-nowrap rounded-md border px-2.5 py-1 text-[10px] font-mono tracking-wider shadow-lg transition-opacity duration-150"
                  style={{
                    backgroundColor: isDark ? '#0c0c10' : '#ffffff',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                    color: isDark ? '#ffffff' : '#0c0c10',
                  }}
                >
                  {item.label}
                </div>
              )}

              {/* Icon Container with magnification physics */}
              <button
                type="button"
                onClick={item.action}
                style={{
                  transform: `scale(${scale}) translateY(${y}px)`,
                  transition: 'transform 0.16s cubic-bezier(0.2, 0, 0.2, 1)',
                  transformOrigin: 'bottom center',
                  borderColor: isCurrentHover ? `${accentColor}50` : 'transparent',
                }}
                className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border p-2 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/12'
                    : 'bg-black/5 text-neutral-700 hover:text-black hover:bg-black/10'
                }`}
                title={item.label}
                aria-label={item.label}
              >
                {item.icon}

                {/* Subtle active indicator dot for current hovered element */}
                {isCurrentHover && (
                  <span
                    className="absolute -bottom-1 h-1 w-1 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HeroDock;
