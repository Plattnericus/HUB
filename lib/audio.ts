// Tiny, resilient audio manager.
//  - SFX (hover/click) are synthesized with the Web Audio API, so they need no
//    downloaded files and never 404.
//  - Ambient music is an optional loop loaded from /audio/ambient.mp3 (Howler).
// Everything is gated behind a user gesture and starts muted by default.

import { Howl } from "howler";

type Sfx = "hover" | "click" | "close";

class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: Howl | null = null;
  private ambientReady = false;
  enabled = false; // ambient music on/off
  muted = false; // master mute for all sound (sfx + ambient)
  private lastHover = 0;

  private ensureCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.18;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  // Call on first user gesture.
  unlock() {
    this.ensureCtx();
  }

  blip(type: Sfx) {
    if (this.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;
    // Light throttle for hover spam.
    if (type === "hover") {
      const now = ctx.currentTime;
      if (now - this.lastHover < 0.04) return;
      this.lastHover = now;
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const cfg = {
      hover: { f: 660, to: 880, dur: 0.08, vol: 0.06, type: "sine" as OscillatorType },
      click: { f: 520, to: 720, dur: 0.14, vol: 0.13, type: "triangle" as OscillatorType },
      close: { f: 480, to: 300, dur: 0.16, vol: 0.1, type: "sine" as OscillatorType },
    }[type];
    osc.type = cfg.type;
    osc.frequency.setValueAtTime(cfg.f, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(cfg.to, ctx.currentTime + cfg.dur);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(cfg.vol, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + cfg.dur);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + cfg.dur + 0.02);
  }

  private ensureAmbient() {
    if (this.ambient || typeof window === "undefined") return;
    this.ambient = new Howl({
      src: ["/audio/ambient.mp3"],
      loop: true,
      volume: 0,
      html5: true,
      onload: () => {
        this.ambientReady = true;
      },
      onloaderror: () => {
        this.ambient = null; // file not present — silently skip music
      },
    });
  }

  // Master mute toggle for the speaker button. Returns the new muted state.
  toggleMute(): boolean {
    this.unlock();
    this.muted = !this.muted;
    this.ensureAmbient();
    if (this.ambient) {
      if (this.muted) {
        this.ambient.fade(this.ambient.volume(), 0, 500);
      } else {
        if (!this.ambient.playing()) this.ambient.play();
        this.ambient.fade(0, 0.3, 800);
      }
    }
    // A tiny confirmation blip when un-muting.
    if (!this.muted) setTimeout(() => this.blip("click"), 60);
    return this.muted;
  }
}

export const audio = new AudioManager();
