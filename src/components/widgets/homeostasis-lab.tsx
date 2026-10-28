"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Explain, useToolUse } from "./sim-kit";
import { Plot } from "./plot";
import { Segmented, Slider, Toggle, WidgetFrame } from "./widget-frame";

type Mode = "glucose" | "temperature" | "water";

function Gauge({ label, value, min, max, lo, hi, unit }: { label: string; value: number; min: number; max: number; lo: number; hi: number; unit: string }) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const ok = value >= lo && value <= hi;
  return (
    <div>
      <div className="flex justify-between text-sm"><span className="font-semibold">{label}</span><span className={cn("font-mono font-bold", ok ? "text-success" : "text-danger")}>{value.toFixed(1).replace(".", ",")} {unit}</span></div>
      <div className="relative mt-1 h-4 rounded-full bg-surface-2">
        <div className="absolute inset-y-0 rounded-full bg-success/25" style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} />
        <div className="absolute top-1/2 h-6 w-1.5 -translate-y-1/2 rounded bg-fg transition-[left] duration-500" style={{ left: `calc(${Math.min(100, Math.max(0, pct(value)))}% - 3px)` }} />
      </div>
      <div className="mt-0.5 text-[10px] text-muted">green band = normal range ({String(lo).replace(".", ",")}–{String(hi).replace(".", ",")} {unit})</div>
    </div>
  );
}

/**
 * Homeostasis by negative feedback: blood glucose (insulin and glucagon), body
 * temperature (sweating, shivering, vasodilation, vasoconstriction) and water
 * balance (ADH). Push the body out of balance and watch it correct itself.
 */
