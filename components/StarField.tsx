"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  brightness: number;
};

export function StarField({ density = 0.00018 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor(w * h * density);
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 0.9 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0006 + Math.random() * 0.0014,
          brightness: 0.35 + Math.random() * 0.65,
        });
      }
      starsRef.current = stars;
    }

    function readVar(name: string, fallback: string) {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    }

    function frame(t: number) {
      if (!canvas || !ctx) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const star = readVar("--star", "rgba(40,30,80,1)");
      const glow = readVar("--star-glow", "rgba(180,140,80,1)");

      for (const s of starsRef.current) {
        const flicker = reduced ? 0.7 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        const alpha = s.brightness * flicker;

        ctx.beginPath();
        ctx.fillStyle = star;
        ctx.globalAlpha = alpha * 0.85;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 0.7) {
          ctx.beginPath();
          ctx.fillStyle = glow;
          ctx.globalAlpha = alpha * 0.18;
          ctx.arc(s.x, s.y, s.r * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [density]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Slow color field, two layered radial gradients drifting in opposing directions */}
      <div
        className="absolute -inset-[20%]"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 30%, color-mix(in oklch, var(--field-b) 70%, transparent) 0%, transparent 70%)",
          animation: "drift-a 38s var(--ease-celestial, ease) infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute -inset-[20%]"
        style={{
          background:
            "radial-gradient(55% 45% at 75% 65%, color-mix(in oklch, var(--field-c) 80%, transparent) 0%, transparent 75%)",
          animation: "drift-b 52s var(--ease-celestial, ease) infinite",
          willChange: "transform",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
