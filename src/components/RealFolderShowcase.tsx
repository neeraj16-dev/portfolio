'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useId,
  useCallback,
  ReactNode,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import {
  Project,
  SpecializationKey,
  normalizeProjectSpecialization,
} from '../types/project';
import { ColorMode, THEME_DEFINITIONS } from '../types/hero';
import { ArrowUpRight } from 'lucide-react';

/* ─── RealFolder exact CSS styles from Matthias Ölschlegel ───────────────────── */
const css = `
.real-folder, .real-folder * {
  box-sizing: border-box;
}
.real-folder button, .real-folder a {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  appearance: none;
}
.real-folder button:focus-visible, .real-folder a:focus-visible {
  outline: 2px solid #252A26;
  outline-offset: 4px;
}
.real-folder .real-folder-tab:focus-visible {
  outline-color: #fff;
  outline-offset: -2px;
}
@media (prefers-reduced-motion: reduce) {
  .real-folder * {
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`;

/* ─── Color Helper to Auto-Link Folders to Active Theme ──────────────────────── */
function hexToHsl(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return [200, 80, 50];
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((((h % 360) + 360) % 360) / 360);
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function shiftHexHue(hex: string, deltaDeg: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h + deltaDeg, Math.max(65, s), Math.min(62, Math.max(45, l)));
}

export function resolveFolderThemeColors(
  accentColor: string = '#00F0FF',
  colorMode: ColorMode = 'dark'
): { aiColor: string; fullstackColor: string } {
  const clean = accentColor.trim().toLowerCase();
  const matched = THEME_DEFINITIONS.find((t) => {
    const pal = colorMode === 'light' ? t.light : t.dark;
    return (
      pal.accentColor.toLowerCase() === clean ||
      t.dark.accentColor.toLowerCase() === clean ||
      t.light.accentColor.toLowerCase() === clean
    );
  });

  if (matched) {
    const pal = colorMode === 'light' ? matched.light : matched.dark;
    return {
      aiColor: pal.accentColor,
      fullstackColor: pal.secondaryAccent || shiftHexHue(pal.accentColor, 40),
    };
  }

  return {
    aiColor: accentColor,
    fullstackColor: shiftHexHue(accentColor, 45),
  };
}

