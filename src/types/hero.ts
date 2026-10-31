import { Project, PROJECTS_DATA } from './project';
import { TechItem, DEFAULT_TECH_STACK } from './tech';

export type LiquidPresetName = 'Prism' | 'Lava' | 'Plasma' | 'Pulse' | 'Mist' | 'Vortex' | 'Auto';

export type ColorMode = 'dark' | 'light';

export interface ThemePalette {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;
  secondaryAccent: string;
  backgroundColor: string;
  shadeColor: string;
  textColor: string;
  backgroundGradient: string;
  previewColors: [string, string, string]; // [accent, secondary, base]
}

export interface ThemeDefinition {
  id: string;
  name: string;
  tagline: string;
  dark: {
    accentColor: string;
    secondaryAccent: string;
    backgroundColor: string;
    shadeColor: string;
    textColor: string;
    backgroundGradient: string;
    previewColors: [string, string, string];
  };
  light: {
    accentColor: string;
    secondaryAccent: string;
    backgroundColor: string;
    shadeColor: string;
    textColor: string;
    backgroundGradient: string;
    previewColors: [string, string, string];
  };
}

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: 'white',
    name: 'White',
    tagline: 'Minimalist stark white canvas with charcoal and slate',
    light: {
      accentColor: '#18181B',
      secondaryAccent: '#71717A',
      backgroundColor: '#FFFFFF',
      shadeColor: '#E4E4E7',
      textColor: '#09090B',
      backgroundGradient: 'none',
      previewColors: ['#18181B', '#71717A', '#FFFFFF'],
    },
    dark: {
      accentColor: '#FFFFFF',
      secondaryAccent: '#A1A1AA',
      backgroundColor: '#09090B',
      shadeColor: '#27272A',
      textColor: '#F4F4F5',
      backgroundGradient: 'none',
      previewColors: ['#FFFFFF', '#A1A1AA', '#09090B'],
    },
  },
  {
    id: 'black',
    name: 'Black',
    tagline: 'Minimalist obsidian black canvas with crisp silver and slate',
    light: {
      accentColor: '#09090B',
      secondaryAccent: '#52525B',
      backgroundColor: '#FFFFFF',
      shadeColor: '#D4D4D8',
      textColor: '#09090B',
      backgroundGradient: 'none',
      previewColors: ['#09090B', '#52525B', '#FFFFFF'],
    },
    dark: {
      accentColor: '#FFFFFF',
      secondaryAccent: '#71717A',
      backgroundColor: '#000000',
      shadeColor: '#18181B',
      textColor: '#F4F4F5',
      backgroundGradient: 'none',
      previewColors: ['#FFFFFF', '#71717A', '#000000'],
    },
  },
];

export function getThemeForMode(themeId: string = 'white', mode: ColorMode = 'light'): ThemePalette {
  const def = THEME_DEFINITIONS.find((t) => t.id === themeId) || THEME_DEFINITIONS[0];
  const modeValues = mode === 'light' ? def.light : def.dark;
  return {
    id: def.id,
    name: def.name,
    tagline: def.tagline,
    ...modeValues,
  };
}

export function getAllThemesForMode(mode: ColorMode = 'light'): ThemePalette[] {
  return THEME_DEFINITIONS.map((def) => {
    const modeValues = mode === 'light' ? def.light : def.dark;
    return {
      id: def.id,
      name: def.name,
      tagline: def.tagline,
      ...modeValues,
    };
  });
}

export const THEME_PALETTES: ThemePalette[] = getAllThemesForMode('light');

export interface GlobalPortfolioConfig {
  colorMode: ColorMode;
  themeId: string;
  backgroundGradient?: string;
  accentColor: string;
  secondaryAccent?: string;
  textColor: string;
  shadeColor: string;
  backgroundColor: string;

  wordmarkText: string;
  roleTagline: string;
  summaryText: string;
  availabilityText: string;
  locationText: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: string;
  fontFamily: string;
  reach: number;
  speed: number;
  damping: number;
  handleSize: number;
  handleSpread: number;
  showLabels: boolean;

  liquidPreset?: LiquidPresetName;
  liquidSpeed?: number;
  liquidOpacity?: number;

  // SectionMorph Divider Fluid Transition Settings
  morphPreset?: 'smooth' | 'elastic' | 'cinematic' | 'custom';
  morphCurveDepth?: number;
  morphCurveWidth?: number;
  morphStiffness?: number;
  morphDamping?: number;
  morphHighlightStrength?: number;
  morphShowTelemetry?: boolean;

  aboutImageSrc?: string;
  aboutQuote: string;
  aboutBio: string;
  aboutYears: number;
  aboutLatency: number;
  aboutUptime: number;
  aboutDeployments: number;
  aboutCapabilitiesTitle: string;
  techCapabilities: TechItem[];

  worksHeadline: string;
  worksTagline: string;
  worksTiltStrength: number;
  worksShowMetrics: boolean;
  projects: Project[];

  contactEmail: string;
  contactStatus: string;
  contactLocation: string;
  contactTimezone: string;
  contactSLA: string;
  contactGithub: string;
  contactLinkedin: string;
  contactTwitter: string;
}

export type HeroConfig = GlobalPortfolioConfig;

