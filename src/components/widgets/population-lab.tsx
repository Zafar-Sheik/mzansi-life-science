"use client";
import { useMemo, useState } from "react";
import { Eye, Fish, RotateCcw } from "lucide-react";
import { seededRandom } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { celebrate, Explain, useToolUse } from "./sim-kit";
import { Plot } from "./plot";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

type Mode = "capture" | "growth" | "predator";

/** Logistic growth (S-curve) and geometric growth (J-curve), and a predator–prey model. */
const logistic = (t: number, r: number, K: number, N0 = 10) => K / (1 + ((K - N0) / N0) * Math.exp(-r * t));
const geometric = (t: number, r: number, N0 = 10) => N0 * Math.exp(r * t);
function predatorPrey(steps: number) {
  let prey = 60;
  let pred = 15;
  const out: { t: number; prey: number; pred: number }[] = [];
  for (let t = 0; t <= steps; t++) {
    out.push({ t, prey, pred });
    // Four small time steps per month keep the cycles smooth.
    for (let k = 0; k < 4; k++) {
      const dPrey = 0.3 * prey * (1 - prey / 2000) - 0.012 * prey * pred;
      const dPred = 0.0025 * prey * pred - 0.25 * pred;
      prey = Math.max(1, prey + dPrey * 0.25);
      pred = Math.max(1, pred + dPred * 0.25);
    }
  }
  return out;
}

/**
 * Population ecology lab: estimate the number of fish in a pond with the
 * mark–recapture method, and explore J- and S-shaped growth curves and
 * predator–prey cycles.
 */
