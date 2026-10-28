"use client";
import { useRef } from "react";
import type { AnswerKind } from "@/content/types";
import { cn } from "@/lib/utils";

type Key = { label: string; insert: string; title: string; colour?: string };

/** Big, tappable keys for answers that are fiddly to type on a phone. */
const KEYS: Partial<Record<AnswerKind, Key[]>> = {
  bases: [
    { label: "A", insert: "A", title: "adenine", colour: "#16a34a" },
    { label: "T", insert: "T", title: "thymine (DNA only)", colour: "#dc2626" },
    { label: "U", insert: "U", title: "uracil (RNA only)", colour: "#d97706" },
    { label: "C", insert: "C", title: "cytosine", colour: "#2563eb" },
    { label: "G", insert: "G", title: "guanine", colour: "#9333ea" },
    { label: "␣", insert: " ", title: "space between codons" },
    { label: "⌫", insert: "\b", title: "delete" },
  ],
  ratio: [{ label: ":", insert: " : ", title: "ratio colon" }],
  list: [{ label: ",", insert: ", ", title: "comma between items" }],
};

const PLACEHOLDER: Record<AnswerKind, string> = {
  word: "Type the term",
  sentence: "Type your answer",
  number: "Type a number",
  ratio: "e.g. 3 : 1",
  bases: "Tap the bases or type them",
  list: "Separate items with commas",
};

export function AnswerInput({ value, onChange, onSubmit, kind = "word", disabled, status, label = "Your answer" }: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  kind?: AnswerKind;
  disabled?: boolean;
  status?: "ok" | "bad" | null;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const keys = KEYS[kind] ?? [];

  const insert = (s: string) => {
    const el = ref.current;
    if (s === "\b") return onChange(value.replace(/\s*.$/, ""));
    if (!el) return onChange(value + s);
    const a = el.selectionStart ?? value.length;
    const b = el.selectionEnd ?? value.length;
    // Codons are easier to read in threes: add a space automatically after every third base.
    let add = s;
    if (kind === "bases" && /[ACGTU]/.test(s)) {
      const run = value.slice(0, a).split(" ").pop() ?? "";
      if (run.length === 3) add = ` ${s}`;
    }
    const next = value.slice(0, a) + add + value.slice(b);
    onChange(next);
    const caret = a + add.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  return (
    <div>
      <label className="block">
        <span className="sr-only">{label}</span>
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(kind === "bases" ? e.target.value.toUpperCase() : e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
          inputMode={kind === "number" ? "decimal" : "text"}
          autoComplete="off"
          autoCapitalize={kind === "bases" ? "characters" : "off"}
          spellCheck={false}
          placeholder={PLACEHOLDER[kind]}
          aria-label={label}
          className={cn(
            "w-full min-w-0 rounded-xl border-2 bg-bg px-3 py-2 text-base outline-none transition focus:border-brand",
            (kind === "bases" || kind === "ratio") && "font-mono tracking-wider",
            status === "ok" ? "border-success" : status === "bad" ? "border-danger" : "border-line",
          )}
        />
      </label>
      {keys.length > 0 && !disabled && (
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Answer keys">
          {keys.map((k) => (
            <button key={k.label} type="button" title={k.title} aria-label={k.title} onClick={() => insert(k.insert)}
              className="h-10 min-w-10 rounded-lg border-2 bg-surface-2 px-2 font-mono text-base font-bold transition hover:brightness-110"
              style={k.colour ? { borderColor: k.colour, color: k.colour } : { borderColor: "var(--border)" }}>
              {k.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
