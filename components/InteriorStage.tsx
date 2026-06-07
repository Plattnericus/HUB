"use client";

import type { OverlayItem, Project, Room } from "@/lib/projects";
import { PROJECTS, FRAMES } from "@/lib/projects";
import { House } from "./House";
import { ProjectsRoom } from "./DevRoom";
import { PortfolioRoom } from "./PortfolioRoom";
import { ProjectObject } from "./ProjectObject";
import { PortfolioFrame } from "./PortfolioFrame";
import { DoorPortal } from "./DoorPortal";

interface Props {
  visible: boolean;
  mode: Room;
  onSelect: (item: OverlayItem) => void;
  onNavigate: (room: Room) => void;
}

// The cozy interior you step into: a programming room ("projects") and a
// portfolio room. Built procedurally so it stays crisp and light.
export function InteriorStage({ visible, mode, onSelect, onNavigate }: Props) {
  const roomProjects = PROJECTS.filter((p) => p.room === "projects" || p.room === "portfolio");

  return (
    <group visible={visible}>
      <House />
      <ProjectsRoom />
      <PortfolioRoom />
      {visible && <DoorPortal mode={mode} onSwitch={onNavigate} />}

      {roomProjects.map((p: Project) => (
        <ProjectObject
          key={p.id}
          project={p}
          interactive={visible && mode === p.room}
          onSelect={onSelect}
        />
      ))}

      {FRAMES.map((f) => (
        <PortfolioFrame
          key={f.id}
          frame={f}
          interactive={visible && mode === "portfolio"}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
