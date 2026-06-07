"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

interface Props {
  onDone: () => void;
}

export function LoadingScreen({ onDone }: Props) {
  const { progress, active, total } = useProgress();
  const [done, setDone] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [shown, setShown] = useState(0);

  // Minimum on-screen time so the intro feels intentional, never a flash.
  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 1100);
    return () => clearTimeout(t);
  }, []);

  // The scene is largely procedural; when there are real loads, follow them,
  // otherwise glide the bar to 100% on its own.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const target = total > 0 ? progress : minElapsed ? 100 : 92;
      setShown((s) => s + (target - s) * 0.12);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, total, minElapsed]);

  useEffect(() => {
    if (done || !minElapsed) return;
    const loadsDone = total === 0 || (!active && progress >= 100);
    if (loadsDone) {
      const t = setTimeout(() => {
        setDone(true);
        onDone();
      }, 350);
      return () => clearTimeout(t);
    }
  }, [active, progress, total, done, minElapsed, onDone]);

  const pct = Math.min(100, shown);
  return (
    <div className={`loader ${done ? "loader--done" : ""}`}>
      <div className="loader__inner">
        <div className="loader__logo" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pfp.jpg" alt="" />
        </div>
        <div className="loader__brand">Plattnericus</div>
        <div className="loader__eyebrow">Projects &amp; Portfolio</div>
        <div className="loader__meter">
          <div className="loader__bar" style={{ width: `${pct}%` }} />
        </div>
        <div className="loader__status">
          Crafting the island <span>{Math.round(pct)}%</span>
        </div>
      </div>
    </div>
  );
}
