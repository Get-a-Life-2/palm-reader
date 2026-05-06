"use client";

import { useEffect, useState } from "react";

type Props = {
  state: "idle" | "tracing" | "revealed";
  onTracingComplete?: () => void;
};

const lines: { id: string; numeral: string; label: string; d: string; delay: number; len: number }[] = [
  {
    id: "heart",
    numeral: "I",
    label: "Heart Line",
    d: "M 110 220 C 180 180, 270 175, 360 200 C 410 215, 450 215, 480 200",
    delay: 0,
    len: 470,
  },
  {
    id: "head",
    numeral: "II",
    label: "Head Line",
    d: "M 130 280 C 200 270, 300 285, 400 320 C 440 335, 460 340, 470 345",
    delay: 700,
    len: 460,
  },
  {
    id: "life",
    numeral: "III",
    label: "Life Line",
    d: "M 150 230 C 130 290, 145 360, 200 440 C 220 470, 240 490, 260 500",
    delay: 1400,
    len: 480,
  },
  {
    id: "fate",
    numeral: "IV",
    label: "Fate Line",
    d: "M 320 510 C 320 460, 315 400, 325 340 C 332 290, 330 250, 325 220",
    delay: 2100,
    len: 350,
  },
];

const annotations: { id: string; x: number; y: number; numeral: string; label: string; delay: number }[] = [
  { id: "heart", x: 500, y: 196, numeral: "I", label: "Linea Mensalis", delay: 600 },
  { id: "head", x: 490, y: 350, numeral: "II", label: "Linea Cephalica", delay: 1300 },
  { id: "life", x: 270, y: 510, numeral: "III", label: "Linea Vitalis", delay: 2000 },
  { id: "fate", x: 350, y: 220, numeral: "IV", label: "Linea Saturni", delay: 2700 },
];

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
        {lines.map((l) => (
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
              ["--len" as string]: l.len,
            }}
          />
        ))}

        {/* small constellation dots at joints */}
        {revealStarted &&
          [
            [110, 220],
            [360, 200],
            [480, 200],
            [130, 280],
            [400, 320],
            [150, 230],
            [200, 440],
            [260, 500],
            [320, 510],
            [325, 220],
          ].map(([x, y], i) => (
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
        {annotations.map((a) => (
          <g
            key={a.id}
            style={{
              opacity: 0,
              animation: `fade-in 0.9s ease ${a.delay + 600}ms forwards`,
            }}
          >
            <line
              x1={a.x - 50}
              y1={a.y}
              x2={a.x - 8}
              y2={a.y}
              stroke="var(--ink-soft)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <text
              x={a.x}
              y={a.y - 4}
              fill="var(--accent)"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "14px",
              }}
            >
              {a.numeral}
            </text>
            <text
              x={a.x}
              y={a.y + 12}
              fill="var(--ink-soft)"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "10.5px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {a.label}
            </text>
          </g>
        ))}

        {/* vignette — gentle fade to bg around the cartouche */}
        <rect width="600" height="720" fill="url(#vignette)" />
      </svg>
    </div>
  );
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function Cartouche() {
  return (
    <svg
      viewBox="0 0 600 720"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      {/* Outer ornamental ellipse */}
      <ellipse
        cx="300"
        cy="360"
        rx="270"
        ry="324"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="0.6"
      />
      <ellipse
        cx="300"
        cy="360"
        rx="262"
        ry="316"
        fill="none"
        stroke="var(--rule)"
        strokeWidth="0.4"
      />
      {/* tick marks like a dial */}
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const r1 = i % 5 === 0 ? 252 : 256;
        const r2 = 260;
        // Round to avoid SSR/CSR hydration mismatches from trig precision drift
        // between Node and the browser's V8 builds.
        const x1 = round3(300 + Math.cos(a) * r1);
        const y1 = round3(360 + Math.sin(a) * r1 * 1.2);
        const x2 = round3(300 + Math.cos(a) * r2);
        const y2 = round3(360 + Math.sin(a) * r2 * 1.2);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--rule)"
            strokeWidth={i % 5 === 0 ? 0.6 : 0.3}
          />
        );
      })}
      {/* compass cardinals */}
      {(["N", "E", "S", "W"] as const).map((dir, i) => {
        const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
        const a = angles[i];
        const x = round3(300 + Math.cos(a) * 280);
        const y = round3(360 + Math.sin(a) * 336);
        return (
          <text
            key={dir}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--ink-soft)"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "12px",
            }}
          >
            {dir}
          </text>
        );
      })}
    </svg>
  );
}
