import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ColorMode } from '../types/hero';

interface ParallaxBackgroundProps {
  accentColor: string;
  secondaryAccent?: string;
  colorMode?: ColorMode;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  accentColor,
  secondaryAccent = '#818CF8',
  colorMode = 'dark',
}) => {
  const isDark = colorMode === 'dark';
  const { scrollY } = useScroll();

  // Mouse parallax motion values (normalized between -1 and 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 45, stiffness: 220, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax offsets for different depth layers based on mouse
  const layer1X = useTransform(smoothMouseX, [-1, 1], [-25, 25]);
  const layer1Y = useTransform(smoothMouseY, [-1, 1], [-25, 25]);

  const layer2X = useTransform(smoothMouseX, [-1, 1], [40, -40]);
  const layer2Y = useTransform(smoothMouseY, [-1, 1], [40, -40]);

  const layer3X = useTransform(smoothMouseX, [-1, 1], [-60, 60]);
  const layer3Y = useTransform(smoothMouseY, [-1, 1], [-60, 60]);

  // Scroll parallax offsets for deep atmospheric orbs
  const orb1ScrollY = useTransform(scrollY, [0, 4000], [0, 650]);
  const orb2ScrollY = useTransform(scrollY, [0, 4000], [0, -450]);
  const orb3ScrollY = useTransform(scrollY, [0, 4000], [0, 850]);

  useEffect(() => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Deep Atmospheric Parallax Glowing Orbs */}
      <motion.div
        style={{
          y: orb1ScrollY,
          x: layer1X,
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          willChange: 'transform',
        }}
        className="absolute -top-[10vh] left-[15vw] h-[500px] w-[500px] rounded-full transition-colors duration-700"
        animate={{
          scale: [1, 1.1, 1],
          opacity: isDark ? [0.12, 0.2, 0.12] : [0.04, 0.08, 0.04],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        style={{
          y: orb2ScrollY,
          x: layer2X,
          background: `radial-gradient(circle, ${secondaryAccent} 0%, transparent 70%)`,
          willChange: 'transform',
        }}
        className="absolute top-[45vh] right-[10vw] h-[550px] w-[550px] rounded-full transition-colors duration-700"
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: isDark ? [0.1, 0.18, 0.1] : [0.03, 0.07, 0.03],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        style={{
          y: orb3ScrollY,
          x: layer3X,
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          willChange: 'transform',
        }}
        className="absolute top-[130vh] left-[25vw] h-[450px] w-[450px] rounded-full transition-colors duration-700"
        animate={{
          scale: [0.95, 1.15, 0.95],
          opacity: isDark ? [0.08, 0.16, 0.08] : [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Spatial Geometric Depth Nodes (Multi-Layer Parallax) */}
      <motion.div
        style={{
          x: layer2X,
          y: layer2Y,
        }}
        className={`absolute top-[28vh] left-[8vw] hidden font-mono text-[9px] tracking-widest sm:block ${isDark ? 'text-white/20' : 'text-black/15'
          }`}
      >
        <div className="flex items-center gap-1.5">
          <span style={{ color: accentColor }}>+</span>
          <span>PARALLAX_HORIZON // L-01</span>
        </div>
        <div className="text-[8px] opacity-60">[Z: -180PX]</div>
      </motion.div>

      <motion.div
        style={{
          x: layer1X,
          y: layer1Y,
        }}
        className={`absolute top-[65vh] right-[6vw] hidden font-mono text-[9px] tracking-widest sm:block ${isDark ? 'text-white/20' : 'text-black/15'
          }`}
      >
        <div className="flex items-center gap-1.5">
          <span>VECTOR_PLANE // R-02</span>
          <span style={{ color: secondaryAccent }}>+</span>
        </div>
        <div className="text-[8px] opacity-60">[Z: +90PX]</div>
      </motion.div>

      <motion.div
        style={{
          x: layer3X,
          y: layer3Y,
        }}
        className={`absolute top-[110vh] left-[5vw] hidden font-mono text-[9px] tracking-widest sm:block ${isDark ? 'text-white/20' : 'text-black/15'
          }`}
      >
        <div className="flex items-center gap-1.5">
          <span style={{ color: accentColor }}>•</span>
          <span>SPATIAL_ORBIT // K-03</span>
        </div>
        <div className="text-[8px] opacity-60">[DEPTH: DUAL_AXIS]</div>
      </motion.div>
    </div>
  );
};

export default ParallaxBackground;
