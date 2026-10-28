"use client";
import { useState } from "react";
import { solvePuzzle } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Explain, useToolUse } from "./sim-kit";
import { Toggle, WidgetFrame } from "./widget-frame";

type GraphType = "line" | "bar" | "histogram" | "pie";

interface Dataset {
  id: string;
  title: string;
  heading: string;
  x: string;
  y: string;
  type: GraphType;
  why: string;
  rows: [string, number][];
  yMax: number;
}

const DATA: Dataset[] = [
  { id: "enzyme", title: "Enzyme activity", heading: "The effect of temperature on the activity of amylase", x: "Temperature (°C)", y: "Starch digested (g/min)", type: "line", why: "Temperature is continuous (it can be any value in between), so draw a line graph and join the points with straight lines.", rows: [["10", 1], ["20", 2.5], ["30", 4], ["40", 5.5], ["50", 3], ["60", 0.5]], yMax: 6 },
  { id: "blood", title: "Blood groups", heading: "The number of learners in a class with each blood group", x: "Blood group", y: "Number of learners", type: "bar", why: "Blood groups are separate categories (discontinuous), so draw a bar graph with gaps between the bars.", rows: [["A", 11], ["B", 6], ["AB", 2], ["O", 15]], yMax: 16 },
  { id: "mass", title: "Learners' mass", heading: "The mass of the learners in a Grade 11 class", x: "Mass (kg)", y: "Number of learners", type: "histogram", why: "Mass is continuous data grouped into class intervals, so draw a histogram – the bars touch.", rows: [["40–49", 4], ["50–59", 11], ["60–69", 9], ["70–79", 5], ["80–89", 2]], yMax: 12 },
  { id: "land", title: "Land use", heading: "The percentage of land in a district used for different purposes", x: "Land use", y: "Percentage (%)", type: "pie", why: "The values are parts of a whole (they add up to 100%), so a pie chart shows them best.", rows: [["Farming", 55], ["Housing", 20], ["Nature reserve", 15], ["Mining", 10]], yMax: 60 },
];

const ITEMS = [
  { id: "type", label: "Correct type of graph" },
  { id: "heading", label: "Heading that names both variables" },
  { id: "x", label: "X-axis: label and unit (independent variable)" },
  { id: "y", label: "Y-axis: label and unit (dependent variable)" },
  { id: "scale", label: "Correct, even scale on both axes" },
  { id: "plot", label: "All values plotted correctly" },
] as const;
type Item = (typeof ITEMS)[number]["id"];
const PIE = ["#16a34a", "#f59e0b", "#2563eb", "#db2777"];

/**
 * Graph lab: choose the right graph for the data, then switch the parts of a
 * graph on and off to see what the 6-mark NSC graph rubric looks for.
 */
