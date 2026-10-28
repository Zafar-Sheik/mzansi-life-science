"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Heart, Play, RotateCcw, SkipForward, Timer, X } from "lucide-react";
import type { Topic } from "@/content/types";
import { addXp, bumpStat } from "@/lib/progress";
import { STRANDS, TOPICS, topicLabel, topicMeta } from "@/lib/topics";
import { checkAnswer, inferKind } from "@/lib/bio/check";
import { GENERATORS } from "@/lib/bio/generators";
import { DASH, type Riddle } from "@/content/games";
import { cn, seededRandom, shuffle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InlineMd, Markdown } from "@/components/learn/markdown";
import { AnswerInput } from "@/components/bio/answer-input";

export interface GameTerm { term: string; def: string; topic: Topic }
type Game = "speed" | "drcr" | "who" | "pairs" | "blitz" | "odd" | "hangman";

const GAMES: { id: Game; title: string; emoji: string; text: string }[] = [
  { id: "speed", title: "Speed Bio", emoji: "⏱️", text: "90 seconds of quick-fire questions: terms, base pairing, gametes, chromosome numbers." },
  { id: "drcr", title: "This or That?", emoji: "⚖️", text: "Meiosis or mitosis? Insulin or glucagon? Two options, 60 seconds, go!" },
  { id: "who", title: "Who Am I?", emoji: "🕵️", text: "A structure describes itself. Can you name it?" },
  { id: "pairs", title: "Concept Pairs", emoji: "🃏", text: "Flip cards to match each term with its meaning." },
  { id: "blitz", title: "True/False Blitz", emoji: "⚡", text: "60 seconds. Does the meaning match the term?" },
  { id: "odd", title: "Odd One Out", emoji: "🔎", text: "Three belong to one topic. Spot the intruder." },
  { id: "hangman", title: "Bio Hangman", emoji: "🔤", text: "Read the meaning, spell the term – spelling counts in Section A!" },
];

function finish(xp: number, reason: string) {
  bumpStat("games");
  addXp(xp, reason);
}

function readBest(key: string) {
  try { return Number(window.localStorage.getItem(`lifemzansi:best:${key}`) ?? 0); } catch { return 0; }
}
function saveBest(key: string, v: number) {
  try { window.localStorage.setItem(`lifemzansi:best:${key}`, String(v)); } catch { /* storage blocked */ }
}

// ---------------------------------------------------------------- Speed Solve
const SPEED = GENERATORS.filter((g) => g.speed);
const SPEED_SECONDS = 90;

