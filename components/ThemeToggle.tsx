"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("atlas-theme", next);
    } catch {}
    setTheme(next);
  }

  const isDark = theme === "dark";
  const label = isDark ? "Light the candle" : "Draw the curtain";

  return (
    <button
      onClick={toggle}
      aria-label={label}
      className="group relative inline-flex items-center gap-2 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors duration-500"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <span aria-hidden="true" className="relative inline-block w-4 h-4">
        {/* sun & moon overlap, opacity swap */}
        <svg
          viewBox="0 0 16 16"
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: isDark ? 0 : 1 }}
        >
          <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="0.7" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = 8 + Math.cos(a) * 4.6;
            const y1 = 8 + Math.sin(a) * 4.6;
            const x2 = 8 + Math.cos(a) * 6.2;
            const y2 = 8 + Math.sin(a) * 6.2;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.7" />
            );
          })}
        </svg>
        <svg
          viewBox="0 0 16 16"
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: isDark ? 1 : 0 }}
        >
          <path
            d="M11.5 9.8a4.4 4.4 0 0 1-5.3-5.3 4.6 4.6 0 1 0 5.3 5.3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
          />
        </svg>
      </span>
      <span>{label}</span>
    </button>
  );
}
