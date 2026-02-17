"use client";

import { useEffect, useRef, useState } from "react";

export function FPSCounter() {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const updateFPS = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now >= lastTimeRef.current + 1000) {
        const currentFPS = Math.round(
          (frameCountRef.current * 1000) / (now - lastTimeRef.current),
        );
        setFps(currentFPS);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(updateFPS);
    };

    rafIdRef.current = requestAnimationFrame(updateFPS);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] pointer-events-none"
      aria-hidden="true"
    >
      <div className="rounded-md border border-white/20 bg-black/80 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/60">FPS</span>
          <span
            className={`text-lg font-bold tabular-nums ${
              fps >= 55
                ? "text-green-400"
                : fps >= 30
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {fps}
          </span>
        </div>
      </div>
    </div>
  );
}
