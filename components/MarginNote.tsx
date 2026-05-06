export function MarginNote({ n, label, hint }: { n: string; label: string; hint: string }) {
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
