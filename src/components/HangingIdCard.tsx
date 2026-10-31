import React, { useRef, useEffect, useState } from 'react';

interface HangingIdCardProps {
  imageSrc?: string;
  name?: string;
  role?: string;
  accentColor?: string;
  className?: string;
}

export const HangingIdCard: React.FC<HangingIdCardProps> = ({
  imageSrc = '/IMG_6368.PNG',
  name = 'Neeraj Mayekar',
  role = 'Developer & AI Engineer',
  accentColor = '#38BDF8',
  className = '',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(true);

  // Exact physics spring simulation extracted from reference site (shadinkappzzz.vercel.app)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    const strap = strapRef.current;
    if (!wrapper || !card) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let posX = 0;
    let posY = 0;
    let velX = 0;
    let velY = 0;
    let stretchY = 0;
    let rafId: number | null = null;

    const updateTransform = () => {
      const rotZ = 0.16 * posX;
      const rotX = Math.min(22, Math.max(-22, -0.07 * posY));
      const rotY = Math.min(22, Math.max(-22, 0.07 * posX));

      wrapper.style.transform = `translate3d(${posX}px, ${posY}px, 0px) rotate(${rotZ}deg)`;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      if (strap) {
        strap.style.transform = `scaleY(${1 + stretchY})`;
      }
    };

    const tick = (time: number) => {
      if (isDragging) return;

      const forceY = -0.048 * posY;
      const forceX = -0.048 * posX;

      velX = (velX + forceX) * 0.915;
      velY = (velY + forceY) * 0.915;
      posX += velX;
      posY += velY;
      stretchY = Math.max(-0.1, 0.0035 * posY);

      // Ambient idle resting pendulum swing
      if (
        Math.abs(posX) < 0.08 &&
        Math.abs(posY) < 0.08 &&
        Math.abs(velX) < 0.08 &&
        Math.abs(velY) < 0.08
      ) {
        posX = 0;
        posY = 0;
        const idleAngle = 4.5 * Math.sin(0.0016 * time);
        wrapper.style.transform = `translate3d(0px, 0px, 0px) rotate(${idleAngle}deg)`;
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        if (strap) strap.style.transform = 'scaleY(1)';
        rafId = requestAnimationFrame(tick);
        return;
      }

      updateTransform();
      rafId = requestAnimationFrame(tick);
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if ('cancelable' in e && e.cancelable) e.preventDefault();
      isDragging = true;
      if (rafId) cancelAnimationFrame(rafId);

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      startX = clientX - posX;
      startY = clientY - posY;

      card.style.transition = 'none';
      if (strap) strap.style.transition = 'none';
      wrapper.style.transition = 'none';
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      if ('cancelable' in e && e.cancelable) e.preventDefault();

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const rawX = (clientX - startX) * 0.85;
      const rawY = (clientY - startY) * 0.85;

      const dist = Math.hypot(rawX, rawY);
      const limit = dist > 380 ? (380 + (dist - 380) * 0.3) / dist : 1;

      const clampedX = rawX * limit;
      const clampedY = rawY * limit;

      velX = (clampedX - posX) * 0.7;
      velY = (clampedY - posY) * 0.7;
      posX = clampedX;
      posY = clampedY;
      stretchY = Math.max(-0.1, 0.0035 * posY);

      updateTransform();
    };

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false;
        rafId = requestAnimationFrame(tick);
      }
    };

    wrapper.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    wrapper.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible && !rafId && !isDragging) {
          rafId = requestAnimationFrame(tick);
        } else if (!isVisible && rafId && !isDragging) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(wrapper);

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      wrapper.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      wrapper.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, []);

  const firstName = (name.split(' ')[0] || 'NEERAJ').toUpperCase();

  return (
    <div className={`relative flex items-center justify-center select-none py-6 ${className}`}>
      {/* Container Wrapper */}
      <div
        id="id-card-lanyard-wrapper"
        ref={wrapperRef}
        title="Pull &amp; Release Me!"
        className="relative flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
        style={{
          width: '250px',
          transformOrigin: 'top center',
          filter: 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.85))',
          touchAction: 'none',
        }}
      >
        {/* Lanyard Fabric Strap with Ridge Texture */}
        <div
          id="lanyard-strap"
          ref={strapRef}
          className="relative overflow-hidden shadow-2xl"
          style={{
            zIndex: 5,
            transformOrigin: 'top center',
            width: '44px',
            height: '92px',
            borderRadius: '3px 3px 0 0',
            background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 1.5px, transparent 1.5px 4px), linear-gradient(90deg, #18181b 0%, #27272a 15%, #3f3f46 30%, ${accentColor} 50%, #3f3f46 70%, #27272a 85%, #18181b 100%)`,
            boxShadow: '4px 0 12px rgba(0,0,0,0.8), -4px 0 12px rgba(0,0,0,0.8)',
          }}
        >
          {/* Subtle Fabric Sheen Highlight */}
          <div
            className="absolute top-0 bottom-0 left-3 w-2 pointer-events-none"
            style={{
              background:
                'linear-gradient(transparent 0%, rgba(255, 255, 255, 0.22) 40%, rgba(255, 255, 255, 0.1) 100%)',
            }}
          />
        </div>

        {/* Lanyard Metallic Clip & Ring */}
        <div
          className="relative flex items-center justify-center -mt-1"
          style={{
            zIndex: 6,
            width: '44px',
            height: '24px',
          }}
        >
          {/* Circular Metallic Key Ring */}
          <div
            className="absolute top-0.5 rounded-full"
            style={{
              width: '22px',
              height: '22px',
              border: '3px solid #d4d4d8',
              boxShadow: '0 1px 4px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.4)',
            }}
          />
          {/* Metallic Chrome Clamp */}
          <div
            className="absolute bottom-0 rounded-b-lg border border-zinc-500"
            style={{
              width: '28px',
              height: '13px',
              background: 'linear-gradient(#e4e4e7 0%, #a1a1aa 50%, #71717a 100%)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.7), inset 0 1px rgba(255,255,255,0.6)',
            }}
          />
        </div>

        {/* The Hanging ID Card */}
        <div
          id="hanging-id-card"
          ref={cardRef}
          className="relative flex p-1.5 -mt-0.5 transition-shadow"
          style={{
            width: '240px',
            height: '355px',
            borderRadius: '18px',
            transformOrigin: 'top center',
            background:
              'linear-gradient(145deg, #f4f4f5 0%, #c4c4c7 20%, #e4e4e7 35%, #a1a1aa 50%, #d4d4d8 65%, #949498 80%, #ceced2 100%)',
            boxShadow:
              '0 30px 60px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.35), inset 0 1px rgba(255,255,255,0.6), inset 0 -1px rgba(0,0,0,0.4)',
          }}
        >
          {/* Four Metallic Corner Rivets */}
          <div className="absolute top-2.5 left-2.5 z-20 h-2.5 w-2.5 rounded-full border border-zinc-400 bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-sm flex items-center justify-center">
            <div className="h-0.5 w-0.5 rounded-full bg-zinc-800" />
          </div>
          <div className="absolute top-2.5 right-2.5 z-20 h-2.5 w-2.5 rounded-full border border-zinc-400 bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-sm flex items-center justify-center">
            <div className="h-0.5 w-0.5 rounded-full bg-zinc-800" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 z-20 h-2.5 w-2.5 rounded-full border border-zinc-400 bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-sm flex items-center justify-center">
            <div className="h-0.5 w-0.5 rounded-full bg-zinc-800" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 z-20 h-2.5 w-2.5 rounded-full border border-zinc-400 bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 shadow-sm flex items-center justify-center">
            <div className="h-0.5 w-0.5 rounded-full bg-zinc-800" />
          </div>

          {/* Card Inner Body */}
          <div
            className="relative flex flex-col flex-1 w-full rounded-[13px] overflow-hidden"
            style={{
              background: `linear-gradient(160deg, #09090b 0%, #111116 50%, #09090b 100%)`,
            }}
          >
            {/* Concentric Watermark Wave Rings */}
            <div
              className="pointer-events-none absolute inset-[-20px] opacity-25"
              style={{
                backgroundImage:
                  'repeating-radial-gradient(circle at 50% 45%, transparent 20px, rgba(255,255,255,0.08) 21px, transparent 22px 30px, rgba(255,255,255,0.08) 31px, transparent 32px)',
              }}
            />

            {/* Giant Typographic Watermark Letters */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
              <div
                className="absolute font-black leading-none opacity-10 text-white"
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '110px',
                  letterSpacing: '-6px',
                  top: '4%',
                  left: '-12px',
                }}
              >
                NEE
                <br />
                RAJ
              </div>
              <div
                className="absolute font-black leading-none opacity-10 text-white"
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '110px',
                  letterSpacing: '-6px',
                  bottom: '18%',
                  right: '-12px',
                }}
              >
                MAY
              </div>
            </div>

            {/* Photo Container */}
            <div className="relative z-10 flex-1 flex items-start justify-center overflow-hidden min-h-0 pt-2 px-2">
              {imgLoaded ? (
                <img
                  src={imageSrc}
                  alt={name}
                  draggable="false"
                  onError={() => setImgLoaded(false)}
                  className="w-full h-full object-cover object-top select-none pointer-events-none drop-shadow-xl"
                  style={{
                    filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))',
                  }}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-lg font-bold"
                    style={{
                      borderColor: `${accentColor}50`,
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    NM
                  </div>
                  <span className="mt-2 text-xs font-mono font-semibold text-white">{name}</span>
                </div>
              )}
            </div>

            {/* Bottom Name & Role Strip */}
            <div
              className="relative z-20 flex items-center justify-between px-3 py-2 border-t"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* White Name Badge Pill */}
              <div
                className="rounded px-2.5 py-1 shadow-md"
                style={{
                  backgroundColor: '#FFFFFF',
                }}
              >
                <span
                  className="font-black text-sm tracking-wider uppercase block leading-none"
                  style={{
                    color: '#09090b',
                    fontFamily: 'system-ui, sans-serif',
                    letterSpacing: '1.5px',
                  }}
                >
                  {firstName}
                </span>
              </div>

              {/* Italic Role Specification */}
              <div className="text-right pl-2">
                <span className="text-[7.5px] uppercase font-mono tracking-wider text-neutral-400 block leading-tight">
                  ENGINEERING //
                </span>
                <span
                  className="text-xs text-white block italic font-serif leading-tight truncate max-w-[110px]"
                  style={{
                    textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  }}
                >
                  {role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HangingIdCard;
