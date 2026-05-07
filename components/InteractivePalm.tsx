"use client";

import { Cartouche } from "./Cartouche";
import { PALM_LINES, type LineId } from "@/lib/palmLines";

type Props = {
  activeLine: LineId | null;
};

// All four lines are drawn at once — the palm is a still object on the page,
// the chart already inscribed. As the reader scrolls into a chapter, the
// corresponding line lifts in tone (opacity + stroke-weight + colour) and its
// Latin name appears in the margin. Nothing moves; only the page's attention
// shifts.

export function InteractivePalm({ activeLine }: Props) {
  return (
    <div className="relative w-full h-full">
      <Cartouche />

      <div
        className="absolute"
        style={{
          inset: "11% 14%",
          clipPath: "ellipse(50% 50% at 50% 50%)",
          opacity: 0.85,
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

      <svg
        viewBox="0 0 600 720"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="vignette-interactive" cx="50%" cy="50%" r="58%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        {PALM_LINES.map((l) => {
          const isActive = activeLine === l.id;
          return (
            <path
              key={l.id}
              d={l.d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={isActive ? 1.9 : 1.1}
              strokeLinecap="round"
              opacity={isActive ? 1 : 0.42}
              style={{
                transition:
                  "opacity 900ms var(--ease-celestial, ease)," +
                  " stroke-width 900ms var(--ease-celestial, ease)",
              }}
            />
          );
        })}

        {PALM_LINES.flatMap((l) =>
          l.endpoints.map(([x, y], i) => {
            const isActive = activeLine === l.id;
            return (
              <circle
                key={`${l.id}-${i}`}
                cx={x}
                cy={y}
                r={isActive ? 2.6 : 1.5}
                fill="var(--accent)"
                opacity={isActive ? 0.95 : 0.32}
                style={{
                  transition:
                    "opacity 900ms var(--ease-celestial, ease)," +
                    " r 900ms var(--ease-celestial, ease)",
                }}
              />
            );
          })
        )}

        {PALM_LINES.map((l) => {
          const isActive = activeLine === l.id;
          return (
            <g
              key={l.id}
              style={{
                opacity: isActive ? 1 : 0,
                transition: "opacity 700ms var(--ease-celestial, ease)",
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
          );
        })}

        <rect width="600" height="720" fill="url(#vignette-interactive)" />
      </svg>
    </div>
  );
}
