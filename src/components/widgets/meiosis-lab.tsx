"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Explain, useCalm, useToolUse } from "./sim-kit";
import { Toggle, WidgetFrame } from "./widget-frame";

const RED = "#e11d48";
const BLUE = "#2563eb";
type Key = "r1" | "b1" | "r2" | "b2";
const LEN: Record<Key, number> = { r1: 64, b1: 64, r2: 36, b2: 36 };
const COL: Record<Key, string> = { r1: RED, b1: BLUE, r2: RED, b2: BLUE };

interface Item { k: Key; x: number; y: number; n: 1 | 2; which?: 0 | 1; s?: number }
interface Scene { cells: { x: number; y: number; r: number; nucleus?: boolean }[]; items: Item[]; spindles?: [number, number][]; poles?: [number, number][] }

const PHASES = [
  { id: "interphase", name: "Interphase", text: "The cell grows and the DNA replicates. Each chromosome now has two identical chromatids – but the DNA is still long, thin chromatin and can't be seen." },
  { id: "prophase1", name: "Prophase I", text: "Chromosomes shorten and thicken. Homologous chromosomes pair up (a bivalent). Crossing over can happen: non-sister chromatids exchange pieces at a chiasma. The nuclear membrane disappears and the spindle forms." },
  { id: "metaphase1", name: "Metaphase I", text: "Homologous PAIRS line up at the equator. Each pair lines up randomly (random arrangement) – the second source of variation. Spindle fibres attach to the centromeres." },
  { id: "anaphase1", name: "Anaphase I", text: "Spindle fibres shorten. One chromosome of each pair is pulled to each pole. The chromatids stay together." },
  { id: "telophase1", name: "Telophase I", text: "A nuclear membrane forms around each set and the cytoplasm divides. Two cells, each haploid (n) – but each chromosome still has two chromatids." },
  { id: "prophase2", name: "Prophase II", text: "In each of the two cells the nuclear membrane disappears again and a new spindle forms. No DNA replication happens before meiosis II." },
  { id: "metaphase2", name: "Metaphase II", text: "Individual chromosomes (not pairs) line up at the equator of each cell. Spindle fibres attach to each centromere." },
  { id: "anaphase2", name: "Anaphase II", text: "The centromeres split. Sister chromatids separate and are pulled to opposite poles – each is now a chromosome." },
  { id: "telophase2", name: "Telophase II", text: "Nuclear membranes form and the cytoplasm divides. Result: FOUR haploid cells (gametes), all genetically different." },
] as const;

const spread = (n: number, mid = 150, gap = 78) => (n === 1 ? [mid] : n === 2 ? [mid - gap / 2, mid + gap / 2] : [mid - gap * 0.7, mid, mid + gap * 0.7]);

