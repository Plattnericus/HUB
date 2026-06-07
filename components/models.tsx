"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import type { ModelKind } from "@/lib/projects";
import { OctocatGLB, MacbookGLB } from "./glb";

// Shared low-poly palette — keeps every object visually coherent.
const C = {
  dark: "#2b2f3a",
  darker: "#1d212b",
  metal: "#3a4150",
  light: "#e8eaf0",
  beige: "#d8cdb4",
  beigeDark: "#b9ad90",
  wood: "#9b6f47",
  woodDark: "#7c5638",
  green: "#5fae6a",
  red: "#e2574c",
  white: "#f3f4f7",
  black: "#15171e",
};

interface ModelProps {
  accent: string;
}

/** A glowing screen surface that gently pulses. */
function Screen({
  width,
  height,
  accent,
  position,
  rotation,
}: {
  width: number;
  height: number;
  accent: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const mat = useRef<MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (mat.current)
      mat.current.emissiveIntensity = 0.85 + Math.sin(clock.elapsedTime * 2) * 0.15;
  });
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        ref={mat}
        color={accent}
        emissive={accent}
        emissiveIntensity={0.9}
        toneMapped={false}
      />
    </mesh>
  );
}

function Monitor({ accent }: ModelProps) {
  return (
    <group>
      {/* stand */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[0.34, 0.04, 0.22]} />
        <meshStandardMaterial color={C.metal} flatShading roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.08, 0.28, 0.06]} />
        <meshStandardMaterial color={C.metal} flatShading roughness={0.6} />
      </mesh>
      {/* body */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.92, 0.58, 0.06]} />
        <meshStandardMaterial color={C.darker} flatShading roughness={0.5} />
      </mesh>
      <Screen width={0.82} height={0.48} accent={accent} position={[0, 0.52, 0.032]} />
    </group>
  );
}

function ServerRack({ accent }: ModelProps) {
  const leds = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!leds.current) return;
    leds.current.children.forEach((c, i) => {
      const m = (c as Mesh).material as MeshStandardMaterial;
      m.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 4 + i * 1.7) * 0.5;
    });
  });
  const units = [0.3, 0.62, 0.94, 1.26];
  return (
    <group>
      {/* cabinet */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.6, 0.6]} />
        <meshStandardMaterial color={C.dark} flatShading roughness={0.55} />
      </mesh>
      {/* server units */}
      {units.map((y) => (
        <mesh key={y} position={[0, y, 0.31]} castShadow>
          <boxGeometry args={[0.6, 0.22, 0.04]} />
          <meshStandardMaterial color={C.metal} flatShading roughness={0.5} />
        </mesh>
      ))}
      {/* blinking LEDs */}
      <group ref={leds}>
        {units.flatMap((y, ui) =>
          [0, 1, 2].map((i) => (
            <mesh key={`${y}-${i}`} position={[-0.22 + i * 0.07, y, 0.34]}>
              <boxGeometry args={[0.03, 0.03, 0.02]} />
              <meshStandardMaterial
                color={i === ui % 3 ? accent : C.green}
                emissive={i === ui % 3 ? accent : C.green}
                emissiveIntensity={0.8}
                toneMapped={false}
              />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

function CloudModel({ accent }: ModelProps) {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.12;
  });
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 0.5],
    [0.45, -0.05, 0.1, 0.36],
    [-0.45, -0.04, -0.05, 0.38],
    [0.2, 0.18, -0.1, 0.3],
    [-0.2, 0.16, 0.12, 0.28],
  ];
  return (
    <group ref={g}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color={C.white} flatShading roughness={1} />
        </mesh>
      ))}
      {/* subtle accent underglow */}
      <pointLight position={[0, -0.3, 0]} color={accent} intensity={0.5} distance={2.0} />
    </group>
  );
}

