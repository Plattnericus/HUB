"use client";

import { useEffect, useState } from "react";
import { PROFILE, PROJECTS } from "@/lib/projects";
import { ParticleField } from "./ParticleField";
import {
  IconExternal,
  IconCode,
  IconGlobe,
  IconGamepad,
  IconMonitor,
  IconCloud,
  IconServer,
  IconChart,
  IconApp,
  IconBowl,
  IconMail,
  IconGithub,
  IconCube,
} from "./icons";

const ICONS: Record<string, () => React.ReactElement> = {
  pokyh: IconGlobe,
  minesweeper: IconGamepad,
  streamdeck: IconMonitor,
  cloud: IconCloud,
  proxmox: IconServer,
  finanzen: IconChart,
  campedell: IconApp,
  mensa: IconBowl,
  contact: IconMail,
  github: IconGithub,
};

// Every card is a uniform square in a 2-up grid; only GitHub stays full-width.
const FULL_WIDTH = new Set(["github"]);

const Sun = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" /><line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" /><line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
  </svg>
);
const Moon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
  </svg>
);

// 2D view, rebuilt to match the original Plattnericus hub: a live constellation
// background with Apple-style cards. Used for mobile / weak GPU / reduced-motion.
export function FallbackList({ onBack }: { onBack?: () => void }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("hub-theme");
    if (stored) setDark(stored === "dark");
    else setDark(!window.matchMedia("(prefers-color-scheme: light)").matches);
  }, []);

  const toggle = () => {
    setDark((d) => {
      localStorage.setItem("hub-theme", !d ? "dark" : "light");
      return !d;
    });
  };

  return (
    <div className="hub-root" data-theme={dark ? "dark" : "light"}>
      <ParticleField dark={dark} />

      {onBack && (
        <button className="hub-back" onClick={onBack}>
          <IconCube />
          Back to island
        </button>
      )}

      <main className="hub-container">
        <header className="hub-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hub-avatar" src="/pfp.jpg" alt={`${PROFILE.name} avatar`} />
          <h1 className="hub-name">{PROFILE.name}</h1>
          <p className="hub-tagline">A HUB where you can see all my projects!</p>
        </header>

        <div className="hub-grid">
          {PROJECTS.map((p) => {
            const Icon = ICONS[p.id] ?? IconGlobe;
            const primary = p.links.find((l) => l.kind === "primary");
            const secondary = p.links.find((l) => l.kind === "secondary");
            return (
              <div
                className="hub-card-item"
                key={p.id}
                data-full={FULL_WIDTH.has(p.id) ? "true" : undefined}
              >
                <div className="hub-card">
                  <div className="hub-card-body">
                    <div className="hub-icon" style={{ color: p.accent }}>
                      <Icon />
                    </div>
                    <div className="hub-card-text">
                      <div className="hub-card-title">{p.title}</div>
                      <div className="hub-card-subtitle">{p.tagline}</div>
                    </div>
                  </div>
                  <div className="hub-actions">
                    {primary && (
                      <a
                        className="hub-btn hub-btn-visit"
                        href={primary.href}
                        target={primary.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                      >
                        <IconExternal />
                        {primary.label}
                      </a>
                    )}
                    {secondary && (
                      <a
                        className="hub-btn hub-btn-code"
                        href={secondary.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} source`}
                      >
                        <IconCode />
                        <span className="hub-code-text">Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="hub-footer">© {new Date().getFullYear()} {PROFILE.domain}</footer>
      </main>

      <button className="hub-theme-toggle" onClick={toggle} aria-label="Toggle theme">
        {dark ? <Sun /> : <Moon />}
      </button>
    </div>
  );
}
