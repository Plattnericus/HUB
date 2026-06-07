"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { OverlayItem, Room } from "@/lib/projects";
import { PROFILE, PROJECTS, FRAMES } from "@/lib/projects";
import { useDeviceTier } from "@/lib/useDeviceTier";
import { audio } from "@/lib/audio";
import { Hud } from "@/components/Hud";
import { RoomNav } from "@/components/RoomNav";
import { Overlay } from "@/components/Overlay";
import { Hints } from "@/components/Hints";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FallbackList } from "@/components/FallbackList";

const Experience = dynamic(() => import("@/components/Experience"), { ssr: false });

export default function Page() {
  const tier = useDeviceTier();
  const [view, setView] = useState<"3d" | "list">("3d");
  const [mode, setMode] = useState<Room>("exterior");
  const [active, setActive] = useState<OverlayItem | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [flash, setFlash] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (tier.ready && !tier.can3D) setView("list");
  }, [tier.ready, tier.can3D]);

  // Deep-link rooms via URL hash (#projects / #portfolio) — shareable + restorable.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "projects" || h === "portfolio") setMode(h);
      else setMode("exterior");
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Flash the screen on every room change for a clean scene cut.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setFlash((f) => f + 1);
  }, [mode]);

  const navigate = useCallback((room: Room) => {
    audio.unlock();
    setActive(null);
    setMode(room);
    window.location.hash = room === "exterior" ? "" : room;
  }, []);

  const select = useCallback((item: OverlayItem) => {
    audio.unlock();
    setActive(item);
  }, []);

  const toggleView = useCallback(() => {
    audio.unlock();
    setView((v) => (v === "3d" ? "list" : "3d"));
    setActive(null);
  }, []);

  const mount3D = tier.ready && tier.can3D && view === "3d";
  const showLoader = view === "3d" && (!tier.ready || (mount3D && !introDone));

  return (
    <main id="app-root">
      {/* Always-present, crawlable content (pre-rendered in the static HTML) for
          SEO + screen readers — mirrors everything the 3D scene shows. */}
      <div className="sr-only">
        <header>
          <h1>{PROFILE.name} — projects &amp; portfolio</h1>
          <p>
            {PROFILE.firstName} ({PROFILE.name}), {PROFILE.tagline}, based in{" "}
            {PROFILE.location}. An interactive 3D hub linking all of my projects.
          </p>
        </header>
        <section aria-label="Projects">
          <h2>Projects</h2>
          <ul>
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <a href={p.links[0].href}>{p.title}</a> — {p.tagline}. {p.description}
                {p.links.slice(1).map((l) => (
                  <span key={l.href}>
                    {" "}
                    (<a href={l.href}>{l.label}</a>)
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </section>
        <section aria-label="About">
          <h2>About</h2>
          {FRAMES.map((f) => (
            <article key={f.id}>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
              {f.body && (
                <ul>
                  {f.body.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>
        <footer>
          <a href={PROFILE.github}>GitHub: {PROFILE.github}</a> ·{" "}
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </footer>
      </div>

      {view === "list" ? (
        <FallbackList onBack={tier.can3D ? toggleView : undefined} />
      ) : (
        <>
          {showLoader && <LoadingScreen onDone={() => setIntroDone(true)} />}
          {mount3D && (
            <Experience
              mode={mode}
              introDone={introDone}
              effects={!tier.isMobile}
              onSelect={select}
              onNavigate={navigate}
              onBackgroundClick={() => setActive(null)}
            />
          )}
          {flash > 0 && <div className="flash" key={flash} />}
          <Hints visible={introDone && mode === "exterior" && !active} />
          <RoomNav mode={mode} onSet={navigate} />
          <Overlay
            project={active}
            onClose={() => {
              audio.blip("close");
              setActive(null);
            }}
          />
        </>
      )}

      <Hud view={view} onToggleView={toggleView} />
    </main>
  );
}
