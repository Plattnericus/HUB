"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

const WOOD = "#a9784d";
const WOOD_DARK = "#7c5638";

// Furniture for the RIGHT room ("Portfolio"). Interior spans x∈[0.2,5.3],
// centered around x ≈ 2.75. The interactive wall frames live in PortfolioFrame.
export function PortfolioRoom() {
  const plant = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (plant.current) plant.current.rotation.z = Math.sin(clock.elapsedTime * 0.9 + 1) * 0.04;
  });

  return (
    <group>
      {/* rug */}
      <mesh position={[2.8, 0.01, 0.6]} receiveShadow>
        <cylinderGeometry args={[2.0, 2.0, 0.02, 6]} />
        <meshStandardMaterial color="#b9583f" roughness={1} />
      </mesh>
      <mesh position={[2.8, 0.02, 0.6]}>
        <cylinderGeometry args={[1.6, 1.6, 0.021, 6]} />
        <meshStandardMaterial color="#cf6a4c" roughness={1} />
      </mesh>

      {/* low sideboard under the frames (the octocat sits on it) */}
      <mesh position={[2.9, 0.42, -3.0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.84, 0.6]} />
        <meshStandardMaterial color={WOOD} flatShading roughness={0.8} />
      </mesh>
      {[1.1, 2.5, 3.9].map((x) => (
        <mesh key={x} position={[x, 0.85, -2.78]}>
          <boxGeometry args={[0.04, 0.02, 0.04]} />
          <meshStandardMaterial color="#3a2c1c" />
        </mesh>
      ))}

      {/* armchair facing the wall */}
      <group position={[2.6, 0, 1.4]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.9, 0.3, 0.8]} />
          <meshStandardMaterial color="#4a6b8a" flatShading />
        </mesh>
        <mesh position={[0, 0.62, -0.36]} castShadow>
          <boxGeometry args={[0.9, 0.6, 0.16]} />
          <meshStandardMaterial color="#4a6b8a" flatShading />
        </mesh>
        <mesh position={[-0.46, 0.5, 0]} castShadow>
          <boxGeometry args={[0.14, 0.4, 0.8]} />
          <meshStandardMaterial color="#3f5e7a" flatShading />
        </mesh>
        <mesh position={[0.46, 0.5, 0]} castShadow>
          <boxGeometry args={[0.14, 0.4, 0.8]} />
          <meshStandardMaterial color="#3f5e7a" flatShading />
        </mesh>
      </group>

      {/* round coffee table + book */}
      <group position={[2.7, 0, 0.4]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.06, 16]} />
          <meshStandardMaterial color={WOOD_DARK} flatShading />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.32, 8]} />
          <meshStandardMaterial color={WOOD_DARK} flatShading />
        </mesh>
        <mesh position={[0.06, 0.4, 0]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.22]} />
          <meshStandardMaterial color="#d8584f" flatShading />
        </mesh>
      </group>

      {/* corner plant */}
      <group position={[4.9, 0, 2.5]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.2, 0.5, 10]} />
          <meshStandardMaterial color="#c9a06a" flatShading />
        </mesh>
        <group ref={plant} position={[0, 0.5, 0]}>
          {[
            [0, 0.6, 0, 0.0],
            [0.16, 0.5, 0.06, 0.5],
            [-0.14, 0.55, -0.08, -0.45],
            [0.06, 0.7, -0.12, 0.2],
          ].map(([x, y, z, rot], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[0, 0, rot]} castShadow>
              <coneGeometry args={[0.08, 0.7, 5]} />
              <meshStandardMaterial color="#4f9d54" flatShading />
            </mesh>
          ))}
        </group>
      </group>

      {/* standing lamp near the divider */}
      <group position={[0.7, 0, -2.5]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 10]} />
          <meshStandardMaterial color="#2b2f3a" flatShading />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.8, 8]} />
          <meshStandardMaterial color="#3a4150" flatShading />
        </mesh>
        <mesh position={[0, 1.85, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.34, 14, 1, true]} />
          <meshStandardMaterial color="#f0e6c8" flatShading side={2} />
        </mesh>
        <pointLight position={[0, 1.7, 0]} color="#ffe0b0" intensity={3.4} distance={4} decay={2} />
      </group>
    </group>
  );
}
