"use client";
import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { solvePuzzle } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Explain, useToolUse } from "./sim-kit";
import { WidgetFrame } from "./widget-frame";

interface Scenario {
  id: string;
  title: string;
  story: string;
  cards: { text: string; bucket: "Independent" | "Dependent" | "Controlled" }[];
  hypotheses: { text: string; ok: boolean; why: string }[];
  control: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "photo", title: "Light and photosynthesis",
    story: "Thandi puts pondweed in water 10, 20, 30, 40 and 50 cm from a lamp and counts the oxygen bubbles released per minute.",
    cards: [
      { text: "Distance from the lamp (light intensity)", bucket: "Independent" }, { text: "Number of bubbles per minute", bucket: "Dependent" },
      { text: "Temperature of the water", bucket: "Controlled" }, { text: "Amount of CO₂ (sodium bicarbonate) in the water", bucket: "Controlled" },
      { text: "Same piece of pondweed", bucket: "Controlled" }, { text: "Time allowed before counting", bucket: "Controlled" },
    ],
    hypotheses: [
      { text: "As the light intensity increases, the rate of photosynthesis increases.", ok: true, why: "It links the independent variable to the dependent variable and predicts a direction – it can be tested." },
      { text: "Plants need light.", ok: false, why: "True, but it doesn't predict how the dependent variable changes – it isn't testable in this investigation." },
      { text: "The number of bubbles will be 25.", ok: false, why: "A hypothesis predicts a relationship between the variables, not one exact number." },
    ],
    control: "Set up the same apparatus in the dark (or with a boiled, dead plant) to show that the bubbles come from photosynthesis.",
  },
  {
    id: "enzyme", title: "Temperature and an enzyme",
    story: "Sipho mixes starch with amylase in water baths at 10, 20, 37, 50 and 70 °C, and tests with iodine every minute to see how long the starch takes to disappear.",
    cards: [
      { text: "Temperature of the water bath", bucket: "Independent" }, { text: "Time taken for the starch to disappear", bucket: "Dependent" },
      { text: "Volume and concentration of amylase", bucket: "Controlled" }, { text: "Volume and concentration of starch", bucket: "Controlled" },
      { text: "pH of the mixture", bucket: "Controlled" }, { text: "Amount of iodine used in each test", bucket: "Controlled" },
    ],
    hypotheses: [
      { text: "Amylase digests starch fastest at 37 °C; at higher temperatures it becomes denatured and slower.", ok: true, why: "It names the variables and predicts a testable relationship (an optimum temperature)." },
      { text: "Enzymes are proteins.", ok: false, why: "A fact, not a prediction about the variables in this investigation." },
      { text: "Iodine turns blue-black with starch.", ok: false, why: "That's how the result is measured, not a hypothesis." },
    ],
    control: "A test tube with starch and water but NO amylase, at each temperature – to show that the amylase breaks down the starch.",
  },
  {
    id: "exercise", title: "Exercise and heart rate",
    story: "A class measures each learner's pulse after resting, after walking for 2 minutes and after running for 2 minutes.",
    cards: [
      { text: "Type (intensity) of exercise", bucket: "Independent" }, { text: "Pulse rate (beats per minute)", bucket: "Dependent" },
      { text: "Time spent exercising", bucket: "Controlled" }, { text: "Same method of taking the pulse (counted for 1 minute)", bucket: "Controlled" },
      { text: "Same group of learners", bucket: "Controlled" }, { text: "Time between exercising and measuring", bucket: "Controlled" },
    ],
    hypotheses: [
      { text: "The more strenuous the exercise, the higher the heart rate.", ok: true, why: "It predicts how the dependent variable changes with the independent variable." },
      { text: "Exercise is healthy.", ok: false, why: "An opinion – not something this investigation measures." },
      { text: "Learners will enjoy running more than walking.", ok: false, why: "Enjoyment isn't the dependent variable." },
    ],
    control: "The resting pulse rate is the control – it is the 'normal' value the others are compared with.",
  },
  {
    id: "fertiliser", title: "Fertiliser and bean plants",
    story: "Lerato grows 4 groups of 10 bean seedlings and waters them with 0, 5, 10 and 15 g of fertiliser per litre. After 3 weeks she measures their height.",
    cards: [
      { text: "Mass of fertiliser per litre", bucket: "Independent" }, { text: "Height of the seedlings after 3 weeks", bucket: "Dependent" },
      { text: "Volume of water given", bucket: "Controlled" }, { text: "Type of soil and size of pot", bucket: "Controlled" },
      { text: "Amount of light", bucket: "Controlled" }, { text: "Type (species) of bean", bucket: "Controlled" },
    ],
    hypotheses: [
      { text: "Bean seedlings watered with more fertiliser will grow taller.", ok: true, why: "Links the fertiliser (independent) to height (dependent) and is testable." },
      { text: "Fertiliser costs money.", ok: false, why: "Not related to the variables being measured." },
      { text: "Seeds need water to germinate.", ok: false, why: "True, but it's not what this investigation tests." },
    ],
    control: "The group with 0 g fertiliser is the control.",
  },
];

const BUCKETS = ["Independent", "Dependent", "Controlled"] as const;
const RV = [
  { text: "Repeat the investigation several times", kind: "Reliability" },
  { text: "Use a large sample (many plants / learners)", kind: "Reliability" },
  { text: "Calculate the average of the repeats", kind: "Reliability" },
  { text: "Keep all other variables constant", kind: "Validity" },
  { text: "Include a control", kind: "Validity" },
  { text: "Measure the right thing with suitable apparatus", kind: "Validity" },
] as const;

/**
 * Investigation planner: for a real-feeling investigation, sort the
 * variables, choose the best hypothesis, then sort the ways to make the
 * results reliable and the investigation valid. Ends with the control.
 */
