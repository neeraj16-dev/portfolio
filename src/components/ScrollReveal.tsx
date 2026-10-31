import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scale?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.75,
  yOffset = 24,
  xOffset = 0,
  scale = 1,
  threshold = 0.2,
  once = true,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        x: xOffset,
        scale,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      }}
      viewport={{
        once,
        amount: threshold,
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollStaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export const ScrollStaggerContainer: React.FC<ScrollStaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  initialDelay = 0,
  threshold = 0.15,
  once = true,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollStaggerItemProps {
  children: React.ReactNode;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const ScrollStaggerItem: React.FC<ScrollStaggerItemProps> = ({
  children,
  duration = 0.65,
  yOffset = 20,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: yOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};
