"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

// Subtle bloom (makes the glowing screens pop) + a gentle vignette.
export function PostFX() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.32}
        luminanceThreshold={0.95}
        luminanceSmoothing={0.15}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.32} darkness={0.45} />
    </EffectComposer>
  );
}
