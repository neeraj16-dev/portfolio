import React, { useEffect, useRef, useMemo } from 'react';

export type LiquidPresetName = 'Prism' | 'Lava' | 'Plasma' | 'Pulse' | 'Mist' | 'Vortex' | 'Auto';

export interface LiquidTemplateParams {
  color1: string;
  color2: string;
  color3: string;
  rotation: number;
  proportion: number;
  scale: number;
  speed: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  softness: number;
  offset: number;
  shape: 'Checks' | 'Stripes' | 'Edge';
  shapeSize: number;
}

export const LIQUID_TEMPLATES: Record<Exclude<LiquidPresetName, 'Auto'>, LiquidTemplateParams> = {
  Prism: {
    color1: '#050505',
    color2: '#66B3FF',
    color3: '#FFFFFF',
    rotation: -50,
    proportion: 1,
    scale: 0.01,
    speed: 30,
    distortion: 0,
    swirl: 50,
    swirlIterations: 16,
    softness: 47,
    offset: -299,
    shape: 'Checks',
    shapeSize: 45,
  },
  Lava: {
    color1: '#FF9F21',
    color2: '#FF0303',
    color3: '#000000',
    rotation: 114,
    proportion: 100,
    scale: 0.52,
    speed: 30,
    distortion: 7,
    swirl: 18,
    swirlIterations: 20,
    softness: 100,
    offset: 717,
    shape: 'Edge',
    shapeSize: 12,
  },
  Plasma: {
    color1: '#B566FF',
    color2: '#000000',
    color3: '#000000',
    rotation: 0,
    proportion: 63,
    scale: 0.75,
    speed: 30,
    distortion: 5,
    swirl: 61,
    swirlIterations: 5,
    softness: 100,
    offset: -168,
    shape: 'Checks',
    shapeSize: 28,
  },
  Pulse: {
    color1: '#66FF85',
    color2: '#000000',
    color3: '#000000',
    rotation: -167,
    proportion: 92,
    scale: 0,
    speed: 20,
    distortion: 54,
    swirl: 75,
    swirlIterations: 3,
    softness: 28,
    offset: -813,
    shape: 'Checks',
    shapeSize: 79,
  },
  Vortex: {
    color1: '#000000',
    color2: '#FFFFFF',
    color3: '#000000',
    rotation: 50,
    proportion: 41,
    scale: 0.4,
    speed: 20,
    distortion: 0,
    swirl: 100,
    swirlIterations: 3,
    softness: 5,
    offset: -744,
    shape: 'Stripes',
    shapeSize: 80,
  },
  Mist: {
    color1: '#050505',
    color2: '#FF66B8',
    color3: '#050505',
    rotation: 0,
    proportion: 33,
    scale: 0.48,
    speed: 39,
    distortion: 4,
    swirl: 65,
    swirlIterations: 5,
    softness: 100,
    offset: -235,
    shape: 'Edge',
    shapeSize: 48,
  },
};

export const THEME_TO_LIQUID_PRESET: Record<string, Exclude<LiquidPresetName, 'Auto'>> = {
  midnight: 'Prism',
  solar: 'Lava',
  hyperviolet: 'Plasma',
  violet: 'Plasma',
  matrix: 'Pulse',
  cyberpunk: 'Mist',
  minimalist: 'Vortex',
};

const SHAPE_MAP: Record<'Checks' | 'Stripes' | 'Edge', number> = {
  Checks: 0,
  Stripes: 1,
  Edge: 2,
};

