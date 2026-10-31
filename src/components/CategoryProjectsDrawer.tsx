'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Project,
  SpecializationKey,
  SPECIALIZATION_TABS,
  normalizeProjectSpecialization,
} from '../types/project';
import { ColorMode } from '../types/hero';
import { ProjectCard } from './ProjectCard';
import {
  X,
  Search,
  Bot,
  Layers,
  Database,
  SlidersHorizontal,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface CategoryProjectsDrawerProps {
  isOpen: boolean;
  initialCategory: SpecializationKey;
  projects: Project[];
  accentColor: string;
  colorMode?: ColorMode;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const CategoryProjectsDrawer: React.FC<CategoryProjectsDrawerProps> = ({
  isOpen,
  initialCategory,
  projects,
  accentColor,
  colorMode = 'dark',
  onClose,
  onSelectProject,
}) => {
  const isDark = colorMode === 'dark';
  const [activeCategory, setActiveCategory] = useState<SpecializationKey>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep active category synced if initialCategory changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const activeSpec =
    SPECIALIZATION_TABS.find((t) => t.key === activeCategory) || SPECIALIZATION_TABS[0];

  // Filter projects by category and search query
  const categoryProjects = projects.filter(
    (p) => normalizeProjectSpecialization(p.category) === activeCategory
  );

  const filteredProjects = categoryProjects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.techStack.some((tech) => tech.toLowerCase().includes(q))
    );
  });

  const getCategoryIcon = (key: SpecializationKey) => {
    switch (key) {
      case 'ai':
        return <Bot className="h-4 w-4" />;
      case 'fullstack':
        return <Layers className="h-4 w-4" />;
      case 'infra':
        return <Database className="h-4 w-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="category-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden bg-black/80 backdrop-blur-xl"
          data-lenis-prevent
        >
          {/* Main Full-Screen Overlay Card */}
          <motion.div
            key="category-drawer-content"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`flex h-[94vh] sm:h-[92vh] w-full flex-col rounded-t-3xl border-t border-x shadow-2xl transition-colors duration-300 ${
              isDark
                ? 'border-white/15 bg-[#09090C] text-[#F4F4F5]'
                : 'border-neutral-300 bg-[#FAFAFC] text-neutral-900'
            }`}
          >
            {/* Top Navigation & Status Bar */}
            <div
              className={`flex shrink-0 items-center justify-between border-b px-6 py-4 sm:px-10 ${
                isDark ? 'border-white/10 bg-[#0E0E14]' : 'border-neutral-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`cursor-target flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-mono transition-colors ${
                    isDark
                      ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-white/30 hover:text-white'
                      : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:border-neutral-500 hover:text-black'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>BACK TO PORTFOLIO</span>
                </button>
                <span className="hidden sm:inline font-mono text-xs text-neutral-500">//</span>
                <span
                  className="hidden sm:inline font-mono text-xs font-bold uppercase tracking-wider"
                  style={{ color: activeSpec.accent }}
                >
                  SPECIALIZATION ARCHIVE BLUEPRINT
                </span>
              </div>

              {/* Close Button & ESC hint */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline font-mono text-[11px] text-neutral-500">
                  PRESS [ESC] OR
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close archive blueprint overlay"
                  className={`cursor-target flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-mono font-semibold transition-colors ${
                    isDark
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      : 'border-neutral-300 bg-neutral-200 text-neutral-950 hover:bg-neutral-300'
                  }`}
                >
                  <X className="h-4 w-4" />
                  <span>CLOSE [✕]</span>
                </button>
              </div>
            </div>

            {/* Specialization Filter Switcher & Search Bar */}
            <div
              className={`shrink-0 border-b px-6 py-5 sm:px-10 ${
                isDark ? 'border-white/10 bg-[#0A0A0E]' : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Category Switcher Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {SPECIALIZATION_TABS.map((tab) => {
                    const isSelected = activeCategory === tab.key;
                    const count = projects.filter(
                      (p) => normalizeProjectSpecialization(p.category) === tab.key
                    ).length;

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => {
                          setActiveCategory(tab.key);
                          setSearchQuery('');
                        }}
                        className={`cursor-target flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-mono transition-all duration-200 ${
                          isSelected
                            ? isDark
                              ? 'bg-white text-neutral-950 font-bold shadow-sm'
                              : 'bg-neutral-950 text-white font-bold shadow-sm'
                            : isDark
                            ? 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20 hover:text-white'
                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-black'
                        }`}
                        style={{
                          borderLeftColor: isSelected ? tab.accent : undefined,
                          borderLeftWidth: isSelected ? '3px' : '1px',
                        }}
                      >
                        <span style={{ color: isSelected ? undefined : tab.accent }}>
                          {getCategoryIcon(tab.key)}
                        </span>
                        <span>{tab.label}</span>
                        <span
                          className={`rounded-xs px-1.5 py-0.5 text-[10px] ${
                            isSelected
                              ? isDark
                                ? 'bg-neutral-900 text-white'
                                : 'bg-neutral-200 text-neutral-900'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stack, title, or keywords..."
                    className={`w-full rounded-md border py-1.5 pl-8 pr-3 text-xs font-mono outline-none transition-colors ${
                      isDark
                        ? 'border-white/15 bg-black/50 text-white placeholder-neutral-500 focus:border-white/40'
                        : 'border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:border-neutral-500'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-400 hover:text-white"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Specialization overview description */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-neutral-400">
                <p className="max-w-3xl text-[11px] leading-relaxed">
                  <span className="font-semibold text-white">{activeSpec.countLabel}: </span>
                  {activeSpec.description}
                </p>
                <span className="text-[11px]">
                  SHOWING {filteredProjects.length} OF {categoryProjects.length} PROJECTS
                </span>
              </div>
            </div>

            {/* Scrollable Gallery Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 overscroll-contain">
              {filteredProjects.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center font-mono">
                  <SlidersHorizontal className="h-8 w-8 text-neutral-500 mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">
                    No projects match query "{searchQuery}"
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Try searching for another technology (e.g. FastAPI, Three.js, Redis, PostgreSQL).
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-4 rounded-md border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    RESET QUERY
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="flex">
                      <ProjectCard
                        project={project}
                        onSelect={onSelectProject}
                        accentColor={project.accentColor || activeSpec.accent}
                        colorMode={colorMode}
                        dataCategory={activeCategory}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryProjectsDrawer;
