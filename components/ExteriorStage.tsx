"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { OverlayItem, Project, Room } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";
import { IslandGLB, HouseGLB } from "./glb";
import { Signpost } from "./Signpost";
import { ProjectObject } from "./ProjectObject";
import { Grounded } from "./ExteriorExtras";

interface Props {
  visible: boolean;
  active: boolean;
  onSelect: (item: OverlayItem) => void;
  onNavigate: (room: Room) => void;
}

const byId = (id: string) => PROJECTS.find((p) => p.id === id)!;

// Everything you see from outside: the provided floating island, my cabin beside
// the island's hut, a signpost, the mailbox and the cloud.
export function ExteriorStage({ visible, active, onSelect, onNavigate }: Props) {
  const ref = useRef<Group>(null);
  const island = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current && visible)
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.45) * 0.12;
  });

  const cloud = byId("cloud");
  const contact = byId("contact");

  return (
    <group ref={ref} visible={visible}>
      <group ref={island}>
        <IslandGLB />
      </group>

      {/* my cabin — further to the back-left; click to enter projects */}
      <Grounded x={0.6} z={-2.4} island={island}>
        <group
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("projects");
          }}
        >
          <HouseGLB rotation={[0, 1.5 + (105 * Math.PI) / 180 + 0.35, 0]} scale={0.4} />
        </group>
      </Grounded>

      {/* signpost, further toward the front */}
      <Grounded x={1.4} z={3.4} island={island}>
        <group rotation={[0, 0.2, 0]}>
          <Signpost onNavigate={onNavigate} />
        </group>
      </Grounded>

      {/* mailbox on the grass */}
      <Grounded x={2.6} z={1.4} island={island}>
        <ProjectObject project={{ ...contact, position: [0, 0, 0] }} interactive={active} onSelect={onSelect} />
      </Grounded>

      {/* the cloud stays up in the sky */}
      <ProjectObject project={cloud} interactive={active} onSelect={onSelect} />
    </group>
  );
}
