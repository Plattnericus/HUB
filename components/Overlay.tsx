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
  const isProfile = !!(p && p.facts && p.facts.length > 0);

  const renderLinks = (accent: string, links: NonNullable<OverlayItem["links"]>) =>
    links.map((l) =>
      l.kind === "primary" ? (
        <a
          key={l.href}
          href={l.href}
          target={l.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="btn btn--primary"
          style={{ background: accent }}
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
    );

  return (
    <div className={`overlay ${project ? "overlay--open" : ""}`} aria-hidden={!project}>
      <div className="overlay__backdrop" onClick={onClose} />
      {p && isProfile ? (
        <div
          className="overlay__panel overlay__panel--profile"
          role="dialog"
          aria-modal="true"
          aria-label={p.title}
          style={{ ["--accent" as string]: p.accent }}
        >
          <span className="overlay__glow" aria-hidden="true" />
          <button className="overlay__close" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>

          <div className="profile">
            <div className="profile__main">
              <span className="profile__eyebrow">Who I am</span>
              <h2 className={`profile__title ${p.serif ? "profile__title--serif" : ""}`}>
                {p.title}
              </h2>
              <p className="profile__tagline">{p.tagline}</p>
              <p className="profile__desc">{p.description}</p>
              {p.highlight && <p className="profile__highlight">{p.highlight}</p>}
              <div className="profile__links">{renderLinks(p.accent, p.links ?? [])}</div>
            </div>

            <dl className="profile__facts">
              {p.facts!.map((f) => (
                <div key={f.label} className="fact">
                  <dt className="fact__label">{f.label}</dt>
                  <dd className="fact__value">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ) : p ? (
        <div className="overlay__panel" role="dialog" aria-modal="true" aria-label={p.title}>
          <span className="overlay__glow" aria-hidden="true" />
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
          <div className="overlay__links">{renderLinks(p.accent, p.links ?? [])}</div>
        </div>
      ) : null}
    </div>
  );
}
