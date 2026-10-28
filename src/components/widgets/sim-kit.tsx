"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { bumpStat } from "@/lib/progress";

/** Counts the first interaction with a tool towards the "Hands-on Hero" badge. Call `touch()` in any handler. */
export function useToolUse() {
  const used = useRef(false);
  return useCallback(() => {
    if (used.current) return;
    used.current = true;
    bumpStat("toolsUsed");
  }, []);
}

/** True when the learner asked for calm mode or the OS asks for reduced motion (re-checked on mount). */
export function useCalm() {
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const check = () => setCalm(document.documentElement.classList.contains("calm") || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return calm;
}

/**
 * State that is saved on this device (drafts, CVs, plans). Starts with
 * `initial` on the server and first render, then loads the saved copy, so
 * there is no hydration mismatch. Storage failures are ignored.
 */
export function useSaved<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void, boolean] {
  const storageKey = `lifemzansi:draft:${key}`;
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setValue({ ...initial, ...JSON.parse(raw) } as T);
    } catch {
      /* storage blocked – keep the default */
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);
  const set = useCallback((v: T | ((p: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* storage full or blocked */
      }
      return next;
    });
  }, [storageKey]);
  return [value, set, loaded];
}

/** A friendly "what's happening" explanation box under a tool. */
export function Explain({ children, colour = "var(--brand)" }: { children: React.ReactNode; colour?: string }) {
  return (
    <div className="mt-3 rounded-xl border-l-4 bg-surface-2/60 p-3 text-sm leading-relaxed" style={{ borderColor: colour }} aria-live="polite">
      {children}
    </div>
  );
}

/** A quick confetti pop (canvas-confetti) for a finished task – skipped in calm mode / reduced motion. */
export function celebrate() {
  if (typeof window === "undefined") return;
  if (document.documentElement.classList.contains("calm") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  void import("canvas-confetti").then(({ default: confetti }) => confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, disableForReducedMotion: true }));
}

/** Labelled text field used by the builders. */
export function Field({ label, value, onChange, placeholder, multiline = false, rows = 3, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; rows?: number; hint?: string;
}) {
  const cls = "mt-1 w-full rounded-xl border-2 border-line bg-bg px-3 py-2 text-sm outline-none transition focus:border-brand";
  return (
    <label className="block text-sm">
      <span className="font-semibold">{label}</span>
      {hint && <span className="ml-1 text-xs text-muted">{hint}</span>}
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </label>
  );
}

/** Words in a piece of text. */
export const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

/** Prints only the element with the given id (everything else is hidden by the print stylesheet). */
export function printSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return window.print();
  document.body.classList.add("printing-section");
  el.classList.add("print-target");
  const done = () => {
    document.body.classList.remove("printing-section");
    el.classList.remove("print-target");
    window.removeEventListener("afterprint", done);
  };
  window.addEventListener("afterprint", done);
  window.print();
}

/** Copy text to the clipboard; resolves true when it worked. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
