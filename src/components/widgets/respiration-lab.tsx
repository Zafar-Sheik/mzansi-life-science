"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Explain, useToolUse } from "./sim-kit";
import { Plot } from "./plot";
import { Segmented, Slider, Toggle, WidgetFrame } from "./widget-frame";

type Mode = "pathway" | "yeast" | "exercise";

const Box = ({ title, where, on, colour, children }: { title: string; where: string; on: boolean; colour: string; children?: React.ReactNode }) => (
  <div className={cn("rounded-xl border-2 p-2 text-center text-xs transition", on ? "opacity-100" : "opacity-30")} style={{ borderColor: colour, background: on ? `color-mix(in oklab, ${colour} 12%, transparent)` : undefined }}>
    <div className="font-bold">{title}</div>
    <div className="text-muted">{where}</div>
    {children}
  </div>
);

/** CO₂ from yeast after 30 minutes at a temperature (ml) – an enzyme curve with an optimum near 35 °C. */
const yeastCO2 = (t: number, sugar: boolean) => (sugar ? Math.max(0, t <= 35 ? 20 * (t / 35) ** 1.5 : 20 * (1 - (t - 35) / 20)) : 0.5);

/**
 * Cellular respiration: the aerobic and anaerobic pathways with their ATP
 * yield, a yeast fermentation experiment, and lactic acid and oxygen debt
 * during exercise.
 */