function scene(phase: number, nd: boolean): Scene {
  const left: Key[] = nd ? ["r1", "b2", "r2"] : ["r1", "b2"];
  const right: Key[] = nd ? ["b1"] : ["b1", "r2"];
  switch (PHASES[phase].id) {
    case "interphase":
      return { cells: [{ x: 200, y: 150, r: 120, nucleus: true }], items: [] };
    case "prophase1":
      return { cells: [{ x: 200, y: 150, r: 120 }], items: [{ k: "r1", x: 168, y: 150, n: 2 }, { k: "b1", x: 186, y: 150, n: 2 }, { k: "r2", x: 228, y: 150, n: 2 }, { k: "b2", x: 246, y: 150, n: 2 }] };
    case "metaphase1": {
      const items: Item[] = [{ k: "r1", x: 188, y: 105, n: 2 }, { k: "b1", x: 212, y: 105, n: 2 }, { k: "b2", x: 188, y: 200, n: 2 }, { k: "r2", x: 212, y: 200, n: 2 }];
      return { cells: [{ x: 200, y: 150, r: 120 }], items, poles: [[90, 150], [310, 150]], spindles: items.map((it) => [it.x, it.y]) };
    }
    case "anaphase1": {
      const items: Item[] = [{ k: "r1", x: 125, y: 110, n: 2 }, { k: "b1", x: 275, y: 110, n: 2 }, ...(nd ? [{ k: "b2" as Key, x: 115, y: 195, n: 2 as const }, { k: "r2" as Key, x: 140, y: 195, n: 2 as const }] : [{ k: "b2" as Key, x: 125, y: 195, n: 2 as const }, { k: "r2" as Key, x: 275, y: 195, n: 2 as const }])];
      return { cells: [{ x: 200, y: 150, r: 120 }], items, poles: [[90, 150], [310, 150]], spindles: items.map((it) => [it.x, it.y]) };
    }
    case "telophase1":
    case "prophase2":
      return {
        cells: [{ x: 110, y: 150, r: 88 }, { x: 290, y: 150, r: 88 }],
        items: [...left.map((k, i) => ({ k, x: 110, y: spread(left.length)[i], n: 2 as const })), ...right.map((k, i) => ({ k, x: 290, y: spread(right.length)[i], n: 2 as const }))],
      };
    case "metaphase2": {
      const items: Item[] = [...left.map((k, i) => ({ k, x: 110, y: spread(left.length)[i], n: 2 as const })), ...right.map((k, i) => ({ k, x: 290, y: spread(right.length)[i], n: 2 as const }))];
      return { cells: [{ x: 110, y: 150, r: 88 }, { x: 290, y: 150, r: 88 }], items, poles: [[35, 150], [185, 150], [215, 150], [365, 150]], spindles: items.map((it) => [it.x, it.y]) };
    }
    case "anaphase2": {
      const items: Item[] = [...left, ...right].flatMap((k) => {
        const cx = left.includes(k) ? 110 : 290;
        const list = left.includes(k) ? left : right;
        const y = spread(list.length)[list.indexOf(k)];
        return [{ k, x: cx - 42, y, n: 1 as const, which: 0 as const }, { k, x: cx + 42, y, n: 1 as const, which: 1 as const }];
      });
      return { cells: [{ x: 110, y: 150, r: 88 }, { x: 290, y: 150, r: 88 }], items, poles: [[35, 150], [185, 150], [215, 150], [365, 150]], spindles: items.map((it) => [it.x, it.y]) };
    }
    default: {
      const xs = [52, 152, 248, 348];
      const items: Item[] = [];
      [left, right].forEach((list, side) => list.forEach((k, i) => {
        const y = spread(list.length, 150, 48)[i];
        items.push({ k, x: xs[side * 2], y, n: 1, which: 0, s: 0.62 }, { k, x: xs[side * 2 + 1], y, n: 1, which: 1, s: 0.62 });
      }));
      return { cells: xs.map((x) => ({ x, y: 150, r: 46 })), items };
    }
  }
}

function Chromatid({ x, y, len, colour, tip }: { x: number; y: number; len: number; colour: string; tip?: string }) {
  return (
    <g>
      <rect x={x - 4} y={y - len / 2} width={8} height={len} rx={4} fill={colour} />
      {tip && <rect x={x - 4} y={y + len / 2 - len * 0.32} width={8} height={len * 0.32} rx={4} fill={tip} />}
    </g>
  );
}

/**
 * Meiosis stepper: two pairs of homologous chromosomes (red from the mother,
 * blue from the father) through all nine phases, with switches for crossing
 * over and non-disjunction.
 */
