import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Project } from '../types/project';
import { ColorMode } from '../types/hero';
import { ExternalLink, Github, ArrowUpRight, Cpu, Layers, Sparkles, Activity, Bot } from 'lucide-react';
import { MetricStatsCounter } from './StatsCounter';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  accentColor: string;
  colorMode?: ColorMode;
  dataCategory?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  accentColor,
  colorMode = 'dark',
  dataCategory,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = colorMode === 'dark';

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springConfig = { damping: 22, stiffness: 280, mass: 0.6 };

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), springConfig);
  const magneticX = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), springConfig);
  const magneticY = useSpring(useTransform(mouseY, [-1, 1], [-8, 8]), springConfig);
  const scale = useSpring(1, springConfig);
  const glareOpacity = useSpring(0, { damping: 25, stiffness: 260 });

  const glareBackground = useMotionTemplate`radial-gradient(circle 320px at ${glareX}% ${glareY}%, ${
    isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.08)'
  } 0%, transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x - rect.width / 2) / (rect.width / 2);
    const normY = (y - rect.height / 2) / (rect.height / 2);
    mouseX.set(normX);
    mouseY.set(normY);
    glareX.set((x / rect.width) * 100);
    glareY.set((y / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.02);
    glareOpacity.set(0.35);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
    glareOpacity.set(0);
  };

  const renderCategoryIcon = () => {
    switch (project.category) {
      case 'ai':
        return <Bot className="h-3.5 w-3.5" style={{ color: project.accentColor }} />;
      case 'webgl':
        return <Sparkles className="h-3.5 w-3.5" style={{ color: project.accentColor }} />;
      case 'cloud':
        return <Layers className="h-3.5 w-3.5" style={{ color: project.accentColor }} />;
      case 'fullstack':
        return <Activity className="h-3.5 w-3.5" style={{ color: project.accentColor }} />;
      default:
        return <Cpu className="h-3.5 w-3.5" style={{ color: project.accentColor }} />;
    }
  };

  const computedCategory =
    dataCategory ||
    (project.category === 'ai' ? 'ai' : project.category === 'webgl' ? 'webgl' : 'systems');

  return (
    <motion.div
      data-category={computedCategory}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`cursor-target group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-colors will-change-transform ${
        isDark
          ? 'border-white/10 bg-[#0C0C0F] text-[#F4F4F5] hover:border-white/25 hover:shadow-2xl'
          : 'border-neutral-200 bg-white text-neutral-900 shadow-sm hover:border-neutral-400 hover:shadow-xl'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
        rotateX,
        rotateY,
        x: magneticX,
        y: magneticY,
        scale,
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity"
        style={{
          background: glareBackground,
          opacity: glareOpacity,
        }}
      />

      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-[90px] transition-opacity duration-500 opacity-10 group-hover:opacity-25"
        style={{ backgroundColor: project.accentColor }}
      />

      <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
        <div
          className={`flex items-center justify-between border-b pb-3 text-xs font-mono transition-transform duration-300 ${
            isDark ? 'border-white/10 text-neutral-400' : 'border-neutral-200 text-neutral-600'
          }`}
          style={{ transform: 'translateZ(25px)' }}
        >
          <div className="flex items-center gap-2">
            {renderCategoryIcon()}
            <span className={`font-semibold tracking-wider ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
              {project.categoryLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <span>{project.year}</span>
            {project.featured && (
              <>
                <span aria-hidden="true">|</span>
                <span className="font-semibold tracking-wider" style={{ color: project.accentColor }}>
                  FEATURED
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 transition-transform duration-300" style={{ transform: 'translateZ(38px)' }}>
          <h3
            className={`text-xl font-bold tracking-tight transition-colors sm:text-2xl ${
              isDark ? 'text-white group-hover:text-cyan-300' : 'text-neutral-950 group-hover:text-cyan-700'
            }`}
          >
            {project.title}
          </h3>
          <p className={`mt-1 text-xs font-medium sm:text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {project.subtitle}
          </p>
        </div>

        <p
          className={`mt-3 text-xs sm:text-sm leading-relaxed line-clamp-3 transition-transform duration-300 ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}
          style={{ transform: 'translateZ(25px)' }}
        >
          {project.description}
        </p>

        <div
          className={`relative mt-5 h-36 w-full overflow-hidden rounded-xl border p-3 flex flex-col justify-between transition-transform duration-300 ${
            isDark ? 'border-white/10 bg-black/60' : 'border-neutral-200 bg-neutral-900 text-white'
          }`}
          style={{ transform: 'translateZ(48px)' }}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            }}
          />

          {project.previewType === 'agent' && (
            <div className="relative z-10 font-mono text-[11px] text-cyan-300/90 leading-tight space-y-1">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>DAG Planner :: Stream Active</span>
              </div>
              <div className="text-neutral-300">&gt; Prompt context validated: 100% schema integrity</div>
              <div className="text-cyan-400">&gt; Redis dispatch =&gt; Gemini 2.5 Pro (85ms latency)</div>
              <div className="text-emerald-400">&gt; Tool execution verified: self-healing completed</div>
            </div>
          )}

          {project.previewType === 'shader' && (
            <div className="relative z-10 flex flex-col justify-between h-full font-mono text-[11px]">
              <div className="flex items-center justify-between text-purple-300">
                <span>GLSL Raymarching - 45k Instances</span>
                <span className="text-neutral-400">120 FPS</span>
              </div>
              <div className="flex items-end gap-1.5 h-14 w-full">
                {[40, 65, 85, 30, 95, 60, 45, 80, 50, 70, 90, 35, 60].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-purple-600/30 to-purple-400/80 transition-all duration-300"
                    style={{ height: `${isHovered ? (h * 1.1) % 100 : h}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {project.previewType === 'vector' && (
            <div className="relative z-10 font-mono text-[11px] text-emerald-300/90 space-y-1">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>pgvector + BM25 Hybrid Index</span>
              </div>
              <div className="text-neutral-300">&gt; Cosine Distance: 0.942 | BM25 Score: 8.41</div>
              <div className="text-emerald-400">&gt; RRF Rank Fusion: Recalled 5 chunks in 42ms</div>
              <div className="text-neutral-400">&gt; Context payload hydrated via SSE</div>
            </div>
          )}

          {project.previewType === 'telemetry' && (
            <div className="relative z-10 flex flex-col justify-between h-full font-mono text-[11px]">
              <div className="flex items-center justify-between text-amber-300">
                <span>Ingest: 250k events/s</span>
                <span className="text-emerald-400">P99 &lt; 15ms</span>
              </div>
              <div className="h-12 w-full flex items-center">
                <svg className="w-full h-10 overflow-visible" viewBox="0 0 200 40">
                  <path
                    d="M0 25 Q 30 10, 60 28 T 120 15 T 160 30 T 200 12"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
          )}

          {project.previewType === 'workflow' && (
            <div className="relative z-10 font-mono text-[11px] text-sky-300/90 space-y-1">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Playwright Synthesizer :: Headless</span>
              </div>
              <div className="text-neutral-300">&gt; Accessibility tree inspected: 84 nodes</div>
              <div className="text-sky-400">&gt; Visual spatial bounding boxes aligned</div>
              <div className="text-emerald-400">&gt; 32 Parallel workers executed: 0 failures</div>
            </div>
          )}

          <div className="relative z-10 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10 text-[10px] font-mono text-neutral-400">
            <span className="text-neutral-500">STACK:</span>
            {project.techStack.slice(0, 4).map((tech, idx) => (
              <span key={tech} className="text-neutral-300">
                {tech}
                {idx < 3 && idx < project.techStack.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`mt-4 grid grid-cols-3 gap-2 border-t pt-3 transition-transform duration-300 ${
            isDark ? 'border-white/10' : 'border-neutral-200'
          }`}
          style={{ transform: 'translateZ(30px)' }}
        >
          {project.metrics.map((metric, idx) => (
            <div key={idx} className="text-left">
              <div className={`font-mono text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                <MetricStatsCounter text={metric.value} />
              </div>
              <div className={`text-[10px] leading-snug ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`mt-6 flex items-center justify-between gap-3 border-t pt-4 transition-transform duration-300 ${
          isDark ? 'border-white/10' : 'border-neutral-200'
        }`}
        style={{ transform: 'translateZ(34px)' }}
      >
        <button
          onClick={() => onSelect(project)}
          className={`cursor-target inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
            isDark
              ? 'bg-white/10 text-white hover:bg-white hover:text-neutral-950'
              : 'bg-neutral-100 text-neutral-900 hover:bg-black hover:text-white'
          }`}
        >
          <span>Inspect Case Study</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`cursor-target rounded-lg border p-2 transition ${
                isDark
                  ? 'border-white/10 text-neutral-400 hover:border-white/30 hover:bg-white/5 hover:text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-100 hover:text-black'
              }`}
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`cursor-target rounded-lg border p-2 transition ${
                isDark
                  ? 'border-white/10 text-neutral-400 hover:border-white/30 hover:bg-white/5 hover:text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-100 hover:text-black'
              }`}
              aria-label={`View live demo for ${project.title}`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
