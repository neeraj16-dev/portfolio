import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterRoleProps {
  primaryRole?: string;
  accentColor: string;
  className?: string;
  roles?: string[];
}

export const TypewriterRole: React.FC<TypewriterRoleProps> = ({
  primaryRole,
  accentColor,
  className = '',
  roles = [
    'Full Stack Developer',
    'Full Stack AI Engineer',
    'Gen AI Enthusiast',
  ],
}) => {
  const activeRoles = React.useMemo(() => {
    if (primaryRole && primaryRole.trim().length > 0) {
      const trimmed = primaryRole.trim();
      const filtered = roles.filter(
        (r) => r.toLowerCase() !== trimmed.toLowerCase()
      );
      return [trimmed, ...filtered];
    }
    return roles;
  }, [primaryRole, roles]);

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTarget = activeRoles[currentRoleIndex] || activeRoles[0];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < currentTarget.length) {
        const nextChar = currentTarget.slice(0, displayedText.length + 1);
        const typingDelay = 42 + Math.random() * 32;
        timer = setTimeout(() => {
          setDisplayedText(nextChar);
        }, typingDelay);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        const backspaced = currentTarget.slice(0, displayedText.length - 1);
        const backspaceSpeed = 22;
        timer = setTimeout(() => {
          setDisplayedText(backspaced);
        }, backspaceSpeed);
      } else {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % activeRoles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentRoleIndex, activeRoles]);

  return (
    <div
      className={`inline-flex items-center justify-center gap-2 select-none ${className}`}
      aria-live="polite"
      aria-label={`Current Role: ${displayedText}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 sm:text-xs">
        DISCIPLINE //
      </span>
      <div className="flex items-center min-h-[1.75rem]">
        <motion.span
          key={currentRoleIndex}
          initial={{ opacity: 0.95 }}
          animate={{ opacity: 1 }}
          className="text-sm font-semibold tracking-wide sm:text-base md:text-lg"
        >
          {displayedText}
        </motion.span>
        <motion.span
          animate={{
            opacity: [1, 0, 1],
            scaleY: [1, 0.85, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-block ml-1.5 w-[2.5px] h-4 sm:h-5 rounded-xs"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default TypewriterRole;
