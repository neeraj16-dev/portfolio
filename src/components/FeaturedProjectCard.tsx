import React from 'react';
import { ExternalLink, Github, Lock } from 'lucide-react';
import { FeaturedProject } from '../data/featuredProjectsData';

interface FeaturedProjectCardProps {
  project: FeaturedProject;
  accentColor?: string;
  isDark?: boolean;
}

export const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  project,
  isDark = true,
}) => {
  return (
    <article
      className={`group relative rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${isDark
        ? 'bg-[#0a0a0d]/90 border-white/10 hover:border-red-500/40 shadow-xl shadow-black/50'
        : 'bg-white border-neutral-200 hover:border-red-500/40 shadow-lg shadow-neutral-200/50'
        }`}
    >
      {/* Top subtle red accent highlight line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Ambient Red Glow on hover (dark mode) */}
      {isDark && (
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-red-600/10 blur-[90px] group-hover:bg-red-600/15 transition-all duration-500" />
      )}

      <div className="relative z-10 p-4 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">

          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-5 sm:space-y-6">
            <div>
              {/* Category / Domain Tag: Replaces the two person icon */}
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <span className="font-mono text-[11px] sm:text-[13px] font-bold tracking-wider text-red-500 bg-red-500/10 border border-red-500/25 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full inline-flex items-center gap-2 shadow-[0_0_14px_rgba(239,68,68,0.2)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  {project.domainTag}
                </span>

              </div>

              {/* Project Main Title */}
              <h3
                className={`font-mono text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight leading-tight transition-colors ${isDark ? 'text-white group-hover:text-red-50' : 'text-neutral-950 group-hover:text-red-950'
                  }`}
              >
                {project.title}
              </h3>

              {/* Project Subtitle / Tagline */}
              <p
                className={`mt-3 text-sm sm:text-[15px] leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
              >
                {project.tagline}
              </p>
            </div>

            {/* Action Buttons at bottom of left column */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Primary Button: View Project (hidden for client based & private projects) */}
              {!project.isPrivate && !project.categories.includes('Client Based') && (project.liveUrl || project.githubUrl) && (
                <a
                  href={project.liveUrl || project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_25px_rgba(239,68,68,0.55)] active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Project</span>
                </a>
              )}

              {/* Secondary Button: Source Code or Linkless Private Code Button */}
              {project.isPrivate || project.categories.includes('Client Based') || !project.githubUrl ? (
                <div
                  className={`cursor-target inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 select-none ${isDark
                    ? 'bg-neutral-950/80 text-neutral-200 border border-white/15'
                    : 'bg-neutral-100 text-neutral-800 border border-neutral-300'
                    }`}
                  data-cursor-label="Private Code"
                >
                  <Github className="w-4 h-4 text-red-500" />
                  <span>Private Code</span>
                </div>
              ) : (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`cursor-target inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 ${isDark
                    ? 'bg-neutral-950/80 hover:bg-neutral-900 text-neutral-200 border border-white/15 hover:border-white/30'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
                    }`}
                >
                  <Github className="w-4 h-4 text-red-500" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Concise Overview */}
            {project.overview && (
              <p
                className={`text-sm sm:text-[15px] leading-relaxed ${isDark ? 'text-neutral-300 font-light' : 'text-neutral-700'
                  }`}
              >
                {project.overview}
              </p>
            )}

            {/* KEY FEATURES SECTION */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1 w-3 bg-red-500 rounded-full" />
                <h4
                  className={`font-mono text-xs uppercase tracking-widest font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                >
                  KEY FEATURES
                </h4>
              </div>

              {/* 2-column feature list matching the template */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {project.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm leading-relaxed">
                    <span className="text-red-500 font-black text-lg leading-none select-none">
                      •
                    </span>
                    <span className={isDark ? 'text-neutral-200' : 'text-neutral-800'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TECHNOLOGIES USED SECTION */}
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1 w-3 bg-red-500 rounded-full" />
                <h4
                  className={`font-mono text-xs uppercase tracking-widest font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                >
                  TECHNOLOGIES USED
                </h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className={`font-mono text-xs px-3 py-1 rounded-full transition-colors ${isDark
                      ? 'bg-neutral-950/90 text-neutral-300 border border-white/10 hover:border-red-500/50 hover:text-white'
                      : 'bg-neutral-100 text-neutral-800 border border-neutral-300 hover:border-red-500/50'
                      }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </article>
  );
};
