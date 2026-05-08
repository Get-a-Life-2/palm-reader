"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { StarField } from "@/components/StarField";
import { InteractivePalm } from "@/components/InteractivePalm";
import { setPendingFile } from "@/lib/pendingFile";
import {
  HAND_LORE,
  DOMINANCE_NOTE,
  LINE_LORE,
  type HandSide,
  type LineLore,
} from "@/lib/handLore";
import type { LineId } from "@/lib/palmLines";

type Stage = "hero" | "heart" | "head" | "life" | "fate" | "mercury" | "closing";

const STAGES: readonly Stage[] = [
  "hero",
  "heart",
  "head",
  "life",
  "fate",
  "mercury",
  "closing",
];

// Map each chapter line to which gutter (left or right) it speaks from. We
// alternate so the marginalia visually pulls the eye across the palm — heart
// on the left, head on the right, life on the left, fate on the right.
const CHAPTER_SIDE: Record<LineId, "left" | "right"> = {
  heart: "left",
  head: "right",
  life: "left",
  fate: "right",
  mercury: "left",
};

export default function Home() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [stage, setStage] = useState<Stage>("hero");

  function handleFile(file: File | null) {
    if (!file) return;
    setPendingFile(file);
    router.push("/reading");
  }

  const openPicker = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const activeLine: LineId | null =
    stage === "heart" || stage === "head" || stage === "life" || stage === "fate" || stage === "mercury"
      ? stage
      : null;

  return (
    <main className="relative">
      <StarField />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {/* Visual layer — fixed in viewport. The page itself never moves; only
          this layer's panels cross-fade as the scroll position advances stage. */}
      <div className="fixed inset-0 z-20 flex flex-col">
        <Header trailing={<HeaderSubmit onClick={openPicker} />} />

        <TitleBlock />

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-1 lg:gap-6 lg:px-14 lg:items-stretch lg:max-w-[1400px] lg:mx-auto lg:w-full min-h-0 px-6 md:px-10">
          {/* Desktop: left gutter */}
          <div className="hidden lg:block lg:col-span-3 lg:relative lg:h-full">
            <LeftGutter stage={stage} />
          </div>

          {/* Palm — fixed, all 4 lines drawn, only the active line lifts.
              Sized via min(vh, vw) so it picks up whichever axis is more
              constraining. aspect-ratio needs an explicit dimension to size
              anything; without it the box collapses to 0×0. */}
          <div className="lg:col-span-6 flex-1 flex items-center justify-center min-h-0 py-2">
            <div
              className="pointer-events-none mx-auto"
              style={{
                aspectRatio: "5 / 6",
                height: "min(62vh, 72vw)",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <InteractivePalm activeLine={activeLine} />
            </div>
          </div>

          {/* Desktop: right gutter */}
          <div className="hidden lg:block lg:col-span-3 lg:relative lg:h-full">
            <RightGutter stage={stage} />
          </div>

          {/* Mobile: bottom gutter (replaces side gutters) */}
          <div
            className="lg:hidden relative w-full"
            style={{ height: "30vh", flex: "0 0 30vh" }}
          >
            <MobileGutter stage={stage} onSubmit={openPicker} />
          </div>
        </div>

        {/* Desktop footer — scroll cue / continue indicator / closing CTA */}
        <div className="hidden lg:block">
          <DesktopFooter stage={stage} onSubmit={openPicker} />
        </div>

        <StageIndicator stage={stage} />
      </div>

      {/* Scroll driver — invisible. Each child is a viewport tall and fires an
          IntersectionObserver when its centre crosses the viewport's middle,
          updating the stage state. Total page height = STAGES.length × 100vh. */}
      <div aria-hidden>
        {STAGES.map((s) => (
          <StageTrigger key={s} stage={s} onActive={setStage} />
        ))}
      </div>
    </main>
  );
}

function HeaderSubmit({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--ink-soft)] hover:text-[var(--ink)] border border-[var(--rule)] hover:border-[var(--accent)] transition-colors duration-500"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <span className="numeral">§</span>
      Submit your palm
    </button>
  );
}

function TitleBlock() {
  return (
    <div className="text-center px-6 md:px-10 lg:px-14 pt-1 pb-2 max-w-[1400px] mx-auto w-full">
      <div className="marginalia mb-1">Folio MMXXVI · Liber I</div>
      <h1
        className="text-[clamp(1.4rem,3.4vw,3.4rem)] leading-[1.05] tracking-[-0.015em] text-[var(--ink)] md:whitespace-nowrap"
        style={{ fontFamily: "var(--font-display)" }}
      >
        An atlas of the{" "}
        <em className="italic" style={{ color: "var(--accent)" }}>
          hand,
        </em>{" "}
        read by stars.
      </h1>
      <div className="celestial-rule celestial-rule--accent w-32 mx-auto mt-2" />
    </div>
  );
}

