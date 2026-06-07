"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { OverlayItem, Room } from "@/lib/projects";
import { ROOM_VIEWS } from "@/lib/projects";
import { Scene } from "./Scene";

interface Props {
  mode: Room;
  introDone: boolean;
  effects: boolean;
  onSelect: (item: OverlayItem) => void;
  onNavigate: (room: Room) => void;
  onBackgroundClick: () => void;
}

export default function Experience({
  mode,
  introDone,
  effects,
  onSelect,
  onNavigate,
  onBackgroundClick,
}: Props) {
  return (
    <Canvas
      className="scene-canvas"
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: ROOM_VIEWS.exterior.pos, fov: 42, near: 0.1, far: 300 }}
      onPointerMissed={onBackgroundClick}
    >
      <Suspense fallback={null}>
        <Scene
          mode={mode}
          introDone={introDone}
          effects={effects}
          onSelect={onSelect}
          onNavigate={onNavigate}
        />
      </Suspense>
    </Canvas>
  );
}
