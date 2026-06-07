"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Raycaster, Vector3, type Group, type Points } from "three";

const _ray = new Raycaster();
const _down = new Vector3(0, -1, 0);
const _origin = new Vector3();

// Drops its children onto the island's actual surface by raycasting straight
// down against the island mesh — so everything looks planted in the grass,
// regardless of the terrain's bumps.
export function Grounded({
  x,
  z,
  yOffset = 0,
  island,
  children,
}: {
  x: number;
  z: number;
  yOffset?: number;
  island: React.RefObject<Group | null>;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  const placed = useRef(false);
  useFrame(() => {
    if (placed.current || !island.current || !ref.current) return;
    _origin.set(x, 60, z);
    _ray.set(_origin, _down);
    const hits = _ray.intersectObject(island.current, true);
    if (hits.length) {
      const parent = ref.current.parent;
      const local = parent ? parent.worldToLocal(hits[0].point.clone()) : hits[0].point;
      ref.current.position.set(x, local.y + yOffset, z);
      placed.current = true;
    }
  });
  return (
    <group ref={ref} position={[x, -1.3, z]}>
      {children}
    </group>
  );
}

// A lively waterfall: streaks of droplets fall and recycle, with a foamy splash
// of slower particles at the top lip — so the water reads as moving.
export function WaterfallParticles({
  position,
  rotation = [0, 0, 0],
  width = 1.1,
  height = 4.4,
  count = 460,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  count?: number;
}) {
  const fall = useRef<Points>(null);
  const foam = useRef<Points>(null);

  const fallData = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * width;
      pos[i * 3 + 1] = -Math.random() * height; // below the lip (falls downward)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.45;
      spd[i] = 2.4 + Math.random() * 3.6;
    }
    return { pos, spd };
  }, [count, width, height]);

  const foamData = useMemo(() => {
    const n = 90;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * (width + 0.5);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    return { pos, n };
  }, [width]);

  useFrame(({ clock }, dt) => {
    const d = Math.min(dt, 0.05);
    if (fall.current) {
      const arr = fall.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] -= fallData.spd[i] * d;
        arr[i * 3] += Math.sin(clock.elapsedTime * 3 + i) * 0.004; // slight sway
        if (arr[i * 3 + 1] < -height) {
          arr[i * 3 + 1] = 0; // recycle at the lip
          arr[i * 3] = (Math.random() - 0.5) * width;
        }
      }
      fall.current.geometry.attributes.position.needsUpdate = true;
    }
    if (foam.current) {
      const arr = foam.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < foamData.n; i++) {
        arr[i * 3 + 1] = Math.sin(clock.elapsedTime * 4 + i * 0.7) * 0.12;
      }
      foam.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <points ref={fall}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fallData.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#eaf4ff"
          size={0.13}
          sizeAttenuation
          transparent
          opacity={0.92}
          depthWrite={false}
        />
      </points>
      <points ref={foam} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[foamData.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
