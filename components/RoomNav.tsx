"use client";

import type { Room } from "@/lib/projects";
import { IconCube } from "./icons";

interface Props {
  mode: Room;
  onSet: (mode: Room) => void;
}

// Segmented control shown while inside the house: switch rooms or step back out.
export function RoomNav({ mode, onSet }: Props) {
  if (mode === "exterior") return null;
  return (
    <div className="roomnav">
      <button
        className={`roomnav__seg ${mode === "projects" ? "is-active" : ""}`}
        onClick={() => onSet("projects")}
      >
        Projects
      </button>
      <button
        className={`roomnav__seg ${mode === "portfolio" ? "is-active" : ""}`}
        onClick={() => onSet("portfolio")}
      >
        Portfolio
      </button>
      <button className="roomnav__exit" onClick={() => onSet("exterior")}>
        <IconCube />
        Outside
      </button>
    </div>
  );
}
