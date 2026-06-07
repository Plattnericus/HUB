"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Shape, type Group, type Mesh, type MeshStandardMaterial } from "three";

// House footprint (interior faces near these bounds).
export const HOUSE = {
  HW: 5.4, // half width  (x)
  HD: 3.4, // half depth  (z)
  H: 3.2, // wall height
  T: 0.2, // wall thickness
};

const COL = {
  plaster: "#ece0c8",
  plaster2: "#e3d4b6",
  trim: "#8a5a36",
  roof: "#c2674e",
  roofDark: "#a8553f",
  woodFloorA: "#b9895a",
  woodFloorB: "#caa06d",
  glass: "#bfe3ff",
  door: "#6e4a2c",
};

function Wall(props: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={props.position} castShadow receiveShadow>
      <boxGeometry args={props.size} />
      <meshStandardMaterial color={props.color ?? COL.plaster} flatShading roughness={1} />
    </mesh>
  );
}

function Glass({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={COL.glass}
        emissive={COL.glass}
        emissiveIntensity={0.35}
        roughness={0.2}
      />
    </mesh>
  );
}

function WindowTrim({
  position,
  w,
  h,
  axis,
}: {
  position: [number, number, number];
  w: number;
  h: number;
  axis: "z" | "x";
}) {
  const d = 0.06;
  const frame = "#cdbf9f";
  const bars =
    axis === "z" ? (
      <>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, h, d]} />
          <meshStandardMaterial color={frame} flatShading />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w, 0.05, d]} />
          <meshStandardMaterial color={frame} flatShading />
        </mesh>
      </>
    ) : (
      <>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[d, h, 0.05]} />
          <meshStandardMaterial color={frame} flatShading />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[d, 0.05, w]} />
          <meshStandardMaterial color={frame} flatShading />
        </mesh>
      </>
    );
  return <group position={position}>{bars}</group>;
}

