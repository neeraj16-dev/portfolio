'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import './CircularCarousel.css';

export interface CircularCarouselItem {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  isMonochrome?: boolean;
}

export interface CircularCarouselProps {
  items?: CircularCarouselItem[];
  preset?: 'cylinder' | 'orbit' | 'wheel' | 'panorama';
  intro?: 'assemble' | 'rise' | 'spin' | 'none';
  cardWidth?: number;
  aspectRatio?: number;
  gap?: number;
  speed?: number;
  tilt?: number;
  perspective?: number;
  fadeColor?: string;
  captions?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CircularCarousel: React.FC<CircularCarouselProps> = ({
  items = [],
  cardWidth = 130,
  aspectRatio = 1,
  gap = 18,
  speed = 14,
  tilt = -10,
  perspective = 2000,
  fadeColor = '#08080A',
  className = '',
  style
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const cardW = Math.max(40, cardWidth);
  const cardH = cardW / Math.max(0.2, aspectRatio);
  const step = 360 / Math.max(count, 1);

  // Exact cylinder radius based on chord geometry
  const radius = useMemo(() => {
    const n = Math.max(count, 3);
    const pitch = cardW + gap;
    const chord = pitch / (2 * Math.sin(Math.PI / n));
    return Math.max(chord, cardW * 0.8);
  }, [count, cardW, gap]);

  // Position cards statically on the ring once (both front and back faces)
  const cardTransforms = useMemo(() => {
    return items.map((_, index) => {
      const angle = index * step;
      return {
        front: `rotateY(${angle}deg) translateZ(${radius}px)`,
        back: `rotateY(${angle}deg) translateZ(${radius}px) rotateY(180deg)`,
      };
    });
  }, [items, step, radius]);

  // Direct GPU Transform Animation Loop (zero React re-renders)
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const camera = cameraRef.current;
    const ring = ringRef.current;
    if (!root || !stage || !camera || !ring) return undefined;

    let raf = 0;
    let angle = 0;
    let last = performance.now();
    let isVisible = true;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const width = rect.width * 0.96;
      const height = rect.height;
      const ringDiameter = radius * 2 + cardW;
      const fit = Math.min(1, width / ringDiameter, height / (cardH * 2.2));
      stage.style.perspective = `${perspective}px`;
      stage.style.transform = `scale(${fit})`;
    };

    // Initialize Camera Position
    camera.style.transform = `translate3d(0, 0, ${-radius}px) rotateX(${tilt}deg)`;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (isVisible) {
        // Continuous smooth drift (speed in degrees/sec)
        angle += speed * dt;
        ring.style.transform = `rotateY(${-angle}deg)`;
      }

      if (isVisible && !document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (!raf && isVisible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(root);

    const ro = new ResizeObserver(() => {
      measure();
      wake();
    });
    ro.observe(root);

    measure();
    wake();

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else wake();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [radius, cardW, cardH, perspective, speed, tilt]);

  return (
    <div
      ref={rootRef}
      className={`circular-carousel pointer-events-none select-none ${className}`.trim()}
      style={{
        ...style,
        ['--cc-fade' as string]: fadeColor,
      }}
      aria-hidden="true"
    >
      <div className="circular-carousel__view">
        <div ref={stageRef} className="circular-carousel__stage">
          <div ref={cameraRef} className="circular-carousel__camera">
            <div ref={ringRef} className="circular-carousel__ring">
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Outer Front Face (visible when on the front half of the cylinder) */}
                  <div
                    className="circular-carousel__card"
                    style={{
                      width: `${cardW}px`,
                      height: `${cardH}px`,
                      marginLeft: `${-cardW / 2}px`,
                      marginTop: `${-cardH / 2}px`,
                      transform: cardTransforms[index].front,
                    }}
                  >
                    <div className="circular-carousel__frame">
                      <img
                        className={`circular-carousel__photo ${
                          item.isMonochrome ? 'circular-carousel__photo--monochrome' : ''
                        }`}
                        src={item.src}
                        alt={item.title || item.alt || ''}
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Inner Back Face (visible when on the back half of the cylinder to complete the full 360 circle) */}
                  <div
                    className="circular-carousel__card circular-carousel__card--back"
                    style={{
                      width: `${cardW}px`,
                      height: `${cardH}px`,
                      marginLeft: `${-cardW / 2}px`,
                      marginTop: `${-cardH / 2}px`,
                      transform: cardTransforms[index].back,
                    }}
                  >
                    <div className="circular-carousel__frame">
                      <img
                        className={`circular-carousel__photo ${
                          item.isMonochrome ? 'circular-carousel__photo--monochrome' : ''
                        }`}
                        src={item.src}
                        alt={item.title || item.alt || ''}
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularCarousel;
