import React, { useEffect, useRef } from 'react';

interface HeroParticlesProps {
  accentColor: string;
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
  alpha: number;
}

export const HeroParticles: React.FC<HeroParticlesProps> = ({
  accentColor,
  className = '',
  particleCount = 55,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const parseRgb = (hex: string) => {
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

    let rgb = parseRgb(accentColor);

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const z = 0.3 + Math.random() * 0.9;
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        z,
        size: (1 + Math.random() * 1.8) * z,
        vx: (Math.random() - 0.5) * 0.25 * z,
        vy: (Math.random() - 0.5) * 0.25 * z,
        alpha: (0.15 + Math.random() * 0.35) * z,
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const interactionRadius = 160;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < interactionRadius && dist > 0) {
            const force = (1 - dist / interactionRadius) * 28 * p.z;
            p.x += (dx / dist) * force * dt * 4;
            p.y += (dy / dist) * force * dt * 4;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxDist = 95;
          if (distBetween < maxDist) {
            const lineAlpha = (1 - distBetween / maxDist) * 0.12 * Math.min(p.z, p2.z);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [accentColor, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 block h-full w-full ${className}`}
      style={{ willChange: 'transform, opacity' }}
    />
  );
};

export default HeroParticles;
