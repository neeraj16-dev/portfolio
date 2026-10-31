import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Layers, Box, Mail, Terminal } from 'lucide-react';
import StatsCounter from './StatsCounter';
import { ColorMode } from '../types/hero';

interface SectionRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorMode?: ColorMode;
  accentColor?: string;
}

export const SectionRoadmapModal: React.FC<SectionRoadmapModalProps> = ({
  isOpen,
  onClose,
  colorMode = 'dark',
  accentColor = '#38BDF8',
}) => {
  const isDark = colorMode === 'dark';

  const sections = [
    {
      num: '01',
      title: 'Hero Stage',
      status: 'completed',
      icon: Box,
      description:
        'Interactive WebGL Vector Wordmark with shader bloom, pointer-reactive coordinates, typewriter kicker, dark/light mode toggle, and live parameter customization studio.',
      tag: 'Completed',
    },
    {
      num: '02',
      title: 'About Me & Vision',
      status: 'completed',
      icon: Layers,
      description:
        'Biographical narrative, quantitative engineering milestones (years, latency, uptime, deployments), thesis callout, and core architectural principles.',
      tag: 'Completed',
    },
    {
      num: '03',
      title: 'Technical Capabilities & Skills',
      status: 'completed',
      icon: Terminal,
      description:
        'Interactive capability workbench with domain category filters, deep-dive specification inspector, and multi-tab live system telemetry terminal.',
      tag: 'Completed',
    },
    {
      num: '04',
      title: 'Selected Works & Case Studies',
      status: 'completed',
      icon: Sparkles,
      description:
        'Bento masonry grid with interactive 3D perspective tilt cards, project demos, GitHub links, and deep-dive architectural case study modals.',
      tag: 'Completed',
    },
    {
      num: '05',
      title: 'Contact & Colophon',
      status: 'completed',
      icon: Mail,
      description:
        'Inquiry dispatch terminal, direct click-to-copy communication channels, live timezone telemetry, connected developer nodes, and architectural colophon.',
      tag: 'Completed',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="roadmap-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
            isDark ? 'bg-black/80' : 'bg-black/50'
          }`}
          onClick={onClose}
        >
          <motion.div
            key="roadmap-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl rounded-2xl border p-4 sm:p-8 shadow-2xl ${
              isDark
                ? 'border-white/10 bg-[#0C0C0E] text-[#F4F4F5]'
                : 'border-neutral-200 bg-white text-neutral-900 shadow-2xl'
            }`}
            role="dialog"
            aria-modal="true"
          >
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: accentColor }}>
                  Section-by-Section Roadmap
                </span>
                <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                  Portfolio Architecture
                </h3>
              </div>
              <button
                onClick={onClose}
                className={`cursor-target rounded-lg p-2 transition ${
                  isDark
                    ? 'text-neutral-400 hover:bg-white/10 hover:text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
                aria-label="Close roadmap"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className={`mt-3 text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Following your exact section flow: Section 01 (Hero), Section 02 (About Me), Section 03 (Skills), Section 04 (Works), and Section 05 (Contact &amp; Colophon) are deployed and operational.
            </p>

            <div
              data-lenis-prevent
              className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto overscroll-contain pr-1"
            >
              {sections.map((s) => {
                const Icon = s.icon;
                const isCompleted = s.status === 'completed';
                return (
                  <div
                    key={s.num}
                    className={`flex items-start gap-3 sm:gap-4 rounded-xl border p-3 sm:p-4 transition ${
                      isCompleted
                        ? isDark
                          ? 'border-cyan-500/30 bg-cyan-950/20'
                          : 'border-neutral-200 bg-neutral-50'
                        : isDark
                        ? 'border-white/10 bg-white/[0.02]'
                        : 'border-neutral-100 bg-white'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg ${
                        isCompleted
                          ? isDark
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-neutral-200 text-neutral-900'
                          : 'bg-white/5 text-neutral-500'
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-xs text-neutral-500">{s.num}</span>
                          <h4 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-neutral-950'}`}>{s.title}</h4>
                        </div>
                        <span
                          className="text-[10px] font-medium tracking-wider uppercase shrink-0"
                          style={{ color: accentColor }}
                        >
                          {s.tag}
                        </span>
                      </div>
                      <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{s.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t pt-4 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <span className="text-xs text-neutral-500 font-mono">
                <StatsCounter value={5} duration={1} /> of 5 sections operational
              </span>
              <button
                onClick={onClose}
                className={`cursor-target w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  isDark
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                <span>Dismiss &amp; Return to Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SectionRoadmapModal;
