"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { StarField } from "@/components/StarField";
import { PalmTracing } from "@/components/PalmTracing";
import { ChapterSpread } from "@/components/ChapterSpread";
import { MarginNote } from "@/components/MarginNote";
import { getReading, type Reading } from "@/lib/reading";
import { consumePendingFile } from "@/lib/pendingFile";

type Stage = "tracing" | "revealed";

export default function ReadingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("tracing");
  const [tracingDone, setTracingDone] = useState(false);
  const [liveReading, setLiveReading] = useState<Reading | null>(null);
  const [readingError, setReadingError] = useState<string | null>(null);
  const readingRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  const fallbackReading = getReading();
  const reading = liveReading ?? fallbackReading;

  // Kick off the API call once, on mount. The ref guard makes this safe under
  // React strict-mode's double-invoked effects.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Dev-only design preview: /reading?mock=1 skips the upload + API and
    // renders the fallback reading. Stripped from prod by NODE_ENV inlining.
    if (
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).get("mock") === "1"
    ) {
      setLiveReading(getReading());
      return;
    }

    const file = consumePendingFile();
    if (!file) {
      // Direct hit on /reading (refresh, bookmark, etc.) — no file in flight.
      router.replace("/");
      return;
    }

    (async () => {
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
    })();
  }, [router]);

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

  function reset() {
    router.push("/");
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

              <div className="mt-10">
                <button
                  onClick={reset}
                  className="marginalia hover:text-[var(--ink)] transition-colors"
                >
                  ← Begin again with another hand
                </button>
              </div>
            </div>

            {/* Right column: cartouche */}
            <div className="lg:col-span-7">
              <div className="relative">
                <PalmTracing
                  state={stage}
                  onTracingComplete={() => setTracingDone(true)}
                />

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

                {readingError && (
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
                {i < reading.chapters.length - 1 && <Divider />}
              </div>
            ))}
            <Colophon text={reading.colophon} onAgain={reset} />
          </div>
        )}
      </div>
    </main>
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
