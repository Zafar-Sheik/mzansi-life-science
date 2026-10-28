"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { celebrate, Explain, useToolUse } from "./sim-kit";
import { Segmented, WidgetFrame } from "./widget-frame";

type Group = "starch" | "veg" | "legumes" | "protein" | "dairy" | "extra";
const GROUPS: Record<Group, { name: string; colour: string; why: string }> = {
  starch: { name: "Starchy foods", colour: "#f59e0b", why: "Energy (carbohydrates). Choose whole-grain or unrefined where you can." },
  veg: { name: "Vegetables & fruit", colour: "#16a34a", why: "Vitamins, minerals and fibre. Aim for half your plate." },
  legumes: { name: "Beans, lentils, peas & soya", colour: "#a16207", why: "Cheap protein and fibre – eat them regularly." },
  protein: { name: "Chicken, fish, meat & eggs", colour: "#dc2626", why: "Protein for growth and repair, plus iron." },
  dairy: { name: "Milk, maas & yoghurt", colour: "#0ea5e9", why: "Calcium for bones and teeth, and protein." },
  extra: { name: "Use sparingly", colour: "#6b7280", why: "Sugar, salt, fats and processed foods – small amounts only." },
};

const FOODS: { name: string; emoji: string; group: Group; cost: 1 | 2 | 3 }[] = [
  { name: "Maize meal (pap)", emoji: "🌽", group: "starch", cost: 1 }, { name: "Brown bread", emoji: "🍞", group: "starch", cost: 1 }, { name: "Rice", emoji: "🍚", group: "starch", cost: 1 },
  { name: "Potatoes", emoji: "🥔", group: "starch", cost: 1 }, { name: "Samp", emoji: "🫘", group: "starch", cost: 1 },
  { name: "Cabbage", emoji: "🥬", group: "veg", cost: 1 }, { name: "Spinach / morogo", emoji: "🌿", group: "veg", cost: 1 }, { name: "Carrots", emoji: "🥕", group: "veg", cost: 1 },
  { name: "Butternut", emoji: "🎃", group: "veg", cost: 1 }, { name: "Tomato & onion relish", emoji: "🍅", group: "veg", cost: 1 }, { name: "Banana", emoji: "🍌", group: "veg", cost: 1 }, { name: "Orange", emoji: "🍊", group: "veg", cost: 1 },
  { name: "Sugar beans", emoji: "🫘", group: "legumes", cost: 1 }, { name: "Lentils", emoji: "🥣", group: "legumes", cost: 1 }, { name: "Soya mince", emoji: "🥘", group: "legumes", cost: 1 }, { name: "Peanut butter", emoji: "🥜", group: "legumes", cost: 2 },
  { name: "Eggs", emoji: "🥚", group: "protein", cost: 2 }, { name: "Tinned pilchards", emoji: "🐟", group: "protein", cost: 2 }, { name: "Chicken", emoji: "🍗", group: "protein", cost: 2 }, { name: "Beef stew", emoji: "🥩", group: "protein", cost: 3 },
  { name: "Maas / amasi", emoji: "🥛", group: "dairy", cost: 2 }, { name: "Milk", emoji: "🥛", group: "dairy", cost: 2 }, { name: "Plain yoghurt", emoji: "🍶", group: "dairy", cost: 2 },
  { name: "Fizzy cooldrink", emoji: "🥤", group: "extra", cost: 2 }, { name: "Chips (crisps)", emoji: "🍟", group: "extra", cost: 2 }, { name: "Vienna sausages", emoji: "🌭", group: "extra", cost: 2 }, { name: "Fried vetkoek", emoji: "🍩", group: "extra", cost: 1 },
];

