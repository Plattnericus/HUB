"use client";

import { useEffect, useState } from "react";

export interface DeviceTier {
  ready: boolean;
  // True when the device can comfortably handle the full 3D experience.
  can3D: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
}

// Decides whether to render the 3D island or the 2D fallback list.
// Heavy GPU probing (detect-gpu) is loaded lazily to keep the entry bundle small.
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>({
    ready: false,
    can3D: true,
    isMobile: false,
    reducedMotion: false,
  });

  useEffect(() => {
    let cancelled = false;

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const isMobile =
      window.matchMedia?.("(max-width: 760px)").matches ||
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const hasWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();

    async function probe() {
      let can3D = hasWebGL && !reducedMotion;
      if (can3D) {
        try {
          const { getGPUTier } = await import("detect-gpu");
          const gpu = await getGPUTier();
          // tier 0 = unusable, tier 1 = weak. Keep 3D for 2+ (and mobile tier 2 ok).
          if (gpu.tier < 1 || (gpu.tier < 2 && isMobile)) can3D = false;
        } catch {
          /* keep heuristic result */
        }
      }
      if (!cancelled) setTier({ ready: true, can3D, isMobile, reducedMotion });
    }

    probe();
    return () => {
      cancelled = true;
    };
  }, []);

  return tier;
}