function LeftGutter({ stage }: { stage: Stage }) {
  return (
    <>
      <FadePanel visible={stage === "hero"}>
        <HandColumn side={HAND_LORE.left} alignment="right" />
      </FadePanel>
      {LINE_LORE.filter((l) => CHAPTER_SIDE[l.id] === "left").map((lore) => (
        <FadePanel key={lore.id} visible={stage === lore.id}>
          <ChapterColumn lore={lore} alignment="right" />
        </FadePanel>
      ))}
    </>
  );
}

function RightGutter({ stage }: { stage: Stage }) {
  return (
    <>
      <FadePanel visible={stage === "hero"}>
        <HandColumn side={HAND_LORE.right} alignment="left" />
      </FadePanel>
      {LINE_LORE.filter((l) => CHAPTER_SIDE[l.id] === "right").map((lore) => (
        <FadePanel key={lore.id} visible={stage === lore.id}>
          <ChapterColumn lore={lore} alignment="left" />
        </FadePanel>
      ))}
    </>
  );
}

function FadePanel({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center overflow-y-auto"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 800ms var(--ease-celestial, ease)",
      }}
      aria-hidden={!visible}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}

function HandColumn({
  side,
  alignment,
}: {
  side: HandSide;
  alignment: "left" | "right";
}) {
  const isRight = alignment === "right";
  return (
    <aside className={isRight ? "text-right" : "text-left"}>
      <div className="marginalia mb-2">{side.marginal}</div>
      <div
        className="celestial-rule celestial-rule--accent w-20 mb-4"
        style={{
          marginLeft: isRight ? "auto" : 0,
          marginRight: isRight ? 0 : "auto",
        }}
      />
      <p
        className="italic mb-5 text-[var(--ink)]"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.05rem",
          lineHeight: 1.4,
        }}
      >
        {side.flavor}
      </p>
      <div className="space-y-4">
        <div>
          <div className="marginalia mb-1">If you are a man</div>
          <p
            className="text-[var(--ink-soft)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.94rem",
              lineHeight: 1.55,
            }}
          >
            {side.forMan}
          </p>
        </div>
        <div>
          <div className="marginalia mb-1">If you are a woman</div>
          <p
            className="text-[var(--ink-soft)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.94rem",
              lineHeight: 1.55,
            }}
          >
            {side.forWoman}
          </p>
        </div>
      </div>
    </aside>
  );
}

function ChapterColumn({
  lore,
  alignment,
}: {
  lore: LineLore;
  alignment: "left" | "right";
}) {
  const isRight = alignment === "right";
  return (
    <article className={isRight ? "text-right" : "text-left"}>
      <div
        className="celestial-rule celestial-rule--accent w-20 mb-3"
        style={{
          marginLeft: isRight ? "auto" : 0,
          marginRight: isRight ? 0 : "auto",
        }}
      />
      <div className="marginalia mb-1">Chapter {lore.numeral}</div>
      <h2
        className="text-[clamp(1.4rem,2.4vw,2.2rem)] leading-[1.05] tracking-[-0.01em] mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
      >
        {lore.title}
      </h2>
      <p
        className="italic mb-3 text-[var(--ink-soft)]"
        style={{ fontFamily: "var(--font-body)", fontSize: "0.96rem" }}
      >
        {lore.latin} —{" "}
        <span style={{ color: "var(--ink)" }}>{lore.blurb}</span>
      </p>
      <p
        className="mb-4 text-[var(--ink)]"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.94rem",
          lineHeight: 1.55,
        }}
      >
        {lore.whatItTells}
      </p>
      <ul className="space-y-1.5">
        {lore.signs.slice(0, 5).map((sign, i) => (
          <li
            key={sign.mark}
            className="flex gap-2 items-baseline pb-1.5 border-b border-[var(--rule)] last:border-b-0"
            style={{ flexDirection: isRight ? "row-reverse" : "row" }}
          >
            <span className="numeral text-[0.72rem] flex-shrink-0">
              {toRoman(i + 1)}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.86rem",
                lineHeight: 1.45,
              }}
            >
              <span
                className="italic"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--ink)",
                }}
              >
                {sign.mark}
              </span>
              <span className="text-[var(--ink-soft)]">
                {" "}
                — {sign.meaning}.
              </span>
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function MobileGutter({
  stage,
  onSubmit,
}: {
  stage: Stage;
  onSubmit: () => void;
}) {
  return (
    <>
      <FadePanel visible={stage === "hero"}>
        <div className="text-center max-w-[44ch] mx-auto">
          <p
            className="italic text-[var(--ink-soft)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.94rem",
              lineHeight: 1.55,
            }}
          >
            {DOMINANCE_NOTE}
          </p>
          <ScrollCue className="mt-4" />
        </div>
      </FadePanel>
      {LINE_LORE.map((lore) => (
        <FadePanel key={lore.id} visible={stage === lore.id}>
          <ChapterColumn lore={lore} alignment="left" />
        </FadePanel>
      ))}
      <FadePanel visible={stage === "closing"}>
        <ClosingPanel onSubmit={onSubmit} />
      </FadePanel>
    </>
  );
}

