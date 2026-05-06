import type { Chapter } from "@/lib/reading";

export function ChapterSpread({ chapter, indexOffset = 0 }: { chapter: Chapter; indexOffset?: number }) {
  const delay = 200 + indexOffset * 140;
  return (
    <article
      className="relative grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 px-6 md:px-12 lg:px-20 py-16 md:py-24 opacity-0"
      style={{
        animation: `fade-in 1s var(--ease-celestial, ease) ${delay}ms forwards`,
      }}
    >
      {/* left margin: numeral and figure note */}
      <aside className="md:col-span-2 flex md:block items-center gap-4 md:gap-0">
        <div
          className="numeral text-[2.4rem] md:text-[3rem] leading-none"
          aria-hidden="true"
        >
          {chapter.numeral}
        </div>
        <div className="hidden md:block mt-6 marginalia max-w-[14ch]">
          {chapter.figure.label}
        </div>
        <div className="hidden md:block mt-3 ml-1 space-y-1">
          {chapter.figure.lines.map((line, i) => (
            <div
              key={line}
              className="flex items-baseline gap-2 marginalia text-[0.68rem]"
            >
              <span className="numeral text-[0.72rem]">{toRoman(i + 1)}</span>
              <span className="text-[var(--ink-soft)]">{line}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* main column */}
      <div className="md:col-span-7">
        <div className="celestial-rule celestial-rule--accent w-24 mb-6" />
        <div className="marginalia mb-2">Chapter {chapter.numeral}</div>
        <h2
          className="text-[2.4rem] md:text-[3.4rem] leading-[1.05] tracking-[-0.01em] mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          {chapter.title}
        </h2>
        <p
          className="italic text-[var(--ink-soft)] mb-8"
          style={{ fontFamily: "var(--font-body)", fontSize: "1.15rem" }}
        >
          {chapter.subtitle}
        </p>

        <div
          className="space-y-5 max-w-[62ch]"
          style={{ fontFamily: "var(--font-body)", fontSize: "1.18rem", lineHeight: 1.65 }}
        >
          {chapter.body.map((p, i) => (
            <p key={i}>
              {i === 0 ? <DropCap>{p[0]}</DropCap> : null}
              {i === 0 ? p.slice(1) : p}
            </p>
          ))}
        </div>
      </div>

      {/* right margin: pull quote */}
      <aside className="md:col-span-3 md:pl-2">
        <div className="md:sticky md:top-20">
          <div className="marginalia mb-3">Note in the margin</div>
          <blockquote
            className="border-t border-[var(--rule)] pt-4 italic"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.18rem",
              lineHeight: 1.45,
              color: "var(--ink)",
            }}
          >
            <span className="numeral mr-1">&ldquo;</span>
            {chapter.pull}
            <span className="numeral ml-0.5">&rdquo;</span>
          </blockquote>
        </div>
      </aside>
    </article>
  );
}

function DropCap({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="float-left mr-2 leading-[0.85] mt-1"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "3.6rem",
        color: "var(--accent)",
        fontStyle: "italic",
      }}
    >
      {children}
    </span>
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
