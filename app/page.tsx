"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { StarField } from "@/components/StarField";
import { MarginNote } from "@/components/MarginNote";
import { getReading } from "@/lib/reading";
import { setPendingFile } from "@/lib/pendingFile";

export default function Home() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const reading = getReading();

  function handleFile(file: File | null) {
    if (!file) return;
    setPendingFile(file);
    router.push("/reading");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <StarField />

      <div className="relative z-10">
        <Header />

        {/* HERO SPREAD */}
        <section className="relative px-6 md:px-10 lg:px-14 pt-6 pb-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left column: title block */}
            <div className="lg:col-span-5">
              <div className="marginalia mb-5">{reading.folio}</div>
              <h1
                className="text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98] tracking-[-0.015em] text-[var(--ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                An atlas
                <br />
                of the <em className="italic" style={{ color: "var(--accent)" }}>hand,</em>
                <br />
                read by stars.
              </h1>

              <div className="celestial-rule celestial-rule--accent w-32 my-8" />

              <p
                className="max-w-[44ch] text-[var(--ink-soft)]"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.18rem",
                  lineHeight: 1.65,
                }}
              >
                Hold up your dominant hand to the camera, fingers a little spread, palm
                toward the lens. We will trace its lines as a chart, and translate the
                chart into five short chapters.
              </p>

              <div className="mt-10 space-y-4">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="group inline-flex items-center gap-3 pl-5 pr-7 py-3.5 border border-[var(--accent)] text-[var(--ink)] hover:bg-[color-mix(in_oklch,var(--accent)_8%,transparent)] transition-colors duration-500"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.06em",
                  }}
                >
                  <span className="numeral">§</span>
                  <span className="text-[1.05rem]">Submit your palm</span>
                  <Arrow />
                </button>
                <div className="marginalia mt-3 max-w-[36ch]">
                  A still photograph in good light. The chart is drawn, the
                  lines are named, and translated into five short chapters.
                </div>
              </div>
            </div>

            {/* Right column: cartouche */}
            <div className="lg:col-span-7">
              <div className="relative">
                <IdleCartouche onPick={() => fileRef.current?.click()} />

                {/* Marginalia under cartouche */}
                <div className="mt-6 grid grid-cols-3 gap-4 max-w-[560px] mx-auto">
                  <MarginNote n="i" label="Linea Mensalis" hint="heart" />
                  <MarginNote n="ii" label="Linea Cephalica" hint="head" />
                  <MarginNote n="iii" label="Linea Vitalis" hint="life" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function IdleCartouche({ onPick }: { onPick: () => void }) {
  return (
    <button
      onClick={onPick}
      className="group relative block w-full aspect-[5/6] max-w-[560px] mx-auto cursor-pointer"
      aria-label="Submit a photograph of your palm"
    >
      {/* The specimen plate — a labeled palm chart, treated as an etched manuscript figure */}
      <div
        className="absolute"
        style={{
          inset: "11% 14%",
          clipPath: "ellipse(50% 50% at 50% 50%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/palm.png"
          alt=""
          aria-hidden="true"
          className="palm-plate w-full h-full object-contain transition-all duration-700 group-hover:scale-[1.02]"
        />
      </div>

      <svg viewBox="0 0 600 720" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <ellipse cx="300" cy="360" rx="270" ry="324" fill="none" stroke="var(--rule)" strokeWidth="0.6" />
        <ellipse cx="300" cy="360" rx="262" ry="316" fill="none" stroke="var(--rule)" strokeWidth="0.4" />
        <ellipse
          cx="300"
          cy="360"
          rx="240"
          ry="294"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.7"
          strokeDasharray="4 6"
          className="transition-all duration-700 opacity-50 group-hover:opacity-95"
        />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const r1 = i % 5 === 0 ? 252 : 256;
          const r2 = 260;
          const x1 = 300 + Math.cos(a) * r1;
          const y1 = 360 + Math.sin(a) * r1 * 1.2;
          const x2 = 300 + Math.cos(a) * r2;
          const y2 = 360 + Math.sin(a) * r2 * 1.2;
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
        {/* north tick */}
        <text
          x="300"
          y="48"
          textAnchor="middle"
          fill="var(--accent)"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "13px" }}
        >
          ✦
        </text>
        {/* specimen-plate caption (top) */}
        <text
          x="300"
          y="86"
          textAnchor="middle"
          fill="var(--ink-soft)"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "10.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Specimen Plate · Fig. ⓪
        </text>
        {/* call-to-action chip (bottom) */}
        <g
          transform="translate(300, 670)"
          className="transition-opacity duration-700"
        >
          <line x1="-90" y1="0" x2="-30" y2="0" stroke="var(--accent)" strokeWidth="0.6" />
          <line x1="30" y1="0" x2="90" y2="0" stroke="var(--accent)" strokeWidth="0.6" />
          <text
            textAnchor="middle"
            y="4"
            fill="var(--accent)"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "13px",
              letterSpacing: "0.04em",
            }}
          >
            Tap to read your own
          </text>
        </g>
      </svg>
    </button>
  );
}

function Arrow() {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
      <line x1="0" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="0.8" />
      <polyline points="14,1 20,5 14,9" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
