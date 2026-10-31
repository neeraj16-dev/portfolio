import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { spatialAudio } from '../hooks/useSpatialAudio';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  innerStrength?: number;
  tiltStrength?: number;
  className?: string;
  soundEnabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0,
  innerStrength = 0,
  tiltStrength = 0,
  className = '',
  soundEnabled = true,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const content = contentRef.current;
    if (!button) return;

    // Snappy, ultra-smooth GSAP quickTo tweens with zero lag
    const xTo = gsap.quickTo(button, 'x', { duration: 0.18, ease: 'power2.out' });
    const yTo = gsap.quickTo(button, 'y', { duration: 0.18, ease: 'power2.out' });
    const rotXTo = gsap.quickTo(button, 'rotationX', { duration: 0.2, ease: 'power2.out' });
    const rotYTo = gsap.quickTo(button, 'rotationY', { duration: 0.2, ease: 'power2.out' });

    const innerXTo = content ? gsap.quickTo(content, 'x', { duration: 0.22, ease: 'power2.out' }) : null;
    const innerYTo = content ? gsap.quickTo(content, 'y', { duration: 0.22, ease: 'power2.out' }) : null;

    let baseCenterX = 0;
    let baseCenterY = 0;
    let isHovered = false;

    const handleEnter = () => {
      isHovered = true;
      const rect = button.getBoundingClientRect();
      const currentX = (gsap.getProperty(button, 'x') as number) || 0;
      const currentY = (gsap.getProperty(button, 'y') as number) || 0;
      // Fixed untransformed center prevents feedback loop jitter
      baseCenterX = rect.left + rect.width / 2 - currentX;
      baseCenterY = rect.top + rect.height / 2 - currentY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered || baseCenterX === 0) {
        handleEnter();
      }
      const halfW = button.offsetWidth / 2 || 24;
      const halfH = button.offsetHeight / 2 || 24;

      const normX = Math.max(-1, Math.min(1, (e.clientX - baseCenterX) / halfW));
      const normY = Math.max(-1, Math.min(1, (e.clientY - baseCenterY) / halfH));

      const deltaX = (e.clientX - baseCenterX) * strength;
      const deltaY = (e.clientY - baseCenterY) * strength;

      xTo(deltaX);
      yTo(deltaY);
      rotXTo(-normY * tiltStrength);
      rotYTo(normX * tiltStrength);

      if (innerXTo && innerYTo) {
        innerXTo(deltaX * innerStrength);
        innerYTo(deltaY * innerStrength);
      }
    };

    const handleLeave = () => {
      isHovered = false;
      // Elastic spring physics recoil on release
      gsap.to(button, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.65,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto',
      });

      if (content) {
        gsap.to(content, {
          x: 0,
          y: 0,
          duration: 0.75,
          ease: 'elastic.out(1.1, 0.4)',
          overwrite: 'auto',
        });
      }
    };

    button.addEventListener('mouseenter', handleEnter);
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleLeave);

    return () => {
      button.removeEventListener('mouseenter', handleEnter);
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleLeave);
      gsap.killTweensOf([button, content]);
    };
  }, [strength, innerStrength, tiltStrength]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEnabled) {
      spatialAudio.playTone(680, 'sine', 0.12, 0.07);
    }

    // Squash & Stretch click impulse
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.45, ease: 'back.out(2.4)', overwrite: 'auto' }
      );
    }

    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEnabled) {
      spatialAudio.playTone(420, 'sine', 0.08, 0.03);
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      className={`cursor-target relative inline-flex items-center justify-center overflow-hidden will-change-transform perspective-800 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      {...rest}
    >
      {/* Dynamic Specular Sheen Layer */}
      <div
        ref={sheenRef}
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
      />

      <span
        ref={contentRef}
        className="pointer-events-none relative z-10 inline-flex items-center justify-center gap-2 will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </span>
    </button>
  );
};

export default MagneticButton;