export function MeiosisLab() {
  const touch = useToolUse();
  const calm = useCalm();
  const [phase, setPhase] = useState(0);
  const [cross, setCross] = useState(true);
  const [nd, setNd] = useState(false);
  const [playing, setPlaying] = useState(false);
  const sc = scene(phase, nd);
  const tip = (k: Key, which: 0 | 1) => (cross && phase >= 1 && k === "r1" && which === 1 ? BLUE : cross && phase >= 1 && k === "b1" && which === 0 ? RED : undefined);

  useEffect(() => {
    if (!playing) return;
    if (phase >= PHASES.length - 1) { setPlaying(false); return; }
    const t = window.setTimeout(() => setPhase((p) => p + 1), calm ? 4000 : 2600);
    return () => window.clearTimeout(t);
  }, [playing, phase, calm]);

  const counts = phase === PHASES.length - 1 ? [nd ? 3 : 2, nd ? 3 : 2, nd ? 1 : 2, nd ? 1 : 2] : null;

  return (
    <WidgetFrame title="Meiosis step by step" colour="var(--t-cell)" instruction="Red chromosomes came from the mother, blue from the father. Step through, or press Play.">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => { touch(); setPhase((p) => Math.max(0, p - 1)); }} disabled={phase === 0} aria-label="Previous phase"><ChevronLeft className="h-4 w-4" /></Button>
        <Button size="sm" onClick={() => { touch(); if (phase === PHASES.length - 1) setPhase(0); setPlaying((p) => !p); }}>{playing ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Play</>}</Button>
        <Button size="sm" variant="secondary" onClick={() => { touch(); setPhase((p) => Math.min(PHASES.length - 1, p + 1)); }} disabled={phase === PHASES.length - 1} aria-label="Next phase"><ChevronRight className="h-4 w-4" /></Button>
        <Toggle on={cross} onChange={(v) => { touch(); setCross(v); }}>Crossing over</Toggle>
        <Toggle on={nd} onChange={(v) => { touch(); setNd(v); }}>Non-disjunction in anaphase I</Toggle>
      </div>
      <ol className="mt-3 flex gap-1 overflow-x-auto no-scrollbar">
        {PHASES.map((p, i) => (
          <li key={p.id}><button onClick={() => { touch(); setPhase(i); setPlaying(false); }} aria-current={i === phase ? "step" : undefined} className={cn("rounded-lg px-2 py-1 text-xs font-semibold whitespace-nowrap", i === phase ? "bg-cell text-white" : i < 5 ? "bg-surface-2 text-muted" : "bg-cell/10 text-muted")}>{p.name}</button></li>
        ))}
      </ol>
      <svg viewBox="0 0 400 300" className="diagram mx-auto mt-3 max-w-2xl rounded-2xl border border-line bg-bg" role="img" aria-label={`${PHASES[phase].name}: ${PHASES[phase].text}`}>
        {sc.cells.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r={c.r} style={{ fill: "color-mix(in oklab, var(--t-cell) 6%, var(--surface))", stroke: "var(--t-cell)" }} strokeWidth={2} />
            {c.nucleus && <circle cx={c.x} cy={c.y} r={52} fill="none" style={{ stroke: "var(--text-muted)" }} strokeDasharray="4 3" strokeWidth={1.5} />}
          </g>
        ))}
        {sc.cells[0].nucleus && <path d="M160,140c10,-20 20,20 30,0s20,20 30,0s15,15 25,0M165,165c10,-15 25,15 35,0s20,15 30,0" fill="none" stroke={RED} strokeWidth={2} />}
        {sc.cells[0].nucleus && <path d="M168,125c10,15 20,-15 30,0s20,-15 30,0M170,180c10,15 20,-12 30,0s20,-12 25,0" fill="none" stroke={BLUE} strokeWidth={2} />}
        {sc.poles?.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} style={{ fill: "var(--text-muted)" }} />)}
        {sc.spindles?.map(([x, y], i) => {
          const poles = sc.poles ?? [];
          const near = [...poles].sort((a, b) => Math.hypot(a[0] - x, a[1] - y) - Math.hypot(b[0] - x, b[1] - y));
          return near.slice(0, PHASES[phase].id.startsWith("anaphase") ? 1 : 2).map((p, j) => <line key={`${i}-${j}`} x1={p[0]} y1={p[1]} x2={x} y2={y} strokeWidth={0.8} style={{ stroke: "var(--text-muted)" }} />);
        })}
        {sc.items.map((it, i) => {
          const len = LEN[it.k] * (it.s ?? 1);
          if (it.n === 2) {
            return (
              <g key={i}>
                <Chromatid x={it.x - 4.5} y={it.y} len={len} colour={COL[it.k]} tip={tip(it.k, 0)} />
                <Chromatid x={it.x + 4.5} y={it.y} len={len} colour={COL[it.k]} tip={tip(it.k, 1)} />
                <circle cx={it.x} cy={it.y} r={4} style={{ fill: "var(--text)" }} />
              </g>
            );
          }
          return <g key={i}><Chromatid x={it.x} y={it.y} len={len} colour={COL[it.k]} tip={tip(it.k, it.which ?? 0)} /><circle cx={it.x} cy={it.y} r={3} style={{ fill: "var(--text)" }} /></g>;
        })}
        {cross && phase === 1 && <text x={177} y={196} textAnchor="middle" fontSize={11} fontWeight={700} style={{ fill: "var(--text)" }}>chiasma ✕</text>}
        {counts && counts.map((n, i) => <text key={i} x={[52, 152, 248, 348][i]} y={222} textAnchor="middle" fontSize={11} fontWeight={700} style={{ fill: n === 2 ? "var(--text)" : "var(--danger)" }}>{n === 2 ? "n = 2" : n === 3 ? "n + 1" : "n − 1"}</text>)}
        <text x={200} y={290} textAnchor="middle" fontSize={11} style={{ fill: "var(--text-muted)" }}>{phase < 5 ? "Meiosis I – homologous pairs separate" : "Meiosis II – chromatids separate"}</text>
      </svg>
      <Explain colour="var(--t-cell)">
        <strong>{PHASES[phase].name}.</strong> {PHASES[phase].text}
        {phase === PHASES.length - 1 && (nd
          ? <> <strong className="text-danger">Non-disjunction:</strong> one pair did not separate, so two gametes have an extra chromosome (n + 1) and two are missing one (n − 1). If an n + 1 gamete fuses with a normal one, the zygote is 2n + 1 – this is how trisomy 21 (Down syndrome) happens.</>
          : <> {cross ? "Because of crossing over and random arrangement, every gamete is different – that is genetic variation." : "Switch on crossing over to see how chromatids end up with a mix of the mother's and father's genes."}</>)}
      </Explain>
    </WidgetFrame>
  );
}