export const DEFAULT_HERO_CONFIG: GlobalPortfolioConfig = {
  colorMode: 'light',
  themeId: 'white',
  accentColor: '#18181B',
  secondaryAccent: '#71717A',
  textColor: '#09090B',
  shadeColor: '#E4E4E7',
  backgroundColor: '#FFFFFF',
  backgroundGradient: 'none',

  wordmarkText: 'NEERAJ MAYEKAR',
  roleTagline: 'Full Stack Developer & AI Engineer',
  summaryText: 'Crafting spatial web experiences, interactive shaders, and high-performance digital architectures.',
  availabilityText: 'Available for Q2/Q3 2026 Collaborations',
  locationText: 'Remote / Worldwide',
  fontSize: 180,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  fontFamily: 'Inter',
  reach: 320,
  speed: 55,
  damping: 65,
  handleSize: 109,
  handleSpread: 27,
  showLabels: true,

  liquidPreset: 'Auto',
  liquidSpeed: 25,
  liquidOpacity: 0.65,

  morphPreset: 'cinematic',
  morphCurveDepth: 165,
  morphCurveWidth: 72,
  morphStiffness: 95,
  morphDamping: 24,
  morphHighlightStrength: 0.09,
  morphShowTelemetry: true,

  aboutImageSrc: '/card-front.png',
  aboutQuote: 'Architecting resilient full-stack systems and high-throughput AI agents with unyielding mechanical empathy.',
  aboutBio:
    'I design and engineer production-grade distributed architectures, autonomous multi-agent pipelines, and spatial interactive interfaces. I specialize in bridging complex AI infrastructure with intuitive user experiences.',
  aboutYears: 6,
  aboutLatency: 180,
  aboutUptime: 99.9,
  aboutDeployments: 40,
  aboutCapabilitiesTitle: 'Technical Capabilities & Specializations',
  techCapabilities: DEFAULT_TECH_STACK,

  worksHeadline: 'Selected Works & Case Studies',
  worksTagline: 'Architectural prototypes and production-verified systems deployed at scale.',
  worksTiltStrength: 15,
  worksShowMetrics: true,
  projects: PROJECTS_DATA,

  contactEmail: 'neerajmayekar16@gmail.com',
  contactStatus: 'ACTIVE',
  contactLocation: 'Mumbai, India',
  contactTimezone: 'Asia/Kolkata (UTC+5:30)',
  contactSLA: '< 24h',
  contactGithub: 'https://github.com/neeraj16-dev',
  contactLinkedin: 'https://linkedin.com/in/neerajmayekar',
  contactTwitter: 'https://x.com',
};

export interface HeroPreset {
  id: string;
  name: string;
  description: string;
  config: Partial<GlobalPortfolioConfig>;
}

export const HERO_PRESETS: HeroPreset[] = [
  {
    id: 'cyan-cyber',
    name: 'Cyber Obsidian',
    description: 'Electric cyan glow with deep black contrast',
    config: {
      themeId: 'cyberpunk',
      accentColor: '#00F0FF',
      secondaryAccent: '#FF007F',
      textColor: '#FFFFFF',
      shadeColor: '#0F172A',
      backgroundColor: '#050505',
      backgroundGradient:
        'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(0, 240, 255, 0.2), rgba(5, 5, 5, 1) 100%)',
      reach: 320,
      speed: 55,
      damping: 65,
      fontSize: 180,
      handleSize: 109,
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome Studio',
    description: 'Architectural stark white with minimal slate',
    config: {
      themeId: 'minimalist',
      accentColor: '#FFFFFF',
      secondaryAccent: '#A1A1AA',
      textColor: '#F4F4F5',
      shadeColor: '#27272A',
      backgroundColor: '#09090B',
      backgroundGradient:
        'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(255, 255, 255, 0.14), rgba(9, 9, 11, 1) 100%)',
      reach: 260,
      speed: 40,
      damping: 80,
      fontSize: 190,
      handleSize: 90,
    },
  },
  {
    id: 'acid-matrix',
    name: 'Acid Matrix',
    description: 'High-contrast neon emerald on deep obsidian',
    config: {
      themeId: 'matrix',
      accentColor: '#10B981',
      secondaryAccent: '#34D399',
      textColor: '#F0FDF4',
      shadeColor: '#052E16',
      backgroundColor: '#020B06',
      backgroundGradient:
        'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(16, 185, 129, 0.2), rgba(2, 11, 6, 1) 100%)',
      reach: 340,
      speed: 60,
      damping: 55,
      fontSize: 175,
      handleSize: 115,
    },
  },
  {
    id: 'solar-amber',
    name: 'Solar Flare',
    description: 'Warm radiant amber with bronze depth',
    config: {
      themeId: 'solar',
      accentColor: '#F59E0B',
      secondaryAccent: '#FB923C',
      textColor: '#FFFBEB',
      shadeColor: '#451A03',
      backgroundColor: '#0C0804',
      backgroundGradient:
        'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(245, 158, 11, 0.22), rgba(12, 8, 4, 1) 100%)',
      reach: 300,
      speed: 50,
      damping: 70,
      fontSize: 185,
      handleSize: 100,
    },
  },
  {
    id: 'hyper-violet',
    name: 'Hyper Violet',
    description: 'Ethereal ultraviolet with twilight shades',
    config: {
      themeId: 'hyperviolet',
      accentColor: '#A855F7',
      secondaryAccent: '#EC4899',
      textColor: '#FAF5FF',
      shadeColor: '#3B0764',
      backgroundColor: '#090412',
      backgroundGradient:
        'radial-gradient(ellipse 85% 55% at 50% -15%, rgba(168, 85, 247, 0.24), rgba(9, 4, 18, 1) 100%)',
      reach: 330,
      speed: 52,
      damping: 62,
      fontSize: 180,
      handleSize: 105,
    },
  },
];
