"use client";

import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { OverlayItem, Room } from "@/lib/projects";
import { ROOM_VIEWS } from "@/lib/projects";
import { ExteriorStage } from "./ExteriorStage";
import { InteriorStage } from "./InteriorStage";
import { SkyDome, SkyClouds } from "./SkyDome";
import { CameraRig } from "./CameraRig";
import { PostFX } from "./PostFX";

interface Props {
  mode: Room;
  introDone: boolean;
  effects: boolean;
  onSelect: (item: OverlayItem) => void;
  onNavigate: (room: Room) => void;
}

export function Scene({ mode, introDone, effects, onSelect, onNavigate }: Props) {
  const controls = useRef<OrbitControlsImpl>(null);
  const inside = mode !== "exterior";

  return (
    <>
      <SkyDome />
      <SkyClouds />
      <fog attach="fog" args={["#cfe6fb", 80, 160]} />

      {/* lighting */}
      <ambientLight intensity={0.38} />
      <hemisphereLight args={["#dcecff", "#5e5038", 0.45]} />
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0004}
      />

      <ExteriorStage
        visible={!inside}
        active={mode === "exterior"}
        onSelect={onSelect}
        onNavigate={onNavigate}
      />
      <InteriorStage visible={inside} mode={mode} onSelect={onSelect} onNavigate={onNavigate} />

      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.6}
        zoomSpeed={0.6}
        minDistance={inside ? 3.4 : 7}
        maxDistance={inside ? 4.7 : 17}
        minPolarAngle={inside ? 0.78 : 0.25}
        maxPolarAngle={inside ? 1.36 : Math.PI / 2.1}
        minAzimuthAngle={inside ? -0.4 : -Infinity}
        maxAzimuthAngle={inside ? 0.4 : Infinity}
        target={ROOM_VIEWS.exterior.target}
      />
      <CameraRig controls={controls} mode={mode} introDone={introDone} />

      {effects && <PostFX />}
    </>
  );
}
