"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Mode = "light" | "dark";

/** Runs before paint (inlined in <head>) so there is no theme flash. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("cyc-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const set = document.documentElement.dataset.theme as Mode | undefined;
    setMode(set ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("cyc-theme", next); } catch {}
    setMode(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] text-[var(--heading)] transition hover:border-lime-500 ${className}`}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mode === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}
