"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { PcCaseGLB } from "./glb";

const WOOD = "#8a5a36";
const DESK = "#2a2c33";
const DESK_TOP = "#34373f";
const SHELF = "#9b6f47";

function Bracket({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <mesh position={[x, y - 0.1, z + 0.12]}>
      <boxGeometry args={[0.05, 0.2, 0.18]} />
      <meshStandardMaterial color="#2b2f3a" flatShading />
    </mesh>
  );
}

// LEFT room — "My Projects": a tidy gaming setup. A desk with the PC tower and the
// hero monitor, plus two display shelves where the other projects sit like trophies.
export function ProjectsRoom() {
  const plant = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (plant.current) plant.current.rotation.z = Math.sin(clock.elapsedTime * 1.1) * 0.04;
  });

  return (
    <group>
      {/* rug */}
      <mesh position={[-2.7, 0.012, -0.1]} receiveShadow>
        <cylinderGeometry args={[2.1, 2.1, 0.02, 40]} />
        <meshStandardMaterial color="#2f3a52" roughness={1} />
      </mesh>
      <mesh position={[-2.7, 0.02, -0.1]}>
        <cylinderGeometry args={[1.75, 1.75, 0.021, 40]} />
        <meshStandardMaterial color="#3c4a68" roughness={1} />
      </mesh>

      {/* ===== gaming desk ===== */}
      <mesh position={[-3.0, 0.88, -2.95]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.07, 0.85]} />
        <meshStandardMaterial color={DESK_TOP} flatShading roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-3.0, 0.86, -2.95]}>
        <boxGeometry args={[3.55, 0.02, 0.8]} />
        <meshStandardMaterial color="#0a84ff" emissive="#0a84ff" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      {[
        [-4.65, -2.6],
        [-1.35, -2.6],
        [-4.65, -3.28],
        [-1.35, -3.28],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.43, z]} castShadow>
          <boxGeometry args={[0.07, 0.86, 0.07]} />
          <meshStandardMaterial color={DESK} flatShading />
        </mesh>
      ))}

      {/* keyboard + mouse + mat */}
      <mesh position={[-3.0, 0.925, -2.45]}>
        <boxGeometry args={[1.1, 0.005, 0.42]} />
        <meshStandardMaterial color="#15171e" roughness={1} />
      </mesh>
      <mesh position={[-3.1, 0.945, -2.45]} castShadow>
        <boxGeometry args={[0.66, 0.03, 0.2]} />
        <meshStandardMaterial color="#1d212b" flatShading />
      </mesh>
      <mesh position={[-2.5, 0.945, -2.4]} castShadow>
        <boxGeometry args={[0.09, 0.03, 0.15]} />
        <meshStandardMaterial color="#1d212b" flatShading />
      </mesh>

      {/* gaming PC tower (provided model) on the floor, left of the desk */}
      <group position={[-4.85, 0, -2.35]} rotation={[0, 0.35, 0]}>
        <PcCaseGLB height={1.15} />
      </group>

      {/* gaming chair */}
      <group position={[-3.0, 0, -1.55]}>
        <mesh position={[0, 0.52, 0]} castShadow>
          <boxGeometry args={[0.54, 0.1, 0.52]} />
          <meshStandardMaterial color="#242730" flatShading />
        </mesh>
        <mesh position={[0, 0.9, -0.23]} castShadow>
          <boxGeometry args={[0.54, 0.7, 0.1]} />
          <meshStandardMaterial color="#242730" flatShading />
        </mesh>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0.92, -0.2]}>
            <boxGeometry args={[0.06, 0.62, 0.06]} />
            <meshStandardMaterial color="#0a84ff" emissive="#0a84ff" emissiveIntensity={0.3} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.46, 8]} />
          <meshStandardMaterial color="#15171e" flatShading />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 5]} />
          <meshStandardMaterial color="#15171e" flatShading />
        </mesh>
      </group>

      {/* ===== display shelf — the smaller projects sit here like trophies ===== */}
      <mesh position={[-3.2, 1.92, -3.26]} castShadow>
        <boxGeometry args={[3.6, 0.07, 0.34]} />
        <meshStandardMaterial color={SHELF} flatShading roughness={0.7} />
      </mesh>
      <mesh position={[-3.2, 1.87, -3.26]}>
        <boxGeometry args={[3.55, 0.015, 0.3]} />
        <meshStandardMaterial color="#bf5af2" emissive="#bf5af2" emissiveIntensity={0.55} toneMapped={false} />
      </mesh>
      <Bracket x={-4.7} y={1.92} z={-3.26} />
      <Bracket x={-3.2} y={1.92} z={-3.26} />
      <Bracket x={-1.7} y={1.92} z={-3.26} />
      {/* small pedestals so each trophy stands proud */}
      {[-4.0, -3.2, -2.4].map((x) => (
        <mesh key={x} position={[x, 1.98, -3.2]}>
          <cylinderGeometry args={[0.13, 0.15, 0.05, 16]} />
          <meshStandardMaterial color="#15171e" flatShading roughness={0.6} />
        </mesh>
      ))}

      {/* floor lamp */}
      <group position={[-0.7, 0, -1.0]}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.06, 10]} />
          <meshStandardMaterial color="#2b2f3a" flatShading />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.7, 8]} />
          <meshStandardMaterial color="#3a4150" flatShading />
        </mesh>
        <mesh position={[0, 1.72, 0]}>
          <coneGeometry args={[0.22, 0.3, 12, 1, true]} />
          <meshStandardMaterial color="#f0e6c8" flatShading side={2} />
        </mesh>
        <pointLight position={[0, 1.55, 0]} color="#ffd9a0" intensity={3} distance={4} decay={2} />
      </group>

      {/* potted plant */}
      <group position={[-4.9, 0, 0.4]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.16, 0.36, 10]} />
          <meshStandardMaterial color="#c66a4a" flatShading />
        </mesh>
        <group ref={plant} position={[0, 0.36, 0]}>
          {[
            [0, 0.45, 0, 0.0],
            [0.12, 0.38, 0.05, 0.5],
            [-0.1, 0.4, -0.06, -0.4],
            [0.05, 0.5, -0.1, 0.2],
          ].map(([x, y, z, rot], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[0, 0, rot]} castShadow>
              <coneGeometry args={[0.06, 0.5, 5]} />
              <meshStandardMaterial color="#4f9d54" flatShading />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
