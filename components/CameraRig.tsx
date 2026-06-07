"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ROOM_VIEWS, type Room } from "@/lib/projects";

interface Props {
  controls: React.RefObject<OrbitControlsImpl | null>;
  mode: Room;
  introDone: boolean;
}

// Drives the camera by room mode: a cinematic intro, then a smooth fly between
// the exterior orbit and each interior room.
export function CameraRig({ controls, mode, introDone }: Props) {
  const { camera } = useThree();
  const didIntro = useRef(false);
  const tweens = useRef<gsap.core.Tween[]>([]);

  const flyTo = (mode: Room, duration: number) => {
    const c = controls.current;
    if (!c) return;
    const view = ROOM_VIEWS[mode];
    const inside = mode !== "exterior";
    tweens.current.forEach((t) => t.kill());
    c.autoRotate = false;
    // Inside: snap straight to the room view (the screen flash masks it) so the
    // azimuth/distance limits never fight a tween. Outside: a smooth fly.
    if (inside) {
      camera.position.set(view.pos[0], view.pos[1], view.pos[2]);
      c.target.set(view.target[0], view.target[1], view.target[2]);
      c.update();
      c.enabled = true;
      return;
    }
    c.enabled = false;
    tweens.current = [
      gsap.to(camera.position, {
        x: view.pos[0],
        y: view.pos[1],
        z: view.pos[2],
        duration,
        ease: inside ? "power2.out" : "power3.inOut",
        onUpdate: () => c.update(),
      }),
      gsap.to(c.target, {
        x: view.target[0],
        y: view.target[1],
        z: view.target[2],
        duration,
        ease: "power3.inOut",
        onUpdate: () => c.update(),
        onComplete: () => {
          // Distance / angle limits are applied declaratively in Scene (keeps the
          // camera inside the room). Just hand control back here.
          c.enabled = true;
          c.autoRotate = false;
        },
      }),
    ];
  };

  // Intro: spawn already zoomed in (or straight into a deep-linked room).
  useEffect(() => {
    if (!introDone || didIntro.current || !controls.current) return;
    didIntro.current = true;
    if (mode === "exterior") {
      const p = ROOM_VIEWS.exterior.pos;
      camera.position.set(p[0] * 1.16, p[1] * 1.16, p[2] * 1.16);
      flyTo("exterior", 1.7);
    } else {
      flyTo(mode, 1.1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introDone]);

  // Mode changes (under the screen flash, so a quick settle reads as a clean cut).
  useEffect(() => {
    if (!didIntro.current) return;
    flyTo(mode, 0.7);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return null;
}
