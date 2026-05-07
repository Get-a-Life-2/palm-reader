"use client";

import { useEffect, useState } from "react";
import { Cartouche } from "./Cartouche";
import { PALM_LINES } from "@/lib/palmLines";

type Props = {
  state: "idle" | "tracing" | "revealed";
  onTracingComplete?: () => void;
};

export function PalmTracing({ state, onTracingComplete }: Props) {
  const [revealStarted, setRevealStarted] = useState(false);

  useEffect(() => {
    if (state === "tracing") {
      setRevealStarted(true);
      const t = setTimeout(() => {
        onTracingComplete?.();
      }, 3800);
      return () => clearTimeout(t);
    }
  }, [state, onTracingComplete]);

  return (
    <div className="relative w-full aspect-[5/6] max-w-[560px] mx-auto">
      {/* Outer cartouche frame */}
      <Cartouche />

      {/* Specimen plate — same etched palm as the idle cartouche */}
      <div
        className="absolute"
        style={{
          inset: "11% 14%",
          clipPath: "ellipse(50% 50% at 50% 50%)",
          opacity: revealStarted ? 0.55 : 0.9,
          transition: "opacity 1.6s var(--ease-celestial, ease)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/palm.png"
          alt=""
          aria-hidden="true"
          className="palm-plate w-full h-full object-contain"
        />
      </div>

      {/* Etching SVG layer */}
      <svg
        viewBox="0 0 600 720"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="58%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        {/* Palm lines — drawn in stagger */}
        {PALM_LINES.map((l) => (
          <path
            key={l.id}
            d={l.d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray={l.len}
            strokeDashoffset={revealStarted ? 0 : l.len}
            style={{
              transition: `stroke-dashoffset 1.4s var(--ease-celestial, ease) ${l.delay}ms, opacity 0.6s ease ${l.delay}ms`,
              opacity: revealStarted ? 1 : 0,
            }}
          />
        ))}

        {/* small constellation dots at joints */}
        {revealStarted &&
          PALM_LINES.flatMap((l) => l.endpoints).map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="var(--accent)"
              opacity="0"
              style={{
                animation: `fade-in 0.6s ease ${1000 + i * 120}ms forwards`,
              }}
            />
          ))}

        {/* annotation lead-lines and labels */}
        {PALM_LINES.map((l) => (
          <g
            key={l.id}
            style={{
              opacity: 0,
              animation: `fade-in 0.9s ease ${l.delay + 1200}ms forwards`,
            }}
          >
            <line
              x1={l.annotation.x - 50}
              y1={l.annotation.y}
              x2={l.annotation.x - 8}
              y2={l.annotation.y}
              stroke="var(--ink-soft)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <text
              x={l.annotation.x}
              y={l.annotation.y - 4}
              fill="var(--accent)"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "14px",
              }}
            >
              {l.numeral}
            </text>
            <text
              x={l.annotation.x}
              y={l.annotation.y + 12}
              fill="var(--ink-soft)"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "10.5px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {l.latin}
            </text>
          </g>
        ))}

        {/* vignette — gentle fade to bg around the cartouche */}
        <rect width="600" height="720" fill="url(#vignette)" />
      </svg>
    </div>
  );
}
