"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { StarField } from "@/components/StarField";
import { PalmTracing } from "@/components/PalmTracing";
import { ChapterSpread } from "@/components/ChapterSpread";
import { getReading, type Reading } from "@/lib/reading";

type Stage = "idle" | "tracing" | "revealed";

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [tracingDone, setTracingDone] = useState(false);
  const [liveReading, setLiveReading] = useState<Reading | null>(null);
  const [readingError, setReadingError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const readingRef = useRef<HTMLDivElement | null>(null);

  const fallbackReading = getReading();
  const reading = liveReading ?? fallbackReading;

  async function handleFile(file: File | null) {
    if (!file) return;
    setStage("tracing");
    setTracingDone(false);
    setLiveReading(null);
    setReadingError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/read", { method: "POST", body: formData });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as Reading;
      setLiveReading(data);
    } catch (e) {
      setReadingError(e instanceof Error ? e.message : "The chart could not be read.");
    }
  }

  function reset() {
    setStage("idle");
    setTracingDone(false);
    setLiveReading(null);
    setReadingError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Reveal only when the tracing animation has finished AND the live reading has arrived.
  useEffect(() => {
    if (stage === "tracing" && tracingDone && liveReading) {
      setStage("revealed");
    }
  }, [stage, tracingDone, liveReading]);

  useEffect(() => {
    if (stage === "revealed" && readingRef.current) {
      const t = setTimeout(() => {
        readingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const waitingOnReading = stage === "tracing" && tracingDone && !liveReading && !readingError;

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

              {/* Upload affordance */}
              {stage === "idle" && (
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
              )}

              {stage !== "idle" && (
                <div className="mt-10">
                  <button
                    onClick={reset}
                    className="marginalia hover:text-[var(--ink)] transition-colors"
                  >
                    ← Begin again with another hand
                  </button>
                </div>
              )}
            </div>

            {/* Right column: cartouche */}
            <div className="lg:col-span-7">
              <div className="relative">
                {stage === "idle" && (
                  <IdleCartouche
                    onPick={() => fileRef.current?.click()}
                  />
                )}
                {stage !== "idle" && (
                  <PalmTracing
                    state={stage}
                    onTracingComplete={() => setTracingDone(true)}
                  />
                )}

                {/* Marginalia under cartouche */}
                <div className="mt-6 grid grid-cols-3 gap-4 max-w-[560px] mx-auto">
                  <MarginNote n="i" label="Linea Mensalis" hint="heart" />
                  <MarginNote n="ii" label="Linea Cephalica" hint="head" />
                  <MarginNote n="iii" label="Linea Vitalis" hint="life" />
                </div>

                {waitingOnReading && (
                  <div className="mt-6 flex items-center justify-center">
                    <div className="marginalia inline-flex items-center gap-3">
                      <span className="celestial-rule w-10" />
                      Consulting the chart
                      <span className="inline-flex gap-1" aria-hidden="true">
                        <Dot delay={0} />
                        <Dot delay={180} />
                        <Dot delay={360} />
                      </span>
                      <span className="celestial-rule w-10" />
                    </div>
                  </div>
                )}

                {readingError && stage !== "idle" && (
                  <div className="mt-6 max-w-[44ch] mx-auto text-center">
                    <div className="marginalia mb-2">An interruption</div>
                    <p
                      className="italic text-[var(--ink-soft)]"
                      style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.6 }}
                    >
                      The chart could not be read. {readingError}
                    </p>
                    <button
                      onClick={reset}
                      className="mt-4 marginalia hover:text-[var(--ink)] transition-colors"
                    >
                      ← Try another photograph
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* READING CHAPTERS */}
        {stage === "revealed" && (
          <div ref={readingRef} className="relative">
            <Preamble text={reading.preamble} />
            <div className="celestial-rule mx-auto max-w-3xl" />
            {reading.chapters.map((c, i) => (
              <div key={c.numeral}>
                <ChapterSpread chapter={c} indexOffset={i} />
                {i < reading.chapters.length - 1 && (
                  <Divider />
                )}
              </div>
            ))}
            <Colophon text={reading.colophon} onAgain={reset} />
          </div>
        )}
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

function MarginNote({ n, label, hint }: { n: string; label: string; hint: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="numeral">{n}</span>
      <span
        className="text-[0.92rem] mt-1"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--ink)" }}
      >
        {label}
      </span>
      <span className="marginalia text-[0.68rem]">{hint}</span>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block w-1 h-1 rounded-full bg-[var(--accent)]"
      style={{
        animation: `fade-in 1s ease ${delay}ms infinite alternate`,
        opacity: 0.3,
      }}
    />
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

function Preamble({ text }: { text: string }) {
  return (
    <section className="px-6 md:px-12 lg:px-20 pt-24 pb-10">
      <div className="max-w-[44rem] mx-auto text-center">
        <div className="marginalia mb-3">Preamble</div>
        <p
          className="italic"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.32rem",
            lineHeight: 1.6,
            color: "var(--ink)",
          }}
        >
          {text}
        </p>
        <div className="celestial-rule celestial-rule--accent w-32 mx-auto mt-10" />
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center my-2">
      <svg width="120" height="22" viewBox="0 0 120 22" aria-hidden="true">
        <line x1="0" y1="11" x2="48" y2="11" stroke="var(--rule)" strokeWidth="0.6" />
        <line x1="72" y1="11" x2="120" y2="11" stroke="var(--rule)" strokeWidth="0.6" />
        <text
          x="60"
          y="16"
          textAnchor="middle"
          fill="var(--accent)"
          style={{ fontFamily: "var(--font-display)", fontSize: "14px" }}
        >
          ✦
        </text>
      </svg>
    </div>
  );
}

function Colophon({ text, onAgain }: { text: string; onAgain: () => void }) {
  return (
    <section className="px-6 md:px-12 lg:px-20 pt-12 pb-28">
      <div className="max-w-[40rem] mx-auto text-center">
        <div className="celestial-rule celestial-rule--accent w-24 mx-auto mb-8" />
        <div className="marginalia mb-3">Colophon</div>
        <p
          className="italic text-[var(--ink-soft)]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.1rem",
            lineHeight: 1.7,
          }}
        >
          {text}
        </p>
        <button
          onClick={onAgain}
          className="mt-10 inline-flex items-center gap-3 px-5 py-3 border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors duration-500"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
        >
          <span className="numeral">§</span>
          Read another hand
        </button>
      </div>
    </section>
  );
}
