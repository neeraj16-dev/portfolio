import React from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

interface ViewportPageTransitionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const ViewportPageTransition: React.FC<ViewportPageTransitionProps> = ({
  children,
  id,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Smooth the scroll velocity with spring physics to prevent jitter while maintaining responsiveness
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 38,
    stiffness: 300,
    mass: 0.22,
  });

  // Dynamic Y-axis scale based on instantaneous scroll speed:
  // At rest (0px/s) -> scaleY = 1.00
  // At high velocity (±2500px/s) -> stretches up to 1.048 for a high-velocity aerodynamic stretch
  const scaleY = useTransform(
    smoothVelocity,
    [-2800, 0, 2800],
    [1.048, 1, 1.048],
    { clamp: true }
  );

  if (shouldReduceMotion) {
    return (
      <div id={id} className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div id={id} className={`w-full ${className}`}>
      <motion.div
        style={{
          scaleY,
          originY: 0.5,
          willChange: 'transform',
        }}
        className="w-full origin-center"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ViewportPageTransition;
