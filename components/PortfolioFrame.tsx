"use client";

import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import type { Frame, OverlayItem } from "@/lib/projects";
import { audio } from "@/lib/audio";

interface Props {
  frame: Frame;
  interactive: boolean;
  onSelect: (item: OverlayItem) => void;
}

// A framed board hung on the portfolio-room wall. Clicking opens its overlay.
export function PortfolioFrame({ frame, interactive, onSelect }: Props) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [w, h] = frame.size;

  useFrame(() => {
    if (!ref.current) return;
    const target = hovered ? 1.05 : 1;
    ref.current.scale.x += (target - ref.current.scale.x) * 0.2;
    ref.current.scale.y += (target - ref.current.scale.y) * 0.2;
  });

  const handlers = interactive
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          audio.blip("hover");
        },
        onPointerOut: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        },
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          audio.blip("click");
          onSelect(frame);
        },
      }
    : {};

  return (
    <group ref={ref} position={frame.position} {...handlers}>
      {/* frame border */}
      <mesh castShadow>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.06]} />
        <meshStandardMaterial color="#caa06d" flatShading roughness={0.7} />
      </mesh>
      {/* mat */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[w, h, 0.02]} />
        <meshStandardMaterial color="#f4efe4" flatShading />
      </mesh>
      {/* accent header band */}
      <mesh position={[0, h / 2 - 0.22, 0.05]}>
        <boxGeometry args={[w - 0.16, 0.32, 0.01]} />
        <meshStandardMaterial color={frame.accent} emissive={frame.accent} emissiveIntensity={0.25} />
      </mesh>
      {/* a couple of "text" lines suggested with thin bars */}
      {[0.1, -0.05, -0.2, -0.35].map((y, i) => (
        <mesh key={i} position={[(-w + 0.3) / 2 + (i % 2) * 0.05, y, 0.05]}>
          <boxGeometry args={[w - 0.3 - (i % 3) * 0.18, 0.045, 0.005]} />
          <meshStandardMaterial color="#9a9384" />
        </mesh>
      ))}

      {/* Labels only exist in the DOM while the portfolio room is active,
          so they never leak into the exterior view. */}
      {interactive && (
        <>
          <Html center position={[0, h / 2 + 0.18, 0]} distanceFactor={9} zIndexRange={[10, 0]}>
            <div className={`tooltip ${hovered ? "tooltip--show" : ""}`}>{frame.title}</div>
          </Html>
          <Html center position={[0, h / 2 - 0.22, 0.06]} distanceFactor={6} zIndexRange={[5, 0]}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                textShadow: "0 1px 2px rgba(0,0,0,.3)",
              }}
            >
              {frame.title}
            </div>
          </Html>
        </>
      )}
    </group>
  );
}
