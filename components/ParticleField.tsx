"use client";

import { useEffect, useRef } from "react";

// Animated constellation background: drifting dots connected by faint lines,
// gently repelled by the cursor. Ported from the original Plattnericus hub.
export function ParticleField({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkRef = useRef(dark);
  darkRef.current = dark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      count: 60,
      connect: 150,
      mouseDist: 200,
      damping: 0.99,
    };
    const mouse = { x: -9999, y: -9999 };

    class Particle {
      x = Math.random() * canvas!.width;
      y = Math.random() * canvas!.height;
      vx = (Math.random() - 0.5) * 0.5;
      vy = (Math.random() - 0.5) * 0.5;
      size = Math.random() * 2 + 1;
      update() {
        this.vx *= config.damping;
        this.vy *= config.damping;
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < config.mouseDist && dist > 0) {
          const f = (config.mouseDist - dist) / config.mouseDist;
          this.vx -= (dx / dist) * f * 1.5;
          this.vy -= (dy / dist) * f * 1.5;
        }
      }
    }

    let particles: Particle[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    const init = () => {
      particles = Array.from({ length: config.count }, () => new Particle());
    };

    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const base = darkRef.current ? "255,255,255," : "0,0,0,";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        ctx.fillStyle = `rgba(${base}0.35)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < config.connect) {
            ctx.strokeStyle = `rgba(${base}${(1 - d / config.connect) * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    resize();
    init();
    frame();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="pf-canvas" />;
}
