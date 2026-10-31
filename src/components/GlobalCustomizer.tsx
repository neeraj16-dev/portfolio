import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCcw,
  Sliders,
  Palette,
  Type,
  Layers,
  Sparkles,
  Mail,
  Check,
  Sun,
  Moon,
  Play,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Upload,
  Database,
  Star,
  ExternalLink,
  Activity,
} from 'lucide-react';

const triggerSectionMorphWave = (strength: number) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('section-morph-wave', { detail: { strength } }));
  }
};
import {
  GlobalPortfolioConfig,
  THEME_DEFINITIONS,
  ThemePalette,
  getThemeForMode,
  ColorMode,
  LiquidPresetName,
} from '../types/hero';
import { Project, PROJECTS_DATA, ProjectCategory } from '../types/project';
import { TechItem, StackCategory, DEFAULT_TECH_STACK } from '../types/tech';

interface GlobalCustomizerProps {
  config: GlobalPortfolioConfig;
  onChange: (updated: GlobalPortfolioConfig) => void;
  onReset: () => void;
  onClose: () => void;
  onReplayBoot?: () => void;
}

export const GlobalCustomizer: React.FC<GlobalCustomizerProps> = ({
  config,
  onChange,
  onReset,
  onClose,
  onReplayBoot,
}) => {
  const drawerRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<'themes' | 'hero' | 'about' | 'works' | 'contact' | 'morph' | 'data'>('themes');
  const isDark = config.colorMode === 'dark';

  const projects = config.projects && config.projects.length > 0 ? config.projects : PROJECTS_DATA;
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);

  const techItems =
    config.techCapabilities && config.techCapabilities.length > 0
      ? config.techCapabilities
      : DEFAULT_TECH_STACK;
  const [expandedTechId, setExpandedTechId] = useState<string | null>(null);

  const [copiedConfig, setCopiedConfig] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Prevent background wheel and scroll leakage to Lenis/window
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    const stopScrollLeak = (e: WheelEvent) => {
      e.stopPropagation();
    };

    el.addEventListener('wheel', stopScrollLeak, { passive: true });
    return () => {
      el.removeEventListener('wheel', stopScrollLeak);
    };
  }, []);

  const handleUpdate = <K extends keyof GlobalPortfolioConfig>(
    key: K,
    value: GlobalPortfolioConfig[K]
  ) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const toggleColorMode = () => {
    const newMode: ColorMode = isDark ? 'light' : 'dark';
    const targetThemeId = newMode === 'dark' ? 'black' : 'white';
    const updatedTheme = getThemeForMode(targetThemeId, newMode);
    onChange({
      ...config,
      colorMode: newMode,
      themeId: updatedTheme.id,
      accentColor: updatedTheme.accentColor,
      secondaryAccent: updatedTheme.secondaryAccent,
      backgroundColor: updatedTheme.backgroundColor,
      shadeColor: updatedTheme.shadeColor,
      textColor: updatedTheme.textColor,
      backgroundGradient: updatedTheme.backgroundGradient,
    });
  };

  const applyTheme = (themeDefId: string) => {
    const targetMode: ColorMode = themeDefId === 'black' ? 'dark' : 'light';
    const newTheme = getThemeForMode(themeDefId, targetMode);
    onChange({
      ...config,
      colorMode: targetMode,
      themeId: newTheme.id,
      accentColor: newTheme.accentColor,
      secondaryAccent: newTheme.secondaryAccent,
      backgroundColor: newTheme.backgroundColor,
      shadeColor: newTheme.shadeColor,
      textColor: newTheme.textColor,
      backgroundGradient: newTheme.backgroundGradient,
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Real-time Project Management Handlers ---
  const handleAddProject = () => {
    const id = `project-${Date.now()}`;
    const newProject: Project = {
      id,
      title: 'New Spatial Platform',
      subtitle: 'High-Throughput Autonomous Architecture',
      category: 'ai',
      categoryLabel: 'AI & Autonomous Systems',
      year: new Date().getFullYear().toString(),
      featured: true,
      description:
        'A resilient distributed system engineered for low-latency autonomous operations and real-time verifiable outcomes.',
      challenge: 'Maintaining deterministic output and zero-drift state coordination under burst loads.',
      solution: 'Engineered an asynchronous streaming planner with Pydantic contract validation and Redis state buffers.',
      architectureNotes: [
        'Asynchronous event-driven execution pipeline',
        'Deterministic contract validation for all APIs',
        'Sub-millisecond state caching tier',
      ],
      metrics: [
        { label: 'Latency', value: '38ms', detail: 'P90 turnaround' },
        { label: 'Throughput', value: '2.4M', detail: 'events / day' },
        { label: 'Reliability', value: '99.99%', detail: 'zero crash rate' },
      ],
      techStack: ['TypeScript', 'React', 'FastAPI', 'Redis', 'Docker'],
      demoUrl: 'https://github.com',
      githubUrl: 'https://github.com',
      accentColor: config.accentColor || '#00F0FF',
      previewType: 'agent',
    };

    const updated = [newProject, ...projects];
    handleUpdate('projects', updated);
    setExpandedProjectId(id);
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map((p) => {
      if (p.id !== id) return p;
      const merged: Project = { ...p, ...updates };
      if (updates.category) {
        if (updates.category === 'ai') merged.categoryLabel = 'AI & Autonomous Systems';
        else if (updates.category === 'infra' || updates.category === 'cloud') merged.categoryLabel = 'Infra & Distributed DB';
        else if (updates.category === 'webgl') merged.categoryLabel = 'Full Stack & Spatial Web';
        else merged.categoryLabel = 'Full Stack & Systems';
      }
      return merged;
    });
    handleUpdate('projects', updated);
  };

  const handleRemoveProject = (id: string) => {
    if (projects.length <= 1) {
      alert('Portfolio must contain at least one project.');
      return;
    }
    const updated = projects.filter((p) => p.id !== id);
    handleUpdate('projects', updated);
    if (expandedProjectId === id) {
      setExpandedProjectId(null);
    }
  };

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    handleUpdate('projects', updated);
  };

  // --- Real-time Technical Capabilities & Specializations Handlers ---
  const handleAddTechCapability = () => {
    const id = `tech-${Date.now()}`;
    const newCap: TechItem = {
      id,
      name: 'Distributed Cloud & Kubernetes',
      category: 'cloud',
      categoryLabel: 'Cloud & Infrastructure',
      proficiency: 'Expert',
      experience: '5+ Years',
      description: 'Architecting fault-tolerant cloud systems, continuous deployment pipelines, and high-concurrency microservices.',
      highlight: 'Kubernetes, AWS/GCP, Docker, Terraform, Envoy',
    };
    const updated = [...techItems, newCap];
    handleUpdate('techCapabilities', updated);
    setExpandedTechId(id);
  };

  const handleUpdateTechCapability = (id: string, updates: Partial<TechItem>) => {
    const updated = techItems.map((item) => {
      if (item.id !== id) return item;
      const merged: TechItem = { ...item, ...updates };
      if (updates.category) {
        if (updates.category === 'ai') merged.categoryLabel = 'AI & Intelligence';
        else if (updates.category === 'spatial') merged.categoryLabel = 'Spatial & WebGL';
        else if (updates.category === 'cloud') merged.categoryLabel = 'Cloud & Infrastructure';
        else merged.categoryLabel = 'Full Stack Core';
      }
      return merged;
    });
    handleUpdate('techCapabilities', updated);
  };

  const handleRemoveTechCapability = (id: string) => {
    if (techItems.length <= 1) {
      alert('Must retain at least one technical capability.');
      return;
    }
    const updated = techItems.filter((item) => item.id !== id);
    handleUpdate('techCapabilities', updated);
    if (expandedTechId === id) setExpandedTechId(null);
  };

  const handleMoveTechCapability = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= techItems.length) return;
    const updated = [...techItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    handleUpdate('techCapabilities', updated);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2500);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (typeof parsed !== 'object' || !parsed) {
        throw new Error('Invalid JSON object');
      }
      onChange({
        ...config,
        ...parsed,
      });
      setImportStatus({ success: true, message: 'Configuration successfully imported and applied!' });
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 3500);
    } catch (err) {
      setImportStatus({ success: false, message: `Import error: ${(err as Error).message}` });
    }
  };

  return (
    <aside
      ref={drawerRef}
      data-lenis-prevent
      className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l shadow-2xl transition-all duration-300 sm:max-w-xl overscroll-contain ${
        isDark
          ? 'border-white/10 bg-[#09090C]/95 text-[#F4F4F5] backdrop-blur-2xl'
          : 'border-neutral-300 bg-white/95 text-neutral-900 backdrop-blur-2xl'
      }`}
    >
      {/* Studio Header */}
      <div className={`flex items-center justify-between border-b px-5 py-4 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor }}
          >
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h2 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-neutral-950'}`}>
              Global Studio Customizer
            </h2>
            <span className="text-[10px] text-neutral-500 font-mono">
              Real-time site parameters, content &amp; project manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onReplayBoot && (
            <button
              onClick={onReplayBoot}
              title="Replay architectural loading animation"
              className={`cursor-target flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition ${
                isDark ? 'text-neutral-400 hover:bg-white/5 hover:text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <Play className="h-3 w-3" />
              <span>Intro</span>
            </button>
          )}
          <button
            onClick={onReset}
            title="Reset all settings to default"
            className={`cursor-target flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition ${
              isDark ? 'text-neutral-400 hover:bg-white/5 hover:text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
            }`}
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className={`cursor-target rounded-md p-1.5 transition ${
              isDark ? 'text-neutral-400 hover:bg-white/5 hover:text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
            }`}
            aria-label="Close global customizer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`flex border-b px-2 py-2 gap-1 overflow-x-auto ${isDark ? 'border-white/10 bg-black/40' : 'border-neutral-200 bg-neutral-50'}`}>
        <button
          onClick={() => setActiveTab('themes')}
          className={`cursor-target flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-medium transition shrink-0 ${
            activeTab === 'themes'
              ? isDark
                ? 'bg-white/15 text-white font-semibold shadow-sm'
                : 'bg-white text-neutral-950 font-semibold shadow-sm border border-neutral-200'
              : isDark
              ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200'
          }`}
        >
          <Palette className="h-3 w-3" style={{ color: config.accentColor }} />
          <span>Themes</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('hero');
            scrollToSection('hero');
          }}
          className={`cursor-target flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-medium transition shrink-0 ${
            activeTab === 'hero'
              ? isDark
                ? 'bg-white/15 text-white font-semibold shadow-sm'
                : 'bg-white text-neutral-950 font-semibold shadow-sm border border-neutral-200'
              : isDark
              ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200'
          }`}
        >
          <Type className="h-3 w-3" />
          <span>01 Hero</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('about');
            scrollToSection('about');
          }}
          className={`cursor-target flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-medium transition shrink-0 ${
            activeTab === 'about'
              ? isDark
                ? 'bg-white/15 text-white font-semibold shadow-sm'
                : 'bg-white text-neutral-950 font-semibold shadow-sm border border-neutral-200'
              : isDark
              ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200'
          }`}
        >
          <Layers className="h-3 w-3" />
          <span>02 About</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('works');
            scrollToSection('works');
          }}
          className={`cursor-target flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-medium transition shrink-0 ${
            activeTab === 'works'
              ? isDark
                ? 'bg-white/15 text-white font-semibold shadow-sm'
                : 'bg-white text-neutral-950 font-semibold shadow-sm border border-neutral-200'
              : isDark
              ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          <span>03 Works</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('contact');
            scrollToSection('contact');
          }}
          className={`cursor-target flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-medium transition shrink-0 ${
            activeTab === 'contact'
              ? isDark
                ? 'bg-white/15 text-white font-semibold shadow-sm'
                : 'bg-white text-neutral-950 font-semibold shadow-sm border border-neutral-200'
              : isDark
              ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200'
          }`}
        >
          <Mail className="h-3 w-3" />
          <span>04 Contact</span>
        </button>
        <button
          onClick={() => setActiveTab('morph')}
          className={`cursor-target flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-medium transition shrink-0 ${
            activeTab === 'morph'
              ? isDark
                ? 'bg-white/15 text-white font-semibold shadow-sm'
                : 'bg-white text-neutral-950 font-semibold shadow-sm border border-neutral-200'
              : isDark
              ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200'
          }`}
        >
          <Activity className="h-3 w-3" style={{ color: config.accentColor }} />
          <span>Morph</span>
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`cursor-target flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[11px] font-medium transition shrink-0 ${
            activeTab === 'data'
              ? isDark
                ? 'bg-white/15 text-white font-semibold shadow-sm'
                : 'bg-white text-neutral-950 font-semibold shadow-sm border border-neutral-200'
              : isDark
              ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200'
          }`}
        >
          <Database className="h-3 w-3" />
          <span>Backup</span>
        </button>
      </div>

      {/* Main Tab Content Area */}
      <div
        data-lenis-prevent
        className="flex-1 space-y-6 overflow-y-auto overscroll-contain p-5 text-xs"
      >
        {/* ============================================================== */}
        {/* TAB 1: THEMES & COLOR SYSTEM                                    */}
        {/* ============================================================== */}
        {activeTab === 'themes' && (
          <div className="space-y-5">
            {/* Color Mode Switcher */}
            <div
              className={`rounded-xl border p-4 ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-neutral-200 bg-neutral-50 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider block">
                    COLOR MODE //
                  </span>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Switch between Minimalist Light and Dark Obsidian
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleColorMode}
                  className={`cursor-target flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                    isDark
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      : 'border-neutral-300 bg-neutral-900 text-white hover:bg-black'
                  }`}
                >
                  {isDark ? (
                    <>
                      <Sun className="h-3.5 w-3.5 text-amber-400" />
                      <span>LIGHT MODE</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-3.5 w-3.5 text-neutral-300" />
                      <span>DARK MODE</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Curated Theme Palettes */}
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Curated Minimalist Themes //
              </span>
              <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Select between White and Black monochrome styles:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {THEME_DEFINITIONS.map((def) => {
                const palette = getThemeForMode(def.id, config.colorMode);
                const isActive = config.themeId === def.id;

                return (
                  <button
                    key={def.id}
                    onClick={() => applyTheme(def.id)}
                    className={`cursor-target group relative flex flex-col rounded-xl border p-3.5 text-left transition-all overflow-hidden ${
                      isActive
                        ? isDark
                          ? 'border-white/40 bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.06)]'
                          : 'border-neutral-950 bg-neutral-100 shadow-sm'
                        : isDark
                        ? 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div
                      className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
                      style={{ backgroundColor: palette.accentColor }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-xs shadow-xs"
                          style={{
                            backgroundColor: palette.accentColor,
                            boxShadow: `0 0 10px ${palette.accentColor}`,
                          }}
                        />
                        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                          {def.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-5 rounded-xs border border-white/10" style={{ backgroundColor: palette.accentColor }} />
                        <span className="h-3 w-5 rounded-xs border border-white/10" style={{ backgroundColor: palette.secondaryAccent }} />
                        <span className="h-3 w-5 rounded-xs border border-white/10" style={{ backgroundColor: palette.backgroundColor }} />
                        {isActive && <Check className="ml-1 h-3.5 w-3.5" style={{ color: config.accentColor }} />}
                      </div>
                    </div>
                    <p className="relative z-10 mt-1 text-[11px] text-neutral-400 font-mono">
                      {def.tagline}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Granular Color Overrides */}
            <div className={`rounded-xl border p-4 space-y-3.5 ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-neutral-200 bg-neutral-50'}`}>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block">
                Granular Monochrome Tuning //
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-neutral-400 text-[11px]">Primary Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => handleUpdate('accentColor', e.target.value)}
                      className="h-7 w-8 cursor-pointer rounded border border-white/20 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={config.accentColor}
                      onChange={(e) => handleUpdate('accentColor', e.target.value)}
                      className={`w-full rounded border px-2 py-1 font-mono text-xs ${
                        isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-neutral-400 text-[11px]">Secondary Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.secondaryAccent || '#71717A'}
                      onChange={(e) => handleUpdate('secondaryAccent', e.target.value)}
                      className="h-7 w-8 cursor-pointer rounded border border-white/20 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={config.secondaryAccent || '#71717A'}
                      onChange={(e) => handleUpdate('secondaryAccent', e.target.value)}
                      className={`w-full rounded border px-2 py-1 font-mono text-xs ${
                        isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-neutral-400 text-[11px]">Background Canvas</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.backgroundColor || (isDark ? '#09090B' : '#FFFFFF')}
                      onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                      className="h-7 w-8 cursor-pointer rounded border border-white/20 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={config.backgroundColor || (isDark ? '#09090B' : '#FFFFFF')}
                      onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                      className={`w-full rounded border px-2 py-1 font-mono text-xs ${
                        isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-neutral-400 text-[11px]">Base Text Shade</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textColor || (isDark ? '#F4F4F5' : '#09090B')}
                      onChange={(e) => handleUpdate('textColor', e.target.value)}
                      className="h-7 w-8 cursor-pointer rounded border border-white/20 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={config.textColor || (isDark ? '#F4F4F5' : '#09090B')}
                      onChange={(e) => handleUpdate('textColor', e.target.value)}
                      className={`w-full rounded border px-2 py-1 font-mono text-xs ${
                        isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: HERO SECTION EDITORIAL & WORDMARK                       */}
        {/* ============================================================== */}
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                SECTION 01: HERO &amp; WORDMARK //
              </span>
            </div>

            <div>
              <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Architectural Wordmark (Display Name)
              </label>
              <input
                type="text"
                value={config.wordmarkText}
                onChange={(e) => handleUpdate('wordmarkText', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 font-mono ${
                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                } focus:outline-none`}
              />
            </div>

            <div>
              <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Role Tagline / Title
              </label>
              <input
                type="text"
                value={config.roleTagline}
                onChange={(e) => handleUpdate('roleTagline', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 ${
                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                } focus:outline-none`}
              />
            </div>

            <div>
              <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Editorial Summary Bio
              </label>
              <textarea
                rows={3}
                value={config.summaryText}
                onChange={(e) => handleUpdate('summaryText', e.target.value)}
                className={`w-full resize-none rounded-lg border px-3 py-2 ${
                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                } focus:outline-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Availability Line
                </label>
                <input
                  type="text"
                  value={config.availabilityText}
                  onChange={(e) => handleUpdate('availabilityText', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-1.5 ${
                    isDark ? 'border-white/10 bg-black/60 text-neutral-200' : 'border-neutral-300 bg-neutral-50 text-neutral-900'
                  } focus:outline-none`}
                />
              </div>
              <div>
                <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Location Line
                </label>
                <input
                  type="text"
                  value={config.locationText}
                  onChange={(e) => handleUpdate('locationText', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-1.5 ${
                    isDark ? 'border-white/10 bg-black/60 text-neutral-200' : 'border-neutral-300 bg-neutral-50 text-neutral-900'
                  } focus:outline-none`}
                />
              </div>
            </div>

            {/* Wordmark Typography & Physics Controls */}
            <div className={`border-t pt-4 space-y-3 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block">
                WebGL Kinetic Typography &amp; Physics //
              </span>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Wordmark Size: {config.fontSize}px</span>
                <input
                  type="range"
                  min="120"
                  max="280"
                  step="5"
                  value={config.fontSize}
                  onChange={(e) => handleUpdate('fontSize', Number(e.target.value))}
                  className="w-36 accent-cyan-400"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Interaction Reach: {config.reach}px</span>
                <input
                  type="range"
                  min="120"
                  max="500"
                  step="10"
                  value={config.reach}
                  onChange={(e) => handleUpdate('reach', Number(e.target.value))}
                  className="w-36 accent-cyan-400"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Spring Return Speed: {config.speed}%</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={config.speed}
                  onChange={(e) => handleUpdate('speed', Number(e.target.value))}
                  className="w-36 accent-cyan-400"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Spring Damping: {config.damping}%</span>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={config.damping}
                  onChange={(e) => handleUpdate('damping', Number(e.target.value))}
                  className="w-36 accent-cyan-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ABOUT SECTION & STATS                                   */}
        {/* ============================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                SECTION 02: ABOUT &amp; PHILOSOPHY //
              </span>
            </div>

            {/* Traveling 3D Portrait & ID Card Badge Image */}
            <div
              className={`rounded-xl border p-3.5 space-y-3 ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold block">
                    3D PORTRAIT &amp; BADGE IMAGE //
                  </span>
                  <p className="text-[11px] text-neutral-500">
                    Traveling hero cutout and hanging ID badge card portrait
                  </p>
                </div>
                <label className="cursor-pointer flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-mono hover:bg-white/20 transition">
                  <Upload className="h-3 w-3" />
                  <span>UPLOAD</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const res = ev.target?.result as string;
                          if (res) handleUpdate('aboutImageSrc', res);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={config.aboutImageSrc || '/IMG_6368.PNG'}
                  onChange={(e) => handleUpdate('aboutImageSrc', e.target.value)}
                  placeholder="/IMG_6368.PNG or Image URL"
                  className={`w-full rounded border px-2.5 py-1 text-xs font-mono ${
                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleUpdate('aboutImageSrc', '/IMG_6368.PNG')}
                  className="rounded border border-neutral-700 px-2 py-1 text-[10px] font-mono text-neutral-400 hover:text-white hover:border-neutral-500"
                  title="Reset to default IMG_6368.PNG"
                >
                  DEFAULT
                </button>
              </div>
            </div>

            <div>
              <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Philosophy Statement Quote
              </label>
              <textarea
                rows={2}
                value={config.aboutQuote}
                onChange={(e) => handleUpdate('aboutQuote', e.target.value)}
                className={`w-full resize-none rounded-lg border px-3 py-2 ${
                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                } focus:outline-none`}
              />
            </div>

            <div>
              <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Bio Editorial Paragraph
              </label>
              <textarea
                rows={4}
                value={config.aboutBio}
                onChange={(e) => handleUpdate('aboutBio', e.target.value)}
                className={`w-full resize-none rounded-lg border px-3 py-2 ${
                  isDark ? 'border-white/10 bg-black/60 text-neutral-200' : 'border-neutral-300 bg-neutral-50 text-neutral-900'
                } focus:outline-none`}
              />
            </div>

            <div className={`border-t pt-4 space-y-3 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block">
                Quantified Telemetry &amp; Metrics //
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-neutral-500">Years Experience</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={config.aboutYears}
                    onChange={(e) => handleUpdate('aboutYears', Number(e.target.value))}
                    className={`w-full rounded border px-2 py-1 font-mono ${
                      isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-neutral-500">P95 Latency (ms)</label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    step="5"
                    value={config.aboutLatency}
                    onChange={(e) => handleUpdate('aboutLatency', Number(e.target.value))}
                    className={`w-full rounded border px-2 py-1 font-mono ${
                      isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-neutral-500">Uptime Metric (%)</label>
                  <input
                    type="number"
                    min="90"
                    max="100"
                    step="0.01"
                    value={config.aboutUptime}
                    onChange={(e) => handleUpdate('aboutUptime', Number(e.target.value))}
                    className={`w-full rounded border px-2 py-1 font-mono ${
                      isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                    }`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-neutral-500">Deployments / Services</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={config.aboutDeployments}
                    onChange={(e) => handleUpdate('aboutDeployments', Number(e.target.value))}
                    className={`w-full rounded border px-2 py-1 font-mono ${
                      isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* --- Technical Capabilities & Specializations Manager --- */}
            <div className={`border-t pt-4 space-y-3 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block">
                    TECHNICAL CAPABILITIES &amp; SPECIALIZATIONS //
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {techItems.length} technical domain{techItems.length === 1 ? '' : 's'} configured
                  </span>
                </div>
                <button
                  onClick={handleAddTechCapability}
                  className="cursor-target flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-black shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: config.accentColor }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Capability</span>
                </button>
              </div>

              <div>
                <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Section Header Title
                </label>
                <input
                  type="text"
                  value={config.aboutCapabilitiesTitle || 'Technical Capabilities & Specializations'}
                  onChange={(e) => handleUpdate('aboutCapabilitiesTitle', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-1.5 ${
                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>

              <div className="space-y-2.5">
                {techItems.map((tech, index) => {
                  const isExpanded = expandedTechId === tech.id;

                  return (
                    <div
                      key={tech.id}
                      className={`rounded-xl border transition-all ${
                        isExpanded
                          ? isDark
                            ? 'border-white/30 bg-white/[0.04]'
                            : 'border-neutral-400 bg-white shadow-md'
                          : isDark
                          ? 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                      }`}
                    >
                      {/* Header row */}
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleMoveTechCapability(index, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                              className="cursor-target p-0.5 text-neutral-500 hover:text-white disabled:opacity-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleMoveTechCapability(index, 'down')}
                              disabled={index === techItems.length - 1}
                              title="Move Down"
                              className="cursor-target p-0.5 text-neutral-500 hover:text-white disabled:opacity-20"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>

                          <div
                            onClick={() => setExpandedTechId(isExpanded ? null : tech.id)}
                            className="cursor-pointer"
                          >
                            <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                              {tech.name || 'Untitled Capability'}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              [{tech.category.toUpperCase()}] • {tech.proficiency} • {tech.experience}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleRemoveTechCapability(tech.id)}
                            title="Remove Capability"
                            className="cursor-target rounded p-1 text-neutral-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setExpandedTechId(isExpanded ? null : tech.id)}
                            className="cursor-target rounded p-1 text-neutral-400 hover:text-white transition"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Editor */}
                      {isExpanded && (
                        <div className={`border-t p-3 space-y-3 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="mb-1 block text-neutral-400 text-[11px]">Domain Name</label>
                              <input
                                type="text"
                                value={tech.name}
                                onChange={(e) => handleUpdateTechCapability(tech.id, { name: e.target.value })}
                                className={`w-full rounded border px-2 py-1 text-xs ${
                                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-neutral-400 text-[11px]">Category</label>
                              <select
                                value={tech.category}
                                onChange={(e) =>
                                  handleUpdateTechCapability(tech.id, { category: e.target.value as StackCategory })
                                }
                                className={`w-full rounded border px-2 py-1 text-xs font-mono ${
                                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                                }`}
                              >
                                <option value="ai">AI &amp; Agents</option>
                                <option value="fullstack">Full Stack</option>
                                <option value="spatial">Spatial &amp; 3D</option>
                                <option value="cloud">Cloud &amp; Infrastructure</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="mb-1 block text-neutral-400 text-[11px]">Proficiency Level</label>
                              <input
                                type="text"
                                value={tech.proficiency}
                                onChange={(e) => handleUpdateTechCapability(tech.id, { proficiency: e.target.value })}
                                placeholder="Expert / Mastery / Advanced"
                                className={`w-full rounded border px-2 py-1 text-xs ${
                                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-neutral-400 text-[11px]">Experience Line</label>
                              <input
                                type="text"
                                value={tech.experience}
                                onChange={(e) => handleUpdateTechCapability(tech.id, { experience: e.target.value })}
                                placeholder="e.g. 4+ Years in GenAI"
                                className={`w-full rounded border px-2 py-1 text-xs ${
                                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                                }`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Key Highlights &amp; Tools</label>
                            <input
                              type="text"
                              value={tech.highlight}
                              onChange={(e) => handleUpdateTechCapability(tech.id, { highlight: e.target.value })}
                              placeholder="e.g. Gemini 2.5, LangChain, Tool Use"
                              className={`w-full rounded border px-2 py-1 text-xs font-mono ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Capability Editorial Description</label>
                            <textarea
                              rows={2}
                              value={tech.description}
                              onChange={(e) => handleUpdateTechCapability(tech.id, { description: e.target.value })}
                              className={`w-full resize-none rounded border px-2 py-1 text-xs ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: WORKS & FULL PROJECT CRUD MANAGER                        */}
        {/* ============================================================== */}
        {activeTab === 'works' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block">
                  SECTION 03: WORKS &amp; PROJECT MANAGER //
                </span>
                <span className="text-[11px] text-neutral-500">
                  {projects.length} project{projects.length === 1 ? '' : 's'} live in showcase
                </span>
              </div>
              <button
                onClick={handleAddProject}
                className="cursor-target flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-black shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: config.accentColor }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Section Headline & Perspective Tuning */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Section Headline
                </label>
                <input
                  type="text"
                  value={config.worksHeadline}
                  onChange={(e) => handleUpdate('worksHeadline', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-1.5 ${
                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
              <div>
                <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Tagline Subtitle
                </label>
                <input
                  type="text"
                  value={config.worksTagline}
                  onChange={(e) => handleUpdate('worksTagline', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-1.5 ${
                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-between border-t border-b py-2.5 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <span className="text-neutral-500">3D Tilt Angle ({config.worksTiltStrength}°)</span>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={config.worksTiltStrength}
                onChange={(e) => handleUpdate('worksTiltStrength', Number(e.target.value))}
                className="w-36 accent-cyan-400"
              />
            </div>

            {/* --- Live Interactive Projects List --- */}
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block">
                Active Projects (Drag, Edit, Reorder, Remove) //
              </span>

              {projects.map((project, index) => {
                const isExpanded = expandedProjectId === project.id;

                return (
                  <div
                    key={project.id}
                    className={`rounded-xl border transition-all ${
                      isExpanded
                        ? isDark
                          ? 'border-white/30 bg-white/[0.04]'
                          : 'border-neutral-400 bg-white shadow-md'
                        : isDark
                        ? 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    {/* Project Header Bar */}
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        {/* Reorder Buttons */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveProject(index, 'up')}
                            disabled={index === 0}
                            title="Move Up"
                            className="cursor-target p-0.5 text-neutral-500 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleMoveProject(index, 'down')}
                            disabled={index === projects.length - 1}
                            title="Move Down"
                            className="cursor-target p-0.5 text-neutral-500 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Accent dot */}
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: project.accentColor || config.accentColor }}
                        />

                        {/* Project Title */}
                        <div
                          onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                          className="cursor-pointer"
                        >
                          <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            {project.title || 'Untitled Project'}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            [{project.category.toUpperCase()}] • {project.year}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Featured Star toggle */}
                        <button
                          onClick={() => handleUpdateProject(project.id, { featured: !project.featured })}
                          title={project.featured ? 'Featured Project' : 'Mark as Featured'}
                          className={`cursor-target rounded p-1 transition ${
                            project.featured ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </button>

                        {/* Remove Project */}
                        <button
                          onClick={() => handleRemoveProject(project.id)}
                          title="Remove Project"
                          className="cursor-target rounded p-1 text-neutral-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Expand / Collapse */}
                        <button
                          onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                          className="cursor-target rounded p-1 text-neutral-400 hover:text-white transition"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Project Editor Panel */}
                    {isExpanded && (
                      <div className={`border-t p-3 space-y-3 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Title</label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => handleUpdateProject(project.id, { title: e.target.value })}
                              className={`w-full rounded border px-2 py-1 text-xs ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Subtitle</label>
                            <input
                              type="text"
                              value={project.subtitle}
                              onChange={(e) => handleUpdateProject(project.id, { subtitle: e.target.value })}
                              className={`w-full rounded border px-2 py-1 text-xs ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Category</label>
                            <select
                              value={project.category}
                              onChange={(e) =>
                                handleUpdateProject(project.id, { category: e.target.value as ProjectCategory })
                              }
                              className={`w-full rounded border px-2 py-1 text-xs font-mono ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            >
                              <option value="ai">AI &amp; Agents</option>
                              <option value="fullstack">Full Stack</option>
                              <option value="infra">Infra &amp; DB</option>
                              <option value="webgl">Spatial / WebGL</option>
                              <option value="cloud">Cloud / RAG</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Year</label>
                            <input
                              type="text"
                              value={project.year}
                              onChange={(e) => handleUpdateProject(project.id, { year: e.target.value })}
                              className={`w-full rounded border px-2 py-1 text-xs font-mono ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Accent Color</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={project.accentColor || config.accentColor}
                                onChange={(e) => handleUpdateProject(project.id, { accentColor: e.target.value })}
                                className="h-6 w-7 cursor-pointer rounded border border-white/20 bg-transparent p-0"
                              />
                              <input
                                type="text"
                                value={project.accentColor || config.accentColor}
                                onChange={(e) => handleUpdateProject(project.id, { accentColor: e.target.value })}
                                className={`w-full rounded border px-1.5 py-0.5 text-[10px] font-mono ${
                                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-neutral-400 text-[11px]">Overview Description</label>
                          <textarea
                            rows={2}
                            value={project.description}
                            onChange={(e) => handleUpdateProject(project.id, { description: e.target.value })}
                            className={`w-full resize-none rounded border px-2 py-1 text-xs ${
                              isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                            }`}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Challenge Statement</label>
                            <textarea
                              rows={2}
                              value={project.challenge}
                              onChange={(e) => handleUpdateProject(project.id, { challenge: e.target.value })}
                              className={`w-full resize-none rounded border px-2 py-1 text-xs ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Solution Statement</label>
                            <textarea
                              rows={2}
                              value={project.solution}
                              onChange={(e) => handleUpdateProject(project.id, { solution: e.target.value })}
                              className={`w-full resize-none rounded border px-2 py-1 text-xs ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-neutral-400 text-[11px]">Tech Stack Tags (Comma Separated)</label>
                          <input
                            type="text"
                            value={project.techStack.join(', ')}
                            onChange={(e) =>
                              handleUpdateProject(project.id, {
                                techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              })
                            }
                            className={`w-full rounded border px-2 py-1 text-xs font-mono ${
                              isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                            }`}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">Demo / Live URL</label>
                            <input
                              type="text"
                              value={project.demoUrl || ''}
                              onChange={(e) => handleUpdateProject(project.id, { demoUrl: e.target.value })}
                              className={`w-full rounded border px-2 py-1 text-xs font-mono ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-neutral-400 text-[11px]">GitHub URL</label>
                            <input
                              type="text"
                              value={project.githubUrl || ''}
                              onChange={(e) => handleUpdateProject(project.id, { githubUrl: e.target.value })}
                              className={`w-full rounded border px-2 py-1 text-xs font-mono ${
                                isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Metrics Editor */}
                        <div>
                          <label className="mb-1 block text-neutral-400 text-[11px]">Telemetry Performance Metrics</label>
                          <div className="grid grid-cols-3 gap-2">
                            {project.metrics.map((metric, mIndex) => (
                              <div
                                key={mIndex}
                                className={`rounded border p-1.5 space-y-1 ${
                                  isDark ? 'border-white/10 bg-white/[0.02]' : 'border-neutral-200 bg-neutral-100'
                                }`}
                              >
                                <input
                                  type="text"
                                  placeholder="Label"
                                  value={metric.label}
                                  onChange={(e) => {
                                    const newMetrics = [...project.metrics];
                                    newMetrics[mIndex] = { ...newMetrics[mIndex], label: e.target.value };
                                    handleUpdateProject(project.id, { metrics: newMetrics });
                                  }}
                                  className={`w-full rounded border px-1.5 py-0.5 text-[10px] ${
                                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                                  }`}
                                />
                                <input
                                  type="text"
                                  placeholder="Value"
                                  value={metric.value}
                                  onChange={(e) => {
                                    const newMetrics = [...project.metrics];
                                    newMetrics[mIndex] = { ...newMetrics[mIndex], value: e.target.value };
                                    handleUpdateProject(project.id, { metrics: newMetrics });
                                  }}
                                  className={`w-full rounded border px-1.5 py-0.5 text-[10px] font-bold font-mono ${
                                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: CONTACT & OPERATIONAL TRANSMISSION                       */}
        {/* ============================================================== */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                SECTION 04: CONTACT &amp; COLOPHON //
              </span>
            </div>

            <div>
              <label className={`mb-1 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Primary Transmission Email
              </label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => handleUpdate('contactEmail', e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 font-mono ${
                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-neutral-500">Availability Status</label>
                <input
                  type="text"
                  value={config.contactStatus}
                  onChange={(e) => handleUpdate('contactStatus', e.target.value)}
                  className={`w-full rounded border px-3 py-1.5 font-mono ${
                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
              <div>
                <label className="mb-1 block text-neutral-500">SLA Response Turnaround</label>
                <input
                  type="text"
                  value={config.contactSLA}
                  onChange={(e) => handleUpdate('contactSLA', e.target.value)}
                  className={`w-full rounded border px-3 py-1.5 font-mono ${
                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-neutral-500">Location</label>
                <input
                  type="text"
                  value={config.contactLocation}
                  onChange={(e) => handleUpdate('contactLocation', e.target.value)}
                  className={`w-full rounded border px-3 py-1.5 ${
                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
              <div>
                <label className="mb-1 block text-neutral-500">Timezone Offset</label>
                <input
                  type="text"
                  value={config.contactTimezone}
                  onChange={(e) => handleUpdate('contactTimezone', e.target.value)}
                  className={`w-full rounded border px-3 py-1.5 font-mono ${
                    isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
            </div>

            <div className={`border-t pt-4 space-y-3 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block">
                Network &amp; Social Endpoints //
              </span>
              <div>
                <label className="mb-1 block text-neutral-500">GitHub Profile URL</label>
                <input
                  type="text"
                  value={config.contactGithub}
                  onChange={(e) => handleUpdate('contactGithub', e.target.value)}
                  className={`w-full rounded border px-3 py-1.5 font-mono ${
                    isDark ? 'border-white/10 bg-black/60 text-neutral-200' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
              <div>
                <label className="mb-1 block text-neutral-500">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={config.contactLinkedin}
                  onChange={(e) => handleUpdate('contactLinkedin', e.target.value)}
                  className={`w-full rounded border px-3 py-1.5 font-mono ${
                    isDark ? 'border-white/10 bg-black/60 text-neutral-200' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
              <div>
                <label className="mb-1 block text-neutral-500">X / Twitter Profile URL</label>
                <input
                  type="text"
                  value={config.contactTwitter}
                  onChange={(e) => handleUpdate('contactTwitter', e.target.value)}
                  className={`w-full rounded border px-3 py-1.5 font-mono ${
                    isDark ? 'border-white/10 bg-black/60 text-neutral-200' : 'border-neutral-300 bg-neutral-50 text-black'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: SECTION MORPH // FLUID SPRING DIVIDERS                   */}
        {/* ============================================================== */}
        {activeTab === 'morph' && (
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                TRANSITIONS: SECTION MORPH // FLUID DIVIDERS
              </span>
              <p className="mt-1 text-[11px] text-neutral-500">
                Reactive Bezier membranes connecting viewport sectors. The dividers bulge, flex, and rebound based on scroll velocity and spring physics.
              </p>
            </div>

            {/* Interactive Physics Sandbox */}
            <div className={`rounded-lg border p-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-neutral-200 bg-neutral-100'}`}>
              <span className="font-mono text-[10px] font-semibold uppercase text-neutral-400 block mb-2">
                Kinetic Pulse Trigger
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => triggerSectionMorphWave(0.85)}
                  className={`cursor-target flex items-center justify-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-mono font-medium transition ${
                    isDark
                      ? 'border-white/10 bg-black/50 text-white hover:border-cyan-400/50 hover:bg-white/10'
                      : 'border-neutral-300 bg-white text-neutral-900 hover:border-black hover:bg-neutral-50'
                  }`}
                >
                  <ArrowDown className="h-3 w-3" style={{ color: config.accentColor }} />
                  <span>Impulse Down</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerSectionMorphWave(-0.85)}
                  className={`cursor-target flex items-center justify-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-mono font-medium transition ${
                    isDark
                      ? 'border-white/10 bg-black/50 text-white hover:border-cyan-400/50 hover:bg-white/10'
                      : 'border-neutral-300 bg-white text-neutral-900 hover:border-black hover:bg-neutral-50'
                  }`}
                >
                  <ArrowUp className="h-3 w-3" style={{ color: config.accentColor }} />
                  <span>Impulse Up</span>
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className={`cursor-target flex-1 rounded-sm border px-2 py-1.5 text-[10px] font-mono text-center transition ${
                    isDark ? 'border-white/5 bg-black/30 text-neutral-400 hover:text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:text-black'
                  }`}
                >
                  Scroll to About &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('works')}
                  className={`cursor-target flex-1 rounded-sm border px-2 py-1.5 text-[10px] font-mono text-center transition ${
                    isDark ? 'border-white/5 bg-black/30 text-neutral-400 hover:text-white' : 'border-neutral-200 bg-white text-neutral-600 hover:text-black'
                  }`}
                >
                  Scroll to Works &rarr;
                </button>
              </div>
            </div>

            {/* Response Mode Preset */}
            <div>
              <label className={`mb-1.5 block font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Response Profile Preset
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['cinematic', 'elastic', 'smooth', 'custom'] as const).map((mode) => {
                  const isSelected = (config.morphPreset || 'cinematic') === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleUpdate('morphPreset', mode)}
                      className={`cursor-target rounded-md border py-1.5 px-2 text-[10px] font-mono uppercase transition ${
                        isSelected
                          ? isDark
                            ? 'border-white/30 bg-white/20 text-white font-bold'
                            : 'border-neutral-900 bg-neutral-900 text-white font-bold'
                          : isDark
                          ? 'border-white/10 bg-black/40 text-neutral-400 hover:text-white'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:text-black'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Curve Depth Slider */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className={`font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Max Curve Depth
                </label>
                <span className="font-mono text-neutral-500">{config.morphCurveDepth ?? 165}px</span>
              </div>
              <input
                type="range"
                min="60"
                max="280"
                step="5"
                value={config.morphCurveDepth ?? 165}
                onChange={(e) => handleUpdate('morphCurveDepth', Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Curve Width Slider */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className={`font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Curve Width Inset
                </label>
                <span className="font-mono text-neutral-500">{config.morphCurveWidth ?? 72}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="2"
                value={config.morphCurveWidth ?? 72}
                onChange={(e) => handleUpdate('morphCurveWidth', Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Spring Stiffness & Damping */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-[11px] text-neutral-500">Stiffness</label>
                  <span className="font-mono text-neutral-500">{config.morphStiffness ?? 95}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="220"
                  step="5"
                  value={config.morphStiffness ?? 95}
                  onChange={(e) => handleUpdate('morphStiffness', Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-[11px] text-neutral-500">Damping</label>
                  <span className="font-mono text-neutral-500">{config.morphDamping ?? 24}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={config.morphDamping ?? 24}
                  onChange={(e) => handleUpdate('morphDamping', Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Specular Highlight Strength */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className={`font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Specular Highlight Opacity
                </label>
                <span className="font-mono text-neutral-500">
                  {Math.round((config.morphHighlightStrength ?? 0.09) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.35"
                step="0.01"
                value={config.morphHighlightStrength ?? 0.09}
                onChange={(e) => handleUpdate('morphHighlightStrength', Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Telemetry Overlay Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.morphShowTelemetry ?? true}
                  onChange={(e) => handleUpdate('morphShowTelemetry', e.target.checked)}
                  className="rounded border-neutral-600 text-cyan-500 focus:ring-0"
                />
                <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Show Tactical Telemetry Badges ([01] &rarr; [02])
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: BACKUP, EXPORT & IMPORT DATA                            */}
        {/* ============================================================== */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                DATA BACKUP &amp; PORTFOLIO MIGRATION //
              </span>
              <p className={`mt-1 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Export your entire real-time portfolio state as JSON, or import previous backups.
              </p>
            </div>

            {/* Export Actions */}
            <div className={`rounded-xl border p-4 space-y-3 ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-neutral-200 bg-neutral-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold block">Export Portfolio Configuration</span>
                  <span className="text-[11px] text-neutral-500">Includes all projects, themes, bios &amp; settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="cursor-target flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    {copiedConfig ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedConfig ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownloadJson}
                    className="cursor-target flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-black transition hover:opacity-90"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Import Area */}
            <div className={`rounded-xl border p-4 space-y-3 ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-neutral-200 bg-neutral-50'}`}>
              <span className="font-semibold block">Import Portfolio JSON</span>
              <textarea
                rows={5}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste portfolio JSON configuration here..."
                className={`w-full resize-none rounded-lg border p-2.5 font-mono text-[11px] ${
                  isDark ? 'border-white/10 bg-black/60 text-white' : 'border-neutral-300 bg-white text-black'
                }`}
              />

              {importStatus && (
                <div
                  className={`rounded-lg p-2.5 text-xs font-medium ${
                    importStatus.success
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {importStatus.message}
                </div>
              )}

              <button
                onClick={handleApplyJson}
                disabled={!importJsonText.trim()}
                className="cursor-target flex items-center justify-center gap-1.5 w-full rounded-lg py-2 text-xs font-semibold text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.accentColor }}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Apply Imported Configuration</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Status Bar */}
      <div className={`border-t px-5 py-3 flex items-center justify-between text-[11px] font-mono ${isDark ? 'border-white/10 bg-black/40 text-neutral-400' : 'border-neutral-200 bg-neutral-100 text-neutral-600'}`}>
        <span>MODE: {config.colorMode.toUpperCase()} | THEME: {config.themeId?.toUpperCase()}</span>
        <span style={{ color: config.accentColor }}>{config.accentColor}</span>
      </div>
    </aside>
  );
};

export default GlobalCustomizer;
