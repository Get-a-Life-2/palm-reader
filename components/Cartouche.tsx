// The ornamental ellipse, dial-tick ring, and compass cardinals that frame
// every palm rendering on the site. Lifted out of PalmTracing so the landing
// page can reuse it. Rounding the trig avoids hydration-mismatch flicker
// between Node and browser V8 builds.

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function Cartouche() {
  return (
    <svg
      viewBox="0 0 600 720"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
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
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
        const r1 = i % 5 === 0 ? 252 : 256;
        const r2 = 260;
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
