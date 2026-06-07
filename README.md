# Plattnericus · Hub

An interactive **low-poly 3D island** that doubles as my project hub and portfolio.
A floating island drifts in the sky with a cosy cabin in the back corner and a
signpost out front. Follow the signpost inside to a **programming room** (every
object on the desk is a real project) and a **portfolio room** (about me, my stack,
where to find me). Built to feel handmade, run fast, and work everywhere.

🔗 **Live:** https://plattnericus.dev

![Plattnericus Hub](public/pfp.jpg)

## Highlights
- 🏝️ Real Sketchfab **floating-island** model, compressed 70 MB → ~2 MB (Draco + WebP), look intact.
- 🏠 Enterable cabin with two hand-built low-poly rooms; drag to look, tap objects to open them.
- 🧭 Wooden **signpost** that walks you into *My Projects* / *Portfolio* (also deep-linkable: `#projects`, `#portfolio`).
- 🍎 Apple-minimal UI: glassy chrome, a clean loading screen, smooth GSAP scene cuts.
- 🔊 Synthesized hover/click SFX + optional ambient music (off by default).
- ♿ Automatic **2D fallback** for mobile / weak GPUs / reduced-motion, with real crawlable links.
- 🔎 SEO-ready: metadata, Open Graph, JSON-LD (`Person` + `ItemList`), `robots.txt`, `sitemap.xml`.

## Tech stack
Next.js (App Router, static export) · React · TypeScript · three.js ·
@react-three/fiber · @react-three/drei · @react-three/postprocessing · GSAP ·
Howler · detect-gpu.

## Local development
```bash
npm install
npm run dev          # http://localhost:3000
```

## Build & deploy
Static export (works on GitHub Pages — keeps the `plattnericus.dev` CNAME):
```bash
npm run build        # outputs ./out  (includes CNAME + 404.html)
npx serve out        # preview the production build locally
```

## Assets
3D models are optimized with `@gltf-transform/cli`. To re-optimize a raw download:
```bash
npx gltf-transform optimize in.glb out.glb \
  --palette false --join false --weld false \
  --compress draco --texture-compress webp --texture-size 2048
```
See [`public/CREDITS.md`](public/CREDITS.md) for model sources and licenses.

## Project map
| Area | File |
|---|---|
| Project & portfolio data | `lib/projects.ts` |
| Scene composition | `components/Scene.tsx` |
| Exterior (island + cabin + signpost) | `components/ExteriorStage.tsx`, `components/glb.tsx`, `components/Signpost.tsx` |
| Interior rooms | `components/InteriorStage.tsx`, `components/House.tsx`, `components/DevRoom.tsx`, `components/PortfolioRoom.tsx` |
| Low-poly project objects | `components/models.tsx`, `components/ProjectObject.tsx` |
| Camera / loading / UI | `components/CameraRig.tsx`, `components/LoadingScreen.tsx`, `components/Hud.tsx`, `components/RoomNav.tsx`, `components/Overlay.tsx` |
| 2D fallback | `components/FallbackList.tsx`, `lib/useDeviceTier.ts` |

---
© Plattnericus · plattnericus.dev