export function GraphLab() {
  const touch = useToolUse();
  const [did, setDid] = useState(DATA[0].id);
  const d = DATA.find((x) => x.id === did)!;
  const [choice, setChoice] = useState<GraphType | null>(null);
  const [on, setOn] = useState<Record<Item, boolean>>({ type: true, heading: false, x: false, y: false, scale: false, plot: false });
  const marks = ITEMS.filter((i) => on[i.id]).length;
  const type = on.type ? d.type : d.type === "line" ? "bar" : "line";
  const W = 400;
  const H = 240;
  const L = 50;
  const B = 40;
  const T = 30;
  const n = d.rows.length;
  const sx = (i: number) => L + ((i + 0.5) / n) * (W - L - 15);
  const sy = (v: number) => H - B - (v / d.yMax) * (H - B - T) * (on.scale ? 1 : v > d.yMax / 2 ? 0.8 : 1.1);

  const choose = (t: GraphType) => {
    touch();
    setChoice(t);
    if (t === d.type) solvePuzzle(`graph-type:${d.id}`, 5);
  };

  return (
    <WidgetFrame title="Graph lab: the 6-mark graph" colour="var(--t-skills)" instruction="Choose the right type of graph, then switch each part on to earn the marks.">
      <div className="flex flex-wrap gap-1.5">
        {DATA.map((x) => <button key={x.id} onClick={() => { setDid(x.id); setChoice(null); }} aria-pressed={x.id === did} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", x.id === did ? "border-skills bg-skills text-white" : "border-line text-muted hover:text-fg")}>{x.title}</button>)}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <table className="w-full border-collapse text-sm">
            <caption className="pb-1 text-left text-xs font-bold text-muted">{d.heading}</caption>
            <thead><tr><th className="border border-line bg-surface-2 px-2 py-1 text-left">{d.x}</th><th className="border border-line bg-surface-2 px-2 py-1 text-left">{d.y}</th></tr></thead>
            <tbody>{d.rows.map(([a, b]) => <tr key={a}><td className="border border-line px-2 py-1">{a}</td><td className="border border-line px-2 py-1">{String(b).replace(".", ",")}</td></tr>)}</tbody>
          </table>
          <div className="mt-3 text-sm font-semibold">Which type of graph?</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {(["line", "bar", "histogram", "pie"] as const).map((t) => (
              <button key={t} onClick={() => choose(t)} className={cn("rounded-lg border-2 px-2.5 py-1 text-sm capitalize", choice === t ? (t === d.type ? "border-success bg-success/10" : "border-danger bg-danger/10") : "border-line")}>{t === "pie" ? "pie chart" : `${t} graph`.replace("histogram graph", "histogram")}</button>
            ))}
          </div>
          {choice && <p className="mt-2 text-sm">{choice === d.type ? "✅ " : "❌ "}{d.why}</p>}
          <div className="mt-3 space-y-1">
            {ITEMS.map((i) => <div key={i.id}><Toggle on={on[i.id]} onChange={(v) => { touch(); setOn((o) => ({ ...o, [i.id]: v })); }}>{i.label}</Toggle></div>)}
          </div>
        </div>
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="diagram rounded-xl border border-line bg-bg" role="img" aria-label={`${type} graph preview, ${marks} of 6 rubric marks`}>
            {on.heading && <text x={W / 2} y={16} textAnchor="middle" fontSize={11} fontWeight={700}>{type === "pie" ? d.heading : `${d.heading}`}</text>}
            {type === "pie" ? (() => {
              let a0 = -Math.PI / 2;
              return d.rows.map(([label, v], i) => {
                const a1 = a0 + (v / 100) * Math.PI * 2;
                const p = (a: number, r: number) => `${200 + r * Math.cos(a)},${130 + r * Math.sin(a)}`;
                const path = `M200,130L${p(a0, 80)}A80,80 0 ${a1 - a0 > Math.PI ? 1 : 0},1 ${p(a1, 80)}Z`;
                const mid = (a0 + a1) / 2;
                a0 = a1;
                return <g key={label}><path d={path} fill={PIE[i]} opacity={on.plot ? 1 : 0.5} stroke="white" />{on.x && <text x={200 + 100 * Math.cos(mid)} y={130 + 100 * Math.sin(mid)} textAnchor="middle" fontSize={10}>{label} {on.y ? `${v}%` : ""}</text>}</g>;
              });
            })() : (
              <>
                <line className="axis" x1={L} y1={H - B} x2={W - 10} y2={H - B} />
                <line className="axis" x1={L} y1={T} x2={L} y2={H - B} />
                {[0, 0.25, 0.5, 0.75, 1].map((f, i) => <text key={i} className="tick" x={L - 5} y={H - B - f * (H - B - T) + 3} textAnchor="end">{on.scale ? String(f * d.yMax).replace(".", ",") : ["0", "1", "5", "6", "20"][i]}</text>)}
                {d.rows.map(([label], i) => <text key={label} className="tick" x={sx(i)} y={H - B + 13} textAnchor="middle">{label}</text>)}
                {on.x && <text x={(L + W) / 2} y={H - 6} textAnchor="middle" fontSize={11} fontWeight={600}>{d.x}</text>}
                {on.y && <text x={12} y={(T + H - B) / 2} textAnchor="middle" fontSize={11} fontWeight={600} transform={`rotate(-90 12 ${(T + H - B) / 2})`}>{d.y}</text>}
                {type === "line" ? (
                  <>
                    <polyline className="curve" points={d.rows.map(([, v], i) => `${sx(i)},${sy(on.plot ? v : v * 0.8 + 0.5)}`).join(" ")} stroke="var(--t-skills)" />
                    {d.rows.map(([, v], i) => <circle key={i} cx={sx(i)} cy={sy(on.plot ? v : v * 0.8 + 0.5)} r={3.5} fill="var(--t-skills)" />)}
                  </>
                ) : d.rows.map(([label, v], i) => {
                  const w = (W - L - 15) / n;
                  const gap = type === "histogram" ? 0 : w * 0.3;
                  const val = on.plot ? v : v * 0.8;
                  return <rect key={label} x={L + i * w + gap / 2} y={sy(val)} width={w - gap} height={H - B - sy(val)} fill="var(--t-skills)" opacity={0.8} stroke="var(--bg)" />;
                })}
              </>
            )}
          </svg>
          <div className="mt-2 flex items-center gap-2"><span className="font-display text-2xl font-bold">{marks}/6</span><span className="text-sm text-muted">rubric marks</span></div>
        </div>
      </div>
      <Explain colour="var(--t-skills)">The <strong>independent variable</strong> goes on the x-axis and the <strong>dependent variable</strong> on the y-axis. Use a scale that is even and uses more than half the grid. A line graph is for continuous data, a bar graph for separate categories (bars don&apos;t touch), a histogram for grouped continuous data (bars touch), and a pie chart for parts of a whole.</Explain>
    </WidgetFrame>
  );
}
