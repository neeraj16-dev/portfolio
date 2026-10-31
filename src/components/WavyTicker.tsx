import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SkillLogoItem } from '../data/skillsLogos';
import { ColorMode } from '../types/hero';

interface WavyTickerProps {
  items: SkillLogoItem[];
  colorMode?: ColorMode;
  accentColor?: string;
  speed?: number; // pixels per second (default 40)
  slowdownOnHover?: number; // multiplier on hover (default 0.16)
  isWavy?: boolean; // false for straight horizontal line
  waveAmplitude?: number; // height of sinusoidal peak (default 0 for horizontal line)
  waveFrequency?: number; // frequency of sinusoidal wave
  gap?: number; // gap between items (default 24px)
  itemSize?: number; // size of each icon container (default 68px)
  direction?: 'left' | 'right';
  fadeEdges?: boolean;
  fadeDistance?: number; // percentage (default 12)
  className?: string;
  onSkillClick?: (skill: SkillLogoItem) => void;
}

export const WavyTicker: React.FC<WavyTickerProps> = ({
  items,
  colorMode = 'dark',
  accentColor = '#00F0FF',
  speed = 40,
  slowdownOnHover = 0.16,
  isWavy = false,
  waveAmplitude = 0,
  waveFrequency = 0.0038,
  gap = 24,
  itemSize = 68,
  direction = 'left',
  fadeEdges = true,
  fadeDistance = 12,
  className = '',
  onSkillClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const isHoveredRef = useRef(false);
  const currentSpeedRef = useRef<number>(speed);
  const lastTimeRef = useRef<number>(performance.now());
  const offsetRef = useRef<number>(0);
  const isDark = colorMode === 'dark';

  // Measure container dimensions
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const singleCycleWidth = items.length * (itemSize + gap);

  // Direct GPU Transform Animation Loop with IntersectionObserver
  useEffect(() => {
    let animationFrameId: number;
    let isVisible = true;
    lastTimeRef.current = performance.now();

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible) {
          lastTimeRef.current = performance.now();
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const animate = (currentTime: number) => {
      if (isVisible) {
        const delta = Math.min(currentTime - lastTimeRef.current, 64);
        lastTimeRef.current = currentTime;

        const targetSpeed = isHoveredRef.current ? speed * slowdownOnHover : speed;
        currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 0.08;

        offsetRef.current += (currentSpeedRef.current * delta) / 1000;
        const wrapped = ((offsetRef.current % singleCycleWidth) + singleCycleWidth) % singleCycleWidth;
        const finalTrackOffset = direction === 'left' ? -wrapped : wrapped - singleCycleWidth;

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${finalTrackOffset}px, 0, 0)`;
        }
      } else {
        lastTimeRef.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [speed, slowdownOnHover, singleCycleWidth, direction]);

  // Calculate repeats needed for seamless infinite loop
  const repeats = Math.max(3, Math.ceil((containerWidth * 2.2) / Math.max(singleCycleWidth, 1)) + 1);

  const repeatedItems = useMemo(() => {
    return Array.from({ length: repeats }, () => items).flat();
  }, [repeats, items]);

  const maskStyle = fadeEdges
    ? {
        maskImage: `linear-gradient(to right, transparent 0%, black ${fadeDistance}%, black ${
          100 - fadeDistance
        }%, transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to right, transparent 0%, black ${fadeDistance}%, black ${
          100 - fadeDistance
        }%, transparent 100%)`,
      }
    : {};

  // Monochrome black logos that need inversion and bright white styling in dark mode
  const monochromeLogos = [
    'Next.js',
    'GitHub',
    'LangChain',
    'LangGraph',
    'LangSmith',
    'Trae',
    'Express.js',
  ];

  const actualWaveAmp = isWavy ? waveAmplitude : 0;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      style={{
        ...maskStyle,
        height: `${itemSize + actualWaveAmp * 2 + 52}px`,
      }}
      className={`relative w-full overflow-hidden select-none flex items-center ${className}`}
      aria-label="Interactive horizontal skills ticker"
    >
      <div
        ref={trackRef}
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
        className="absolute flex items-center gap-[24px]"
      >
        {repeatedItems.map((skill, index) => {
          const isMonochrome = monochromeLogos.includes(skill.name);

          return (
            <div
              key={`${skill.name}-${index}`}
              style={{
                width: `${itemSize}px`,
                height: `${itemSize}px`,
              }}
              onClick={() => onSkillClick && onSkillClick(skill)}
              className="group relative shrink-0 flex items-center justify-center cursor-pointer transition-transform duration-75"
            >
              {/* Minimalist Floating Tooltip (reveals skill name on hover) */}
              <div className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 z-50 whitespace-nowrap">
                <div
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono font-semibold tracking-wider shadow-2xl border backdrop-blur-md ${
                    isDark
                      ? 'border-white/20 bg-[#09090D]/95 text-white shadow-black/90'
                      : 'border-neutral-300 bg-white/95 text-neutral-900 shadow-neutral-400/50'
                  }`}
                  style={{
                    boxShadow: isDark
                      ? `0 0 15px ${accentColor}30, 0 8px 20px rgba(0,0,0,0.8)`
                      : undefined,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
                  />
                  <span>{skill.name}</span>
                </div>
                {/* Micro tooltip arrow */}
                <div
                  className={`mx-auto h-1.5 w-2.5 border-b-2 border-r-2 -rotate-45 ${
                    isDark ? 'border-white/20 bg-[#09090D]' : 'border-neutral-300 bg-white'
                  }`}
                />
              </div>

              {/* Enhanced Luminous Tech Icon Tile with Ambient Glow */}
              <div
                className={`relative flex h-full w-full items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 ${
                  isDark
                    ? 'border-white/15 bg-[#121217]/90 hover:border-white/40 hover:bg-[#181820] shadow-[0_0_12px_rgba(255,255,255,0.04)]'
                    : 'border-neutral-200/90 bg-white/95 hover:border-neutral-400 hover:bg-neutral-50 shadow-md shadow-neutral-200/60'
                }`}
                style={{
                  boxShadow: isDark
                    ? '0 0 16px rgba(255,255,255,0.03), inset 0 0 12px rgba(255,255,255,0.02)'
                    : undefined,
                }}
              >
                {/* Ambient Soft Core Glow to ensure logo visibility */}
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                    isDark ? 'opacity-35 group-hover:opacity-80' : 'opacity-0'
                  }`}
                  style={{
                    background: `radial-gradient(circle at center, ${accentColor}25 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                  }}
                />

                {/* Subtle Inner Backlight Disk */}
                {isDark && (
                  <div className="pointer-events-none absolute h-9 w-9 rounded-full bg-white/[0.04] blur-[4px]" />
                )}

                {/* Official SVG Logo with enhanced visibility filter & subtle glow */}
                <img
                  src={skill.logoUrl}
                  alt={skill.name}
                  loading="lazy"
                  className={`relative z-10 h-8 w-8 object-contain transition-all duration-300 group-hover:scale-110 ${
                    isDark && isMonochrome
                      ? 'brightness-0 invert drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'
                      : isDark
                      ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.22)]'
                      : 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                  }`}
                  onError={(e) => {
                    // Fallback to text initials if offline or CDN block
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const fallback = document.createElement('span');
                      fallback.className =
                        'font-mono text-xs font-bold text-neutral-300 relative z-10';
                      fallback.innerText = skill.name.slice(0, 2).toUpperCase();
                      target.parentElement.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WavyTicker;
