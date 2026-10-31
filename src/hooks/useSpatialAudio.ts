import { useEffect, useRef, useState, useCallback } from 'react';

const AUDIO_STORAGE_KEY = 'spatial_audio_enabled_v1';

class SpatialAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AUDIO_STORAGE_KEY);
      // Default to enabled (soft subtle 0.05-0.08 gain)
      this.isMuted = stored === 'false';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUDIO_STORAGE_KEY, muted ? 'false' : 'true');
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * High-velocity cinematic section transit sound:
   * Combines a soft sub-bass sweep, filtered pink noise air whoosh, and spatial directional pan.
   */
  public playSectionTransit(direction: 'down' | 'up' = 'down') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.55;

      // Master output node for this event with gentle volume ceiling
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.09, now + 0.06);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(this.ctx.destination);

      // Stereo panner for spatial direction (if supported)
      let destinationNode: AudioNode = masterGain;
      if ('createStereoPanner' in this.ctx) {
        const panner = this.ctx.createStereoPanner();
        // Moving from left-to-right or slight directional bias
        const startPan = direction === 'down' ? -0.25 : 0.25;
        const endPan = direction === 'down' ? 0.3 : -0.3;
        panner.pan.setValueAtTime(startPan, now);
        panner.pan.linearRampToValueAtTime(endPan, now + duration);
        panner.connect(masterGain);
        destinationNode = panner;
      }

      // 1. Sub-bass cinematic pulse (smooth sine drop or rise)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      
      const startFreq = direction === 'down' ? 140 : 55;
      const endFreq = direction === 'down' ? 42 : 110;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.7);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.85);

      osc.connect(oscGain);
      oscGain.connect(destinationNode);

      osc.start(now);
      osc.stop(now + duration);

      // 2. Filtered airy kinetic whoosh (synthesized noise)
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Soft pinking filter
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.12;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Bandpass filter sweeping through velocity horizon
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 1.4;
      const filterStart = direction === 'down' ? 650 : 250;
      const filterEnd = direction === 'down' ? 180 : 700;
      filter.frequency.setValueAtTime(filterStart, now);
      filter.frequency.exponentialRampToValueAtTime(filterEnd, now + duration);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.07, now + 0.08);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(destinationNode);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
    } catch {
      // AudioContext policy or device exception fallback
    }
  }

  /**
   * Tactical micro-click for waypoint arrival or button lock.
   */
  public playWaypointTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  /**
   * Silky dual-harmonic chime for theme toggle or mode activation.
   */
  public playThemeChime(isDark: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.45;
      const f1 = isDark ? 440 : 554.37;
      const f2 = isDark ? 659.25 : 830.61;

      [f1, f2].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.045, now + idx * 0.04 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + duration);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Versatile acoustic feedback tone generator.
   */
  public playTone(
    freq = 540,
    type: OscillatorType = 'sine',
    duration = 0.12,
    gainValue = 0.05
  ) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.75), now + duration);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // ignore
    }
  }
}

// Global singleton instance
export const spatialAudio = new SpatialAudioSynthesizer();

export function useSpatialAudio() {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => !spatialAudio.getMuted());

  const toggleAudio = useCallback(() => {
    const nextState = !isEnabled;
    spatialAudio.setMuted(!nextState);
    setIsEnabled(nextState);
    if (nextState) {
      spatialAudio.playWaypointTick();
    }
  }, [isEnabled]);

  useEffect(() => {
    // Unlock AudioContext on first user interaction
    const unlockAudio = () => {
      spatialAudio.playWaypointTick();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  return {
    isAudioEnabled: isEnabled,
    toggleAudio,
    playTransitSound: (direction: 'down' | 'up' = 'down') => spatialAudio.playSectionTransit(direction),
    playTick: () => spatialAudio.playWaypointTick(),
    playThemeChime: (isDark: boolean) => spatialAudio.playThemeChime(isDark),
  };
}