const VERTEX_SHADER_SOURCE = `#version 300 es
layout(location = 0) in vec4 a_position;
void main() {
  gl_Position = a_position;
}`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;
uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;
out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
  vec3 color1 = c1.rgb * c1.a;
  vec3 color2 = c2.rgb * c2.a;
  vec3 color3 = c3.rgb * c3.a;
  float r1 = smoothstep(0.0 + 0.35 * edgesWidth, 0.7 - 0.35 * edgesWidth + 0.5 * edge_blur, mixer);
  float r2 = smoothstep(0.3 + 0.35 * edgesWidth, 1.0 - 0.35 * edgesWidth + edge_blur, mixer);
  vec3 blended_color_2 = mix(color1, color2, r1);
  float blended_opacity_2 = mix(c1.a, c2.a, r1);
  vec3 c = mix(blended_color_2, color3, r2);
  float o = mix(blended_opacity_2, c3.a, r2);
  return vec4(c, o);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = 0.5 * u_time;
  float noise_scale = 0.0005 + 0.006 * u_scale;
  uv -= 0.5;
  uv *= (noise_scale * u_resolution);
  uv = rotate(uv, u_rotation * 0.5 * PI);
  uv /= u_pixelRatio;
  uv += 0.5;

  float n1 = noise(uv * 1.0 + t);
  float n2 = noise(uv * 2.0 - t);
  float angle = n1 * TWO_PI;
  uv.x += 4.0 * u_distortion * n2 * cos(angle);
  uv.y += 4.0 * u_distortion * n2 * sin(angle);

  float iterations_number = ceil(clamp(u_swirlIterations, 1.0, 30.0));
  for (float i = 1.0; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0.0, 2.0) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0.0, 2.0) / i * cos(t + i * 1.0 * uv.x);
  }

  float proportion = clamp(u_proportion, 0.0, 1.0);
  float shape = 0.0;
  float mixer = 0.0;

  if (u_shape < 0.5) {
    vec2 checks_shape_uv = uv * (0.5 + 3.5 * u_shapeScale);
    shape = 0.5 + 0.5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
    mixer = shape + 0.48 * sign(proportion - 0.5) * pow(abs(proportion - 0.5), 0.5);
  } else if (u_shape < 1.5) {
    vec2 stripes_shape_uv = uv * (0.25 + 3.0 * u_shapeScale);
    float f = fract(stripes_shape_uv.y);
    shape = smoothstep(0.0, 0.55, f) * smoothstep(1.0, 0.45, f);
    mixer = shape + 0.48 * sign(proportion - 0.5) * pow(abs(proportion - 0.5), 0.5);
  } else {
    float sh = 1.0 - uv.y;
    sh -= 0.5;
    sh /= (noise_scale * u_resolution.y);
    sh += 0.5;
    float shape_scaling = 0.2 * (1.0 - u_shapeScale);
    shape = smoothstep(0.45 - shape_scaling, 0.55 + shape_scaling, sh + 0.3 * (proportion - 0.5));
    mixer = shape;
  }

  vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1.0 - clamp(u_softness, 0.0, 1.0), 0.01 + 0.01 * u_scale);
  fragColor = vec4(color_mix.rgb, color_mix.a);
}`;

function parseColorToRgbaArray(str: string, fallback: [number, number, number, number] = [0, 0, 0, 1]): [number, number, number, number] {
  if (!str || typeof str !== 'string') return fallback;
  str = str.trim();
  if (str.startsWith('#')) {
    let hex = str.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length === 6) hex += 'ff';
    if (hex.length >= 8) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b, isNaN(a) ? 1 : a];
    }
  } else if (str.startsWith('rgb')) {
    const match = str.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);
    if (match) {
      return [
        parseInt(match[1], 10) / 255,
        parseInt(match[2], 10) / 255,
        parseInt(match[3], 10) / 255,
        match[4] !== undefined ? parseFloat(match[4]) : 1,
      ];
    }
  }
  return fallback;
}

export interface AnimatedLiquidBackgroundProps {
  preset?: LiquidPresetName;
  themeId?: string;
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  opacity?: number;
  className?: string;
}

export const AnimatedLiquidBackground: React.FC<AnimatedLiquidBackgroundProps> = ({
  preset = 'Auto',
  themeId = 'midnight',
  color1,
  color2,
  color3,
  speed = 25,
  opacity = 0.65,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Determine active preset based on theme mapping if 'Auto'
  const activePreset: Exclude<LiquidPresetName, 'Auto'> = useMemo(() => {
    if (preset && preset !== 'Auto' && LIQUID_TEMPLATES[preset]) {
      return preset;
    }
    return THEME_TO_LIQUID_PRESET[themeId] || 'Prism';
  }, [preset, themeId]);

  const template = LIQUID_TEMPLATES[activePreset] || LIQUID_TEMPLATES.Prism;

  // Resolved colors with props fallback
  const resolvedColor1 = color1 || template.color1;
  const resolvedColor2 = color2 || template.color2;
  const resolvedColor3 = color3 || template.color3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      });
    } catch {
      // WebGL2 unsupported
    }

    if (!gl) return;

    // Helper functions
    const compileShader = (type: number, src: string): WebGLShader | null => {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      return;
    }

    // Geometry buffer (full screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const locTime = gl.getUniformLocation(program, 'u_time');
    const locPixelRatio = gl.getUniformLocation(program, 'u_pixelRatio');
    const locResolution = gl.getUniformLocation(program, 'u_resolution');
    const locScale = gl.getUniformLocation(program, 'u_scale');
    const locRotation = gl.getUniformLocation(program, 'u_rotation');
    const locColor1 = gl.getUniformLocation(program, 'u_color1');
    const locColor2 = gl.getUniformLocation(program, 'u_color2');
    const locColor3 = gl.getUniformLocation(program, 'u_color3');
    const locProportion = gl.getUniformLocation(program, 'u_proportion');
    const locSoftness = gl.getUniformLocation(program, 'u_softness');
    const locShape = gl.getUniformLocation(program, 'u_shape');
    const locShapeScale = gl.getUniformLocation(program, 'u_shapeScale');
    const locDistortion = gl.getUniformLocation(program, 'u_distortion');
    const locSwirl = gl.getUniformLocation(program, 'u_swirl');
    const locSwirlIterations = gl.getUniformLocation(program, 'u_swirlIterations');

    let isDisposed = false;
    let rafId: number | null = null;
    let lastTime = performance.now();
    let totalTime = template.offset * 10;

    const handleResize = () => {
      if (!canvas || !gl || isDisposed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);
    handleResize();

    // Render loop
    const render = (currentTime: number) => {
      if (isDisposed || !gl) return;
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      const spdFactor = (speed / 100) * 1.8;
      totalTime += dt * spdFactor;

      gl.useProgram(program);

      // Pass time and resolution
      gl.uniform1f(locTime, totalTime * 0.001);
      gl.uniform2f(locResolution, canvas.width, canvas.height);
      gl.uniform1f(locPixelRatio, Math.min(window.devicePixelRatio || 1, 2));

      // Pass template uniforms
      gl.uniform1f(locScale, template.scale);
      gl.uniform1f(locRotation, (template.rotation * Math.PI) / 180);
      gl.uniform4fv(locColor1, parseColorToRgbaArray(resolvedColor1));
      gl.uniform4fv(locColor2, parseColorToRgbaArray(resolvedColor2));
      gl.uniform4fv(locColor3, parseColorToRgbaArray(resolvedColor3));
      gl.uniform1f(locProportion, template.proportion / 100);
      gl.uniform1f(locSoftness, template.softness / 100);
      gl.uniform1f(locShape, SHAPE_MAP[template.shape] ?? 0);
      gl.uniform1f(locShapeScale, template.shapeSize / 100);
      gl.uniform1f(locDistortion, template.distortion / 50);
      gl.uniform1f(locSwirl, template.swirl / 100);
      gl.uniform1f(locSwirlIterations, template.swirl === 0 ? 0 : template.swirlIterations);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (gl && program) {
        gl.deleteProgram(program);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [
    activePreset,
    resolvedColor1,
    resolvedColor2,
    resolvedColor3,
    speed,
    template,
  ]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden transition-opacity duration-700 ${className}`}
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default AnimatedLiquidBackground;