function Gable({ x }: { x: number }) {
  const shape = useMemo(() => {
    const s = new Shape();
    s.moveTo(-(HOUSE.HD + 0.35), 0);
    s.lineTo(HOUSE.HD + 0.35, 0);
    s.lineTo(0, 1.7);
    s.closePath();
    return s;
  }, []);
  return (
    <mesh position={[x, HOUSE.H, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={COL.plaster2} flatShading roughness={1} side={2} />
    </mesh>
  );
}

// Decorative front door (entering happens via the signpost).
function Door() {
  const x = -2.85;
  const z = HOUSE.HD + 0.02;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.1, -0.04]}>
        <boxGeometry args={[1.5, 2.25, 0.12]} />
        <meshStandardMaterial color={COL.trim} flatShading />
      </mesh>
      <mesh position={[0, 1.05, 0.02]} castShadow>
        <boxGeometry args={[1.2, 2.05, 0.08]} />
        <meshStandardMaterial color={COL.door} flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 0.07]}>
        <boxGeometry args={[0.85, 0.7, 0.02]} />
        <meshStandardMaterial color="#5c3e24" flatShading />
      </mesh>
      <mesh position={[0, 0.6, 0.07]}>
        <boxGeometry args={[0.85, 0.7, 0.02]} />
        <meshStandardMaterial color="#5c3e24" flatShading />
      </mesh>
      <mesh position={[0.42, 1.05, 0.08]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#e8c46a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Roof({ open }: { open: boolean }) {
  const ref = useRef<Group>(null);
  const target = open ? 0 : 1;
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    g.traverse((o) => {
      const m = (o as Mesh).material as MeshStandardMaterial | undefined;
      if (m && "opacity" in m) {
        m.opacity += (target - m.opacity) * 0.12;
        m.visible = m.opacity > 0.02;
      }
    });
  });

  const overhang = 0.4;
  const eaveZ = HOUSE.HD + overhang;
  const ridgeY = HOUSE.H + 1.7;
  const slope = Math.atan2(ridgeY - HOUSE.H, eaveZ);
  const len = Math.hypot(eaveZ, ridgeY - HOUSE.H);
  const width = (HOUSE.HW + 0.35) * 2;

  return (
    <group ref={ref}>
      {[1, -1].map((s) => (
        <mesh
          key={s}
          position={[0, (HOUSE.H + ridgeY) / 2, (s * eaveZ) / 2]}
          rotation={[s * slope, 0, 0]}
          castShadow
        >
          <boxGeometry args={[width, 0.14, len]} />
          <meshStandardMaterial
            color={s === 1 ? COL.roof : COL.roofDark}
            flatShading
            roughness={1}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
      {/* ridge cap */}
      <mesh position={[0, ridgeY, 0]} castShadow>
        <boxGeometry args={[width, 0.16, 0.22]} />
        <meshStandardMaterial color={COL.roofDark} flatShading transparent opacity={1} />
      </mesh>
      <Gable x={HOUSE.HW + 0.34} />
      <Gable x={-(HOUSE.HW + 0.34)} />
      {/* chimney */}
      <mesh position={[2.6, HOUSE.H + 1.3, -1.2]} castShadow>
        <boxGeometry args={[0.55, 1.4, 0.55]} />
        <meshStandardMaterial color="#9c5a48" flatShading transparent opacity={1} />
      </mesh>
      <mesh position={[2.6, HOUSE.H + 2.05, -1.2]}>
        <boxGeometry args={[0.7, 0.18, 0.7]} />
        <meshStandardMaterial color="#7e463a" flatShading transparent opacity={1} />
      </mesh>
    </group>
  );
}

export function House({ roofOpen = false }: { roofOpen?: boolean }) {
  const { HW, HD, H, T } = HOUSE;

  return (
    <group>
      {/* ===== floor (two-tone, one tone per room) ===== */}
      <mesh position={[-HW / 2, -0.06, 0]} receiveShadow>
        <boxGeometry args={[HW, 0.12, HD * 2]} />
        <meshStandardMaterial color={COL.woodFloorA} flatShading roughness={0.9} />
      </mesh>
      <mesh position={[HW / 2, -0.06, 0]} receiveShadow>
        <boxGeometry args={[HW, 0.12, HD * 2]} />
        <meshStandardMaterial color={COL.woodFloorB} flatShading roughness={0.9} />
      </mesh>

      {/* ===== back wall (solid, with two windows) ===== */}
      <Wall position={[0, H / 2, -HD]} size={[HW * 2 + T, H, T]} />
      <Glass position={[-2.7, 2.2, -HD + 0.02]} size={[1.4, 0.9, 0.04]} />
      <WindowTrim position={[-2.7, 2.2, -HD + 0.05]} w={1.4} h={0.9} axis="z" />

      {/* ===== left & right walls (with windows) ===== */}
      <Wall position={[-HW, H / 2, 0]} size={[T, H, HD * 2]} />
      <Glass position={[-HW + 0.02, 1.8, 1.4]} size={[0.04, 1.0, 1.5]} />
      <WindowTrim position={[-HW + 0.05, 1.8, 1.4]} w={1.5} h={1.0} axis="x" />
      <Wall position={[HW, H / 2, 0]} size={[T, H, HD * 2]} />
      <Glass position={[HW - 0.02, 1.8, -1.2]} size={[0.04, 1.0, 1.5]} />
      <WindowTrim position={[HW - 0.05, 1.8, -1.2]} w={1.5} h={1.0} axis="x" />

      {/* ===== front wall: door opening + window ===== */}
      {/* left pillar */}
      <Wall position={[-4.5, H / 2, HD]} size={[1.8, H, T]} />
      {/* door header */}
      <Wall position={[-2.85, 2.75, HD]} size={[1.5, 0.9, T]} />
      {/* middle pier */}
      <Wall position={[-0.3, H / 2, HD]} size={[3.6, H, T]} />
      {/* window block (sill + header + glass) */}
      <Wall position={[2.55, 0.5, HD]} size={[1.9, 1.0, T]} />
      <Wall position={[2.55, 2.6, HD]} size={[1.9, 1.2, T]} />
      <Glass position={[2.55, 1.5, HD]} size={[1.6, 1.0, 0.04]} />
      <WindowTrim position={[2.55, 1.5, HD + 0.04]} w={1.6} h={1.0} axis="z" />
      {/* right pillar */}
      <Wall position={[4.45, H / 2, HD]} size={[1.9, H, T]} />

      {/* ===== interior divider with doorway ===== */}
      <Wall position={[0, H / 2, -2.1]} size={[T, H, 2.6]} color={COL.plaster2} />
      <Wall position={[0, H / 2, 2.1]} size={[T, H, 2.6]} color={COL.plaster2} />
      <Wall position={[0, 2.75, 0]} size={[T, 0.9, 1.6]} color={COL.plaster2} />
      {/* doorway trim */}
      <mesh position={[0, 1.15, 0.8]}>
        <boxGeometry args={[T + 0.06, 2.3, 0.08]} />
        <meshStandardMaterial color={COL.trim} flatShading />
      </mesh>
      <mesh position={[0, 1.15, -0.8]}>
        <boxGeometry args={[T + 0.06, 2.3, 0.08]} />
        <meshStandardMaterial color={COL.trim} flatShading />
      </mesh>

      {/* ===== porch step + path ===== */}
      <mesh position={[-2.85, -0.12, HD + 0.55]} receiveShadow>
        <boxGeometry args={[1.8, 0.16, 0.9]} />
        <meshStandardMaterial color="#c9c2b4" flatShading roughness={1} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-2.85 + (i % 2 ? 0.18 : -0.18), 0.01, HD + 1.3 + i * 0.7]} receiveShadow>
          <boxGeometry args={[0.95, 0.04, 0.55]} />
          <meshStandardMaterial color="#cbbfa6" flatShading roughness={1} />
        </mesh>
      ))}

      {/* ===== little fence by the front corners ===== */}
      {[-5.0, -4.4, -3.8].map((x) => (
        <group key={x} position={[x, 0, HD + 2.9]}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.08, 0.6, 0.08]} />
            <meshStandardMaterial color="#d8cdb4" flatShading />
          </mesh>
        </group>
      ))}
      <mesh position={[-4.4, 0.42, HD + 2.9]}>
        <boxGeometry args={[1.4, 0.07, 0.05]} />
        <meshStandardMaterial color="#d8cdb4" flatShading />
      </mesh>

      {/* ceiling (so the room has a roof overhead) + cosy ceiling light */}
      <mesh position={[0, H + 0.06, 0]} receiveShadow>
        <boxGeometry args={[HW * 2 + T, T, HD * 2 + T]} />
        <meshStandardMaterial color="#d8cdb6" flatShading roughness={1} />
      </mesh>
      {/* exposed beams for detail */}
      {[-3.4, -1.7, 1.7, 3.4].map((x) => (
        <mesh key={x} position={[x, H - 0.12, 0]}>
          <boxGeometry args={[0.16, 0.16, HD * 2]} />
          <meshStandardMaterial color={COL.trim} flatShading />
        </mesh>
      ))}
      <pointLight position={[-2.7, H - 0.5, -0.4]} color="#ffe6c2" intensity={3.2} distance={6} decay={2} />
      <pointLight position={[2.7, H - 0.5, -0.4]} color="#ffe6c2" intensity={3.2} distance={6} decay={2} />

      <Roof open={roofOpen} />
      <Door />
    </group>
  );
}