export function RespirationLab() {
  const touch = useToolUse();
  const [mode, setMode] = useState<Mode>("pathway");
  const [oxygen, setOxygen] = useState(true);
  const [cell, setCell] = useState<"muscle" | "yeast">("muscle");
  const [temp, setTemp] = useState(30);
  const [sugar, setSugar] = useState(true);
  const [effort, setEffort] = useState(40);
  const co2 = yeastCO2(temp, sugar);
  const anaerobicShare = Math.max(0, (effort - 55) / 45);
  const lactic = (t: number) => {
    // Lactic acid (arbitrary units) during 10 minutes of exercise, then 10 minutes of recovery.
    if (t <= 10) return 1 + anaerobicShare * 9 * (t / 10);
    return 1 + anaerobicShare * 9 * Math.exp(-(t - 10) / 3);
  };

  return (
    <WidgetFrame title="Cellular respiration lab" colour="var(--t-energy)" instruction="Glucose + oxygen → carbon dioxide + water + energy (ATP). What happens when there's no oxygen?">
      <Segmented colour="var(--t-energy)" value={mode} onChange={(m) => { touch(); setMode(m); }} options={[{ id: "pathway", label: "The pathway" }, { id: "yeast", label: "Yeast experiment" }, { id: "exercise", label: "Exercise & oxygen debt" }]} />

      {mode === "pathway" && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Toggle on={oxygen} onChange={(v) => { touch(); setOxygen(v); }}>Oxygen available</Toggle>
            {!oxygen && <Segmented colour="var(--t-energy)" value={cell} onChange={setCell} options={[{ id: "muscle", label: "Muscle cell" }, { id: "yeast", label: "Yeast cell" }]} />}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            <Box title="Glycolysis" where="cytoplasm" on colour="#f59e0b">glucose → 2 pyruvate<div className="mt-1 font-bold">+2 ATP</div></Box>
            <Box title="Krebs cycle" where="mitochondrial matrix" on={oxygen} colour="#ea580c">pyruvate → CO₂ + H⁺/e⁻<div className="mt-1 font-bold">+2 ATP</div></Box>
            <Box title="Oxidative phosphorylation" where="cristae (inner membrane)" on={oxygen} colour="#c2410c">O₂ accepts H → H₂O<div className="mt-1 font-bold">+32–34 ATP</div></Box>
            <Box title={cell === "yeast" ? "Alcoholic fermentation" : "Lactic acid fermentation"} where="cytoplasm" on={!oxygen} colour="#dc2626">{cell === "yeast" ? "pyruvate → ethanol + CO₂" : "pyruvate → lactic acid"}<div className="mt-1 font-bold">+0 ATP</div></Box>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-semibold">ATP per glucose:</span>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-energy transition-[width] duration-700" style={{ width: oxygen ? "100%" : "5.5%" }} /></div>
            <span className="font-mono font-bold">{oxygen ? "36–38" : "2"}</span>
          </div>
          <Explain colour="var(--t-energy)">
            {oxygen
              ? <><strong>Aerobic respiration</strong> uses oxygen and releases a lot of energy: about 36–38 ATP per glucose. Products: <strong>CO₂, water and ATP</strong>. Most of the ATP is made on the <strong>cristae</strong> – that is why active cells (muscle, sperm, liver) have many mitochondria.</>
              : cell === "yeast"
                ? <><strong>Anaerobic respiration in yeast</strong> (alcoholic fermentation): glucose → ethanol + CO₂ + 2 ATP. We use it to make bread (CO₂ makes the dough rise), umqombothi, wine and beer (ethanol).</>
                : <><strong>Anaerobic respiration in muscle</strong>: glucose → lactic acid + 2 ATP. Lactic acid causes muscle fatigue and cramps. It is used to make yoghurt, maas and amasi (by bacteria), and silage for cattle.</>}
          </Explain>
        </div>
      )}

      {mode === "yeast" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Slider label="Water-bath temperature (°C)" value={temp} min={0} max={60} onChange={(v) => { touch(); setTemp(v); }} colour="var(--t-energy)" />
            <Toggle on={sugar} onChange={setSugar}>Sugar added to the yeast</Toggle>
            <svg viewBox="0 0 300 170" className="diagram rounded-2xl border border-line bg-bg" role="img" aria-label={`Yeast flask at ${temp} °C producing ${co2.toFixed(1)} ml of carbon dioxide; the limewater is ${co2 > 8 ? "milky" : "clear"}`}>
              <ellipse cx={70} cy={45 - co2} rx={14 + co2} ry={16 + co2} fill="#fca5a5" opacity={0.85} />
              <path d="M55,150L85,150L82,90L58,90Z" fill="#fef3c7" stroke="#a16207" />
              <text x={70} y={130} textAnchor="middle" fontSize={10}>yeast</text>
              <path d="M85,100C140,100 150,80 190,80L190,110" fill="none" stroke="#64748b" strokeWidth={3} />
              <rect x={175} y={95} width={30} height={60} rx={4} fill={co2 > 8 ? "#e5e7eb" : "#ecfeff"} stroke="#0284c7" />
              {co2 > 8 && <circle cx={190} cy={130} r={10} fill="#fff" opacity={0.7} />}
              <text x={190} y={170} textAnchor="middle" fontSize={10} className="muted">limewater</text>
              <text x={250} y={70} textAnchor="middle" fontSize={20} fontWeight={800} style={{ fill: "var(--t-energy)" }}>{co2.toFixed(1).replace(".", ",")}</text>
              <text x={250} y={86} textAnchor="middle" fontSize={10} className="muted">ml CO₂ in 30 min</text>
            </svg>
          </div>
          <div>
            <Plot curves={[{ points: Array.from({ length: 31 }, (_, i) => [i * 2, yeastCO2(i * 2, sugar)] as [number, number]), colour: "var(--t-energy)" }]} marker={{ x: temp, y: co2 }} xMax={60} yMax={22} xLabel="Temperature (°C)" yLabel="CO₂ produced (ml)" title="CO₂ released by yeast in 30 minutes" />
            <Explain colour="var(--t-energy)">Yeast respires sugar and releases CO₂, which turns <strong>limewater milky</strong> (or bromothymol blue yellow). The rate rises with temperature up to an <strong>optimum (~35 °C)</strong> and then falls as the enzymes denature. Without sugar there is no substrate – this is the <strong>control</strong>.</Explain>
          </div>
        </div>
      )}

      {mode === "exercise" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Slider label="How hard you exercise (%)" value={effort} min={0} max={100} onChange={(v) => { touch(); setEffort(v); }} colour="var(--t-energy)" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-surface-2 p-3"><div className="text-xs text-muted">Breathing rate</div><div className="font-display text-2xl font-bold">{Math.round(14 + effort * 0.36)}</div><div className="text-xs text-muted">breaths/min</div></div>
              <div className="rounded-xl bg-surface-2 p-3"><div className="text-xs text-muted">Heart rate</div><div className="font-display text-2xl font-bold">{Math.round(70 + effort * 1.2)}</div><div className="text-xs text-muted">beats/min</div></div>
            </div>
          </div>
          <div>
            <Plot curves={[{ points: Array.from({ length: 41 }, (_, i) => [i / 2, lactic(i / 2)] as [number, number]), colour: "#dc2626" }]} xMax={20} yMax={11} xLabel="Time (min) – exercise stops at 10" yLabel="Lactic acid in blood" title="Lactic acid during and after exercise" />
            <Explain colour="var(--t-energy)">{anaerobicShare > 0 ? <>At this effort your muscles need ATP faster than oxygen can be delivered, so they also respire <strong>anaerobically</strong> and <strong>lactic acid</strong> builds up. After exercise you keep breathing fast to repay the <strong>oxygen debt</strong> – the oxygen needed to break down the lactic acid in the liver.</> : <>At this effort the heart and lungs deliver enough oxygen: respiration is <strong>aerobic</strong> and lactic acid stays low. Push the slider above about 55%.</>}</Explain>
          </div>
        </div>
      )}
    </WidgetFrame>
  );
}
