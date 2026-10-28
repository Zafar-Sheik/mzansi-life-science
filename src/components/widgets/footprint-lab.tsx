"use client";
import { useState } from "react";
import { Explain, useToolUse } from "./sim-kit";
import { Plot } from "./plot";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

/**
 * Water and carbon footprint calculator for a household, with the biggest
 * savings first. Figures are rounded estimates for South African homes
 * (e.g. coal-fired electricity ≈ 1 kg CO₂ per kWh).
 */
export function FootprintLab({ mode: initial = "water" }: { mode?: "water" | "carbon" }) {
  const touch = useToolUse();
  const [mode, setMode] = useState(initial);
  // Water (litres per person per day)
  const [shower, setShower] = useState(8);
  const [bath, setBath] = useState(0);
  const [flushes, setFlushes] = useState(5);
  const [tap, setTap] = useState(3);
  const [laundry, setLaundry] = useState(3);
  const [people, setPeople] = useState(4);
  const showerL = shower * 10;
  const bathL = (bath * 80) / 7;
  const flushL = flushes * 9;
  const tapL = tap * 6;
  const laundryL = (laundry * 80) / 7 / people;
  const water = Math.round(showerL + bathL + flushL + tapL + laundryL + 5);
  // Carbon (kg CO₂ per month for the household)
  const [kwh, setKwh] = useState(350);
  const [car, setCar] = useState(10);
  const [taxi, setTaxi] = useState(20);
  const [beef, setBeef] = useState(3);
  const [waste, setWaste] = useState(3);
  const elec = kwh * 1;
  const carCO2 = car * 30 * 0.18;
  const taxiCO2 = taxi * 30 * 0.05;
  const food = beef * 4.3 * 3;
  const wasteCO2 = waste * 4.3 * 2;
  const carbon = Math.round(elec + carCO2 + taxiCO2 + food + wasteCO2);

  return (
    <WidgetFrame title="Footprint calculator" colour="var(--t-eco)" instruction="Move the sliders to match your home. Which change saves the most?">
      <Segmented colour="var(--t-eco)" value={mode} onChange={(m) => { touch(); setMode(m); }} options={[{ id: "water", label: "Water footprint" }, { id: "carbon", label: "Carbon footprint" }]} />
      {mode === "water" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Slider label="Minutes in the shower per day" value={shower} min={0} max={20} onChange={(v) => { touch(); setShower(v); }} colour="var(--t-eco)" />
            <Slider label="Baths per week" value={bath} min={0} max={7} onChange={(v) => { touch(); setBath(v); }} colour="var(--t-eco)" />
            <Slider label="Toilet flushes per day" value={flushes} min={0} max={10} onChange={(v) => { touch(); setFlushes(v); }} colour="var(--t-eco)" />
            <Slider label="Minutes the tap runs (teeth, dishes)" value={tap} min={0} max={15} onChange={(v) => { touch(); setTap(v); }} colour="var(--t-eco)" />
            <Slider label="Washing-machine loads per week (household)" value={laundry} min={0} max={10} onChange={(v) => { touch(); setLaundry(v); }} colour="var(--t-eco)" />
            <Slider label="People in your home" value={people} min={1} max={10} onChange={(v) => { touch(); setPeople(v); }} colour="var(--t-eco)" />
          </div>
          <div>
            <div className="rounded-2xl bg-eco/10 p-4 text-center"><div className="text-sm text-muted">Your water use</div><div className="font-display text-5xl font-bold text-eco">{water}</div><div className="text-xs text-muted">litres per person per day (target during a drought: 50)</div></div>
            <Plot bars={[{ label: "Shower", value: showerL, colour: "#0ea5e9" }, { label: "Bath", value: bathL, colour: "#38bdf8" }, { label: "Toilet", value: flushL, colour: "#0369a1" }, { label: "Taps", value: tapL, colour: "#22d3ee" }, { label: "Laundry", value: laundryL, colour: "#67e8f9" }]} xMax={1} yMax={Math.max(40, Math.ceil(Math.max(showerL, bathL, flushL, tapL, laundryL) / 20) * 20)} xLabel="" yLabel="Litres per day" height={180} />
            <Explain colour="var(--t-eco)">South Africa is a <strong>water-scarce</strong> country. Biggest savers: a 2-minute shorter shower saves ~20 L a day; &quot;if it&apos;s yellow, let it mellow&quot; and a brick or bottle in the cistern save ~3 L a flush; close the tap while brushing; reuse bath, shower and laundry water (grey water) on the garden; fix leaking taps.</Explain>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Slider label="Electricity per month (kWh)" value={kwh} min={0} max={1000} step={10} onChange={(v) => { touch(); setKwh(v); }} colour="var(--t-eco)" />
            <Slider label="Kilometres by car per day" value={car} min={0} max={100} onChange={(v) => { touch(); setCar(v); }} colour="var(--t-eco)" />
            <Slider label="Kilometres by taxi or bus per day" value={taxi} min={0} max={100} onChange={(v) => { touch(); setTaxi(v); }} colour="var(--t-eco)" />
            <Slider label="Beef meals per week" value={beef} min={0} max={14} onChange={(v) => { touch(); setBeef(v); }} colour="var(--t-eco)" />
            <Slider label="Bags of rubbish to landfill per week" value={waste} min={0} max={10} onChange={(v) => { touch(); setWaste(v); }} colour="var(--t-eco)" />
          </div>
          <div>
            <div className="rounded-2xl bg-eco/10 p-4 text-center"><div className="text-sm text-muted">Household carbon footprint</div><div className="font-display text-5xl font-bold text-eco">{carbon}</div><div className="text-xs text-muted">kg CO₂ per month (rough estimate)</div></div>
            <Plot bars={[{ label: "Electricity", value: elec, colour: "#f59e0b" }, { label: "Car", value: carCO2, colour: "#dc2626" }, { label: "Taxi/bus", value: taxiCO2, colour: "#f97316" }, { label: "Beef", value: food, colour: "#a16207" }, { label: "Waste", value: wasteCO2, colour: "#6b7280" }]} xMax={1} yMax={Math.max(100, Math.ceil(Math.max(elec, carCO2, taxiCO2, food, wasteCO2) / 100) * 100)} xLabel="" yLabel="kg CO₂ / month" height={180} />
            <Explain colour="var(--t-eco)">Most of South Africa&apos;s electricity comes from burning <strong>coal</strong>, so saving electricity is the biggest cut you can make: switch off geysers and lights, use LED bulbs, cook with a lid or a wonder bag. Shared transport, less meat, and recycling or composting waste (which stops landfills making <strong>methane</strong>) all reduce the greenhouse gases that cause <strong>global warming</strong>.</Explain>
          </div>
        </div>
      )}
    </WidgetFrame>
  );
}
