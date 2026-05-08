"use client";

import { useEffect, useRef, useState } from "react";
import type { Reading, Chapter } from "@/lib/reading";
import { PalmZoom } from "./PalmZoom";

export function ScrollReading({ reading, onAgain }: { reading: Reading; onAgain: () => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRefs  = useRef<(HTMLElement | null)[]>([]);
  const preambleRef  = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    if (preambleRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(null); },
        { threshold: 0.3 }
      );
      obs.observe(preambleRef.current);
      observers.push(obs);
    }

    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  function scrollToChapter(i: number) {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div>
      {/* ── Preamble ── */}
      <section
        ref={(el) => { preambleRef.current = el; }}
        className="min-h-[55vh] flex items-center justify-center px-8 py-28 text-center"
      >
        <div className="max-w-[44rem]">
          <div className="marginalia mb-4">Preamble</div>
          <p
            className="italic"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.18rem, 2.4vw, 1.5rem)",
              lineHeight: 1.72,
              color: "var(--ink)",
            }}
          >
            {reading.preamble}
          </p>
          <div className="celestial-rule celestial-rule--accent w-24 mx-auto mt-10" />
          <p
            className="marginalia mt-5"
            style={{ animation: "twinkle 2.8s ease infinite" }}
          >
            ↓ &ensp; scroll to read each line
          </p>
        </div>
      </section>

      {/* ── Main scroll layout ── */}
      <div className="relative lg:flex">

        {/* Sticky palm panel — desktop only */}
        <div className="hidden lg:block w-[46%] shrink-0">
          <div className="sticky top-0 h-screen flex items-center justify-center py-14 px-10">
            <PalmZoom activeChapter={activeIndex} />
          </div>
        </div>

        {/* Scrollable chapter sections */}
        <div className="w-full lg:w-[54%]">
          {reading.chapters.map((chapter, i) => (
            <ChapterSection
              key={chapter.numeral}
              chapter={chapter}
              chapterIndex={i}
              isActive={activeIndex === i}
              setRef={(el) => { sectionRefs.current[i] = el; }}
            />
          ))}
        </div>
      </div>

      {/* ── Colophon ── */}
      <section className="px-8 md:px-16 pt-20 pb-40 text-center">
        <div className="max-w-[38rem] mx-auto">
          <div className="celestial-rule celestial-rule--accent w-20 mx-auto mb-10" />
          <div className="marginalia mb-3">Colophon</div>
          <p
            className="italic text-[var(--ink-soft)]"
            style={{ fontFamily: "var(--font-body)", fontSize: "1.06rem", lineHeight: 1.78 }}
          >
            {reading.colophon}
          </p>
          <button
            onClick={onAgain}
            className="mt-12 inline-flex items-center gap-3 px-6 py-3.5 border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--accent)] transition-colors duration-500"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
          >
            <span className="numeral">§</span>
            Read another hand
          </button>
        </div>
      </section>

      {/* ── Progress dots (fixed, desktop) ── */}
      <ProgressDots
        total={reading.chapters.length}
        active={activeIndex}
        onDotClick={scrollToChapter}
      />
    </div>
  );
}

// ─────────────────────────────────────────────

function ChapterSection({
  chapter,
  chapterIndex,
  isActive,
  setRef,
}: {
  chapter: Chapter;
  chapterIndex: number;
  isActive: boolean;
  setRef: (el: HTMLElement | null) => void;
}) {
  return (
    <section
      ref={setRef}
      className="relative min-h-screen flex flex-col justify-center px-8 md:px-14 py-28 overflow-hidden"
    >
      {/* Giant watermark numeral */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute leading-none"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(14rem, 28vw, 24rem)",
          color: "var(--accent)",
          opacity: isActive ? 0.055 : 0.018,
          transition: "opacity 1s ease",
          right: "-0.05em",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {chapter.numeral}
      </div>

      {/* Mobile: compact palm thumbnail */}
      <div
        className="lg:hidden mb-10 mx-auto"
        style={{ width: 180, height: 180 }}
      >
        <PalmZoom activeChapter={chapterIndex} />
      </div>

      {/* Text block */}
      <div
        className="relative max-w-[54ch]"
        style={{
          opacity: isActive ? 1 : 0.38,
          transform: isActive ? "none" : "translateY(0.6rem)",
          transition: "opacity 0.85s ease, transform 0.85s ease",
        }}
      >
        <div className="celestial-rule celestial-rule--accent w-12 mb-7" />

        <div className="marginalia mb-2">Chapter {chapter.numeral}</div>

        <h2
          className="leading-[1.02] tracking-[-0.015em] mb-3"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            color: "var(--ink)",
          }}
        >
          {chapter.title}
        </h2>

        <p
          className="italic mb-9 text-[var(--ink-soft)]"
          style={{ fontFamily: "var(--font-body)", fontSize: "1.08rem", lineHeight: 1.62 }}
        >
          {chapter.subtitle}
        </p>

        <div
          className="space-y-5 text-[var(--ink)]"
          style={{ fontFamily: "var(--font-body)", fontSize: "1.15rem", lineHeight: 1.7 }}
        >
          {chapter.body.map((p, pi) => (
            <p key={pi}>
              {pi === 0 && (
                <span
                  className="float-left mr-2 mt-0.5 leading-[0.82]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "3.7rem",
                    color: "var(--accent)",
                  }}
                >
                  {p[0]}
                </span>
              )}
              {pi === 0 ? p.slice(1) : p}
            </p>
          ))}
        </div>

        {/* Pull quote */}
        <div className="mt-12 border-l border-[var(--accent)] pl-5">
          <blockquote
            className="italic"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
              lineHeight: 1.52,
              color: "var(--ink)",
            }}
          >
            <span className="numeral">&ldquo;</span>
            {chapter.pull}
            <span className="numeral">&rdquo;</span>
          </blockquote>
        </div>

        {/* Figure annotation */}
        <div className="mt-9 flex items-start gap-4 opacity-60">
          <div className="w-px h-5 bg-[var(--rule)] mt-1 shrink-0" />
          <div>
            <div className="marginalia mb-1.5">{chapter.figure.label}</div>
            <div className="flex flex-wrap gap-x-5 gap-y-0.5">
              {chapter.figure.lines.map((line, li) => (
                <div key={line} className="flex items-baseline gap-1.5 marginalia text-[0.64rem]">
                  <span className="numeral text-[0.68rem]">{toRoman(li + 1)}</span>
                  <span className="text-[var(--ink-soft)]">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────

function ProgressDots({
  total,
  active,
  onDotClick,
}: {
  total: number;
  active: number | null;
  onDotClick: (i: number) => void;
}) {
  return (
    <div
      className="fixed right-5 z-50 hidden lg:flex flex-col gap-3.5"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          aria-label={`Jump to chapter ${i + 1}`}
          onClick={() => onDotClick(i)}
          className="flex items-center justify-center w-5 h-5 group"
        >
          <span
            className="rounded-full block transition-all duration-500"
            style={{
              width:      active === i ? 7 : 4,
              height:     active === i ? 7 : 4,
              background: active === i ? "var(--accent)" : "var(--rule)",
              boxShadow:  active === i ? "0 0 10px 2px var(--accent)" : "none",
              opacity:    active === i ? 1 : 0.45,
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────

function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
  ];
  let res = "";
  for (const [val, sym] of map) {
    while (n >= val) { res += sym; n -= val; }
  }
  return res;
}
