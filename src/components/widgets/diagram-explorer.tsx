"use client";
import { useMemo, useState } from "react";
import { Eye, EyeOff, RotateCcw, Shuffle, Volume2 } from "lucide-react";
import type { DiagramId } from "@/content/types";
import { solvePuzzle } from "@/lib/progress";
import { speak } from "@/lib/bio/speech";
import { cn, shuffle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DIAGRAMS, type DiagramPart } from "./diagrams";
import { useToolUse } from "./sim-kit";
import { Segmented, WidgetFrame } from "./widget-frame";

type Mode = "explore" | "find" | "name";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * A labelled diagram you can tap. Explore: tap any part (or its name) to see
 * what it is and what it does. Find it: "tap the cochlea". Name it: "what is
 * part C?" – exactly how diagram questions work in the NSC papers, one part
 * at a time instead of a wall of labels.
 */
export function DiagramExplorer({ diagram = "eye", mode: initialMode = "explore" }: { diagram?: DiagramId; mode?: "explore" | "quiz" }) {
  const d = DIAGRAMS[diagram];
  const touch = useToolUse();
  const [mode, setMode] = useState<Mode>(initialMode === "quiz" ? "find" : "explore");
  const [sel, setSel] = useState<string | null>(null);
  const [letters, setLetters] = useState(true);
  const [round, setRound] = useState(0);
  const [q, setQ] = useState(0);
  const [score, setScore] = useState({ right: 0, tried: 0 });
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const order = useMemo(() => shuffle(d.parts, `${diagram}-${round}`), [d.parts, diagram, round]);
  const target = order[q % order.length];
  const letterOf = (p: DiagramPart) => LETTERS[d.parts.indexOf(p)];
  const options = useMemo(() => shuffle([target, ...shuffle(d.parts.filter((p) => p.id !== target.id), `${round}-${q}`).slice(0, 3)], `${round}-${q}-o`), [d.parts, target, round, q]);
  const selected = d.parts.find((p) => p.id === sel);
  const finished = mode !== "explore" && score.tried >= d.parts.length;

  const answer = (p: DiagramPart) => {
    if (feedback) return;
    touch();
    const ok = p.id === target.id;
    setScore((s) => {
      const next = { right: s.right + (ok ? 1 : 0), tried: s.tried + 1 };
      if (next.tried === d.parts.length && next.right === d.parts.length) solvePuzzle(`diagram:${diagram}:${mode}`, 20);
      return next;
    });
    setSel(target.id);
    setFeedback({ ok, text: ok ? `Yes! ${target.name}: ${target.fn}` : `Not quite – that is the ${p.name.toLowerCase()}. The ${target.name.toLowerCase()} is highlighted: ${target.fn}` });
  };
  const next = () => {
    setFeedback(null);
    setSel(null);
    setQ((x) => x + 1);
  };
  const restart = (m: Mode = mode) => {
    setMode(m);
    setRound((r) => r + 1);
    setQ(0);
    setScore({ right: 0, tried: 0 });
    setFeedback(null);
    setSel(null);
  };
  const tapPart = (p: DiagramPart) => {
    touch();
    if (mode === "explore") setSel(p.id === sel ? null : p.id);
    else if (mode === "find" && !finished) answer(p);
  };

  return (
    <WidgetFrame title={d.title} colour="var(--t-body)" instruction={mode === "explore" ? "Tap any part – or its name in the list – to see what it does." : mode === "find" ? "Find the part on the diagram and tap it." : "Which part is marked with the letter? Pick its name."}>
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour="var(--t-body)" value={mode} onChange={(m) => restart(m)} options={[{ id: "explore", label: "Explore" }, { id: "find", label: "Find it" }, { id: "name", label: "Name it" }]} />
        {mode === "explore" && <button onClick={() => setLetters((x) => !x)} className="flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-xs font-semibold text-muted hover:text-fg">{letters ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />} {letters ? "Hide letters" : "Show letters"}</button>}
        <button onClick={() => speak(`${d.title}. ${d.intro}`)} className="flex items-center gap-1 rounded-lg border border-line px-2 py-1 text-xs font-semibold text-muted hover:text-fg"><Volume2 className="h-3.5 w-3.5" /> Read intro</button>
        {mode !== "explore" && <span className="ml-auto text-sm font-semibold">{score.right}/{score.tried} · {Math.min(score.tried + 1, d.parts.length)} of {d.parts.length}</span>}
      </div>
      <p className="mt-2 text-sm text-muted">{d.intro}</p>

      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 400 300" className="diagram w-full rounded-2xl border border-line bg-bg" role="group" aria-label={`${d.title} – tappable diagram`}>
          {d.parts.map((p) => {
            const isSel = sel === p.id;
            const dim = sel !== null && !isSel && mode === "explore";
            return (
              <path key={p.id} d={p.d} role="button" tabIndex={0} aria-label={mode === "explore" ? p.name : `Part ${letterOf(p)}`}
                onClick={() => tapPart(p)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), tapPart(p))}
                className={cn("part", dim && "dim")}
                fill={p.line ? "none" : p.fill} fillRule={p.evenodd ? "evenodd" : undefined}
                stroke={p.line ? p.fill : isSel ? "var(--brand)" : "var(--text)"} strokeOpacity={p.line ? 1 : isSel ? 1 : 0.55}
                strokeWidth={p.line ? (isSel ? p.line + 3 : p.line) : isSel ? 3 : 1}
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray={p.id === "nucleotide" ? "6 4" : undefined} />
            );
          })}
          {d.decor?.map((x, i) => <path key={i} d={x.d} fill={x.fill ?? "none"} stroke={x.stroke} strokeWidth={x.width} strokeDasharray={x.dash} pointerEvents="none" />)}
          {d.notes?.map((n, i) => <text key={i} x={n.x} y={n.y} fontSize={11} fontWeight={700} style={{ fill: n.colour ?? "var(--text)" }} pointerEvents="none">{n.text}</text>)}
          {(mode !== "explore" || letters) && d.parts.map((p) => {
            const show = mode === "name" ? p.id === target.id : true;
            if (!show) return null;
            const hi = sel === p.id || (mode === "name" && p.id === target.id);
            return (
              <g key={p.id} pointerEvents="none">
                <circle cx={p.at[0]} cy={p.at[1]} r={8.5} style={{ fill: hi ? "var(--brand)" : "var(--surface)", stroke: "var(--text)" }} strokeWidth={1.2} />
                <text x={p.at[0]} y={p.at[1] + 3.8} textAnchor="middle" fontSize={11} fontWeight={800} style={{ fill: hi ? "#fff" : "var(--text)" }}>{letterOf(p)}</text>
              </g>
            );
          })}
        </svg>

        <div className="min-w-0">
          {mode === "explore" && (
            <>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
                {d.parts.map((p) => (
                  <li key={p.id}>
                    <button onClick={() => tapPart(p)} aria-pressed={sel === p.id}
                      className={cn("flex w-full items-center gap-2 rounded-xl border px-2 py-1.5 text-left text-sm transition", sel === p.id ? "border-brand bg-brand-soft font-semibold" : "border-transparent hover:bg-surface-2")}>
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line text-[10px] font-bold">{letterOf(p)}</span>
                      <span className="h-3 w-3 shrink-0 rounded-sm border border-line" style={{ background: p.fill }} />
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
              {selected && (
                <div className="mt-3 rounded-xl border-l-4 border-brand bg-brand-soft/50 p-3 text-sm" role="status">
                  <div className="flex items-start justify-between gap-2"><strong>{letterOf(selected)}. {selected.name}</strong><button onClick={() => speak(`${selected.name}. ${selected.fn}`)} aria-label="Read aloud" className="text-muted hover:text-fg"><Volume2 className="h-4 w-4" /></button></div>
                  <p className="mt-1">{selected.fn}</p>
                </div>
              )}
            </>
          )}

          {mode !== "explore" && !finished && (
            <div className="rounded-2xl border border-line bg-surface-2/50 p-4">
              {mode === "find" ? (
                <p className="font-display text-lg font-bold">Tap the <span className="text-brand">{target.name.toLowerCase()}</span>.</p>
              ) : (
                <>
                  <p className="font-display text-lg font-bold">What is part <span className="text-brand">{letterOf(target)}</span>?</p>
                  <div className="mt-3 grid gap-2">
                    {options.map((o) => (
                      <button key={o.id} disabled={Boolean(feedback)} onClick={() => answer(o)}
                        className={cn("rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold transition", feedback && o.id === target.id ? "border-success bg-success/10" : "border-line hover:border-brand/50")}>
                        {o.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {feedback && (
                <div role="status" className={cn("mt-3 rounded-xl p-3 text-sm", feedback.ok ? "bg-success/10" : "bg-warning/10")}>
                  <p>{feedback.ok ? "✅ " : "💡 "}{feedback.text}</p>
                  <Button size="sm" className="mt-2" onClick={next}>Next part</Button>
                </div>
              )}
            </div>
          )}

          {finished && (
            <div role="status" className="rounded-2xl border border-success/40 bg-success/10 p-4 text-center">
              <div className="text-4xl">{score.right === d.parts.length ? "🏆" : score.right >= d.parts.length / 2 ? "🌟" : "💪"}</div>
              <p className="mt-1 font-display text-xl font-bold">{score.right}/{d.parts.length} correct</p>
              <p className="text-sm text-muted">{score.right === d.parts.length ? "Every part, first time. Exam-ready!" : "Explore the ones you missed, then try again."}</p>
              <div className="mt-3 flex justify-center gap-2">
                <Button size="sm" onClick={() => restart()}><Shuffle className="h-4 w-4" /> Try again</Button>
                <Button size="sm" variant="secondary" onClick={() => restart("explore")}><RotateCcw className="h-4 w-4" /> Explore</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}
