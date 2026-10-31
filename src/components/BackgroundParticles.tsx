import React, { useEffect, useRef } from 'react';
import { ColorMode } from '../types/hero';

interface BackgroundParticlesProps {
  accentColor: string;
  colorMode?: ColorMode;
  className?: string;
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  z: number;
  size: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  isAccent: boolean;
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  accentColor,
  colorMode = 'dark',
  className = '',
  particleCount = 110,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = colorMode === 'dark';

  const mouseRef = useRef<{ x: number; y: number; active: boolean; prevX: number; prevY: number }>({
    x: -2000,
    y: -2000,
    active: false,
    prevX: -2000,
    prevY: -2000,
  });

  const scrollRef = useRef<{ y: number; prevY: number; velocity: number }>({
    y: 0,
    prevY: 0,
    velocity: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);

    const parseHexRgb = (hex: string) => {
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map((char) => char + char).join('');
      const num = parseInt(c, 16);
      if (isNaN(num)) return { r: 56, g: 189, b: 248 };
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    };

    const accentRgb = parseHexRgb(accentColor);
    const neutralRgb = isDark ? { r: 240, g: 245, b: 255 } : { r: 70, g: 80, b: 95 };

    // Responsive particle count tuned for ultra-lightweight 120fps performance
    const effectiveCount = Math.min(
      36,
      Math.max(18, Math.floor((window.innerWidth * window.innerHeight) / 45000))
    );

    const particles: Particle[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      const z = 0.2 + Math.random() * 0.8;
      const x = Math.random() * (width / dpr);
      const y = Math.random() * (height / dpr);
      const isAccent = Math.random() > 0.35;

      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        z,
        size: (isAccent ? 1.6 + Math.random() * 1.6 : 1.0 + Math.random() * 1.2) * z,
        vx: (Math.random() - 0.5) * 0.32 * z,
        vy: (Math.random() - 0.5) * 0.32 * z,
        baseAlpha: (isAccent ? 0.35 + Math.random() * 0.45 : 0.2 + Math.random() * 0.3) * z,
        alpha: 0.3,
        pulseSpeed: 0.8 + Math.random() * 1.8,
        pulsePhase: Math.random() * Math.PI * 2,
        isAccent,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const handleScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop;
      scrollRef.current.velocity = (currentY - scrollRef.current.prevY) * 0.35;
      scrollRef.current.prevY = currentY;
      scrollRef.current.y = currentY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastTime = performance.now();
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isTabVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.08);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Decelerate scroll velocity smoothly
      scrollRef.current.velocity *= 0.92;
      const scrollDrift = scrollRef.current.velocity;

      const viewW = width / dpr;
      const viewH = height / dpr;

      const mouse = mouseRef.current;
      const mouseRadius = 170;

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Normal physics drift
          p.x += p.vx * 60 * dt;
          p.y += p.vy * 60 * dt - scrollDrift * p.z * 0.4;

          // Gentle sine-wave harmonic wobble
          p.pulsePhase += p.pulseSpeed * dt;
          const alphaOsc = Math.sin(p.pulsePhase) * 0.18;
          p.alpha = Math.max(0.08, Math.min(0.95, p.baseAlpha + alphaOsc));

          // Wrap edges with generous boundary buffer
          if (p.x < -30) p.x = viewW + 30;
          if (p.x > viewW + 30) p.x = -30;
          if (p.y < -30) p.y = viewH + 30;
          if (p.y > viewH + 30) p.y = -30;

          // Interactive mouse force field
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouseRadius && dist > 0) {
              const force = (1 - dist / mouseRadius) * 45 * p.z;
              p.x += (dx / dist) * force * dt * 3.5;
              p.y += (dy / dist) * force * dt * 3.5;
              // Intensify alpha when near cursor
              p.alpha = Math.min(1.0, p.alpha + 0.35);
            }
          }
        }

        const screenX = p.x * dpr;
        const screenY = p.y * dpr;
        const radius = p.size * dpr;

        // Choose color palette based on accent and color mode
        const color = p.isAccent ? accentRgb : neutralRgb;

        // Particle point
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${p.alpha})`;
        ctx.fill();

        // Soft outer glow for foreground accent particles
        if (p.isAccent && p.z > 0.55 && isDark) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${p.alpha * 0.18})`;
          ctx.fill();
        }

        // Connecting lattice filaments between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxConnectDist = 80;

          if (distBetween < maxConnectDist) {
            const lineAlpha =
              (1 - distBetween / maxConnectDist) *
              0.16 *
              Math.min(p.z, p2.z) *
              (isDark ? 1 : 0.7);

            ctx.beginPath();
            ctx.moveTo(p.x * dpr, p.y * dpr);
            ctx.lineTo(p2.x * dpr, p2.y * dpr);
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${lineAlpha})`;
            ctx.lineWidth = 0.65 * dpr;
            ctx.stroke();
          }
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [accentColor, colorMode, particleCount, isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 block h-full w-full will-change-transform ${className}`}
      style={{
        transform: 'translateZ(0)',
      }}
    />
  );
};

export default BackgroundParticles;