export function HomeostasisLab({ mode: initial = "glucose" }: { mode?: Mode }) {
  const touch = useToolUse();
  const [mode, setMode] = useState<Mode>(initial);
  const [running, setRunning] = useState(true);
  // Glucose
  const [glucose, setGlucose] = useState(5);
  const [diabetes, setDiabetes] = useState(false);
  const [gHist, setGHist] = useState<number[]>([5]);
  // Temperature
  const [outside, setOutside] = useState(22);
  const [exercise, setExercise] = useState(false);
  const [core, setCore] = useState(37);
  // Water
  const [water, setWater] = useState(100);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      if (mode === "glucose") {
        setGlucose((g) => {
          if (g > 6 && !diabetes) return g - Math.min(1, (g - 5) * 0.35);
          if (g > 6 && diabetes) return g - 0.08; // only a little is lost in the urine
          if (g < 4) return g + Math.min(0.8, (5 - g) * 0.4);
          return g + (5 - g) * 0.1;
        });
      } else if (mode === "temperature") {
        setCore((c) => {
          const load = (outside - 25) * 0.04 + (exercise ? 0.6 : 0);
          const correct = (37 - c) * 0.5;
          return Math.max(30, Math.min(43, c + load + correct));
        });
      } else {
        setWater((w) => w + (100 - w) * 0.25);
      }
    }, 800);
    return () => window.clearInterval(t);
  }, [running, mode, diabetes, outside, exercise]);

  useEffect(() => {
    setGHist((h) => [...h.slice(-39), glucose]);
  }, [glucose]);

  const glucoseState = glucose > 6 ? (diabetes ? "high – but there is no insulin!" : "high → pancreas secretes insulin") : glucose < 4 ? "low → pancreas secretes glucagon" : "normal";
  const responses = core > 37.4 ? ["Vasodilation: skin arterioles widen, more blood flows near the skin, more heat is lost by radiation", "Sweat glands secrete more sweat – it evaporates and cools the skin", "Hair erector muscles relax – hairs lie flat"] : core < 36.6 ? ["Vasoconstriction: skin arterioles narrow, less blood near the skin, less heat lost", "Less sweat", "Shivering – muscles contract and release heat (respiration)", "Hair erector muscles contract – hairs stand up and trap air (goosebumps)"] : ["Hypothalamus: all normal – no response needed"];

  return (
    <WidgetFrame title="Homeostasis lab: negative feedback" colour="var(--t-body)" instruction="Push the body out of balance and watch it bring itself back.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour="var(--t-body)" value={mode} onChange={(m) => { touch(); setMode(m); }} options={[{ id: "glucose", label: "Blood glucose" }, { id: "temperature", label: "Body temperature" }, { id: "water", label: "Water balance" }]} />
        <Button size="sm" variant="ghost" onClick={() => setRunning((r) => !r)}>{running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Run</>}</Button>
      </div>

      {mode === "glucose" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Gauge label="Blood glucose" value={glucose} min={1} max={14} lo={4} hi={6} unit="mmol/L" />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => { touch(); setGlucose((g) => g + 4); }}>🍞 Eat a big meal</Button>
              <Button size="sm" variant="secondary" onClick={() => { touch(); setGlucose((g) => Math.max(1.5, g - 2)); }}>🏃 Run / skip lunch</Button>
            </div>
            <Toggle on={diabetes} onChange={(v) => { touch(); setDiabetes(v); }}>Type 1 diabetes (no insulin made)</Toggle>
            <div className={cn("rounded-xl p-3 text-sm font-semibold", glucose > 6 ? "bg-warning/10" : glucose < 4 ? "bg-info/10" : "bg-success/10")}>Glucose is {glucoseState}</div>
          </div>
          <div>
            <Plot curves={[{ points: gHist.map((g, i) => [i, g] as [number, number]), colour: "var(--t-body)" }, { points: [[0, 6], [40, 6]], colour: "var(--success)", dashed: true }, { points: [[0, 4], [40, 4]], colour: "var(--success)", dashed: true }]} xMax={40} yMax={14} xLabel="Time" yLabel="Glucose (mmol/L)" height={190} />
            <Explain colour="var(--t-body)">
              {glucose > 6 && !diabetes && <><strong>Too high:</strong> the pancreas (islets of Langerhans) secretes <strong>insulin</strong> → the liver and muscles take up glucose and convert it to <strong>glycogen</strong>; cells use more glucose → level drops back to normal.</>}
              {glucose > 6 && diabetes && <><strong>No insulin:</strong> glucose can&apos;t be stored as glycogen, so it stays high and spills into the urine. People with type 1 diabetes inject insulin; type 2 is linked to diet and weight and is controlled with exercise, diet and medicine.</>}
              {glucose < 4 && <><strong>Too low:</strong> the pancreas secretes <strong>glucagon</strong> → the liver converts <strong>glycogen back into glucose</strong> → level rises back to normal.</>}
              {glucose >= 4 && glucose <= 6 && <>Normal. This is <strong>negative feedback</strong>: any change from normal triggers a response that <em>reverses</em> the change.</>}
            </Explain>
          </div>
        </div>
      )}

      {mode === "temperature" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Slider label="Outside temperature (°C)" value={outside} min={-5} max={45} onChange={(v) => { touch(); setOutside(v); }} colour="var(--t-body)" />
            <Toggle on={exercise} onChange={(v) => { touch(); setExercise(v); }}>Playing soccer (muscles release heat)</Toggle>
            <Gauge label="Core body temperature" value={core} min={33} max={41} lo={36.5} hi={37.5} unit="°C" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted uppercase">The hypothalamus responds</div>
            <ul className="mt-1 space-y-1 text-sm">{responses.map((r) => <li key={r} className="rounded-lg bg-surface-2 px-2 py-1">{r}</li>)}</ul>
            <Explain colour="var(--t-body)">Thermoreceptors in the skin and hypothalamus detect the change; the <strong>hypothalamus</strong> sends impulses to the skin and muscles (effectors). If the responses can&apos;t keep up you get <strong>hyperthermia</strong> (heat stroke) or <strong>hypothermia</strong>.</Explain>
          </div>
        </div>
      )}

      {mode === "water" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Gauge label="Water in the blood" value={water} min={80} max={120} lo={97} hi={103} unit="%" />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => { touch(); setWater((w) => Math.min(120, w + 12)); }}>💧 Drink 1 litre of water</Button>
              <Button size="sm" variant="secondary" onClick={() => { touch(); setWater((w) => Math.max(80, w - 12)); }}>☀️ Sweat in the sun / eat salty chips</Button>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-surface-2 p-3"><div className="text-xs text-muted">ADH secreted</div><div className="font-display text-xl font-bold">{water < 98 ? "MORE ⬆" : water > 102 ? "LESS ⬇" : "normal"}</div></div>
              <div className="rounded-xl bg-surface-2 p-3"><div className="text-xs text-muted">Urine</div><div className="font-display text-xl font-bold">{water < 98 ? "little, dark" : water > 102 ? "lots, pale" : "normal"}</div></div>
            </div>
            <Explain colour="var(--t-body)">Receptors in the <strong>hypothalamus</strong> detect the water level of the blood. If it is low, the pituitary releases <strong>more ADH</strong>: the walls of the <strong>collecting ducts and DCT</strong> become more permeable, more water is reabsorbed, and you pass a small amount of concentrated urine. If it is high, <strong>less ADH</strong> → less water reabsorbed → lots of dilute urine.</Explain>
          </div>
        </div>
      )}
    </WidgetFrame>
  );
}
