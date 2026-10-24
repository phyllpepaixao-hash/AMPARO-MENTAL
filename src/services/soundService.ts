/**
 * Ambient Sound Generator using Web Audio API
 * Provides 100% offline, zero-network, soothing soundscapes
 * for deep relaxation and emotional grounding.
 */

export type SoundscapeType = 'rain' | 'brown_noise' | 'waves' | 'zen_tone' | 'off';

class SoundService {
  private ctx: AudioContext | null = null;
  private currentType: SoundscapeType = 'off';
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.3;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): SoundscapeType {
    return this.currentType;
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
    setTimeout(() => {
      this.activeNodes.forEach(node => {
        if (typeof node === 'number') {
          clearInterval(node);
        } else {
          try {
            (node as any).stop?.();
            node.disconnect();
          } catch {}
        }
      });
      this.activeNodes = [];
      this.currentType = 'off';
    }, 250);
  }

  public play(type: SoundscapeType) {
    if (type === 'off') {
      this.stop();
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    // Stop current sound smoothly
    this.stop();

    setTimeout(() => {
      if (!this.ctx) return;
      this.currentType = type;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.5);
      this.gainNode.connect(this.ctx.destination);

      switch (type) {
        case 'brown_noise':
          this.startBrownNoise();
          break;
        case 'rain':
          this.startRain();
          break;
        case 'waves':
          this.startOceanWaves();
          break;
        case 'zen_tone':
          this.startZenDrone();
          break;
      }
    }, 300);
  }

  private startBrownNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to warm bass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 450;

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter);
  }

  private startRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.8;

    const highPass = this.ctx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.value = 300;

    noise.connect(filter);
    filter.connect(highPass);
    highPass.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter, highPass);
  }

  private startOceanWaves() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.03 * white) / 1.03;
      lastOut = data[i];
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // LFO for slow breath-like wave swell (8 seconds cycle)
    const waveGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.12; // 8s period
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.gainNode);

    lfo.start();
    noise.start();
    this.activeNodes.push(noise, filter, waveGain, lfo, lfoGain);
  }

  private startZenDrone() {
    if (!this.ctx || !this.gainNode) return;
    // 432 Hz warm healing tone with harmonic warmth
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 108; // deep sub

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 216; // root

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 324; // fifth harmonic

    const subGain = this.ctx.createGain();
    subGain.gain.value = 0.25;

    osc1.connect(subGain);
    osc2.connect(subGain);
    osc3.connect(subGain);
    subGain.connect(this.gainNode);

    osc1.start();
    osc2.start();
    osc3.start();
    this.activeNodes.push(osc1, osc2, osc3, subGain);
  }

  /**
   * Play a gentle chime when a step is completed
   */
  public playGentleChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);
      chimeGain.connect(this.ctx.destination);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, this.ctx.currentTime); // Solfeggio frequency
      osc.connect(chimeGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.8);
    } catch {}
  }
}

export const AmbientSound = new SoundService();
