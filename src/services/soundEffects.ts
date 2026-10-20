/**
 * High-fidelity Web Audio synthesis for authentic antique clock ticks
 * and bright, crisp, short Zen bell chime.
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.75;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Authentic antique mechanical clock tick (crisp escapement tooth strike).
   * Not a turn signal relay, but a real wooden clock escapement.
   */
  public playClockTick(tickNumber: number = 5): void {
    if (this.isMuted || this.masterVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Crisp high-frequency escapement strike (brass gear tooth)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const highpass = ctx.createBiquadFilter();
      const bandpass = ctx.createBiquadFilter();

      // Subtle alternation for organic tick-tock cadence
      const strikeFreq = tickNumber % 2 === 0 ? 3200 : 2800;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(strikeFreq, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.012);

      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(1800, now);

      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(strikeFreq, now);
      bandpass.Q.setValueAtTime(3.5, now);

      const vol = this.masterVolume * 0.4;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);

      // 2. Short wooden clock cabinet body warmth (very fast decay)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(580, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(160, now + 0.018);

      bodyGain.gain.setValueAtTime(vol * 0.35, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.025);
    } catch {
      // Audio playback failsafe
    }
  }

  /**
   * Bright, crystal-clear, short bell chime ("чуть-чуть более звонкий и чуть-чуть более короткий")
   */
  public playChimeBell(): void {
    if (this.isMuted || this.masterVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Bright fundamental tone at ~987.77 Hz (B5) with crystal overtones
      const fundamental = 988;
      const harmonics = [
        { mult: 1.0, gain: 0.6, decay: 0.95 },
        { mult: 2.04, gain: 0.35, decay: 0.75 },
        { mult: 3.12, gain: 0.2, decay: 0.55 },
        { mult: 4.8, gain: 0.12, decay: 0.35 },
      ];

      harmonics.forEach(({ mult, gain: hGain, decay }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * mult, now);

        const initialVol = this.masterVolume * hGain * 0.55;
        gainNode.gain.setValueAtTime(0.0001, now);
        // Instant crisp metallic strike (3ms)
        gainNode.gain.exponentialRampToValueAtTime(initialVol, now + 0.003);
        // Clean, short, melodious decay (~0.9s)
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + decay);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay + 0.02);
      });
    } catch {
      // Audio playback failsafe
    }
  }
}

export const soundEffects = new SoundEffectsService();
