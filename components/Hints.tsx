"use client";

import { useEffect, useState } from "react";
import { IconDrag, IconTap } from "./icons";

// "Drag to look · Tap objects" — fades out after the first interaction or a timeout.
export function Hints({ visible }: { visible: boolean }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const hide = () => setGone(true);
    const t = setTimeout(hide, 7000);
    window.addEventListener("pointerdown", hide, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", hide);
    };
  }, [visible]);

  return (
    <div className="hint" style={{ opacity: visible && !gone ? 1 : 0 }}>
      <IconDrag />
      Drag to look around
      <span className="hint__dot" />
      <IconTap />
      Tap an object
    </div>
  );
}
