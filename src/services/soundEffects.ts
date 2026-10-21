/**
 * High-fidelity Web Audio synthesis for authentic antique clock ticks
 * and bright, crystal-clear Zen bell chime.
 * Includes user-interaction unlock and failsafe AudioContext resumption.
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.9;

  public resumeContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getContext(): AudioContext | null {
    return this.resumeContext();
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
   * Authentic antique mechanical clock tick (crisp wooden escapement tooth strike).
   * Clearly audible, pleasant, authentic 5-second countdown sound.
   */
  public playClockTick(tickNumber: number = 5): void {
    if (this.isMuted || this.masterVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Crisp high-frequency strike
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const bandpass = ctx.createBiquadFilter();

      // Alternate slightly between ticks for organic tick-tock cadence
      const strikeFreq = tickNumber % 2 === 0 ? 3200 : 2700;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(strikeFreq, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.025);

      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(strikeFreq, now);
      bandpass.Q.setValueAtTime(2.5, now);

      const vol = this.masterVolume * 0.75;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);

      // 2. Wooden clock cabinet body resonance (resonant warmth)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(620, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

      bodyGain.gain.setValueAtTime(0.0001, now);
      bodyGain.gain.exponentialRampToValueAtTime(vol * 0.5, now + 0.003);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      bodyOsc.start(now);
      bodyOsc.stop(now + 0.05);
    } catch {
      // Audio playback failsafe
    }
  }

  /**
   * Bright, crystal-clear, short bell chime for timer finish and phase transition.
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
        { mult: 1.0, gain: 0.75, decay: 1.1 },
        { mult: 2.04, gain: 0.45, decay: 0.85 },
        { mult: 3.12, gain: 0.25, decay: 0.65 },
        { mult: 4.8, gain: 0.15, decay: 0.45 },
      ];

      harmonics.forEach(({ mult, gain: hGain, decay }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * mult, now);

        const initialVol = this.masterVolume * hGain * 0.7;
        gainNode.gain.setValueAtTime(0.0001, now);
        // Instant crisp metallic strike (3ms)
        gainNode.gain.exponentialRampToValueAtTime(initialVol, now + 0.003);
        // Clean melodious decay
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

// Auto-unlock AudioContext on first user interaction anywhere on the page
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    soundEffects.resumeContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}
