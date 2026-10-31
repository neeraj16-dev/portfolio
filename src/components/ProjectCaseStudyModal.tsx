import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types/project';
import { ColorMode } from '../types/hero';
import { X, ExternalLink, Github } from 'lucide-react';
import { MetricStatsCounter } from './StatsCounter';

interface ProjectCaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  colorMode?: ColorMode;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({
  project,
  onClose,
  colorMode = 'dark',
}) => {
  const isDark = colorMode === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="casestudy-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto overscroll-contain ${
            isDark ? 'bg-black/85' : 'bg-black/50'
          }`}
          data-lenis-prevent
          onClick={onClose}
        >
          <motion.div
            key="casestudy-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative my-4 sm:my-8 w-full max-w-3xl rounded-2xl border p-4 sm:p-8 shadow-2xl ${
              isDark
                ? 'border-white/10 bg-[#0C0C0F] text-[#F4F4F5]'
                : 'border-neutral-200 bg-white text-neutral-900 shadow-2xl'
            }`}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`flex items-start justify-between border-b pb-5 ${
                isDark ? 'border-white/10' : 'border-neutral-200'
              }`}
            >
              <div>
                <div
                  className={`flex items-center gap-2 text-xs font-mono ${
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-xs"
                    style={{ backgroundColor: project.accentColor }}
                  />
                  <span className={`font-semibold uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                    {project.categoryLabel}
                  </span>
                  <span aria-hidden="true">|</span>
                  <span>{project.year} ARCHITECTURE</span>
                </div>
                <h3 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                  {project.title}
                </h3>
                <p className={`mt-1 text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {project.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`cursor-target rounded-lg p-2 transition ${
                  isDark
                    ? 'text-neutral-400 hover:bg-white/10 hover:text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
                aria-label="Close case study"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-8 max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  Executive Brief //
                </span>
                <p className={`mt-2 text-sm leading-relaxed sm:text-base ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-red-500">
                    01 The Challenge //
                  </span>
                  <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    {project.challenge}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-500">
                    02 The Engineered Solution //
                  </span>
                  <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    {project.solution}
                  </p>
                </div>
              </div>

              <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  Architectural Decisions &amp; Implementation //
                </span>
                <ul className="mt-4 space-y-2.5">
                  {project.architectureNotes.map((note, idx) => (
                    <li key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      <span className="font-mono font-bold mt-0.5" style={{ color: project.accentColor }}>
                        0{idx + 1}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  Verifiable Performance Metrics //
                </span>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl border p-3.5 text-left ${
                        isDark ? 'border-white/10 bg-white/[0.02]' : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      <div className={`font-mono text-lg font-bold sm:text-xl ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                        <MetricStatsCounter text={metric.value} />
                      </div>
                      <div className={`text-xs font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {metric.label}
                      </div>
                      {metric.detail && (
                        <div className="mt-0.5 text-[10px] text-neutral-500 font-mono">
                          {metric.detail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  Technology Stack //
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-md border px-3 py-1 font-mono text-xs ${
                        isDark ? 'border-white/10 bg-white/[0.04] text-neutral-300' : 'border-neutral-200 bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5 ${
                isDark ? 'border-white/10' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`cursor-target inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                      isDark
                        ? 'border-white/15 bg-white/5 text-white hover:bg-white/15'
                        : 'border-neutral-300 bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                    }`}
                  >
                    <Github className="h-4 w-4" />
                    <span>View Repository</span>
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: project.accentColor }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Live Verification</span>
                  </a>
                )}
              </div>
              <button
                onClick={onClose}
                className={`cursor-target rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                  isDark
                    ? 'border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                    : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectCaseStudyModal;
