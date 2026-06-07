"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/projects";
import { audio } from "@/lib/audio";
import {
  IconGithub,
  IconList,
  IconCube,
  IconSoundOn,
  IconSoundOff,
} from "./icons";

interface Props {
  view: "3d" | "list";
  onToggleView: () => void;
}

export function Hud({ view, onToggleView }: Props) {
  const [muted, setMuted] = useState(false);

  return (
    <div className="topbar">
      <div className="brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand__avatar" src="/pfp.jpg" alt="" />
        <div className="brand__text">
          <span className="brand__name">{PROFILE.name}</span>
          <span className="brand__role">Project Hub</span>
        </div>
      </div>

      <div className="actions">
        <a
          className="pill pill--icon"
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile"
        >
          <IconGithub />
        </a>
        <button
          className="pill pill--icon"
          onClick={() => setMuted(audio.toggleMute())}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <IconSoundOff /> : <IconSoundOn />}
        </button>
        <button className="pill" onClick={onToggleView}>
          {view === "3d" ? <IconList /> : <IconCube />}
          {view === "3d" ? "List" : "3D view"}
        </button>
      </div>
    </div>
  );
}