/* ─── Vector Artworks for Paper Cards ────────────────────────────────────────── */
function Artwork({
  collection,
  index,
  project,
}: {
  collection: number;
  index: number;
  project?: Project;
}) {
  const cream = '#F2EFDF';
  const red = '#E86042';
  const ink = '#262B29';
  const blue = '#456BBD';
  const powder = '#ADC9DB';
  const forest = '#315F50';
  const citron = '#D9E6A5';

  let art: ReactNode;
  const artId = ((collection % 3) * 3 + (index % 3)) % 9;

  switch (artId) {
    case 0:
      art = (
        <React.Fragment>
          <rect width="300" height="360" fill={cream} />
          <circle cx="150" cy="155" r="109" fill={red} />
          <circle cx="150" cy="155" r="62" fill={cream} />
          <path d="M41 155a109 109 0 0 0 218 0" fill="none" stroke={ink} strokeWidth="28" />
          <rect x="122" y="142" width="56" height="164" rx="28" fill={red} />
          <circle cx="150" cy="302" r="28" fill={ink} />
          <path d="M22 326h57m-57 7h35" stroke={ink} strokeWidth="2" />
        </React.Fragment>
      );
      break;
    case 1:
      art = (
        <React.Fragment>
          <rect width="300" height="360" fill={red} />
          <circle cx="246" cy="45" r="80" fill={ink} />
          <circle cx="246" cy="45" r="31" fill={red} />
          {[38, 52, 66, 80, 94, 108, 122, 136].map((r) => (
            <path
              key={r}
              d={`M${146 - r} 253a${r} ${r} 0 0 1 ${r * 2} 0v107`}
              fill="none"
              stroke={cream}
              strokeWidth="6"
            />
          ))}
          <rect x="129" y="231" width="34" height="129" rx="17" fill={ink} />
          <circle cx="35" cy="39" r="9" fill={cream} />
        </React.Fragment>
      );
      break;
    case 2:
      art = (
        <React.Fragment>
          <rect width="300" height="360" fill={cream} />
          <path d="M33 30h102v102H33z" fill={ink} />
          <path d="M33 132a102 102 0 0 0 102 102V132Z" fill={red} />
          <path d="M165 30a102 102 0 0 1 102 102H165Z" fill={red} />
          <path d="M165 162h102v102H165z" fill={ink} />
          <circle cx="216" cy="213" r="29" fill={cream} />
          <path d="M33 265h102v63H33z" fill={red} />
          {[276, 287, 298, 309, 320].map((y) => (
            <path key={y} d={`M33 ${y}h102`} stroke={cream} strokeWidth="3" />
          ))}
          <circle cx="216" cy="311" r="18" fill={ink} />
        </React.Fragment>
      );
      break;
    case 3:
      art = (
        <React.Fragment>
          <rect width="300" height="360" fill={powder} />
          <circle cx="239" cy="54" r="28" fill={cream} />
          <path d="M29 360V151a110 110 0 0 1 220 0v209Z" fill={cream} />
          <path d="M61 360V155a78 78 0 0 1 156 0v205Z" fill={blue} />
          <path d="M97 360V163a42 42 0 0 1 84 0v197Z" fill="#284980" />
          <path d="m139 212 78 72v76H61v-76Z" fill={powder} />
          {[237, 256, 280, 309, 344].map((y, i) => (
            <path
              key={y}
              d={`M${139 - (y - 212) * 0.55} ${y}H${139 + (y - 212) * 0.55}`}
              stroke={cream}
              strokeWidth={2 + i * 0.2}
            />
          ))}
          <path d="M29 360h220" stroke={cream} strokeWidth="16" />
        </React.Fragment>
      );
      break;
    case 4:
      art = (
        <React.Fragment>
          <rect width="300" height="360" fill={blue} />
          <path d="m33 322 90-230 144-49-90 230Z" fill={cream} />
          <path d="m177 273 90-230v106l-90 211Z" fill={powder} />
          <path d="m88 283 54-142c15-39 64-32 49 7l-46 116Z" fill={blue} />
          <path d="m108 275 45-120c7-19 26-18 18 3l-42 111Z" fill="#294A80" />
          <path d="M33 322h36v-12h36v-12h36v-12h36v74H33Z" fill={powder} />
          <path d="M33 340h36m0-12h36m0-12h36m0-12h36" stroke={blue} strokeWidth="2" />
          <circle cx="47" cy="53" r="18" fill={powder} />
        </React.Fragment>
      );
      break;
    case 5:
    default:
      art = (
        <React.Fragment>
          <rect width="300" height="360" fill={cream} />
          <circle cx="228" cy="84" r="103" fill={powder} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${25 + i * 38} 320V${83 + i * 16}l20-20v237Z`} fill={blue} />
          ))}
          <path d="M0 360v-29h48v-22h48v-22h48v-22h48v-22h48v-22h60v139Z" fill={cream} />
          <path
            d="M0 331h48v-22h48v-22h48v-22h48v-22h48v-22h60"
            fill="none"
            stroke={blue}
            strokeWidth="2"
          />
          <circle cx="39" cy="41" r="7" fill={blue} />
        </React.Fragment>
      );
      break;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 300 360"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        {art}
      </svg>
      {project && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '6px 8px',
            background: 'rgba(15, 17, 21, 0.94)',
            backdropFilter: 'blur(6px)',
            color: '#FCFBF7',
            fontFamily: 'monospace',
            fontSize: '9.5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            borderTop: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '120px',
              }}
            >
              {project.title}
            </span>
            <span style={{ color: '#ADC9DB', fontSize: '8.5px', fontWeight: 600 }}>
              {project.year}
            </span>
          </div>
          <div
            style={{
              fontSize: '8px',
              color: '#9CA3AF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.subtitle}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── C2 Continuous Flight Path Simulation ────────────────────────────────────── */
function smoothUnit(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function paperFlight(
  value: number,
  index: number,
  compact: boolean,
  peekAmount: number
) {
  const p = Math.max(0, Math.min(1, value));
  const side = index - 1; // -1, 0, 1
  const u = smoothUnit(p);
  const delay = [0.09, 0, 0.15][index];
  const spread = smoothUnit((p - delay) / (1 - delay));
  const arc = 64 * p ** 3 * (1 - p) ** 3;
  // Symmetrical fan angles and positions
  const restingX = compact ? [-92, 0, 92][index] : [-128, 0, 130][index];
  const restingY = compact ? [228, 192, 238][index] : [204, 168, 214][index];
  const closedY = 295 + Math.abs(side) * 6;
  const peek = peekAmount * (1 - u);

  return {
    x: side * 18 + (restingX - side * 18) * spread + side * 6 * peek,
    y: closedY - 120 + (restingY - closedY) * u - [22, 26, 22][index] * (compact ? 0.8 : 1) * arc - 22 * peek,
    z: [32, 48, 38][index] * (compact ? 0.7 : 1) * arc,
    rotate: side * 6.5 - 2 + ([-10, 0, 10][index] - (side * 6.5 - 2)) * u + side * 1.5 * arc,
    rotateX: -12 * arc + 5 * peek,
    rotateY: (side === 0 ? -6 : -side * 18) * arc + side * 8 * peek,
    scale: 0.88 + ((compact ? 0.85 : 0.96) - 0.88) * u,
    light: arc * 0.5,
  };
}

interface PaperCardProps {
  index: number;
  open: boolean;
  peek: boolean;
  compact: boolean;
  still: boolean;
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function PaperCard({
  index,
  open,
  peek,
  compact,
  still,
  label,
  onClick,
  children,
}: PaperCardProps) {
  const restingAngle = [-10, 0, 10][index];

  const progress = useSpring(open ? 1 : 0, {
    stiffness: 95,
    damping: 24,
    mass: 1,
    restDelta: 2e-4,
    restSpeed: 0.002,
  });

  const peekProgress = useSpring(0, { stiffness: 130, damping: 25 });

  const flightPose = ([p, k]: number[]) =>
    paperFlight(still ? (open ? 1 : 0) : p, index, compact, still ? 0 : k);

  const x = useTransform([progress, peekProgress], (v) => flightPose(v as number[]).x);
  const y = useTransform([progress, peekProgress], (v) => flightPose(v as number[]).y);
  const z = useTransform([progress, peekProgress], (v) => flightPose(v as number[]).z);
  const rotate = useTransform([progress, peekProgress], (v) => flightPose(v as number[]).rotate);
  const rotateX = useTransform([progress, peekProgress], (v) => flightPose(v as number[]).rotateX);
  const rotateY = useTransform([progress, peekProgress], (v) => flightPose(v as number[]).rotateY);
  const cardScale = useTransform([progress, peekProgress], (v) => flightPose(v as number[]).scale);
  const flightLight = useTransform([progress, peekProgress], (v) => flightPose(v as number[]).light);

  const surface = useRef<HTMLDivElement>(null);
  const [pointerOver, setPointerOver] = useState(false);
  const hover = open && !still && pointerOver;

  const pitch = useMotionValue(0);
  const yaw = useMotionValue(0);
  const light = useMotionValue(0);

  const smoothPitch = useSpring(pitch, { stiffness: 140, damping: 26 });
  const smoothYaw = useSpring(yaw, { stiffness: 140, damping: 26 });
  const smoothLight = useSpring(light, { stiffness: 110, damping: 25 });

  const settle = still
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 150, damping: 26 };

  useEffect(() => {
    if (still) progress.jump(open ? 1 : 0);
    else progress.set(open ? 1 : 0);
  }, [open, still, progress]);

  useEffect(() => {
    if (still) peekProgress.jump(0);
    else peekProgress.set(!open && peek ? 1 : 0);
  }, [open, peek, still, peekProgress]);

  const resetSurface = useCallback(() => {
    pitch.set(0);
    yaw.set(0);
    light.set(0);
  }, [pitch, yaw, light]);

  useEffect(() => {
    if (!open || still) resetSurface();
    if (!open) setPointerOver(false);
  }, [open, still, resetSurface]);

  function onMove(event: React.PointerEvent) {
    if (!open || still || event.pointerType !== 'mouse' || !surface.current) return;
    const rect = surface.current.getBoundingClientRect();
    const px = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5));
    pitch.set(-py * 14);
    yaw.set(px * 18);
    light.set(px * 80);
  }

  return (
    <motion.button
      type="button"
      data-card={index}
      tabIndex={open ? 0 : -1}
      aria-label={label}
      onClick={onClick}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setPointerOver(true);
      }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        setPointerOver(false);
        resetSurface();
      }}
      onFocus={() => {
        if (open) setPointerOver(true);
      }}
      onBlur={() => {
        setPointerOver(false);
        resetSurface();
      }}
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        marginLeft: -96,
        width: 192,
        height: 236,
        x,
        y,
        z,
        rotate,
        scale: cardScale,
        transformOrigin: '50% 80%',
        transformStyle: 'preserve-3d',
        pointerEvents: open ? 'auto' : 'none',
        cursor: open ? 'pointer' : 'default',
        zIndex: hover ? 15 : index + 2,
        border: 0,
        background: 'transparent',
        padding: 0,
      }}
    >
      <motion.div
        ref={surface}
        data-paper-surface={index}
        aria-hidden="true"
        initial={false}
        animate={{
          y: hover ? -8 : 0,
          rotate: hover ? -restingAngle * 0.15 : 0,
          boxShadow: hover
            ? '0 6px 12px -3px rgba(10,12,14,.25), 0 24px 38px -12px rgba(10,12,14,.42)'
            : '0 2px 4px rgba(10,12,14,.12), 0 12px 24px -8px rgba(10,12,14,.28)',
        }}
        transition={settle}
        style={{
          position: 'absolute',
          display: 'block',
          left: 0,
          top: 8,
          width: '100%',
          height: 236,
          borderRadius: 8,
          rotateX: still ? 0 : smoothPitch,
          rotateY: still ? 0 : smoothYaw,
          transformOrigin: '50% 65%',
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            background: '#D8D3C5',
            border: '1px solid #C9C4B7',
            transform: 'translateZ(-1.5px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'block',
            width: '100%',
            height: '100%',
            padding: 6,
            background: '#FCFBF7',
            border: '1px solid #DEDCD4',
            borderRadius: 8,
            overflow: 'hidden',
            transform: 'translateZ(.2px)',
            backfaceVisibility: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4 }}>
            {children}
          </div>
          <motion.span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: flightLight,
              background:
                'linear-gradient(120deg,rgba(255,255,255,.32),transparent 55%,rgba(39,35,28,.055))',
            }}
          />
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{ opacity: hover ? 1 : 0 }}
            transition={still ? { duration: 0 } : { duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: '-30% -45%',
              x: still ? 0 : smoothLight,
              pointerEvents: 'none',
              background:
                'linear-gradient(115deg,transparent 34%,rgba(255,255,255,.025) 42%,rgba(255,255,255,.18) 50%,rgba(255,255,255,.025) 58%,transparent 66%)',
            }}
          />
        </div>
      </motion.div>
    </motion.button>
  );
}

/* ─── Single Tactile Folder Component ────────────────────────────────────────── */
interface SingleRealFolderProps {
  specKey: SpecializationKey;
  specTitle: string;
  folderColor: string;
  projects: Project[];
  colorMode: ColorMode;
  onOpenArchive: (specKey: SpecializationKey) => void;
  onSelectProject: (project: Project) => void;
  indexNum: string;
}

const SingleRealFolder: React.FC<SingleRealFolderProps> = ({
  specKey,
  specTitle,
  folderColor,
  projects,
  colorMode,
  onOpenArchive,
  onSelectProject,
  indexNum,
}) => {
  const isDark = colorMode === 'dark';
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const [opened, setOpened] = useState(false);
  const [peek, setPeek] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [size, setSize] = useState({ width: 440, height: 490 });

  const reduced = !!useReducedMotion();
  const still = reduced;

  const uid = useId();
  const panelId = `single-folder-${specKey}-${uid}`;

  const sceneW = 440;
  const sceneH = 490;
  const scale = Math.max(0.72, Math.min(size.width / sceneW, 1.05));
  const centerX = sceneW / 2;
  const fan = opened;

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rx = useSpring(tiltX, { stiffness: 110, damping: 23 });
  const ry = useSpring(tiltY, { stiffness: 110, damping: 23 });

  const spring = still
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 110, damping: 23 };

  const folderY = fan ? 370 : 315;

  useEffect(() => {
    const node = root.current;
    if (!node || typeof window === 'undefined') return;
    const update = () => {
      const next = { width: node.clientWidth, height: node.clientHeight || 480 };
      setSize((previous) =>
        previous.width === next.width && previous.height === next.height ? previous : next
      );
    };
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const resetTilt = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  function onMove(event: React.PointerEvent) {
    if (still || fan || event.pointerType !== 'mouse' || !root.current) return;
    const r = root.current.getBoundingClientRect();
    tiltX.set(
      Math.max(
        -2,
        Math.min(2, (-(event.clientY - r.top - r.height / 2) / Math.max(1, r.height)) * 4)
      )
    );
    tiltY.set(
      Math.max(
        -3,
        Math.min(3, ((event.clientX - r.left - r.width / 2) / Math.max(1, r.width)) * 6)
      )
    );
  }

  function toggleFolder() {
    resetTilt();
    setPeek(false);
    setOpened((prev) => !prev);
  }

  function onKey(event: React.KeyboardEvent) {
    if (event.key === 'Escape' && fan) {
      event.preventDefault();
      setOpened(false);
      setPeek(false);
      trigger.current?.focus({ preventScroll: true });
    }
  }

  // Get matching projects (limit to 3 for the preview paper cascade)
  const displayProjects = projects.slice(0, 3);
  const collectionIndex = specKey === 'ai' ? 0 : 1;

  return (
    <motion.div
      whileHover={still ? {} : { y: -7, scale: 1.018 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative flex flex-col rounded-xl border p-5 transition-shadow duration-300 ${
        isDark
          ? 'border-white/10 bg-[#0A0C10]/80 shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-white/20 hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.7)]'
          : 'border-neutral-200 bg-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-neutral-300 hover:shadow-[0_22px_44px_-10px_rgba(0,0,0,0.14)]'
      }`}
    >
      {/* Subtle depth glow reflecting folder accent color on hover */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(550px circle at 50% 30%, ${folderColor}14, transparent 75%)`,
        }}
      />
      {/* Folder Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3.5 font-mono text-xs border-white/10 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-neutral-400">[{indexNum}]</span>
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm shadow-sm transition-colors"
            style={{ backgroundColor: folderColor }}
          />
          <h3
            className={`font-mono text-sm font-bold tracking-wider uppercase ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {specTitle}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onOpenArchive(specKey)}
          className={`cursor-target group/btn flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-mono transition-all ${
            isDark
              ? 'border-white/15 bg-white/5 text-neutral-300 hover:border-white/30 hover:bg-white/10 hover:text-white'
              : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-200 hover:text-neutral-900'
          }`}
          title={`Expand complete ${specTitle} project gallery`}
        >
          <span>EXPAND ARCHIVE</span>
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>

      {/* ─── RealFolder 3D Interactive Stage ───────────────────────────────── */}
      <div
        ref={root}
        className="real-folder relative mx-auto my-3 w-full"
        role="group"
        aria-label={`${specTitle} Interactive Dossier Folder`}
        onKeyDown={onKey}
        onPointerMove={onMove}
        onPointerLeave={() => {
          resetTilt();
          setPeek(false);
        }}
        style={{
          width: '100%',
          aspectRatio: '440 / 470',
          position: 'relative',
          overflow: 'hidden',
          isolation: 'isolate',
          background: 'transparent',
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: css }} />

        <div
          style={{
            width: sceneW,
            height: sceneH,
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -sceneW / 2,
            marginTop: -sceneH / 2,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            perspective: 1300,
          }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              rotateX: still ? 0 : rx,
              rotateY: still ? 0 : ry,
            }}
          >
            {/* Ground shadow beneath physical folder */}
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{
                y: fan ? 62 : isHovered ? 8 : 0,
                scaleX: fan ? 1.08 : isHovered ? 1.05 : 1,
                opacity: fan ? 0.12 : isHovered ? 0.22 : 0.16,
              }}
              transition={spring}
              style={{
                position: 'absolute',
                left: centerX - 160,
                top: 418,
                width: 320,
                height: 18,
                borderRadius: '50%',
                background: '#15171C',
                filter: isHovered ? 'blur(16px)' : 'blur(14px)',
                pointerEvents: 'none',
              }}
            />

            {/* Folder Back Case (Body & Back Spine Tab) */}
            <motion.div
              initial={false}
              animate={{ y: folderY - 100, rotate: fan ? -1.5 : -3 }}
              transition={spring}
              style={{
                position: 'absolute',
                left: centerX - 164,
                top: 0,
                width: 328,
                height: 196,
                zIndex: 1,
              }}
            >
              <motion.div
                data-folder-back="body"
                aria-hidden="true"
                initial={false}
                animate={{ backgroundColor: folderColor }}
                transition={spring}
                style={{
                  position: 'absolute',
                  inset: '0 6px 0',
                  borderRadius: 12,
                  backgroundColor: folderColor,
                  filter: 'brightness(.82)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,.24)',
                }}
              />
              <motion.div
                data-folder-back="tab"
                aria-hidden="true"
                initial={false}
                animate={{ backgroundColor: folderColor }}
                transition={spring}
                style={{
                  position: 'absolute',
                  left: 6,
                  top: -24,
                  width: 104,
                  height: 40,
                  borderRadius: '10px 15px 0 0',
                  backgroundColor: folderColor,
                  filter: 'brightness(.82)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2)',
                }}
              />
            </motion.div>

            {/* 3 Paper Cards with Staggered 3D Flight Cascade */}
            <div
              id={panelId}
              role="group"
              aria-label={`${specTitle} prints`}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                perspective: 1100,
                perspectiveOrigin: '50% 48%',
                transformStyle: 'flat',
                pointerEvents: 'none',
              }}
            >
              {[0, 1, 2].map((index) => {
                const proj = displayProjects[index];
                return (
                  <PaperCard
                    key={index}
                    index={index}
                    open={fan}
                    peek={peek}
                    compact={size.width < 450}
                    still={still}
                    label={proj?.title || `${specTitle} project ${index + 1}`}
                    onClick={() => {
                      if (proj) onSelectProject(proj);
                    }}
                  >
                    <Artwork
                      collection={collectionIndex}
                      index={index}
                      project={proj}
                    />
                  </PaperCard>
                );
              })}
            </div>

            {/* Folder Front Flap with Opening/Closing Mechanical Physics */}
            <motion.div
              initial={false}
              animate={{ y: folderY - 100, rotate: fan ? -1.5 : -3 }}
              transition={spring}
              style={{
                position: 'absolute',
                left: centerX - 164,
                top: 0,
                width: 328,
                height: 196,
                perspective: 1000,
                zIndex: 6,
                pointerEvents: 'none',
              }}
            >
              <motion.div
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') setPeek(true);
                }}
                onPointerLeave={() => setPeek(false)}
                initial={false}
                animate={{
                  rotateX: fan ? -28 : peek && !still ? -12 : 0,
                  backgroundColor: folderColor,
                }}
                transition={spring}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 28,
                  width: 328,
                  height: 168,
                  transformOrigin: '50% 100%',
                  border: '1px solid rgba(255,255,255,.2)',
                  borderRadius: '10px 10px 14px 14px',
                  padding: 0,
                  pointerEvents: 'auto',
                  backgroundImage:
                    'linear-gradient(165deg,rgba(255,255,255,.07),rgba(0,0,0,.14))',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,.22), inset 0 -2px 2px rgba(0,0,0,.06), 0 8px 14px -6px rgba(10,12,18,.35)',
                }}
              >
                {/* Main clickable flap toggle */}
                <button
                  ref={trigger}
                  type="button"
                  aria-label={`${fan ? 'Close' : 'Open'} ${specTitle} dossier folder`}
                  aria-expanded={fan}
                  aria-controls={panelId}
                  onClick={toggleFolder}
                  onFocus={(e) => {
                    if (e.currentTarget.matches(':focus-visible')) setPeek(true);
                  }}
                  onBlur={() => setPeek(false)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    border: 0,
                    borderRadius: 'inherit',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {/* Spine fastener / pull bar */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: '50%',
                      marginLeft: -15,
                      width: 30,
                      height: 3.5,
                      borderRadius: 4,
                      background: 'rgba(255,255,255,.25)',
                      boxShadow: '0 1px 2px rgba(0,0,0,.3)',
                    }}
                  />
                </button>

                {/* Left Spine Label: Status Dot & Count */}
                <div
                  style={{
                    position: 'absolute',
                    left: 14,
                    bottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: 'rgba(255,255,255,0.92)',
                    pointerEvents: 'none',
                    letterSpacing: '0.06em',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: '#FFFFFF',
                      boxShadow: '0 0 8px rgba(255,255,255,0.6)',
                    }}
                  />
                  <span>[{displayProjects.length} BUILDS]</span>
                </div>

                {/* Right Spine Label: Category Specialization */}
                <div
                  style={{
                    position: 'absolute',
                    right: 14,
                    bottom: 14,
                    fontFamily: 'monospace',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.95)',
                    pointerEvents: 'none',
                    textTransform: 'uppercase',
                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                  }}
                >
                    {specTitle}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main RealFolderShowcase (Two Side-by-Side Folders) ─────────────────────── */