export function PopulationLab({ mode: initial = "capture" }: { mode?: Mode }) {
  const touch = useToolUse();
  const [mode, setMode] = useState<Mode>(initial);
  // Mark–recapture
  const [trial, setTrial] = useState(1);
  const actual = useMemo(() => 120 + Math.floor(seededRandom(`pond-${Math.ceil(trial / 4)}`)() * 220), [trial]);
  const fish = useMemo(() => {
    const r = seededRandom(`fish-${Math.ceil(trial / 4)}`);
    return Array.from({ length: actual }, (_, i) => ({ id: i, x: 8 + r() * 384, y: 8 + r() * 184 }));
  }, [actual, trial]);
  const [M, setM] = useState(40);
  const [C, setC] = useState(50);
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [caught, setCaught] = useState<number[]>([]);
  const [reveal, setReveal] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const R = caught.filter((i) => marked.has(i)).length;
  const estimate = R ? Math.round((M * C) / R) : null;

  const catch1 = () => {
    touch();
    const r = seededRandom(`c1-${trial}`);
    const ids = new Set<number>();
    while (ids.size < Math.min(M, actual)) ids.add(Math.floor(r() * actual));
    setMarked(ids);
    setStage(1);
    setCaught([]);
    setReveal(false);
  };
  const catch2 = () => {
    touch();
    const r = seededRandom(`c2-${trial}-${M}-${C}`);
    const ids = new Set<number>();
    while (ids.size < Math.min(C, actual)) ids.add(Math.floor(r() * actual));
    const list = [...ids];
    setCaught(list);
    setStage(2);
    const rr = list.filter((i) => marked.has(i)).length;
    if (rr) setHistory((h) => [...h.slice(-5), Math.round((M * C) / rr)]);
    if (rr && Math.abs((M * C) / rr - actual) / actual < 0.1) celebrate();
  };
  const again = () => { setTrial((t) => t + 1); setStage(0); setMarked(new Set()); setCaught([]); setReveal(false); };
  const newPond = () => { setTrial((t) => Math.ceil(t / 4) * 4 + 1); setStage(0); setMarked(new Set()); setCaught([]); setReveal(false); setHistory([]); };

  // Growth curves
  const [r, setR] = useState(0.5);
  const [K, setK] = useState(500);
  const pp = useMemo(() => predatorPrey(120), []);

  return (
    <WidgetFrame title="Population ecology lab" colour="var(--t-eco)" instruction={mode === "capture" ? "Estimate how many fish live in the pond without counting them all." : mode === "growth" ? "Change the growth rate and the carrying capacity." : "Watch how predator and prey numbers rise and fall together."}>
      <Segmented colour="var(--t-eco)" value={mode} onChange={(m) => { touch(); setMode(m); }} options={[{ id: "capture", label: "Mark–recapture" }, { id: "growth", label: "Growth curves" }, { id: "predator", label: "Predator & prey" }]} />

      {mode === "capture" && (
        <div className="mt-4">
          <svg viewBox="0 0 400 200" className="diagram rounded-2xl border border-line" style={{ background: "color-mix(in oklab, #0ea5e9 14%, var(--bg))" }} role="img" aria-label={`A pond with fish. ${marked.size} marked. ${stage === 2 ? `Second catch: ${C} fish, ${R} marked.` : ""}`}>
            {fish.map((f) => {
              const isMarked = marked.has(f.id);
              const isCaught = stage === 2 && caught.includes(f.id);
              return <ellipse key={f.id} cx={f.x} cy={f.y} rx={isCaught ? 5 : 3.5} ry={isCaught ? 3 : 2.2} fill={isMarked ? "#f97316" : "#475569"} opacity={stage === 2 && !isCaught ? 0.25 : 0.9} stroke={isCaught ? "var(--text)" : undefined} strokeWidth={isCaught ? 1 : 0} />;
            })}
          </svg>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Slider label="1st catch: fish to mark (M)" value={M} min={10} max={80} onChange={(v) => { setM(v); setStage(0); setMarked(new Set()); setCaught([]); }} colour="var(--t-eco)" />
              <Slider label="2nd catch: fish caught (C)" value={C} min={10} max={100} onChange={(v) => { setC(v); if (stage === 2) setStage(1); }} colour="var(--t-eco)" />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={catch1}><Fish className="h-4 w-4" /> 1. Catch, mark &amp; release</Button>
                <Button size="sm" onClick={catch2} disabled={stage === 0}><Fish className="h-4 w-4" /> 2. Recapture (a week later)</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={again} disabled={stage < 2}><RotateCcw className="h-4 w-4" /> Repeat in the same pond</Button>
                <Button size="sm" variant="ghost" onClick={newPond}>New pond</Button>
              </div>
            </div>
            <div className="rounded-2xl bg-surface-2/60 p-3 text-sm">
              <div>Marked in the 1st sample (M): <strong>{stage ? marked.size : "–"}</strong></div>
              <div>Caught in the 2nd sample (C): <strong>{stage === 2 ? C : "–"}</strong></div>
              <div>Marked fish recaptured (R): <strong>{stage === 2 ? R : "–"}</strong></div>
              <div className="mt-2 font-mono">N = (M × C) ÷ R {stage === 2 && R ? `= (${M} × ${C}) ÷ ${R} = ` : ""}<strong className="text-eco">{estimate ?? "?"}</strong></div>
              {stage === 2 && !R && <p className="mt-1 text-warning">No marked fish recaptured – catch more fish!</p>}
              {history.length > 1 && <div className="mt-2 text-xs text-muted">Your estimates: {history.join(", ")} → mean <strong>{Math.round(history.reduce((a, b) => a + b, 0) / history.length)}</strong></div>}
              <button onClick={() => setReveal(true)} className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand"><Eye className="h-3.5 w-3.5" /> Reveal the real number</button>
              {reveal && <div className="mt-1 font-semibold">Actual population: {actual}</div>}
            </div>
          </div>
          <Explain colour="var(--t-eco)">The estimate works if the marked fish <strong>mix evenly</strong> with the others, marks don&apos;t harm the fish or rub off, and there are <strong>no births, deaths, immigration or emigration</strong> between the two samples. Bigger samples and <strong>repeating</strong> the count (then taking the mean) make the estimate more <strong>reliable</strong>.</Explain>
        </div>
      )}

      {mode === "growth" && (
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="space-y-3">
            <Slider label="Growth rate" value={r} min={0.1} max={1} step={0.05} onChange={(v) => { touch(); setR(v); }} colour="var(--t-eco)" format={(v) => v.toFixed(2).replace(".", ",")} />
            <Slider label="Carrying capacity (K)" value={K} min={200} max={900} step={50} onChange={(v) => { touch(); setK(v); }} colour="var(--t-eco)" />
            <ul className="space-y-1 text-sm">
              <li><strong className="text-eco">Lag phase</strong> – few individuals, slow growth.</li>
              <li><strong className="text-eco">Exponential (log) phase</strong> – plenty of food and space, fast growth.</li>
              <li><strong className="text-eco">Stationary phase</strong> – environmental resistance (food, space, predators, disease): births = deaths at the carrying capacity.</li>
            </ul>
          </div>
          <div>
            <Plot curves={[
              { points: Array.from({ length: 61 }, (_, i) => [i / 2, Math.min(1000, geometric(i / 2, r))] as [number, number]), colour: "#dc2626", label: "Geometric (J)", dashed: true },
              { points: Array.from({ length: 61 }, (_, i) => [i / 2, logistic(i / 2, r, K)] as [number, number]), colour: "var(--t-eco)", label: "Logistic (S)" },
              { points: [[0, K], [30, K]], colour: "var(--text-muted)", label: "Carrying capacity", dashed: true },
            ]} xMax={30} yMax={1000} xLabel="Time (weeks)" yLabel="Population size" />
            <Explain colour="var(--t-eco)">A <strong>geometric (J-shaped)</strong> curve grows without limits – it only happens for a short time (bacteria in fresh nutrients, the human population since 1800). Real populations follow a <strong>logistic (S-shaped)</strong> curve and level off at the <strong>carrying capacity</strong>.</Explain>
          </div>
        </div>
      )}

      {mode === "predator" && (
        <div className="mt-4">
          <Plot curves={[
            { points: pp.map((p) => [p.t, p.prey] as [number, number]), colour: "#16a34a", label: "Prey (e.g. springbok)" },
            { points: pp.map((p) => [p.t, p.pred] as [number, number]), colour: "#dc2626", label: "Predator (e.g. cheetah)" },
          ]} xMax={120} yMax={220} xLabel="Time (months)" yLabel="Number of animals" height={240} />
          <Explain colour="var(--t-eco)">When prey are plentiful, predators have lots of food and their numbers rise. More predators eat more prey, so prey numbers fall. Then predators starve and decrease, and the prey recover. The predator peak always comes <strong>after</strong> the prey peak, and there are usually <strong>fewer predators</strong> than prey (energy is lost at each trophic level).</Explain>
        </div>
      )}
    </WidgetFrame>
  );
}
