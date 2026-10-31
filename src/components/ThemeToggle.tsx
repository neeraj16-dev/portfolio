import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ColorMode } from '../types/hero';

interface ThemeToggleProps {
  mode: ColorMode;
  onToggle: () => void;
  accentColor?: string;
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  mode,
  onToggle,
  accentColor = '#38BDF8',
  className = '',
  showLabel = true,
}) => {
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`cursor-target group relative inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-all duration-300 ${
        isDark
          ? 'border-white/15 bg-white/[0.04] text-neutral-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
          : 'border-neutral-300 bg-black/[0.04] text-neutral-800 hover:border-black/30 hover:bg-black/[0.08] hover:text-black shadow-xs'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Toggle theme: Currently ${mode.toUpperCase()} mode`}
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        <Sun
          className={`absolute h-3.5 w-3.5 transition-all duration-300 ${
            isDark
              ? 'scale-0 rotate-90 opacity-0 text-amber-400'
              : 'scale-100 rotate-0 opacity-100 text-amber-600'
          }`}
        />
        <Moon
          className={`absolute h-3.5 w-3.5 transition-all duration-300 ${
            isDark
              ? 'scale-100 rotate-0 opacity-100 text-cyan-300'
              : 'scale-0 -rotate-90 opacity-0 text-neutral-600'
          }`}
        />
      </div>

      {showLabel && (
        <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">
          {isDark ? 'DARK' : 'LIGHT'}
        </span>
      )}

      <span
        className="h-1.5 w-1.5 rounded-xs transition-colors duration-300"
        style={{
          backgroundColor: accentColor,
          boxShadow: isDark ? `0 0 6px ${accentColor}` : 'none',
        }}
      />
    </button>
  );
};

export default ThemeToggle;