function ConsoleModel({ accent }: ModelProps) {
  return (
    <group rotation={[-0.35, 0, 0]}>
      {/* body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.44, 0.08]} />
        <meshStandardMaterial color={accent} flatShading roughness={0.5} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 0.05, 0.045]}>
        <boxGeometry args={[0.4, 0.3, 0.02]} />
        <meshStandardMaterial color={C.darker} flatShading />
      </mesh>
      <Screen width={0.34} height={0.24} accent={"#9fd8ff"} position={[0, 0.05, 0.06]} />
      {/* d-pad */}
      <mesh position={[-0.24, -0.05, 0.05]}>
        <boxGeometry args={[0.1, 0.03, 0.02]} />
        <meshStandardMaterial color={C.darker} flatShading />
      </mesh>
      <mesh position={[-0.24, -0.05, 0.05]}>
        <boxGeometry args={[0.03, 0.1, 0.02]} />
        <meshStandardMaterial color={C.darker} flatShading />
      </mesh>
      {/* buttons */}
      {[
        [0.24, -0.02],
        [0.3, -0.08],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.05]}>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />
          <meshStandardMaterial color={C.white} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function ChartScreen({ accent }: ModelProps) {
  const bars = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!bars.current) return;
    bars.current.children.forEach((c, i) => {
      const m = c as Mesh;
      const h = 0.1 + (Math.sin(clock.elapsedTime * 1.5 + i) * 0.5 + 0.5) * 0.26;
      m.scale.y = h / 0.26;
      m.position.y = 0.42 + (h - 0.26) / 2;
    });
  });
  return (
    <group>
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[0.3, 0.04, 0.2]} />
        <meshStandardMaterial color={C.metal} flatShading />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.07, 0.26, 0.05]} />
        <meshStandardMaterial color={C.metal} flatShading />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.86, 0.54, 0.06]} />
        <meshStandardMaterial color={C.darker} flatShading />
      </mesh>
      <Screen width={0.78} height={0.46} accent={"#1a1530"} position={[0, 0.5, 0.032]} />
      {/* live bars */}
      <group ref={bars} position={[0, 0, 0.05]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-0.28 + i * 0.14, 0.42, 0]}>
            <boxGeometry args={[0.08, 0.26, 0.02]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.7}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Phone({ accent }: ModelProps) {
  return (
    <group rotation={[-0.5, 0, 0.12]}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.6, 0.04]} />
        <meshStandardMaterial color={C.black} flatShading roughness={0.4} />
      </mesh>
      <Screen width={0.26} height={0.52} accent={accent} position={[0, 0, 0.022]} />
    </group>
  );
}

function Tray() {
  return (
    <group>
      {/* tray */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.04, 0.5]} />
        <meshStandardMaterial color={C.red} flatShading roughness={0.6} />
      </mesh>
      {/* plate */}
      <mesh position={[-0.12, 0.05, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.03, 12]} />
        <meshStandardMaterial color={C.white} flatShading />
      </mesh>
      {/* food blobs */}
      <mesh position={[-0.12, 0.09, 0]}>
        <icosahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial color={C.green} flatShading />
      </mesh>
      <mesh position={[0.18, 0.07, 0.1]}>
        <icosahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial color={"#e8a13a"} flatShading />
      </mesh>
      {/* cup */}
      <mesh position={[0.2, 0.08, -0.12]}>
        <cylinderGeometry args={[0.05, 0.04, 0.12, 10]} />
        <meshStandardMaterial color={"#5aa6e8"} flatShading />
      </mesh>
    </group>
  );
}

function Mailbox() {
  return (
    <group>
      {/* post */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color={C.woodDark} flatShading />
      </mesh>
      {/* box body */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.26, 0.22, 0.36]} />
        <meshStandardMaterial color={C.red} flatShading roughness={0.5} />
      </mesh>
      {/* rounded top */}
      <mesh position={[0, 0.89, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 0.26, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={C.red} flatShading roughness={0.5} />
      </mesh>
      {/* flag */}
      <mesh position={[0.14, 0.86, -0.08]} castShadow>
        <boxGeometry args={[0.02, 0.14, 0.1]} />
        <meshStandardMaterial color={C.white} flatShading />
      </mesh>
    </group>
  );
}


const REGISTRY: Record<ModelKind, (p: ModelProps) => React.ReactElement> = {
  monitor: Monitor,
  retroMac: () => <MacbookGLB width={0.85} />,
  serverRack: ServerRack,
  cloud: CloudModel,
  console: ConsoleModel,
  chartScreen: ChartScreen,
  phone: Phone,
  tray: () => <Tray />,
  mailbox: () => <Mailbox />,
  octocat: () => <OctocatGLB height={0.7} />,
};

export function ProjectModel({ kind, accent }: { kind: ModelKind; accent: string }) {
  const Comp = REGISTRY[kind];
  return <Comp accent={accent} />;
}
