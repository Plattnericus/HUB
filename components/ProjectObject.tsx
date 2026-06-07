"use client";

import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";
import { Color, type Group, type Mesh, type MeshStandardMaterial } from "three";
import type { Project } from "@/lib/projects";
import { ProjectModel } from "./models";
import { ICON_FOR_KIND } from "./icons";
import { audio } from "@/lib/audio";

const WHITE = new Color("#ffffff");

interface Props {
  project: Project;
  interactive: boolean;
  onSelect: (p: Project) => void;
}

// An interactive project object: hover lifts it and shows a little label above it;
// clicking opens its description card.
export function ProjectObject({ project, interactive, onSelect }: Props) {
  const outer = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const base = project.scale;
  const seed = project.position[0] * 1.3 + project.position[2];
  const Icon = ICON_FOR_KIND[project.kind];

  // Collected materials + their original colours, for the hover "bleach" effect.
  const mats = useRef<{ mat: MeshStandardMaterial; base: Color }[]>([]);
  const tint = useRef({ v: 0 });

  useFrame(({ clock }) => {
    if (!outer.current) return;
    outer.current.position.y = project.position[1] + Math.sin(clock.elapsedTime * 1.1 + seed) * 0.02;

    // Lazily collect materials once the model has mounted.
    if (mats.current.length === 0 && inner.current) {
      inner.current.traverse((o) => {
        const m = (o as Mesh).material as MeshStandardMaterial | undefined;
        if (m && m.color) mats.current.push({ mat: m, base: m.color.clone() });
      });
    }
    // Apply the current bleach amount.
    if (tint.current.v > 0.001 || mats.current.some((x) => !x.mat.color.equals(x.base))) {
      for (const { mat, base } of mats.current) mat.color.copy(base).lerp(WHITE, tint.current.v);
    }
  });

  const animate = (toScale: number, lift: number) => {
    if (!inner.current) return;
    gsap.to(inner.current.scale, {
      x: base * toScale,
      y: base * toScale,
      z: base * toScale,
      duration: 0.5,
      ease: "back.out(2.2)",
    });
    gsap.to(inner.current.rotation, { z: lift !== 0 ? 0.08 : 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
    gsap.to(inner.current.position, { y: lift, duration: 0.5, ease: "back.out(2)" });
  };

  const handlers = interactive
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          audio.blip("hover");
          animate(1.14, 0.12);
          gsap.to(tint.current, { v: 0.42, duration: 0.4, ease: "power2.out" });
        },
        onPointerOut: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
          animate(1, 0);
          gsap.to(tint.current, { v: 0, duration: 0.45, ease: "power2.out" });
        },
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          audio.blip("click");
          if (inner.current)
            gsap.fromTo(
              inner.current.scale,
              { x: base * 0.9, y: base * 0.9, z: base * 0.9 },
              { x: base, y: base, z: base, duration: 0.45, ease: "back.out(3)" }
            );
          onSelect(project);
        },
      }
    : {};

  return (
    <group ref={outer} position={project.position} rotation={project.rotation} {...handlers}>
      <group ref={inner} scale={base}>
        <ProjectModel kind={project.kind} accent={project.accent} />
      </group>
      {interactive && (
        <Html position={[0, 1.25, 0]} center zIndexRange={[20, 0]} wrapperClass="objcard-wrap">
          <div className={`objcard ${hovered ? "objcard--show" : ""}`}>
            <span className="objcard__icon" style={{ color: project.accent }}>
              {Icon && <Icon />}
            </span>
            <span className="objcard__title">{project.title}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
