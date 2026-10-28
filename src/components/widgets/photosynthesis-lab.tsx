"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Explain, useCalm, useToolUse } from "./sim-kit";
import { Plot } from "./plot";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

type Vary = "light" | "co2" | "temp";

/** Rate of photosynthesis (bubbles per minute) – the smallest of the three limits, times an enzyme factor for temperature. */
export function photoRate(light: number, co2: number, temp: number) {
  const fromLight = 60 * (light / 100);
  const fromCo2 = 60 * Math.min(1, co2 / 0.1);
  const enzyme = temp <= 35 ? Math.max(0, temp / 35) : Math.max(0, 1 - (temp - 35) / 15);
  return Math.max(0, Math.min(fromLight, fromCo2) * enzyme);
}

/**
 * Pondweed (Elodea) in a test tube under a lamp: change the light intensity,
 * CO₂ concentration and temperature, count the oxygen bubbles and see which
 * factor is limiting – with the graph of rate against the factor you vary.
 */
export function PhotosynthesisLab() {
  const touch = useToolUse();
  const calm = useCalm();
  const [light, setLight] = useState(50);
  const [co2, setCo2] = useState(0.04);
  const [temp, setTemp] = useState(25);
  const [vary, setVary] = useState<Vary>("light");
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [bubbles, setBubbles] = useState<{ id: number; x: number }[]>([]);
  const idRef = useRef(0);
  const rate = photoRate(light, co2, temp);

  const limiting = useMemo(() => {
    const l = 60 * (light / 100);
    const c = 60 * Math.min(1, co2 / 0.1);
    if (temp > 40) return "temperature (too hot – the enzymes are denaturing)";
    if (temp < 12) return "temperature (too cold – the enzymes work slowly)";
    if (Math.abs(l - c) < 2) return "light AND carbon dioxide (both are equally short)";
    return l < c ? "light intensity" : "carbon dioxide concentration";
  }, [light, co2, temp]);

  useEffect(() => {
    if (!running || rate <= 0) return;
    const ms = Math.max(120, 60000 / rate / 4);
    const t = window.setInterval(() => {
      idRef.current += 1;
      setCount((c) => c + 1);
      if (!calm) setBubbles((b) => [...b.slice(-12), { id: idRef.current, x: 150 + Math.random() * 30 }]);
    }, ms);
    return () => window.clearInterval(t);
  }, [running, rate, calm]);

  const curve = useMemo(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 40; i++) {
      if (vary === "light") pts.push([(i / 40) * 100, photoRate((i / 40) * 100, co2, temp)]);
      else if (vary === "co2") pts.push([(i / 40) * 0.2, photoRate(light, (i / 40) * 0.2, temp)]);
      else pts.push([(i / 40) * 50, photoRate(light, co2, (i / 40) * 50)]);
    }
    return pts;
  }, [vary, light, co2, temp]);
  const marker = vary === "light" ? { x: light, y: rate } : vary === "co2" ? { x: co2, y: rate } : { x: temp, y: rate };

  return (
    <WidgetFrame title="Photosynthesis lab: limiting factors" colour="var(--t-energy)" instruction="Change one factor at a time, press Start and watch the oxygen bubbles. Which factor is limiting the rate?">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <svg viewBox="0 0 320 220" className="diagram rounded-2xl border border-line bg-bg" role="img" aria-label={`Pondweed under a lamp producing about ${Math.round(rate)} bubbles per minute`}>
            <circle cx={50} cy={60} r={22} fill="#facc15" opacity={0.25 + light / 130} />
            <path d="M28,40L18,30M50,32L50,20M72,40L82,30" stroke="#f59e0b" strokeWidth={2} opacity={light / 100} />
            <rect x={36} y={80} width={28} height={10} rx={2} fill="#64748b" />
            <text x={50} y={110} textAnchor="middle" fontSize={10} className="muted">lamp</text>
            <rect x={120} y={40} width={90} height={160} rx={10} fill="#e0f2fe" opacity={0.7} stroke="#0284c7" />
            <text x={165} y={215} textAnchor="middle" fontSize={10} className="muted">water + {co2.toFixed(2).replace(".", ",")}% CO₂ · {temp} °C</text>
            <path d="M165,190C160,170 172,160 162,140C155,125 170,112 165,95" stroke="#15803d" strokeWidth={5} fill="none" />
            <path d="M163,175l-14,-6M166,160l14,-8M162,140l-13,-5M167,125l13,-6M164,110l-12,-6" stroke="#22c55e" strokeWidth={4} strokeLinecap="round" />
            {bubbles.map((b) => (
              <circle key={b.id} cx={b.x} cy={92} r={3.5} fill="#bae6fd" stroke="#0284c7">
                <animate attributeName="cy" from="92" to="40" dur="1.4s" fill="freeze" />
                <animate attributeName="opacity" from="1" to="0" dur="1.4s" fill="freeze" />
              </circle>
            ))}
            <text x={265} y={80} textAnchor="middle" fontSize={11} fontWeight={700}>O₂ bubbles</text>
            <text x={265} y={105} textAnchor="middle" fontSize={22} fontWeight={800} style={{ fill: "var(--t-energy)" }}>{count}</text>
            <text x={265} y={128} textAnchor="middle" fontSize={10} className="muted">≈ {Math.round(rate)} per min</text>
          </svg>
          <div className="mt-2 flex gap-2">
            <Button size="sm" onClick={() => { touch(); setRunning((r) => !r); }}>{running ? <><Pause className="h-4 w-4" /> Stop</> : <><Play className="h-4 w-4" /> Start</>}</Button>
            <Button size="sm" variant="ghost" onClick={() => { setCount(0); setBubbles([]); }}><RotateCcw className="h-4 w-4" /> Reset count</Button>
          </div>
        </div>
        <div className="space-y-3">
          <Slider label="Light intensity (%)" value={light} min={0} max={100} onChange={(v) => { touch(); setLight(v); }} colour="var(--t-energy)" />
          <Slider label="CO₂ concentration (%)" value={co2} min={0} max={0.2} step={0.01} onChange={(v) => { touch(); setCo2(v); }} colour="var(--t-energy)" format={(v) => v.toFixed(2).replace(".", ",")} />
          <Slider label="Temperature (°C)" value={temp} min={0} max={50} onChange={(v) => { touch(); setTemp(v); }} colour="var(--t-energy)" />
          <div className="flex items-center gap-2 text-xs"><span className="font-semibold">Graph against:</span><Segmented colour="var(--t-energy)" value={vary} onChange={setVary} options={[{ id: "light", label: "Light" }, { id: "co2", label: "CO₂" }, { id: "temp", label: "Temperature" }]} /></div>
          <Plot curves={[{ points: curve, colour: "var(--t-energy)" }]} marker={marker} xMax={vary === "light" ? 100 : vary === "co2" ? 0.2 : 50} yMax={60} xLabel={vary === "light" ? "Light intensity (%)" : vary === "co2" ? "CO₂ concentration (%)" : "Temperature (°C)"} yLabel="Rate (bubbles/min)" height={190} />
        </div>
      </div>
      <Explain colour="var(--t-energy)">
        Right now the <strong>limiting factor is {limiting}</strong>. A limiting factor is the factor in shortest supply – increasing it speeds up photosynthesis; increasing the others does nothing. Where the graph <strong>levels off (plateaus)</strong>, something else has become limiting. Above about 35 °C the rate drops because the <strong>enzymes</strong> of the dark phase start to denature.
        <span className="mt-1 block text-xs text-muted">Investigation tip: independent variable = the factor you change; dependent variable = number of bubbles per minute; keep the other two factors (and the same plant) constant.</span>
      </Explain>
    </WidgetFrame>
  );
}
