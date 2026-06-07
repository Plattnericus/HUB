# Credits & licenses

## 3D models
- **Floating Island** — sourced from Sketchfab
  (https://sketchfab.com/3d-models/floating-island-eec0165c5d7e41f0bbd10b3f96051cfd).
  Used as `island.opt.glb` (Draco-compressed, WebP textures). Please retain the
  original author's attribution per the model's Sketchfab license (typically CC-BY).
- **Cabin / house** — sourced from Sketchfab. Used as `house.opt.glb`
  (Draco-compressed, WebP textures). Attribution per its Sketchfab license.

> Original full-resolution downloads were optimized with `@gltf-transform/cli`
> (`optimize --compress draco --texture-compress webp`). Geometry and look are
> preserved; only file size was reduced for the web.

## Other objects
All other low-poly objects (computer, server rack, console, phone, tray, mailbox,
GitHub cat, signpost, furniture, etc.) are **original geometry** built procedurally
in React Three Fiber — no third-party assets, no attribution required.

## Audio
- Interaction sounds (hover / click / close) are **synthesized at runtime** with the
  Web Audio API — no audio files required.
- Ambient music is optional: drop a CC0 loop at `public/audio/ambient.mp3` to enable
  it (the toggle is wired up but silent if the file is absent).

## Libraries
Next.js · React · three.js · @react-three/fiber · @react-three/drei ·
@react-three/postprocessing · GSAP · Howler · detect-gpu.
