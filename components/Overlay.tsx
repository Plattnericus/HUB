"use client";

import { useEffect } from "react";
import type { OverlayItem } from "@/lib/projects";
import { IconExternal, IconCode, IconClose } from "./icons";

interface Props {
  project: OverlayItem | null;
  onClose: () => void;
}

export function Overlay({ project, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Keep last project mounted during the close animation.
  const p = project;

  return (
    <div className={`overlay ${project ? "overlay--open" : ""}`} aria-hidden={!project}>
      <div className="overlay__backdrop" onClick={onClose} />
      {p && (
        <div className="overlay__panel" role="dialog" aria-modal="true" aria-label={p.title}>
          <button className="overlay__close" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
          <span
            className="overlay__badge"
            style={{ background: `${p.accent}22`, color: p.accent }}
          >
            {p.tagline}
          </span>
          <h2 className="overlay__title">{p.title}</h2>
          <p className="overlay__desc">{p.description}</p>
          {p.body && p.body.length > 0 && (
            <ul className="overlay__list">
              {p.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
          {p.tags && p.tags.length > 0 && (
            <div className="overlay__tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="overlay__links">
            {(p.links ?? []).map((l) =>
              l.kind === "primary" ? (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  style={{ background: p.accent }}
                >
                  <IconExternal />
                  {l.label}
                </a>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary"
                >
                  <IconCode />
                  {l.label}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