const LABELS = [
  { name: "Cola cooldrink (330 ml can)", serve: 330, per100: { energy: 180, sugar: 10.6, fat: 0, salt: 0.02 } },
  { name: "Breakfast cereal (40 g)", serve: 40, per100: { energy: 1600, sugar: 30, fat: 2, salt: 1.1 } },
  { name: "Plain oats (40 g)", serve: 40, per100: { energy: 1550, sugar: 1, fat: 7, salt: 0.01 } },
  { name: "Potato chips (36 g packet)", serve: 36, per100: { energy: 2200, sugar: 1, fat: 33, salt: 1.6 } },
  { name: "Flavoured yoghurt (175 g)", serve: 175, per100: { energy: 400, sugar: 12, fat: 2.5, salt: 0.1 } },
  { name: "Tinned pilchards in tomato sauce (100 g)", serve: 100, per100: { energy: 700, sugar: 2, fat: 9, salt: 1.2 } },
];
/** UK-style traffic-light cut-offs per 100 g (widely used to judge labels). */
const LIGHT = { sugar: [5, 22.5], fat: [3, 17.5], salt: [0.3, 1.5] } as const;
const light = (k: keyof typeof LIGHT, v: number) => (v <= LIGHT[k][0] ? "low" : v > LIGHT[k][1] ? "high" : "medium");
const LCOL = { low: "#16a34a", medium: "#f59e0b", high: "#dc2626" };

/**
 * Eat well on a budget: build a plate from everyday South African foods and get
 * feedback on balance and cost – or decode a food label with traffic lights
 * and teaspoons of sugar.
 */
