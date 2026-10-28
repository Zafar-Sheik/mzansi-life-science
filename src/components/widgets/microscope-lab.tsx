"use client";
import { useState } from "react";
import { Explain, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

const za = (n: number, dp = 2) => String(Number(n.toFixed(dp))).replace(".", ",");

/**
 * Microscope and magnification lab: change the eyepiece and objective lenses
 * and watch the view, then use the calculator to go between image size,
 * actual size and magnification (with mm ↔ µm conversion).
 */
export function MicroscopeLab() {
  const touch = useToolUse();
  const [eye, setEye] = useState<"10" | "15">("10");
  const [obj, setObj] = useState<"4" | "10" | "40">("10");
  const [specimen, setSpecimen] = useState<"onion" | "cheek" | "blood">("onion");
  const [image, setImage] = useState(30);
  const [mag, setMag] = useState(400);
  const total = Number(eye) * Number(obj);
  const scale = total / 100; // how big things look
  const actualUm = (image * 1000) / mag;
  const cellSize = { onion: 200, cheek: 60, blood: 8 }[specimen]; // µm
  const field = Math.round(2000 / (total / 40)); // field-of-view diameter in µm (×40 total = 2 mm)

  const cells = Array.from({ length: 30 }, (_, i) => ({ x: (i % 6) * 80 + (Math.floor(i / 6) % 2) * 40 - 40, y: Math.floor(i / 6) * 50 - 20 }));

  return (
    <WidgetFrame title="Microscope & magnification" colour="var(--t-skills)" instruction="Change the lenses and see the view. Then calculate actual sizes like the exam asks.">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Segmented colour="var(--t-skills)" value={specimen} onChange={(v) => { touch(); setSpecimen(v); }} options={[{ id: "onion", label: "Onion skin" }, { id: "cheek", label: "Cheek cells" }, { id: "blood", label: "Blood smear" }]} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold">Eyepiece</span><Segmented colour="var(--t-skills)" value={eye} onChange={(v) => { touch(); setEye(v); }} options={[{ id: "10", label: "×10" }, { id: "15", label: "×15" }]} />
            <span className="font-semibold">Objective</span><Segmented colour="var(--t-skills)" value={obj} onChange={(v) => { touch(); setObj(v); }} options={[{ id: "4", label: "×4" }, { id: "10", label: "×10" }, { id: "40", label: "×40" }]} />
          </div>
          <svg viewBox="0 0 240 240" className="diagram mx-auto mt-3 max-w-xs" role="img" aria-label={`Microscope view of ${specimen} at ×${total}`}>
            <defs><clipPath id="fov"><circle cx={120} cy={120} r={110} /></clipPath></defs>
            <circle cx={120} cy={120} r={112} fill="#fefce8" stroke="#334155" strokeWidth={4} />
            <g clipPath="url(#fov)">
              <g transform={`translate(120 120) scale(${(scale * cellSize) / 200}) translate(-120 -120)`}>
                {specimen === "onion" && cells.map((c, i) => <g key={i}><rect x={c.x} y={c.y} width={78} height={48} fill="#fef9c3" stroke="#a16207" strokeWidth={2} /><circle cx={c.x + 50} cy={c.y + 24} r={6} fill="#a16207" opacity={0.7} /></g>)}
                {specimen === "cheek" && cells.slice(0, 18).map((c, i) => <g key={i}><path d={`M${c.x + 10},${c.y + 20}c10,-25 50,-20 60,0s-10,35 -30,30s-40,-5 -30,-30z`} fill="#fce7f3" stroke="#be185d" strokeWidth={2} /><circle cx={c.x + 40} cy={c.y + 25} r={6} fill="#7e22ce" /></g>)}
                {specimen === "blood" && cells.flatMap((c, i) => [0, 1, 2].map((k) => <circle key={`${i}-${k}`} cx={c.x + k * 26} cy={c.y + (k % 2) * 20} r={10} fill="#fca5a5" stroke="#b91c1c" strokeWidth={2} />))}
              </g>
            </g>
          </svg>
          <p className="text-center text-sm">Total magnification = eyepiece × objective = {eye} × {obj} = <strong>×{total}</strong> · field of view ≈ {field >= 1000 ? `${za(field / 1000)} mm` : `${field} µm`}</p>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-bold">Size calculator</div>
          <Slider label="Size of the drawing / image (mm)" value={image} min={5} max={120} onChange={(v) => { touch(); setImage(v); }} colour="var(--t-skills)" />
          <Slider label="Magnification (×)" value={mag} min={40} max={2000} step={20} onChange={(v) => { touch(); setMag(v); }} colour="var(--t-skills)" />
          <div className="rounded-xl bg-surface-2 p-3 font-mono text-sm leading-7">
            <div>actual size = image size ÷ magnification</div>
            <div>= {image} mm ÷ {mag}</div>
            <div>= {za(image / mag, 4)} mm</div>
            <div>= <strong>{za(actualUm, 1)} µm</strong> <span className="font-sans text-xs text-muted">(× 1 000)</span></div>
          </div>
          <Explain colour="var(--t-skills)">
            <strong>1 mm = 1 000 µm.</strong> Always change both sizes to the <em>same unit</em> before dividing. Magnification has <strong>no unit</strong> (write ×400). Rearrange the triangle: image = actual × magnification; magnification = image ÷ actual. The higher the magnification, the smaller the field of view.
          </Explain>
        </div>
      </div>
    </WidgetFrame>
  );
}