function DesktopFooter({
  stage,
  onSubmit,
}: {
  stage: Stage;
  onSubmit: () => void;
}) {
  const isChapter =
    stage === "heart" || stage === "head" || stage === "life" || stage === "fate" || stage === "mercury";
  return (
    <div className="relative h-28 px-14 max-w-[1400px] mx-auto w-full">
      <FadePanel visible={stage === "hero"}>
        <div className="text-center max-w-[60ch] mx-auto">
          <p
            className="italic text-[var(--ink-soft)] mb-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.94rem",
              lineHeight: 1.55,
            }}
          >
            {DOMINANCE_NOTE}
          </p>
          <ScrollCue />
        </div>
      </FadePanel>
      <FadePanel visible={isChapter}>
        <div className="text-center">
          <ContinueIndicator stage={stage} />
        </div>
      </FadePanel>
      <FadePanel visible={stage === "closing"}>
        <ClosingPanel onSubmit={onSubmit} />
      </FadePanel>
    </div>
  );
}

function ScrollCue({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 marginalia ${className}`}>
      <span className="celestial-rule w-12" />
      Scroll · the five lines
      <span className="celestial-rule w-12" />
    </div>
  );
}

function ContinueIndicator({ stage }: { stage: Stage }) {
  const next: Record<Stage, string> = {
    hero: "",
    heart: "Continue · the head line",
    head: "Continue · the life line",
    life: "Continue · the fate line",
    fate: "Continue · the mercury line",
    mercury: "Continue · the closing",
    closing: "",
  };
  return (
    <div className="inline-flex items-center gap-3 marginalia">
      <span className="celestial-rule w-12" />
      {next[stage]}
      <span className="celestial-rule w-12" />
    </div>
  );
}

function ClosingPanel({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="text-center">
      <div className="marginalia mb-1">Now</div>
      <h2
        className="text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.05] mb-4"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
      >
        Read your{" "}
        <em className="italic" style={{ color: "var(--accent)" }}>
          own
        </em>{" "}
        hand.
      </h2>
      <button
        onClick={onSubmit}
        className="group inline-flex items-center gap-3 pl-5 pr-6 py-3 border border-[var(--accent)] text-[var(--ink)] hover:bg-[color-mix(in_oklch,var(--accent)_8%,transparent)] transition-colors duration-500"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
      >
        <span className="numeral">§</span>
        <span className="text-[1rem]">Submit your palm</span>
        <Arrow />
      </button>
    </div>
  );
}

function StageIndicator({ stage }: { stage: Stage }) {
  return (
    <div
      className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
      aria-hidden
    >
      {STAGES.map((s) => {
        const isCurrent = s === stage;
        return (
          <span
            key={s}
            className="block w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: isCurrent ? "var(--accent)" : "transparent",
              border: `1px solid var(--${isCurrent ? "accent" : "rule"})`,
              transform: isCurrent ? "scale(1.6)" : "scale(1)",
              transition:
                "background-color 600ms var(--ease-celestial, ease)," +
                " border-color 600ms ease," +
                " transform 600ms var(--ease-celestial, ease)",
            }}
          />
        );
      })}
    </div>
  );
}

function StageTrigger({
  stage,
  onActive,
}: {
  stage: Stage;
  onActive: (s: Stage) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onActive(stage);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stage, onActive]);

  return (
    <div ref={ref} className="h-screen" data-stage={stage} aria-hidden />
  );
}

function Arrow() {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
      <line
        x1="0"
        y1="5"
        x2="20"
        y2="5"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <polyline
        points="14,1 20,5 14,9"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"],
  ];
  let res = "";
  for (const [val, sym] of map) {
    while (n >= val) {
      res += sym;
      n -= val;
    }
  }
  return res;
}
