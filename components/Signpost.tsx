"use client";

import { Html } from "@react-three/drei";
import type { Room } from "@/lib/projects";
import { audio } from "@/lib/audio";
import { SignpostGLB } from "./glb";

function SignLabel({
  label,
  accent,
  position,
  onClick,
}: {
  label: string;
  accent: string;
  position: [number, number, number];
  onClick: () => void;
}) {
  return (
    <Html position={position} center distanceFactor={9} zIndexRange={[15, 0]}>
      <button
        className="sign-btn"
        style={{ ["--sb" as string]: accent }}
        onPointerOver={() => audio.blip("hover")}
        onClick={(e) => {
          e.stopPropagation();
          audio.blip("click");
          onClick();
        }}
      >
        {label}
        <span className="sign-btn__arrow" style={{ background: accent }} />
      </button>
    </Html>
  );
}

// The provided signpost model, with two clickable nav labels for the rooms.
export function Signpost({ onNavigate }: { onNavigate: (room: Room) => void }) {
  return (
    <group>
      <SignpostGLB height={2.6} />
      <SignLabel
        label="My Projects"
        accent="#0a84ff"
        position={[0.55, 2.15, 0]}
        onClick={() => onNavigate("projects")}
      />
      <SignLabel
        label="Portfolio"
        accent="#bf5af2"
        position={[-0.55, 1.55, 0]}
        onClick={() => onNavigate("portfolio")}
      />
    </group>
  );
}
