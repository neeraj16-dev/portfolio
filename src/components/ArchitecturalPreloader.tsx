import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ArchitecturalPreloaderProps {
  brandName?: string;
  roleTagline?: string;
  accentColor?: string;
  isDark?: boolean;
  onComplete: () => void;
}

export const ArchitecturalPreloader: React.FC<ArchitecturalPreloaderProps> = ({
  brandName = 'NEERAJ MAYEKAR',
  roleTagline = 'Full Stack Developer & AI Engineer',
  accentColor = '#00F0FF',
  isDark = true,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('INITIALIZING_KERNEL');
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topShutterRef = useRef<HTMLDivElement>(null);
  const bottomShutterRef = useRef<HTMLDivElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const laserBeamRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  // Background colors matching active theme
  const bgColor = isDark ? '#08080C' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#09090B';
  const mutedColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)';
  const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  useEffect(() => {
    // If user prefers reduced motion, finish immediately
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      onComplete();
      return;
    }

    // Lock scroll during boot sequence
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Canvas particle / geometric radar ring animation
    const canvas = canvasRef.current;
    let animId: number;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = (canvas.width = window.innerWidth * dpr);
        const h = (canvas.height = window.innerHeight * dpr);

        let angle = 0;
        const renderCanvas = () => {
          ctx.clearRect(0, 0, w, h);
          const cx = w / 2;
          const cy = h / 2;
          const maxR = Math.min(w, h) * 0.35;

          // Technical concentric coordinate circles
          ctx.strokeStyle = gridLineColor;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.arc(cx, cy, maxR * 0.45, 0, Math.PI * 2);
          ctx.arc(cx, cy, maxR * 0.8, 0, Math.PI * 2);
          ctx.stroke();

          // Radar sweep line
          angle += 0.045;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          const grad = ctx.createLinearGradient(0, 0, maxR * 0.85, 0);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(1, accentColor);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5 * dpr;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(maxR * 0.85, 0);
          ctx.stroke();
          ctx.restore();

          animId = requestAnimationFrame(renderCanvas);
        };
        renderCanvas();
      }
    }

    // Status message ticks
    const messages = [
      'INIT_SYSTEM_KERNEL',
      'VECTOR_MATRICES_ACTIVE',
      'NEURAL_AGENTS_MOUNTED',
      'CALIBRATING_SPATIAL_PIPELINE',
      'INTERFACE_READY',
    ];

    // Master Timeline
    const tl = gsap.timeline({
      onComplete: finishPreloader,
    });

    // Progress counter animation (0 to 100)
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => {
        const rounded = Math.round(counterObj.val);
        setProgress(rounded);
        const msgIdx = Math.min(
          messages.length - 1,
          Math.floor((rounded / 100) * messages.length)
        );
        setStatusMessage(messages[msgIdx]);
      },
    });

    // Flash laser seam beam
    if (laserBeamRef.current) {
      tl.to(
        laserBeamRef.current,
        {
          opacity: 1,
          scaleX: 1,
          boxShadow: `0 0 24px ${accentColor}`,
          duration: 0.25,
          ease: 'power3.out',
        },
        '-=0.2'
      );
    }

    // Fade out center text slightly before shutters split
    if (centerContentRef.current) {
      tl.to(
        centerContentRef.current,
        {
          opacity: 0,
          scale: 0.95,
          duration: 0.35,
          ease: 'power3.in',
        },
        '+=0.05'
      );
    }

    // Architectural Dual Shutter Reveal: Top slides UP, Bottom slides DOWN
    if (topShutterRef.current) {
      tl.to(
        topShutterRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: 'power4.inOut',
        },
        'split'
      );
    }

    if (bottomShutterRef.current) {
      tl.to(
        bottomShutterRef.current,
        {
          yPercent: 100,
          duration: 0.85,
          ease: 'power4.inOut',
        },
        'split'
      );
    }

    if (laserBeamRef.current) {
      tl.to(
        laserBeamRef.current,
        {
          opacity: 0,
          scaleY: 0,
          duration: 0.4,
          ease: 'power2.in',
        },
        'split+=0.1'
      );
    }

    function finishPreloader() {
      if (hasCompletedRef.current) return;
      hasCompletedRef.current = true;
      document.body.style.overflow = previousOverflow;
      if (animId) cancelAnimationFrame(animId);
      onComplete();
    }

    // Keyboard (Escape) or Click to bypass
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        tl.progress(1);
        finishPreloader();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (animId) cancelAnimationFrame(animId);
      tl.kill();
    };
  }, [accentColor, onComplete]);

  const handleSkip = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      document.body.style.overflow = '';
      onComplete();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleSkip}
      className="fixed inset-0 z-[100] cursor-pointer select-none overflow-hidden"
      style={{ touchAction: 'none' }}
      aria-label="Loading animation - click or press Escape to skip"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Architectural Shutter */}
      <div
        ref={topShutterRef}
        className="absolute top-0 left-0 right-0 h-1/2 will-change-transform border-b"
        style={{
          backgroundColor: bgColor,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${
              isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
            } 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Top-left Telemetry Header */}
        <div className="absolute top-5 left-6 sm:top-7 sm:left-8 flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase">
          <span
            className="inline-block h-2 w-2 rounded-xs animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span style={{ color: mutedColor }}>SYS_INIT // {brandName}</span>
        </div>

        {/* Top-right Status */}
        <div className="absolute top-5 right-6 sm:top-7 sm:right-8 font-mono text-[10px] tracking-widest uppercase text-right">
          <span style={{ color: mutedColor }}>LATITUDE: 37.7749° N</span>
        </div>
      </div>

      {/* Bottom Architectural Shutter */}
      <div
        ref={bottomShutterRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 will-change-transform border-t"
        style={{
          backgroundColor: bgColor,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${
              isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
            } 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Bottom-left telemetry info */}
        <div className="absolute bottom-5 left-6 sm:bottom-7 sm:left-8 font-mono text-[10px] tracking-widest uppercase">
          <span style={{ color: mutedColor }}>STATUS: {statusMessage}</span>
        </div>

        {/* Bottom-right Bypass Prompt */}
        <div className="absolute bottom-5 right-6 sm:bottom-7 sm:right-8 font-mono text-[10px] tracking-widest uppercase">
          <span
            className="hover:underline transition-opacity"
            style={{ color: accentColor }}
          >
            [ESC OR CLICK TO SKIP]
          </span>
        </div>
      </div>

      {/* Procedural Canvas (Background Oscilloscope) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-60"
      />

      {/* Laser Horizon Beam along 50vh seam */}
      <div
        ref={laserBeamRef}
        className="pointer-events-none absolute top-1/2 left-0 right-0 z-30 h-[2px] -translate-y-1/2 opacity-0"
        style={{
          backgroundColor: accentColor,
          transformOrigin: 'center center',
        }}
      />

      {/* Centerpiece Content */}
      <div
        ref={centerContentRef}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center will-change-transform"
      >
        {/* Micro-label */}
        <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em]">
          <span style={{ color: mutedColor }}>ENGINEERING MATRIX // </span>
          <span style={{ color: accentColor }}>ONLINE</span>
        </div>

        {/* Monolithic Digital Odometer Counter */}
        <div className="flex items-baseline justify-center">
          <span
            className="font-mono text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter tabular-nums"
            style={{ color: textColor }}
          >
            {String(progress).padStart(3, '0')}
          </span>
          <span
            className="ml-2 font-mono text-xl sm:text-2xl font-bold"
            style={{ color: accentColor }}
          >
            %
          </span>
        </div>

        {/* Brand Name & Role Reveal */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <h2
            className="text-base sm:text-lg font-bold tracking-widest uppercase"
            style={{ color: textColor }}
          >
            {brandName}
          </h2>
          <p
            className="text-xs sm:text-sm font-mono tracking-wider"
            style={{ color: mutedColor }}
          >
            {roleTagline}
          </p>
        </div>

        {/* Precision Laser Caliper Track */}
        <div className="mt-7 w-64 sm:w-80 max-w-full">
          <div
            className="relative h-[2px] w-full overflow-hidden rounded-full"
            style={{
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className="h-full transition-all duration-75 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: accentColor,
                boxShadow: `0 0 12px ${accentColor}`,
              }}
            />
          </div>

          {/* Caliper ticks */}
          <div
            className="mt-2 flex justify-between font-mono text-[9px] tracking-widest uppercase"
            style={{ color: mutedColor }}
          >
            <span>00%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span style={{ color: accentColor }}>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitecturalPreloader;
