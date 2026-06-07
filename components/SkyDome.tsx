"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Color, ShaderMaterial, type Group } from "three";

// A soft vertical-gradient sky dome with drifting 2D clouds painted into it
// (no external HDR → works offline / static export).
export function SkyDome() {
  const matRef = useRef<ShaderMaterial>(null);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          top: { value: new Color("#2f86e0") },
          mid: { value: new Color("#6fb2ea") },
          bottom: { value: new Color("#cfe7fb") },
        },
        vertexShader: /* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vPos;
          uniform float uTime;
          uniform vec3 top;
          uniform vec3 mid;
          uniform vec3 bottom;

          float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
          float noise(vec2 p){
            vec2 i = floor(p), f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i), b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }
          float fbm(vec2 p){
            float v = 0.0, a = 0.5;
            for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
            return v;
          }

          void main() {
            vec3 d = normalize(vPos);
            float h = d.y;
            vec3 col = mix(bottom, mid, smoothstep(-0.15, 0.3, h));
            col = mix(col, top, smoothstep(0.25, 0.8, h));

            // 2D clouds painted across the dome
            if (h > 0.01) {
              vec2 uv = d.xz / (h + 0.22) * 1.0;
              uv += vec2(uTime * 0.006, uTime * 0.002);
              float c = fbm(uv * 1.1);
              c = smoothstep(0.42, 0.74, c);
              float fade = smoothstep(0.015, 0.12, h) * smoothstep(1.1, 0.35, h);
              col = mix(col, vec3(1.0), clamp(c * fade, 0.0, 1.0) * 0.95);
            }
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh scale={[80, 80, 80]}>
      <sphereGeometry args={[1, 24, 16]} />
      <primitive ref={matRef} object={material} attach="material" />
    </mesh>
  );
}

// A few distant low-poly clouds for parallax depth (kept subtle alongside the
// painted sky clouds).
export function SkyClouds() {
  const root = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (root.current) root.current.rotation.y = clock.elapsedTime * 0.008;
  });
  const clouds: [number, number, number, number][] = [
    [-18, 9, -12, 1.7],
    [20, 12, -8, 2.0],
    [-10, 14, 16, 1.4],
  ];
  return (
    <group ref={root}>
      {clouds.map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={s}>
          {[
            [0, 0, 0, 0.95],
            [0.95, -0.1, 0.1, 0.7],
            [-0.95, -0.08, -0.05, 0.72],
            [0.3, 0.32, 0, 0.58],
          ].map(([px, py, pz, r], j) => (
            <mesh key={j} position={[px, py, pz]}>
              <icosahedronGeometry args={[r, 2]} />
              <meshStandardMaterial color="#ffffff" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
