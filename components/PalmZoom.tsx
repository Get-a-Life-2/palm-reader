"use client";

import { useEffect, useRef, useState } from "react";

const LINE_DEFS = [
  { id: "heart", d: "M 110 220 C 180 180, 270 175, 360 200 C 410 215, 450 215, 480 200" },
  { id: "head",  d: "M 130 280 C 200 270, 300 285, 400 320 C 440 335, 460 340, 470 345" },
  { id: "life",  d: "M 150 230 C 130 290, 145 360, 200 440 C 220 470, 240 490, 260 500" },
  { id: "fate",  d: "M 320 510 C 320 460, 315 400, 325 340 C 332 290, 330 250, 325 220" },
];

// (minX, minY, width, height) in SVG coordinate space (canvas is 600×720)
const CHAPTER_REGIONS: [number, number, number, number][] = [
  [50,  120, 500, 240],   // I  — heart line, upper palm band
  [50,  210, 490, 220],   // II — head line, middle band
  [50,  148, 292, 402],   // III — life arc, left side
  [155, 148, 288, 402],   // IV — fate line, centre vertical
  [80,  128, 440, 520],   // V  — full hand / mounts
];
const OVERVIEW: [number, number, number, number] = [20, 78, 560, 602];

// Key points along each line for the constellation-dot reveal
const DOTS: [number, number][][] = [
  [[110, 220], [270, 175], [360, 200], [480, 200]],
  [[130, 280], [300, 285], [400, 320], [470, 345]],
  [[150, 230], [145, 360], [200, 440], [260, 500]],
  [[325, 220], [325, 340], [320, 460], [320, 510]],
  [[110, 220], [130, 280], [150, 230], [325, 340], [320, 510]],
];

type VB = [number, number, number, number];

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function PalmZoom({ activeChapter }: { activeChapter: number | null }) {
  const [vb, setVb] = useState<VB>(OVERVIEW);
  const curRef  = useRef<VB>(OVERVIEW);
  const rafRef  = useRef(0);
  const animRef = useRef({ start: OVERVIEW as VB, t0: 0, target: OVERVIEW as VB });

  useEffect(() => {
    const target = activeChapter !== null ? CHAPTER_REGIONS[activeChapter] : OVERVIEW;
    cancelAnimationFrame(rafRef.current);
    animRef.current = { start: [...curRef.current] as VB, t0: performance.now(), target };
    const dur = 1300;

    function tick(now: number) {
      const { start, t0, target } = animRef.current;
      const p = Math.min((now - t0) / dur, 1);
      const e = easeOutExpo(p);
      const next = start.map((s, i) => s + (target[i] - s) * e) as VB;
      curRef.current = next;
      setVb(next);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeChapter]);

  const isOverview  = activeChapter === null;
  const isAllLines  = activeChapter === 4 || isOverview;
  const dialOpacity = isOverview ? 0.38 : 0.10;

  return (
    <div
      className="relative w-full h-full"
      style={{
        maskImage: "radial-gradient(ellipse 88% 88% at 50% 50%, black 45%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 88% 88% at 50% 50%, black 45%, transparent 100%)",
      }}
    >
      <svg
        viewBox={vb.join(" ")}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="pz-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pz-halo" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>

        {/* Compass dial — naturally scrolls out of frame as we zoom into palm lines */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a  = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const r1 = i % 5 === 0 ? 252 : 256;
          const x1 = 300 + Math.cos(a) * r1;
          const y1 = 360 + Math.sin(a) * r1 * 1.2;
          const x2 = 300 + Math.cos(a) * 260;
          const y2 = 360 + Math.sin(a) * 260 * 1.2;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--rule)"
              strokeWidth={i % 5 === 0 ? 0.5 : 0.25}
              opacity={dialOpacity}
              style={{ transition: "opacity 1.2s ease" }}
            />
          );
        })}
        <ellipse cx="300" cy="360" rx="270" ry="324"
          fill="none" stroke="var(--rule)" strokeWidth="0.5"
          opacity={dialOpacity} style={{ transition: "opacity 1.2s ease" }} />
        <ellipse cx="300" cy="360" rx="262" ry="316"
          fill="none" stroke="var(--rule)" strokeWidth="0.3"
          opacity={dialOpacity * 0.6} style={{ transition: "opacity 1.2s ease" }} />

        {/* Cardinal letters */}
        {(["N", "E", "S", "W"] as const).map((dir, i) => {
          const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
          const a = angles[i];
          return (
            <text
              key={dir}
              x={300 + Math.cos(a) * 280}
              y={360 + Math.sin(a) * 336}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--ink-soft)"
              opacity={dialOpacity}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "12px",
                transition: "opacity 1.2s ease",
              }}
            >
              {dir}
            </text>
          );
        })}

        {/* Hand silhouette */}
        <path
          d="M 180 540 C 160 470, 150 400, 158 330 C 162 290, 175 270, 195 270 C 210 270, 218 285, 220 305 L 222 200 C 222 178, 232 168, 246 168 C 260 168, 268 180, 268 198 L 268 270 L 280 198 C 280 178, 292 168, 306 168 C 320 168, 328 180, 328 198 L 328 280 L 342 220 C 342 200, 354 192, 366 196 C 378 200, 384 212, 380 230 L 366 310 L 396 270 C 408 256, 420 258, 426 270 C 432 282, 426 296, 416 308 L 380 372 C 370 396, 360 432, 360 470 C 360 510, 350 540, 320 558 C 290 574, 240 574, 210 564 C 195 558, 188 552, 180 540 Z"
          fill="none"
          stroke="var(--ink-soft)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.42"
        />

        {/* Inactive / background lines */}
        {LINE_DEFS.map((l, i) => {
          const isActive = activeChapter === i;
          const op = isActive ? 0 : isAllLines ? 0.44 : 0.07;
          return (
            <path
              key={l.id}
              d={l.d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity={op}
              style={{ transition: "opacity 0.9s ease" }}
            />
          );
        })}

        {/* Active line: soft halo */}
        {activeChapter !== null && activeChapter < 4 && (
          <path
            d={LINE_DEFS[activeChapter].d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.09"
            filter="url(#pz-halo)"
          />
        )}

        {/* Active line: crisp with glow */}
        {activeChapter !== null && activeChapter < 4 && (
          <path
            d={LINE_DEFS[activeChapter].d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="1"
            filter="url(#pz-glow)"
          />
        )}

        {/* All lines bright for mounts chapter */}
        {activeChapter === 4 &&
          LINE_DEFS.map((l) => (
            <path
              key={`bright-${l.id}`}
              d={l.d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
              filter="url(#pz-glow)"
            />
          ))}

        {/* Constellation dots — keyed on activeChapter so they re-animate on chapter change */}
        {activeChapter !== null &&
          DOTS[activeChapter]?.map(([x, y], i) => (
            <circle
              key={`dot-${activeChapter}-${i}`}
              cx={x}
              cy={y}
              r="2.6"
              fill="var(--accent)"
              opacity="0"
              style={{ animation: `fade-in 0.5s ease ${250 + i * 110}ms forwards` }}
            />
          ))}
      </svg>
    </div>
  );
}
