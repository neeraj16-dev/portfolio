export type ShaderMode = 'morph' | 'chromatic' | 'wave' | 'neural';

export interface ShaderUniforms {
  time: number;
  speed: number;
  distortion: number;
  density: number;
  dispersion: number;
  wireframe: boolean;
  colorScheme: 'theme' | 'cyber' | 'spectral' | 'monochrome';
}

export interface ShaderPreset {
  id: ShaderMode;
  name: string;
  tagline: string;
  description: string;
  defaultUniforms: Partial<ShaderUniforms>;
  glslSnippet: string;
}

export const SHADER_PRESETS: ShaderPreset[] = [
  {
    id: 'morph',
    name: 'Quantum Topology Morph',
    tagline: 'Multi-geometry particle cloud with procedural 4D simplex morphing',
    description:
      '15,000 instanced vertices interpolating smoothly between a Riemann sphere, Trefoil torus knot, and hyperbolic attractor.',
    defaultUniforms: {
      speed: 1.0,
      distortion: 1.2,
      density: 15000,
      dispersion: 0.4,
      wireframe: false,
    },
    glslSnippet: `// GLSL Vertex Morphing Kernel
attribute vec3 targetPosition;
uniform float u_morphProgress;
uniform float u_time;
uniform float u_distortion;

void main() {
  vec3 pos = mix(position, targetPosition, sin(u_morphProgress * 3.14159) * 0.5 + 0.5);
  float noise = sin(pos.x * 2.0 + u_time) * cos(pos.y * 2.0 + u_time);
  pos += normal * noise * u_distortion * 0.15;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (12.0 / -mvPosition.z) * (1.0 + abs(noise));
  gl_Position = projectionMatrix * mvPosition;
}`,
  },
  {
    id: 'chromatic',
    name: 'Raymarched Chromatic Crystal',
    tagline: 'Refractive volumetric crystal with RGB spectral wavelength split',
    description:
      'Real-time raymarched torus and crystal lattice featuring chromatic dispersion, Fresnel rim glow, and specular highlights.',
    defaultUniforms: {
      speed: 0.8,
      distortion: 0.9,
      density: 12000,
      dispersion: 0.85,
      wireframe: false,
    },
    glslSnippet: `// GLSL Chromatic Dispersion Fragment
uniform vec3 u_accentColor;
uniform float u_dispersion;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 3.0);
  float r = fresnel * (1.0 + u_dispersion * 0.35);
  float g = fresnel * (1.0);
  float b = fresnel * (1.0 - u_dispersion * 0.25);
  vec3 rgb = vec3(r, g, b) * u_accentColor * 1.6;
  gl_FragColor = vec4(rgb + vec3(pow(fresnel, 5.0)), 0.95);
}`,
  },
  {
    id: 'wave',
    name: 'Cybernetic Fluid Mesh',
    tagline: 'GPU-displaced continuous wireframe matrix reacting to mouse inertia',
    description:
      'High-frequency 3D sinusoidal wave grid with dynamic elevation coloring and pointer-velocity ripples.',
    defaultUniforms: {
      speed: 1.4,
      distortion: 1.8,
      density: 16000,
      dispersion: 0.5,
      wireframe: true,
    },
    glslSnippet: `// GLSL Surface Wave Displacement
uniform float u_time;
uniform vec2 u_mouse;
varying float vElevation;

void main() {
  vec3 pos = position;
  float distToMouse = distance(pos.xy, u_mouse * 5.0);
  float wave = sin(pos.x * 3.0 + u_time * 2.0) * cos(pos.y * 3.0 + u_time * 1.5);
  float ripple = sin(distToMouse * 4.0 - u_time * 5.0) * exp(-distToMouse * 0.3);
  pos.z += (wave * 0.4 + ripple * 0.6);
  vElevation = pos.z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,
  },
  {
    id: 'neural',
    name: 'Neural Synapse Constellation',
    tagline: 'Bio-synthetic neural node network with kinetic impulse pulses',
    description:
      'Dynamic graph nodes firing electrical pulse wavefronts across interconnected geometric axons.',
    defaultUniforms: {
      speed: 1.2,
      distortion: 0.7,
      density: 10000,
      dispersion: 0.6,
      wireframe: true,
    },
    glslSnippet: `// GLSL Synaptic Impulse Transmission
uniform float u_time;
varying vec3 vPosition;

void main() {
  float pulse = fract((vPosition.z + u_time * 1.5) * 0.5);
  float spark = smoothstep(0.0, 0.1, pulse) * smoothstep(0.3, 0.1, pulse);
  vec3 color = mix(vec3(0.05), vec3(0.2, 0.9, 1.0), spark * 2.5);
  gl_FragColor = vec4(color, 0.85);
}`,
  },
];