function SpeedSolve() {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(SPEED_SECONDS);
  const [seed, setSeed] = useState(1);
  const [n, setN] = useState(0);
  const [value, setValue] = useState("");
  const [score, setScore] = useState({ right: 0, skipped: 0 });
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [best, setBest] = useState(0);
  const ended = useRef(false);
  useEffect(() => setBest(readBest("speed")), []);
  const problem = useMemo(() => {
    const r = seededRandom(`${seed}-${n}`);
    return SPEED[Math.floor(r() * SPEED.length)].make(`${seed}-${n}`);
  }, [seed, n]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      if (!ended.current) {
        ended.current = true;
        if (score.right > best) { saveBest("speed", score.right); setBest(score.right); }
        finish(Math.min(50, score.right * 4), "Speed Bio");
      }
      return;
    }
    const t = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, left, score.right, best]);

  const submit = () => {
    if (!running || !value.trim()) return;
    const res = checkAnswer(value, problem);
    if (res.ok) {
      setScore((s) => ({ ...s, right: s.right + 1 }));
      bumpStat("calculations");
      setFlash("ok");
      setValue("");
      setN((x) => x + 1);
    } else setFlash("bad");
    setTimeout(() => setFlash(null), 300);
  };
  const skip = () => { setScore((s) => ({ ...s, skipped: s.skipped + 1 })); setValue(""); setN((x) => x + 1); };
  const start = () => { ended.current = false; setLeft(SPEED_SECONDS); setScore({ right: 0, skipped: 0 }); setN(0); setValue(""); setSeed(Date.now()); setRunning(true); };

  if (!running && left === SPEED_SECONDS) {
    return (
      <div className="text-center">
        <p className="text-muted">Quick-fire Life Sciences: biological terms for every topic, complementary DNA, mRNA and anticodons, base percentages, gametes and chromosome numbers. Type the answer and press Enter.</p>
        <p className="mt-2 text-sm">Your best: <strong>{best}</strong></p>
        <Button size="lg" className="mt-4" onClick={start}><Play className="h-4 w-4" /> Start</Button>
      </div>
    );
  }
  if (!running) {
    return (
      <div className="text-center" role="status">
        <div className="text-5xl">⏱️</div>
        <h3 className="mt-2 font-display text-3xl font-bold">{score.right} solved</h3>
        <p className="text-muted">{score.skipped} skipped · best {best}</p>
        <Button className="mt-4" onClick={start}><RotateCcw className="h-4 w-4" /> Play again</Button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span className={cn("flex items-center gap-1 font-mono font-bold", left <= 10 && "text-danger")}><Timer className="h-4 w-4" />{left}s</span><span><strong className="text-success">{score.right}</strong> solved</span></div>
      <div className="mt-1 h-1 overflow-hidden rounded bg-surface-2"><div className="h-full bg-brand transition-[width] duration-1000 ease-linear" style={{ width: `${(left / SPEED_SECONDS) * 100}%` }} /></div>
      <div className={cn("mt-3 rounded-3xl border-2 p-5 transition", flash === "ok" ? "border-success bg-success/10" : flash === "bad" ? "border-danger bg-danger/10" : "border-line bg-surface")}>
        <Markdown md={problem.q} className="prose-learn text-lg font-semibold" />
        <div className="mt-3"><AnswerInput key={n} value={value} onChange={setValue} onSubmit={submit} kind={problem.kind ?? inferKind(problem.answer)} /></div>
        <div className="mt-2 flex gap-2"><Button onClick={submit} disabled={!value.trim()}><Check className="h-4 w-4" /> Enter</Button><Button variant="ghost" onClick={skip}><SkipForward className="h-4 w-4" /> Skip</Button></div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- This or That?
const DASH_SECONDS = 60;

function DeviceDash() {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(DASH_SECONDS);
  const [seed, setSeed] = useState(1);
  const [n, setN] = useState(0);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [best, setBest] = useState(0);
  const ended = useRef(false);
  useEffect(() => setBest(readBest("dash")), []);
  const item = useMemo(() => {
    const r = seededRandom(`${seed}-${n}`);
    const f = DASH[Math.floor(r() * DASH.length)];
    const left = r() < 0.5;
    return { f, options: left ? [f.answer, f.other] : [f.other, f.answer] };
  }, [seed, n]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      if (!ended.current) {
        ended.current = true;
        if (score.right > best) { saveBest("dash", score.right); setBest(score.right); }
        finish(Math.min(40, score.right * 2), "This or That?");
      }
      return;
    }
    const t = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, left, score.right, best]);

  const answer = (k: 0 | 1) => {
    if (!running) return;
    const pick = item.options[k];
    const ok = pick === item.f.answer;
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), wrong: s.wrong + (ok ? 0 : 1) }));
    setFlash({ ok, text: ok ? "✓" : `It's ${item.f.answer}: ${item.f.why}` });
    setTimeout(() => setFlash(null), ok ? 250 : 1600);
    setN((x) => x + 1);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (!running) return; if (e.key === "ArrowLeft") answer(0); if (e.key === "ArrowRight") answer(1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const start = () => { ended.current = false; setLeft(DASH_SECONDS); setScore({ right: 0, wrong: 0 }); setN(0); setSeed(Date.now()); setRunning(true); };

  if (!running) {
    return (
      <div className="text-center" role={left === DASH_SECONDS ? undefined : "status"}>
        {left !== DASH_SECONDS && <><div className="text-5xl">⚖️</div><h3 className="mt-2 font-display text-3xl font-bold">{score.right} correct</h3><p className="text-muted">{score.wrong} wrong</p></>}
        <p className="mt-2 text-muted">A description appears with two possible answers – the classic compare-and-contrast pairs of the syllabus. Pick the right one as fast as you can. Keys: ← and →.</p>
        <p className="mt-1 text-sm">Your best: <strong>{best}</strong></p>
        <Button size="lg" className="mt-4" onClick={start}>{left === DASH_SECONDS ? <><Play className="h-4 w-4" /> Start</> : <><RotateCcw className="h-4 w-4" /> Play again</>}</Button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span className={cn("flex items-center gap-1 font-mono font-bold", left <= 10 && "text-danger")}><Timer className="h-4 w-4" />{left}s</span><span><strong className="text-success">{score.right}</strong> · <strong className="text-danger">{score.wrong}</strong></span></div>
      <div className={cn("mt-3 rounded-3xl border-2 p-6 text-center transition", flash ? (flash.ok ? "border-success bg-success/10" : "border-danger bg-danger/10") : "border-line bg-surface")}>
        <div className="font-display text-2xl font-bold">{item.f.s}</div>
        {flash && !flash.ok && <p className="mt-3 text-sm">{flash.text}</p>}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button size="lg" variant="secondary" onClick={() => answer(0)}><span>← {item.options[0]}</span></Button>
        <Button size="lg" variant="secondary" onClick={() => answer(1)}><span>{item.options[1]} →</span></Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Who am I?
function WhoAmI({ riddles }: { riddles: Riddle[] }) {
  const [round, setRound] = useState(() => Date.now());
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const set = useMemo(() => {
    const q = riddles[Math.floor(seededRandom(round)() * riddles.length)];
    const sameTopic = riddles.filter((x) => x.topic === q.topic && x.answer !== q.answer).map((x) => x.answer);
    const others = riddles.filter((x) => x.answer !== q.answer).map((x) => x.answer);
    const decoys = [...new Set([...shuffle(sameTopic, `${round}s`), ...shuffle(others, `${round}o`)])].slice(0, 3);
    return { q, options: shuffle([q.answer, ...decoys], `${round}c`) };
  }, [riddles, round]);
  if (!riddles.length) return null;
  return (
    <div>
      <p className="text-sm text-muted">Who am I? <span className="font-semibold" style={{ color: topicMeta(set.q.topic).colour }}>({topicLabel(set.q.topic)})</span></p>
      <blockquote className="mt-3 rounded-2xl border-l-4 border-cell bg-cell/5 p-4 font-display text-xl leading-snug">“{set.q.riddle}”</blockquote>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {set.options.map((o) => {
          const right = o === set.q.answer;
          return (
            <button key={o} disabled={picked !== null} onClick={() => { setPicked(o); setScore((s) => ({ right: s.right + (right ? 1 : 0), total: s.total + 1 })); if (right && (score.right + 1) % 5 === 0) finish(15, "Who Am I? streak"); }}
              className={cn("rounded-xl border-2 p-3 text-left font-semibold transition", picked && right ? "border-success bg-success/10" : picked === o ? "border-danger bg-danger/10" : "border-line hover:border-cell/50")}>
              {o}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3"><Button size="sm" disabled={!picked} onClick={() => { setRound(Date.now()); setPicked(null); }}>Next riddle</Button><span className="text-sm text-muted">Score {score.right}/{score.total}</span></div>
    </div>
  );
}

// ---------------------------------------------------------------- Pairs
function Pairs({ terms }: { terms: GameTerm[] }) {
  const [seed, setSeed] = useState(() => Date.now());
  const pairs = useMemo(() => shuffle(terms, seed).slice(0, 6), [terms, seed]);
  const cards = useMemo(() => shuffle(pairs.flatMap((p, k) => [{ k, text: p.term, kind: "term" as const }, { k, text: p.def, kind: "def" as const }]), seed + 1), [pairs, seed]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const won = matched.length === pairs.length && pairs.length > 0;

  const click = (i: number) => {
    if (open.length === 2 || open.includes(i) || matched.includes(cards[i].k)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((x) => cards[x]);
      if (a.k === b.k && a.kind !== b.kind) {
        const m2 = [...matched, a.k];
        setMatched(m2);
        setOpen([]);
        if (m2.length === pairs.length) finish(30, "Concept Pairs won");
      } else setTimeout(() => setOpen([]), 1100);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm"><span className="text-muted">Moves: <strong className="text-fg">{moves}</strong> · Pairs: <strong className="text-fg">{matched.length}/{pairs.length}</strong></span><Button size="sm" variant="secondary" onClick={() => { setSeed(Date.now()); setOpen([]); setMatched([]); setMoves(0); }}><RotateCcw className="h-4 w-4" /> New deal</Button></div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c, i) => {
          const shown = open.includes(i) || matched.includes(c.k);
          const colour = topicMeta(pairs[c.k].topic).colour;
          return (
            <button key={i} onClick={() => click(i)} aria-label={shown ? c.text : "Hidden card"}
              className={cn("min-h-28 rounded-2xl border-2 p-2 text-center transition", shown ? "bg-surface" : "bg-gradient-to-br from-brand to-diversity text-white hover:brightness-110", matched.includes(c.k) && "opacity-70")}
              style={shown ? { borderColor: colour } : { borderColor: "transparent" }}>
              {shown ? <span className={cn("block", c.kind === "term" ? "font-display text-base font-bold" : "text-xs leading-snug")}><InlineMd md={c.text} /></span> : <span className="font-display text-2xl">?</span>}
            </button>
          );
        })}
      </div>
      {won && <div role="status" className="mt-4 rounded-2xl bg-success/10 p-4 text-center font-semibold">🎉 All pairs matched in {moves} moves! +30 XP</div>}
    </div>
  );
}

// ---------------------------------------------------------------- Blitz
function Blitz({ terms }: { terms: GameTerm[] }) {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(60);
  const [n, setN] = useState(0);
  const [seed, setSeed] = useState(1);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [best, setBest] = useState(0);
  useEffect(() => setBest(readBest("blitz")), []);

  const item = useMemo(() => {
    const r = seededRandom(`${seed}-${n}`);
    const t = terms[Math.floor(r() * terms.length)];
    const truth = r() < 0.5;
    let def = t.def;
    if (!truth) {
      const same = terms.filter((x) => x.topic === t.topic && x.term !== t.term);
      def = same[Math.floor(r() * same.length)]?.def ?? t.def;
    }
    return { term: t.term, def, truth: truth || def === t.def, topic: t.topic };
  }, [terms, n, seed]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      if (score.right > best) { saveBest("blitz", score.right); setBest(score.right); }
      finish(Math.min(40, score.right * 2), "True/False Blitz");
      return;
    }
    const t = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(t);
  }, [running, left, score.right, best]);

  const answer = (v: boolean) => {
    if (!running) return;
    const ok = v === item.truth;
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), wrong: s.wrong + (ok ? 0 : 1) }));
    setFlash(ok ? "ok" : "bad");
    setTimeout(() => setFlash(null), 250);
    setN((x) => x + 1);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (!running) return; if (e.key === "ArrowLeft" || e.key === "f") answer(false); if (e.key === "ArrowRight" || e.key === "t") answer(true); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!running && left === 60) {
    return (
      <div className="text-center">
        <p className="text-muted">A term and a meaning appear. Do they match? Answer as many as you can in 60 seconds. Keys: ← false, → true.</p>
        <p className="mt-2 text-sm">Your best: <strong>{best}</strong></p>
        <Button size="lg" className="mt-4" onClick={() => { setRunning(true); setSeed(Date.now()); }}><Play className="h-4 w-4" /> Start</Button>
      </div>
    );
  }
  if (!running) {
    return (
      <div className="text-center" role="status">
        <div className="text-5xl">⚡</div>
        <h3 className="mt-2 font-display text-3xl font-bold">{score.right} correct</h3>
        <p className="text-muted">{score.wrong} wrong · best {best}</p>
        <Button className="mt-4" onClick={() => { setLeft(60); setScore({ right: 0, wrong: 0 }); setN(0); setSeed(Date.now()); setRunning(true); }}><RotateCcw className="h-4 w-4" /> Play again</Button>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-1 font-mono font-bold"><Timer className="h-4 w-4" />{left}s</span><span><strong className="text-success">{score.right}</strong> · <strong className="text-danger">{score.wrong}</strong></span></div>
      <div className={cn("mt-3 rounded-3xl border-2 p-6 text-center transition", flash === "ok" ? "border-success bg-success/10" : flash === "bad" ? "border-danger bg-danger/10" : "border-line bg-surface")}>
        <div className="text-xs font-bold" style={{ color: topicMeta(item.topic).colour }}>{topicLabel(item.topic)}</div>
        <div className="mt-1 font-display text-2xl font-bold"><InlineMd md={item.term} /></div>
        <div className="mt-3"><InlineMd md={item.def} /></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button size="lg" variant="danger" onClick={() => answer(false)}><X className="h-5 w-5" /> False</Button>
        <Button size="lg" variant="success" onClick={() => answer(true)}><Check className="h-5 w-5" /> True</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Odd one out
function OddOneOut({ terms }: { terms: GameTerm[] }) {
  const [round, setRound] = useState(() => Date.now());
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const set = useMemo(() => {
    const r = seededRandom(round);
    const topics = shuffle(TOPICS.map((t) => t.topic).filter((t) => terms.filter((x) => x.topic === t).length >= 3), round);
    const main = topics[0];
    const other = topics[1 + Math.floor(r() * (topics.length - 1))];
    const three = shuffle(terms.filter((t) => t.topic === main), `${round}a`).slice(0, 3);
    const odd = shuffle(terms.filter((t) => t.topic === other), `${round}b`)[0];
    return { main, odd, options: shuffle([...three, odd], `${round}c`) };
  }, [terms, round]);

  return (
    <div>
      <p className="text-sm text-muted">Which term does NOT belong with the others?</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {set.options.map((o) => {
          const isOdd = o.term === set.odd.term;
          return (
            <button key={o.term} disabled={picked !== null} onClick={() => { setPicked(o.term); setScore((s) => ({ right: s.right + (isOdd ? 1 : 0), total: s.total + 1 })); if (isOdd && (score.right + 1) % 5 === 0) finish(15, "Odd One Out streak"); }}
              className={cn("rounded-2xl border-2 p-4 font-display font-bold transition", picked && isOdd ? "border-success bg-success/10" : picked === o.term ? "border-danger bg-danger/10" : "border-line hover:border-brand/50")}>
              <InlineMd md={o.term} />
              {picked && <span className="mt-1 block text-xs font-normal" style={{ color: topicMeta(o.topic).colour }}>{topicLabel(o.topic)}</span>}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3 text-sm" role="status">
          <strong><InlineMd md={set.odd.term} /></strong> belongs to {topicLabel(set.odd.topic)}; the others are {topicLabel(set.main)}. <span className="text-muted"><InlineMd md={set.odd.def} /></span>
        </div>
      )}
      <div className="mt-3 flex items-center gap-3"><Button size="sm" disabled={!picked} onClick={() => { setRound(Date.now()); setPicked(null); }}>Next</Button><span className="text-sm text-muted">Score {score.right}/{score.total}</span></div>
    </div>
  );
}

// ---------------------------------------------------------------- Hangman
function Hangman({ terms }: { terms: GameTerm[] }) {
  // Only plain words (no formulas), and hide the word itself if the definition gives it away.
  const pool = useMemo(() => terms.filter((t) => t.term.length <= 22 && /^[A-Za-z \-]+$/.test(t.term) && !t.def.toLowerCase().includes(t.term.toLowerCase())), [terms]);
  const [seed, setSeed] = useState(() => Date.now());
  const target = useMemo(() => shuffle(pool, seed)[0], [pool, seed]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const word = target?.term.toUpperCase() ?? "";
  const letters = [...new Set(word.replace(/[^A-Z]/g, "").split(""))];
  const wrong = guessed.filter((g) => !letters.includes(g));
  const lives = 6 - wrong.length;
  const won = letters.every((l) => guessed.includes(l));
  const lost = lives <= 0;

  const guess = (l: string) => {
    if (won || lost || guessed.includes(l)) return;
    const next = [...guessed, l];
    setGuessed(next);
    const w = letters.every((x) => next.includes(x));
    if (w) finish(15, "Hangman solved");
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (/^[a-z]$/i.test(e.key)) guess(e.key.toUpperCase()); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  if (!target) return null;
  return (
    <div>
      <div className="rounded-2xl bg-surface-2 p-4">
        <div className="text-xs font-bold" style={{ color: topicMeta(target.topic).colour }}>{topicLabel(target.topic)}</div>
        <div className="mt-1"><InlineMd md={target.def} /></div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5 font-mono text-2xl font-bold" aria-live="polite">
        {word.split("").map((ch, i) => /[A-Z]/.test(ch) ? (
          <span key={i} className={cn("grid h-10 w-8 place-items-center border-b-4", lost && !guessed.includes(ch) ? "border-danger text-danger" : "border-brand")}>{guessed.includes(ch) || lost ? ch : ""}</span>
        ) : <span key={i} className="grid h-10 w-4 place-items-center">{ch === " " ? "" : ch}</span>)}
      </div>
      <div className="mt-3 flex justify-center gap-1" aria-label={`${lives} lives left`}>{Array.from({ length: 6 }, (_, i) => <Heart key={i} className={cn("h-5 w-5", i < lives ? "fill-danger text-danger" : "text-line")} />)}</div>
      {(won || lost) ? (
        <div className="mt-4 text-center" role="status">
          <p className="font-semibold">{won ? "🎉 Spot on – and spelled correctly!" : `The answer was ${target.term}.`}</p>
          <Button className="mt-2" onClick={() => { setSeed(Date.now()); setGuessed([]); }}>Next word</Button>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap justify-center gap-1">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
            <button key={l} onClick={() => guess(l)} disabled={guessed.includes(l)} className={cn("h-9 w-9 rounded-lg border text-sm font-bold", guessed.includes(l) ? (letters.includes(l) ? "border-success bg-success/15" : "border-line opacity-40") : "border-line hover:border-brand")}>{l}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Games({ terms, riddles }: { terms: GameTerm[]; riddles: Riddle[] }) {
  const [game, setGame] = useState<Game>("speed");
  const [topic, setTopic] = useState<Topic | null>(null);
  const live = TOPICS.filter((t) => terms.some((x) => x.topic === t.topic));
  const pool = topic && game !== "odd" ? terms.filter((t) => t.topic === topic) : terms;
  const usesTerms = game === "pairs" || game === "blitz" || game === "hangman";
  // Games shuffle with Date.now(), so render them only in the browser (avoids hydration mismatches).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold tracking-tight">Games room</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">Quick, fun ways to drill the {terms.length} key terms, {DASH.length} compare-and-contrast pairs and {riddles.length} riddles. Great for a 5-minute brain break that still counts.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {GAMES.map((g) => (
          <button key={g.id} onClick={() => setGame(g.id)} aria-pressed={game === g.id} className={cn("rounded-2xl border-2 p-4 text-left transition", game === g.id ? "border-cell bg-cell/10" : "border-line bg-surface hover:border-cell/40")}>
            <div className="text-3xl">{g.emoji}</div>
            <div className="mt-1 font-display font-bold">{g.title}</div>
            <div className="text-xs text-muted">{g.text}</div>
          </button>
        ))}
      </div>
      {usesTerms && (
        <label className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">Topic:</span>
          <select value={topic ?? ""} onChange={(e) => setTopic((e.target.value || null) as Topic | null)} className="rounded-xl border border-line bg-surface px-3 py-2">
            <option value="">All topics</option>
            {STRANDS.map((st) => (
              <optgroup key={st.strand} label={st.strand}>
                {live.filter((t) => t.strand === st.strand).map((t) => <option key={t.topic} value={t.topic}>{t.emoji} {t.title}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
      )}
      <div className="mt-6 rounded-3xl border border-line bg-surface p-5" key={`${game}-${topic}`}>
        {!mounted && <div className="h-64 animate-pulse rounded-2xl bg-surface-2" />}
        {mounted && game === "speed" && <SpeedSolve />}
        {mounted && game === "drcr" && <DeviceDash />}
        {mounted && game === "who" && <WhoAmI riddles={riddles} />}
        {mounted && game === "pairs" && <Pairs terms={pool} />}
        {mounted && game === "blitz" && <Blitz terms={pool} />}
        {mounted && game === "odd" && <OddOneOut terms={terms} />}
        {mounted && game === "hangman" && <Hangman terms={pool} />}
      </div>
    </div>
  );
}
