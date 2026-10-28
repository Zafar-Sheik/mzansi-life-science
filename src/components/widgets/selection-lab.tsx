"use client";
import { useMemo, useState } from "react";
import { Bird, RotateCcw, SkipForward } from "lucide-react";
import { seededRandom } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Explain, useToolUse } from "./sim-kit";
import { Plot } from "./plot";
import { Segmented, Toggle, WidgetFrame } from "./widget-frame";

interface Beetle { id: number; dark: boolean; x: number; y: number }
const POP = 40;
const EAT = 20;

function scatter(darks: boolean[], seed: string): Beetle[] {
  const r = seededRandom(seed);
  return darks.map((dark, i) => ({ id: i, dark, x: 14 + r() * 372, y: 14 + r() * 172 }));
}

/**
 * Natural selection with beetles and birds: on a light or dark background,
 * the beetles that stand out get eaten. Be the bird (tap to eat) or let the
 * birds hunt, then let the survivors breed – and watch the population change
 * over the generations.
 */
export function SelectionLab() {
  const touch = useToolUse();
  const [bg, setBg] = useState<"light" | "dark">("dark");
  const [gen, setGen] = useState(0);
  const [darks, setDarks] = useState<boolean[]>(() => Array.from({ length: POP }, (_, i) => i < 8));
  const [eaten, setEaten] = useState<Set<number>>(new Set());
  const [birdMode, setBirdMode] = useState(true);
  const [history, setHistory] = useState<number[]>([20]);
  const [mutation, setMutation] = useState(true);
  const beetles = useMemo(() => scatter(darks, `g${gen}-${bg}`), [darks, gen, bg]);
  const pctDark = Math.round((darks.filter(Boolean).length / POP) * 100);
  const done = eaten.size >= EAT;

  const eat = (b: Beetle) => {
    if (!birdMode || done || eaten.has(b.id)) return;
    touch();
    setEaten((e) => new Set(e).add(b.id));
  };
  const birdsHunt = () => {
    touch();
    // Conspicuous beetles are three times as likely to be spotted.
    const r = seededRandom(`hunt-${gen}-${bg}`);
    const pool = beetles.filter((b) => !eaten.has(b.id));
    const next = new Set(eaten);
    while (next.size < EAT) {
      const weights = pool.filter((b) => !next.has(b.id)).map((b) => ({ b, w: (b.dark ? bg === "light" : bg === "dark") ? 3 : 1 }));
      const total = weights.reduce((s, x) => s + x.w, 0);
      let pickAt = r() * total;
      for (const { b, w } of weights) {
        pickAt -= w;
        if (pickAt <= 0) { next.add(b.id); break; }
      }
    }
    setEaten(next);
  };
  const breed = () => {
    touch();
    const survivors = beetles.filter((b) => !eaten.has(b.id)).map((b) => b.dark);
    const r = seededRandom(`breed-${gen}`);
    // Each survivor has two offspring with its own colour (a rare mutation can flip it).
    const kids = survivors.flatMap((d) => [d, d]).map((d) => (mutation && r() < 0.03 ? !d : d)).slice(0, POP);
    setDarks(kids);
    setEaten(new Set());
    setGen((g) => g + 1);
    setHistory((h) => [...h, Math.round((kids.filter(Boolean).length / POP) * 100)]);
  };
  const reset = () => { setGen(0); setDarks(Array.from({ length: POP }, (_, i) => i < 8)); setEaten(new Set()); setHistory([20]); };

  return (
    <WidgetFrame title="Natural selection lab" colour="var(--t-diversity)" instruction={birdMode ? `You are a hungry bird. Eat ${EAT} beetles as fast as you can – then let the survivors breed.` : "Let the birds hunt, then let the survivors breed. Repeat for several generations."}>
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour="var(--t-diversity)" value={bg} onChange={(v) => { setBg(v); setEaten(new Set()); }} options={[{ id: "dark", label: "Dark soil (after a fire)" }, { id: "light", label: "Light sand" }]} />
        <Toggle on={birdMode} onChange={setBirdMode}>I&apos;m the bird</Toggle>
        <Toggle on={mutation} onChange={setMutation}>Rare mutations</Toggle>
        <span className="ml-auto text-sm font-semibold">Generation {gen} · {pctDark}% dark</span>
      </div>
      <svg viewBox="0 0 400 200" className="diagram mt-3 rounded-2xl border border-line" style={{ background: bg === "dark" ? "#3f2d20" : "#e9d8a6" }} role="group" aria-label={`Beetles on ${bg} background: ${pctDark}% dark. ${eaten.size} eaten.`}>
        {bg === "dark" ? <path d="M0,40c40,-10 80,20 120,5s90,15 140,0s100,20 140,10M0,120c50,10 90,-15 150,0s110,15 160,-5s60,10 90,5" stroke="#2a1d13" strokeWidth={10} fill="none" /> : <path d="M0,50c40,-8 90,15 140,4s100,12 150,0s70,14 110,6M0,150c60,8 110,-12 160,0s100,10 150,-6s60,8 90,4" stroke="#d6c08a" strokeWidth={8} fill="none" />}
        {beetles.map((b) => (eaten.has(b.id) ? (
          <text key={b.id} x={b.x} y={b.y + 4} textAnchor="middle" fontSize={10} opacity={0.6}>✕</text>
        ) : (
          <g key={b.id} onClick={() => eat(b)} style={{ cursor: birdMode && !done ? "pointer" : "default" }} role={birdMode ? "button" : undefined} aria-label={birdMode ? `${b.dark ? "Dark" : "Light"} beetle` : undefined}>
            <ellipse cx={b.x} cy={b.y} rx={7} ry={9} fill={b.dark ? "#2b1d14" : "#e4cf98"} stroke={b.dark ? "#1a120c" : "#cdb57a"} />
            <line x1={b.x} y1={b.y - 9} x2={b.x} y2={b.y + 9} stroke={b.dark ? "#4a3526" : "#bfa56a"} strokeWidth={0.8} />
          </g>
        )))}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!birdMode && <Button size="sm" onClick={birdsHunt} disabled={done}><Bird className="h-4 w-4" /> Birds hunt</Button>}
        {birdMode && <span className="text-sm">Eaten: <strong>{eaten.size}/{EAT}</strong></span>}
        <Button size="sm" variant={done ? "primary" : "secondary"} onClick={breed} disabled={!done}><SkipForward className="h-4 w-4" /> Survivors breed → next generation</Button>
        <Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" /> Start again</Button>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Plot curves={[{ points: history.map((p, i) => [i, p] as [number, number]), colour: "var(--t-diversity)" }]} xMax={Math.max(6, history.length - 1)} xTicks={Math.max(6, history.length - 1)} yMax={100} xLabel="Generation" yLabel="% dark beetles" height={190} />
        <Explain colour="var(--t-diversity)">
          This is <strong>natural selection</strong>, step by step: (1) there is <strong>variation</strong> in colour, which is inherited; (2) more offspring are produced than can survive; (3) beetles that are <strong>camouflaged</strong> are less likely to be eaten – they are better adapted; (4) the survivors <strong>reproduce</strong> and pass on their alleles; (5) over many generations the proportion of the favourable characteristic <strong>increases</strong>. The environment selects – the beetles don&apos;t choose to change colour (that was Lamarck&apos;s mistake).
        </Explain>
      </div>
    </WidgetFrame>
  );
}