export function PlateBuilder({ mode: initial = "plate" }: { mode?: "plate" | "label" }) {
  const touch = useToolUse();
  const [mode, setMode] = useState(initial);
  const [plate, setPlate] = useState<string[]>([]);
  const [label, setLabel] = useState(0);
  const items = FOODS.filter((f) => plate.includes(f.name));
  const has = (g: Group) => items.some((f) => f.group === g);
  const cost = items.reduce((s, f) => s + f.cost, 0);
  const extras = items.filter((f) => f.group === "extra").length;
  const score = [has("starch"), has("veg") && items.filter((f) => f.group === "veg").length >= 2, has("legumes") || has("protein"), extras === 0, cost <= 8].filter(Boolean).length;
  const add = (name: string) => {
    touch();
    setPlate((p) => {
      const next = p.includes(name) ? p.filter((x) => x !== name) : p.length >= 7 ? p : [...p, name];
      return next;
    });
  };
  const L = LABELS[label];
  const serve = (v: number) => (v * L.serve) / 100;

  return (
    <WidgetFrame title="Eat well, spend less" colour="var(--t-daily)" instruction={mode === "plate" ? "Tap foods to put them on your plate (up to 7). Aim for a balanced, affordable meal." : "Pick a product and read its label like a nutritionist."}>
      <Segmented colour="var(--t-daily)" value={mode} onChange={(m) => { touch(); setMode(m); }} options={[{ id: "plate", label: "Build a plate" }, { id: "label", label: "Decode a food label" }]} />
      {mode === "plate" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            {(Object.keys(GROUPS) as Group[]).map((g) => (
              <div key={g} className="mb-2">
                <div className="text-xs font-bold" style={{ color: GROUPS[g].colour }}>{GROUPS[g].name}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {FOODS.filter((f) => f.group === g).map((f) => (
                    <button key={f.name} onClick={() => add(f.name)} aria-pressed={plate.includes(f.name)} className={cn("rounded-full border-2 px-2.5 py-1 text-xs font-semibold transition", plate.includes(f.name) ? "text-white" : "border-line hover:border-daily/50")} style={plate.includes(f.name) ? { background: GROUPS[g].colour, borderColor: GROUPS[g].colour } : undefined}>
                      {f.emoji} {f.name} <span className="opacity-70">{"R".repeat(f.cost)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <svg viewBox="0 0 200 200" className="mx-auto max-w-[220px]" role="img" aria-label={`Your plate: ${items.map((f) => f.name).join(", ") || "empty"}`}>
              <circle cx={100} cy={100} r={92} style={{ fill: "var(--surface-2)", stroke: "var(--border)" }} strokeWidth={4} />
              <path d="M100,100L100,8A92,92 0 0,0 100,192Z" fill="#16a34a" opacity={has("veg") ? 0.35 : 0.08} />
              <path d="M100,100L192,100A92,92 0 0,0 100,8Z" fill="#f59e0b" opacity={has("starch") ? 0.35 : 0.08} />
              <path d="M100,100L100,192A92,92 0 0,0 192,100Z" fill="#dc2626" opacity={has("protein") || has("legumes") ? 0.35 : 0.08} />
              <text x={55} y={104} textAnchor="middle" fontSize={9} className="muted">½ veg & fruit</text>
              <text x={146} y={60} textAnchor="middle" fontSize={9} className="muted">¼ starch</text>
              <text x={146} y={150} textAnchor="middle" fontSize={9} className="muted">¼ protein</text>
              {items.map((f, i) => <text key={f.name} x={60 + (i % 3) * 40} y={70 + Math.floor(i / 3) * 40} fontSize={24} textAnchor="middle">{f.emoji}</text>)}
            </svg>
            <div className="mt-2 text-center"><span className="text-2xl">{"⭐".repeat(score)}{"☆".repeat(5 - score)}</span><div className="text-xs text-muted">Cost: {"R".repeat(Math.min(cost, 12)) || "–"} {cost > 8 && "(pricey – swap meat for beans, eggs or pilchards)"}</div></div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>{has("starch") ? "✅" : "⬜"} A starchy food for energy</li>
              <li>{items.filter((f) => f.group === "veg").length >= 2 ? "✅" : "⬜"} At least two vegetables or fruit</li>
              <li>{has("legumes") || has("protein") ? "✅" : "⬜"} Protein: beans, eggs, fish or chicken</li>
              <li>{extras === 0 ? "✅" : "⚠️"} No sugary, salty or fried extras {extras > 0 && `(${extras})`}</li>
              <li>{cost <= 8 ? "✅" : "⚠️"} Affordable</li>
            </ul>
            {score === 5 && items.length >= 4 && <Button size="sm" className="mt-2" onClick={() => celebrate()}>🎉 Perfect plate!</Button>}
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setPlate([])}><RotateCcw className="h-4 w-4" /> Clear plate</Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <select value={label} onChange={(e) => { touch(); setLabel(Number(e.target.value)); }} className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm" aria-label="Choose a product">
              {LABELS.map((x, i) => <option key={x.name} value={i}>{x.name}</option>)}
            </select>
            <table className="mt-3 w-full border-2 border-fg text-sm">
              <caption className="border-2 border-b-0 border-fg bg-surface px-2 py-1 text-left font-display font-bold">Nutritional information</caption>
              <thead><tr className="border-b-2 border-fg"><th className="px-2 py-1 text-left">Typical values</th><th className="px-2 py-1 text-right">per 100 g/ml</th><th className="px-2 py-1 text-right">per serving</th></tr></thead>
              <tbody>
                <tr className="border-b border-line"><td className="px-2 py-1">Energy (kJ)</td><td className="px-2 py-1 text-right">{L.per100.energy}</td><td className="px-2 py-1 text-right">{Math.round(serve(L.per100.energy))}</td></tr>
                {(["sugar", "fat", "salt"] as const).map((k) => (
                  <tr key={k} className="border-b border-line"><td className="px-2 py-1 capitalize">{k === "sugar" ? "of which total sugar" : k === "salt" ? "Salt" : "Total fat"} (g)</td><td className="px-2 py-1 text-right">{String(L.per100[k]).replace(".", ",")}</td><td className="px-2 py-1 text-right">{String(Math.round(serve(L.per100[k]) * 10) / 10).replace(".", ",")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {(["sugar", "fat", "salt"] as const).map((k) => {
                const l = light(k, L.per100[k]);
                return <span key={k} className="rounded-full px-3 py-1 text-xs font-bold text-white capitalize" style={{ background: LCOL[l] }}>{k}: {l}</span>;
              })}
            </div>
            <div className="rounded-xl bg-surface-2 p-3 text-sm"><div className="text-xs text-muted">Sugar in one serving</div><div className="font-display text-2xl font-bold">{(serve(L.per100.sugar) / 4).toFixed(1).replace(".", ",")} teaspoons</div><div className="text-xs text-muted">{"🥄".repeat(Math.min(12, Math.round(serve(L.per100.sugar) / 4)))}</div></div>
            <div className="rounded-xl bg-surface-2 p-3 text-sm"><div className="text-xs text-muted">Energy in one serving</div><div className="font-display text-2xl font-bold">{Math.round(serve(L.per100.energy))} kJ</div><div className="text-xs text-muted">≈ {Math.round(serve(L.per100.energy) / 17)} minutes of brisk walking to use it up</div></div>
            <Explain colour="var(--t-daily)">Always compare <strong>per 100 g</strong> (fair comparison) – then check the <strong>serving size</strong>. Ingredients are listed from most to least. Lots of sugar and refined starch raises your risk of <strong>type 2 diabetes</strong> and tooth decay; too much salt raises <strong>blood pressure</strong>.</Explain>
          </div>
        </div>
      )}
    </WidgetFrame>
  );
}