export function InvestigationPlanner() {
  const touch = useToolUse();
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const s = SCENARIOS.find((x) => x.id === sid)!;
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [hyp, setHyp] = useState<number | null>(null);
  const [rv, setRv] = useState<Record<string, string>>({});
  const allPlaced = s.cards.every((c) => placed[c.text]);
  const right = s.cards.filter((c) => placed[c.text] === c.bucket).length;
  const rvDone = RV.every((x) => rv[x.text]);
  const rvRight = RV.filter((x) => rv[x.text] === x.kind).length;

  const reset = (id = sid) => { setSid(id); setPlaced({}); setSel(null); setChecked(false); setHyp(null); setRv({}); };
  const check = () => {
    setChecked(true);
    if (right === s.cards.length) solvePuzzle(`investigation:${s.id}`, 15);
  };

  return (
    <WidgetFrame title="Investigation planner" colour="var(--t-skills)" instruction="Pick an investigation and plan it like a scientist – the exact skills Section B asks about.">
      <div className="flex flex-wrap gap-1.5">
        {SCENARIOS.map((x) => <button key={x.id} onClick={() => reset(x.id)} aria-pressed={x.id === sid} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", x.id === sid ? "border-skills bg-skills text-white" : "border-line text-muted hover:text-fg")}>{x.title}</button>)}
      </div>
      <p className="mt-3 rounded-xl border-l-4 border-skills bg-skills/5 p-3 text-sm">{s.story}</p>

      <h4 className="mt-4 font-display font-bold">Step 1 · Sort the variables</h4>
      <p className="text-sm text-muted">Tap a card, then tap its group.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {s.cards.filter((c) => !placed[c.text]).map((c) => (
          <button key={c.text} onClick={() => { touch(); setSel(sel === c.text ? null : c.text); }} aria-pressed={sel === c.text} className={cn("rounded-xl border-2 px-3 py-1.5 text-sm", sel === c.text ? "border-skills bg-skills/10" : "border-line bg-surface-2")}>{c.text}</button>
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {BUCKETS.map((b) => (
          <div key={b} className="rounded-xl border-2 border-dashed border-line p-2">
            <button disabled={!sel || checked} onClick={() => { if (sel) { setPlaced((p) => ({ ...p, [sel]: b })); setSel(null); } }} className="w-full rounded-lg bg-surface-2 py-1 text-sm font-bold">{b} variable{b === "Controlled" ? "s" : ""}{sel && !checked ? " ←" : ""}</button>
            <ul className="mt-1 space-y-1">
              {s.cards.filter((c) => placed[c.text] === b).map((c) => (
                <li key={c.text}><button disabled={checked} onClick={() => setPlaced((p) => Object.fromEntries(Object.entries(p).filter(([k]) => k !== c.text)))} className={cn("w-full rounded-lg px-2 py-1 text-left text-xs", checked ? (c.bucket === b ? "bg-success/15" : "bg-danger/15") : "bg-surface hover:bg-surface-2")}>{c.text}{checked && c.bucket !== b && <strong> → {c.bucket}</strong>}</button></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {!checked ? <Button size="sm" onClick={check} disabled={!allPlaced}><Check className="h-4 w-4" /> Check</Button> : <Button size="sm" variant="ghost" onClick={() => { setPlaced({}); setChecked(false); }}><RotateCcw className="h-4 w-4" /> Try again</Button>}
        {checked && <span className="self-center text-sm font-semibold">{right}/{s.cards.length} correct</span>}
      </div>

      <h4 className="mt-5 font-display font-bold">Step 2 · Choose the best hypothesis</h4>
      <div className="mt-2 grid gap-2">
        {s.hypotheses.map((h, i) => (
          <button key={i} onClick={() => { touch(); setHyp(i); }} className={cn("rounded-xl border-2 px-3 py-2 text-left text-sm", hyp === i ? (h.ok ? "border-success bg-success/10" : "border-danger bg-danger/10") : "border-line hover:border-skills/50")}>
            {h.text}{hyp === i && <span className="mt-1 block text-xs text-muted">{h.ok ? "✅ " : "❌ "}{h.why}</span>}
          </button>
        ))}
      </div>

      <h4 className="mt-5 font-display font-bold">Step 3 · Reliable or valid?</h4>
      <p className="text-sm text-muted">Does each action make the <strong>results reliable</strong> (you&apos;d get the same results again) or the <strong>investigation valid</strong> (it really tests the hypothesis)?</p>
      <ul className="mt-2 space-y-1.5">
        {RV.map((x) => (
          <li key={x.text} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="min-w-0 flex-1">{x.text}</span>
            {(["Reliability", "Validity"] as const).map((k) => (
              <button key={k} onClick={() => { touch(); setRv((r) => ({ ...r, [x.text]: k })); }} aria-pressed={rv[x.text] === k}
                className={cn("rounded-lg border px-2 py-0.5 text-xs font-semibold", rv[x.text] === k ? (rvDone ? (x.kind === k ? "border-success bg-success/15" : "border-danger bg-danger/15") : "border-skills bg-skills/10") : "border-line text-muted")}>{k}</button>
            ))}
          </li>
        ))}
      </ul>
      {rvDone && <p className="mt-1 text-sm font-semibold">{rvRight}/{RV.length} correct</p>}

      <Explain colour="var(--t-skills)">
        <strong>The control:</strong> {s.control} <span className="mt-1 block">Independent = what you <em>change</em>. Dependent = what you <em>measure</em>. Controlled (fixed) = everything you keep the <em>same</em> so that it is a fair test.</span>
      </Explain>
    </WidgetFrame>
  );
}
