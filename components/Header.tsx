import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="relative z-10 px-6 md:px-10 lg:px-14 pt-7 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mark />
          <div className="flex flex-col leading-tight">
            <span
              className="text-[0.78rem] tracking-[0.22em] uppercase"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              Atlas of the Hand
            </span>
            <span className="marginalia mt-0.5">A reading in five chapters</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
      <div className="celestial-rule mt-6" />
    </header>
  );
}

function Mark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      aria-hidden="true"
      style={{ color: "var(--accent)" }}
    >
      <circle
        cx="17"
        cy="17"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <circle
        cx="17"
        cy="17"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="1 2"
      />
      {/* compass cross */}
      <line x1="17" y1="3" x2="17" y2="9" stroke="currentColor" strokeWidth="0.5" />
      <line x1="17" y1="25" x2="17" y2="31" stroke="currentColor" strokeWidth="0.5" />
      <line x1="3" y1="17" x2="9" y2="17" stroke="currentColor" strokeWidth="0.5" />
      <line x1="25" y1="17" x2="31" y2="17" stroke="currentColor" strokeWidth="0.5" />
      {/* center sigil — small hand */}
      <path
        d="M14 21 L14 14 M16 22 L16 12 M18 22 L18 12.5 M20 22 L20 14.5 M14 21 Q14 23 16 23 L18 23 Q20 23 20 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
