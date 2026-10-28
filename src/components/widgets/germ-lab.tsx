"use client";
import { useEffect, useMemo, useState } from "react";
import { Pause, Pill, Play, RotateCcw } from "lucide-react";
import { seededRandom } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Explain, useCalm, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

type Mode = "herd" | "antibiotics" | "handwash";
const COLS = 20;
const ROWS = 10;
type Cell = "s" | "v" | "i" | "r"; // susceptible, vaccinated, infected, recovered

/**
 * The germ lab: herd immunity (how vaccines protect even people who can't be
 * vaccinated), why you must finish a course of antibiotics, and how
 * handwashing breaks the chain of infection.
 */
export function GermLab({ mode: initial = "herd" }: { mode?: Mode }) {
  const touch = useToolUse();
  const calm = useCalm();
  const [mode, setMode] = useState<Mode>(initial);

  // ---- herd immunity
  const [vax, setVax] = useState(40);
  const [run, setRun] = useState(0);
  const start = useMemo(() => {
    const r = seededRandom(`town-${vax}-${run}`);
    const g: Cell[] = Array.from({ length: COLS * ROWS }, () => (r() * 100 < vax ? "v" : "s"));
    const sus = g.map((c, i) => (c === "s" ? i : -1)).filter((i) => i >= 0);
    if (sus.length) g[sus[Math.floor(r() * sus.length)]] = "i";
    return g;
  }, [vax, run]);
  const [grid, setGrid] = useState<Cell[]>(start);
  const [ticks, setTicks] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { setGrid(start); setTicks(0); setPlaying(false); }, [start]);
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      setGrid((g) => {
        const r = seededRandom(`spread-${run}-${ticks}`);
        const next = [...g];
        g.forEach((c, i) => {
          if (c !== "i") return;
          const x = i % COLS;
          const y = Math.floor(i / COLS);
          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]]) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
            const j = ny * COLS + nx;
            if (g[j] === "s" && r() < 0.55) next[j] = "i";
          }
          next[i] = "r";
        });
        if (!next.includes("i")) setPlaying(false);
        return next;
      });
      setTicks((n) => n + 1);
    }, calm ? 700 : 350);
    return () => window.clearTimeout(t);
  }, [playing, ticks, run, calm]);
  const caught = grid.filter((c) => c === "i" || c === "r").length;
  const unvaccinated = grid.filter((c) => c !== "v").length;

  // ---- antibiotics
  const [day, setDay] = useState(0);
  const [stopAt, setStopAt] = useState<number | null>(null);
  const bacteria = useMemo(() => {
    const r = seededRandom("bugs");
    return Array.from({ length: 120 }, (_, i) => ({ id: i, res: r() ** 2.2, x: r() * 380 + 10, y: r() * 120 + 10 }));
  }, []);
  const dose = (d: number) => (stopAt !== null && d > stopAt ? 0 : Math.min(1, d / 7));
  const killedBy = (d: number) => {
    // Each day of treatment kills bacteria whose resistance is below a rising threshold.
    let t = 0;
    for (let k = 1; k <= d; k++) t = Math.max(t, dose(k));
    return t;
  };
  const threshold = killedBy(day);
  const regrow = stopAt !== null && day > stopAt;
  const survivors = bacteria.filter((b) => b.res >= threshold);
  // After stopping early, the resistant survivors multiply again.
  const copies = regrow ? Math.min(3, day - (stopAt ?? 0)) : 0;
  const alive = survivors.flatMap((b) => Array.from({ length: copies + 1 }, (_, k) => ({ ...b, id: b.id * 10 + k, x: (b.x + k * 37) % 380 + 10, y: (b.y + k * 29) % 120 + 10 })));

  // ---- handwashing
  const [washed, setWashed] = useState<"none" | "water" | "soap">("none");
  const germs = { none: 100, water: 55, soap: 5 }[washed];

  return (
    <WidgetFrame title="The germ lab" colour="var(--t-daily)" instruction={mode === "herd" ? "Set how many people are vaccinated, then start an outbreak." : mode === "antibiotics" ? "Take the antibiotics day by day – or stop as soon as you feel better." : "How clean are your hands really?"}>
      <Segmented colour="var(--t-daily)" value={mode} onChange={(m) => { touch(); setMode(m); }} options={[{ id: "herd", label: "Vaccines & herd immunity" }, { id: "antibiotics", label: "Finish your antibiotics" }, { id: "handwash", label: "Handwashing" }]} />

      {mode === "herd" && (
        <div className="mt-4">
          <Slider label="People vaccinated (%)" value={vax} min={0} max={95} step={5} onChange={(v) => { touch(); setVax(v); }} colour="var(--t-daily)" />
          <svg viewBox={`0 0 ${COLS * 20} ${ROWS * 20}`} className="diagram mt-3 rounded-2xl border border-line bg-bg" role="img" aria-label={`${caught} people infected out of ${unvaccinated} unvaccinated`}>
            {grid.map((c, i) => <circle key={i} cx={(i % COLS) * 20 + 10} cy={Math.floor(i / COLS) * 20 + 10} r={7} fill={c === "v" ? "#60a5fa" : c === "i" ? "#dc2626" : c === "r" ? "#9ca3af" : "#fde68a"} />)}
          </svg>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <span><span className="inline-block h-3 w-3 rounded-full bg-[#60a5fa]" /> vaccinated</span>
            <span><span className="inline-block h-3 w-3 rounded-full bg-[#fde68a]" /> not vaccinated</span>
            <span><span className="inline-block h-3 w-3 rounded-full bg-[#dc2626]" /> infected</span>
            <span><span className="inline-block h-3 w-3 rounded-full bg-[#9ca3af]" /> had the disease</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => { touch(); setPlaying((p) => !p); }} disabled={!grid.includes("i")}>{playing ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Spread the disease</>}</Button>
            <Button size="sm" variant="ghost" onClick={() => setRun((r) => r + 1)}><RotateCcw className="h-4 w-4" /> New town</Button>
            <span className="self-center text-sm font-semibold">{caught} of {unvaccinated} unvaccinated people caught it ({Math.round((caught / Math.max(1, unvaccinated)) * 100)}%)</span>
          </div>
          <Explain colour="var(--t-daily)">A <strong>vaccine</strong> contains a dead or weakened pathogen (or part of it). Your lymphocytes make <strong>antibodies</strong> and <strong>memory cells</strong> without you getting sick (artificial active immunity). When enough people are vaccinated, the pathogen can&apos;t find new people to infect – this <strong>herd immunity</strong> protects babies and people who can&apos;t be vaccinated. Try 0%, 40% and 80%.</Explain>
        </div>
      )}

      {mode === "antibiotics" && (
        <div className="mt-4">
          <svg viewBox="0 0 400 140" className="diagram rounded-2xl border border-line bg-bg" role="img" aria-label={`Day ${day}: ${alive.length} bacteria alive`}>
            {alive.map((b) => <rect key={b.id} x={b.x} y={b.y} width={12} height={6} rx={3} fill={`hsl(${120 - b.res * 120} 70% 45%)`} />)}
          </svg>
          <div className="mt-1 text-xs text-muted">Colour = how resistant each bacterium is: green = easily killed, red = more resistant.</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => { touch(); setDay((d) => Math.min(14, d + 1)); }} disabled={day >= 14}><Pill className="h-4 w-4" /> Next day</Button>
            <Button size="sm" variant="secondary" onClick={() => { touch(); setStopAt(day); }} disabled={stopAt !== null || day === 0 || day >= 7}>I feel better – stop taking them</Button>
            <Button size="sm" variant="ghost" onClick={() => { setDay(0); setStopAt(null); }}><RotateCcw className="h-4 w-4" /> Start again</Button>
            <span className="text-sm font-semibold">Day {day} · {alive.length} bacteria alive{stopAt !== null ? ` · stopped on day ${stopAt}` : day >= 7 ? " · course finished" : ""}</span>
          </div>
          <Explain colour="var(--t-daily)">
            {stopAt === null && day < 7 && <>Each day the antibiotic kills the most sensitive bacteria first. You feel better after 2–3 days, but the <strong>more resistant ones are still alive</strong>.</>}
            {stopAt === null && day >= 7 && <>Finishing the whole course kills even the more resistant bacteria. ✅ Your immune system mops up the rest.</>}
            {stopAt !== null && <>Stopping early left the <strong>most resistant bacteria</strong> alive. They multiply, and the infection comes back – now <strong>harder to treat</strong>. Over time this creates <strong>antibiotic-resistant superbugs</strong> (like drug-resistant TB). That is <strong>natural selection</strong> in action. Antibiotics also do nothing against viruses (colds, flu, COVID-19).</>}
          </Explain>
        </div>
      )}

      {mode === "handwash" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Segmented colour="var(--t-daily)" value={washed} onChange={(w) => { touch(); setWashed(w); }} options={[{ id: "none", label: "Not washed" }, { id: "water", label: "Water only" }, { id: "soap", label: "Soap for 20 s" }]} />
            <svg viewBox="0 0 200 200" className="diagram mx-auto mt-3 max-w-[220px]" role="img" aria-label={`Hand with about ${germs}% of germs remaining`}>
              <path d="M70,190L70,110C60,100 40,80 50,70C58,62 68,75 75,85L75,40C75,30 90,30 90,40L90,90L92,25C92,15 107,15 107,25L107,90L110,30C110,20 125,20 125,30L125,92L128,45C128,36 142,36 142,46L142,130C142,160 130,190 110,190Z" fill="#fcd5b5" stroke="#b45309" strokeWidth={2} />
              {Array.from({ length: Math.round(germs / 3) }, (_, i) => { const r = seededRandom(`g${i}`); return <circle key={i} cx={75 + r() * 60} cy={60 + r() * 120} r={2.5} fill="#16a34a" />; })}
            </svg>
          </div>
          <Explain colour="var(--t-daily)"><strong>≈ {germs}% of germs left.</strong> Soap breaks up the fatty layer around many viruses and lifts bacteria off the skin so the water can rinse them away. Wash for 20 seconds (sing &quot;Happy Birthday&quot; twice) – before you eat or cook, and after the toilet, changing nappies, coughing or handling raw meat. Handwashing prevents diarrhoea, which kills thousands of young children in South Africa every year.</Explain>
        </div>
      )}
    </WidgetFrame>
  );
}