export interface RealFolderShowcaseProps {
  projects: Project[];
  accentColor: string;
  colorMode?: ColorMode;
  onOpenSpecializationArchive: (specKey: SpecializationKey) => void;
  onSelectProject: (project: Project) => void;
}

export const RealFolderShowcase: React.FC<RealFolderShowcaseProps> = ({
  projects,
  accentColor,
  colorMode = 'dark',
  onOpenSpecializationArchive,
  onSelectProject,
}) => {
  const isDark = colorMode === 'dark';

  // Automatically link folder colors with active theme accent & palette
  const folderColors = resolveFolderThemeColors(accentColor, colorMode);

  // Filter projects for each folder
  const aiProjects = projects.filter(
    (p) => normalizeProjectSpecialization(p.category) === 'ai'
  );
  const fullstackProjects = projects.filter(
    (p) => normalizeProjectSpecialization(p.category) === 'fullstack'
  );

  return (
    <div className="relative mx-auto my-6 w-full max-w-7xl select-none">
      {/* Two Different Folders in a Single Row Side-by-Side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-start">
        {/* Folder 1: AI & Agents */}
        <SingleRealFolder
          specKey="ai"
          specTitle="AI & Agents"
          folderColor={folderColors.aiColor}
          projects={aiProjects}
          colorMode={colorMode}
          onOpenArchive={onOpenSpecializationArchive}
          onSelectProject={onSelectProject}
          indexNum="01"
        />

        {/* Folder 2: Full Stack */}
        <SingleRealFolder
          specKey="fullstack"
          specTitle="Full Stack"
          folderColor={folderColors.fullstackColor}
          projects={fullstackProjects}
          colorMode={colorMode}
          onOpenArchive={onOpenSpecializationArchive}
          onSelectProject={onSelectProject}
          indexNum="02"
        />
      </div>
    </div>
  );
};

export default RealFolderShowcase;
