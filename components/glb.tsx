"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Mesh, type MeshStandardMaterial, type Object3D } from "three";

const DRACO = "/draco/";
const ISLAND_URL = "/models/island.opt.glb";
const HOUSE_URL = "/models/house.opt.glb";
const SIGNPOST_URL = "/models/signpost.opt.glb";
const OCTOCAT_URL = "/models/github-octocat.opt.glb";
const PCCASE_URL = "/models/pc-case.opt.glb";
const MACBOOK_URL = "/models/macbook.opt.glb";

function applyShadows(root: Object3D) {
  root.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
}

// Auto-fit any model: scale to a target size on its largest axis, centre x/z,
// and sit its base on y=0. Returns props for a wrapper <group>.
function fitToGround(obj: Object3D, target: number, axis: "y" | "xz" = "xz") {
  const box = new Box3().setFromObject(obj);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);
  const measure = axis === "y" ? size.y : Math.max(size.x, size.z);
  const scale = target / measure;
  const position: [number, number, number] = [
    -center.x * scale,
    -box.min.y * scale,
    -center.z * scale,
  ];
  return { scale, position };
}

// The exact floating-island model the user provided (compressed, look preserved).
// Recentred horizontally with its grass surface brought to y≈0, then scaled.
// Known-good manual transform (matches the first good render).
export function IslandGLB() {
  const { scene } = useGLTF(ISLAND_URL, DRACO);
  const obj = useMemo(() => {
    const s = scene.clone(true);
    applyShadows(s);
    // Brighten the island, and push the green-ish grass toward a lighter, fresher green.
    s.traverse((o) => {
      const m = (o as Mesh).material as MeshStandardMaterial | undefined;
      if (!m || !m.color) return;
      const c = m.color;
      const greenish = c.g > c.r * 1.05 && c.g > c.b * 1.05;
      if (greenish) {
        c.r = Math.min(1, c.r * 1.15 + 0.06);
        c.g = Math.min(1, c.g * 1.2 + 0.12);
        c.b = Math.min(1, c.b * 1.1 + 0.04);
      } else {
        c.multiplyScalar(1.08);
      }
    });
    return s;
  }, [scene]);

  return (
    <group scale={0.5} position={[0, 0.7, 0]}>
      <primitive object={obj} position={[5.38, -5.1, 1.18]} />
    </group>
  );
}

// The cabin that sits in the back corner of the island.
export function HouseGLB(props: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(HOUSE_URL, DRACO);
  const obj = useMemo(() => {
    const s = scene.clone(true);
    applyShadows(s);
    return s;
  }, [scene]);
  // From inspect: bboxMin(-3.54,0,-4.11) max(5.70,3.82,4.11) → center x≈1.08.
  return (
    <group
      position={props.position ?? [0, 0, 0]}
      rotation={props.rotation ?? [0, 0, 0]}
      scale={props.scale ?? 1}
    >
      <primitive object={obj} position={[-1.08, 0, 0]} />
    </group>
  );
}

// The signpost model the user provided (huge internal scale → auto-fit to ~2.6 tall).
export function SignpostGLB({ height = 2.6 }: { height?: number }) {
  const { scene } = useGLTF(SIGNPOST_URL, DRACO);
  const { obj, scale, position } = useMemo(() => {
    const s = scene.clone(true);
    applyShadows(s);
    const fit = fitToGround(s, height, "y");
    return { obj: s, ...fit };
  }, [scene, height]);
  return (
    <group scale={scale} position={position}>
      <primitive object={obj} />
    </group>
  );
}

// The official GitHub Octocat model, for the portfolio room.
export function OctocatGLB({ height = 0.62 }: { height?: number }) {
  const { scene } = useGLTF(OCTOCAT_URL, DRACO);
  const { obj, scale, position } = useMemo(() => {
    const s = scene.clone(true);
    applyShadows(s);
    const fit = fitToGround(s, height, "y");
    return { obj: s, ...fit };
  }, [scene, height]);
  return (
    <group scale={scale} position={position}>
      <primitive object={obj} />
    </group>
  );
}

// The gaming PC tower for the projects room.
export function PcCaseGLB({ height = 1.15 }: { height?: number }) {
  const { scene } = useGLTF(PCCASE_URL, DRACO);
  const { obj, scale, position } = useMemo(() => {
    const s = scene.clone(true);
    applyShadows(s);
    const fit = fitToGround(s, height, "y");
    return { obj: s, ...fit };
  }, [scene, height]);
  return (
    <group scale={scale} position={position}>
      <primitive object={obj} />
    </group>
  );
}

// The MacBook model used for the macOS Tahoe clone (StreamDeck) on the desk.
export function MacbookGLB({ width = 0.78 }: { width?: number }) {
  const { scene } = useGLTF(MACBOOK_URL, DRACO);
  const { obj, scale, position } = useMemo(() => {
    const s = scene.clone(true);
    applyShadows(s);
    const fit = fitToGround(s, width, "xz");
    return { obj: s, ...fit };
  }, [scene, width]);
  return (
    <group scale={scale} position={position}>
      <primitive object={obj} />
    </group>
  );
}

useGLTF.preload(ISLAND_URL, DRACO);
useGLTF.preload(HOUSE_URL, DRACO);
useGLTF.preload(SIGNPOST_URL, DRACO);
useGLTF.preload(OCTOCAT_URL, DRACO);
useGLTF.preload(PCCASE_URL, DRACO);
useGLTF.preload(MACBOOK_URL, DRACO);
