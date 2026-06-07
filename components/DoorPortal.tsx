"use client";

import { useState } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Room } from "@/lib/projects";
import { audio } from "@/lib/audio";

// Where the door sits on each room's back wall (to the right of the content).
const DOOR_POS: Record<"projects" | "portfolio", [number, number, number]> = {
  projects: [-0.75, 0, -3.32],
  portfolio: [4.55, 0, -3.32],
};

// A wooden door on the back wall. Clicking it walks the camera through the
// doorway (GSAP) and switches to the other room.
export function DoorPortal({ mode, onSwitch }: { mode: Room; onSwitch: (r: Room) => void }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const [hovered, setHovered] = useState(false);

  if (mode === "exterior") return null;
  const pos = DOOR_POS[mode];
  const other: Room = mode === "projects" ? "portfolio" : "projects";
  const label = other === "portfolio" ? "To Portfolio" : "To Projects";

  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    audio.blip("click");
    if (controls) controls.enabled = false;
    // Walk up to and "through" the door…
    const tweens = [
      gsap.to(camera.position, {
        x: pos[0],
        y: 1.4,
        z: pos[2] + 1.0,
        duration: 0.5,
        ease: "power2.in",
        onUpdate: () => controls?.update?.(),
      }),
    ];
    if (controls)
      tweens.push(
        gsap.to(controls.target, {
          x: pos[0],
          y: 1.3,
          z: pos[2] - 1,
          duration: 0.5,
          ease: "power2.in",
          onUpdate: () => controls.update(),
        })
      );
    // …then, once we've stepped through, kill the tweens and switch rooms so the
    // CameraRig snap to the new room lands cleanly (flash masks the swap).
    window.setTimeout(() => {
      tweens.forEach((t) => t.kill());
      onSwitch(other);
    }, 520);
  };

  return (
    <group
      position={pos}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
        audio.blip("hover");
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={click}
    >
      {/* frame (in the back wall, thin along z) */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[1.5, 2.36, 0.22]} />
        <meshStandardMaterial color="#8a5a36" flatShading roughness={0.7} />
      </mesh>
      {/* door leaf */}
      <mesh position={[0, 1.06, 0.12]} castShadow>
        <boxGeometry args={[1.12, 2.04, 0.08]} />
        <meshStandardMaterial color={hovered ? "#7d5734" : "#6e4a2c"} flatShading roughness={0.7} />
      </mesh>
      {/* panels */}
      {[1.5, 0.6].map((y) => (
        <mesh key={y} position={[0, y, 0.17]}>
          <boxGeometry args={[0.72, 0.7, 0.02]} />
          <meshStandardMaterial color="#5c3e24" flatShading />
        </mesh>
      ))}
      {/* handle */}
      <mesh position={[0.42, 1.05, 0.18]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#e8c46a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* hover glow */}
      <mesh position={[0, 1.06, 0.12]} visible={hovered}>
        <boxGeometry args={[1.22, 2.14, 0.1]} />
        <meshStandardMaterial color="#0a84ff" emissive="#0a84ff" emissiveIntensity={0.5} transparent opacity={0.2} />
      </mesh>

      <Html center position={[0, 2.45, 0.2]} distanceFactor={8} zIndexRange={[20, 0]} wrapperClass="objcard-wrap">
        <div className={`objcard ${hovered ? "objcard--show" : ""}`}>
          <span className="objcard__title">{label} →</span>
        </div>
      </Html>
    </group>
  );
}
