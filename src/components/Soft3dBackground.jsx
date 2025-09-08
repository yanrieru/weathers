// src/components/Soft3DBackground.jsx
import { useRef } from "react";

export default function Soft3DBackground({ children }) {
  const rootRef = useRef(null);

  function handleMove(e) {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1

    const ry = (x - 0.5) * 14; // rotateY
    const rx = (y - 0.5) * -10; // rotateX

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);

    // parallax blobs
    const blobs = el.querySelectorAll(".blob");
    blobs.forEach((b, i) => {
      const depth = (i + 1) * 18; // tweak depth multiplier
      const bx = (x - 0.5) * depth * -1;
      const by = (y - 0.5) * depth * -1;
      b.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
    });
  }

  function handleLeave() {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.querySelectorAll(".blob").forEach((b) => (b.style.transform = ""));
  }

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="soft-3d-root relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-200 via-indigo-200 to-indigo-400"
      aria-hidden="true"
    >
      {/* Blobs (background layer) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="grain"></div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between items-center p-6 pt-[100px]">
        {children}
      </div>
    </div>
  );
}
