"use client";
import { useState } from "react";
import { Explain, useToolUse } from "./sim-kit";
import { Segmented, Slider, WidgetFrame } from "./widget-frame";

type Mode = "accommodation" | "pupil" | "defects";
type Defect = "normal" | "myopia" | "hypermetropia" | "astigmatism" | "cataract";

/**
 * The eye in action: accommodation (near and far objects), the pupillary
 * mechanism (bright and dim light) and the common eye defects with their
 * corrections. Light rays are traced as the sliders change.
 */
export function EyeLab({ mode: initial = "accommodation" }: { mode?: Mode }) {
  const touch = useToolUse();
  const [mode, setMode] = useState<Mode>(initial);
  const [distance, setDistance] = useState(100); // cm: 20 = near, 600 = far
  const [light, setLight] = useState(50);
  const [defect, setDefect] = useState<Defect>("normal");
  const [corrected, setCorrected] = useState(false);
  const near = mode === "accommodation" ? distance < 600 : defect === "hypermetropia";
  const fat = mode === "accommodation" ? Math.max(0, 1 - (distance - 20) / 580) : 0.5; // 1 = very convex
  const lensRx = 8 + fat * 9;
  const pupil = mode === "pupil" ? 4 + (1 - light / 100) * 20 : 14;
  // Where the rays meet (x) – on the retina at 330 when focused.
  let focus = 330;
  if (mode === "defects" && !corrected) focus = defect === "myopia" ? 300 : defect === "hypermetropia" ? 365 : 330;
  const blur = mode === "defects" && !corrected && (defect === "astigmatism" || defect === "cataract");

  return (
    <WidgetFrame title="The eye in action" colour="var(--t-body)" instruction="Move the object, change the light, or choose an eye defect – watch the lens, iris and light rays.">
      <Segmented colour="var(--t-body)" value={mode} onChange={(m) => { touch(); setMode(m); setCorrected(false); }} options={[{ id: "accommodation", label: "Accommodation" }, { id: "pupil", label: "Pupil (iris)" }, { id: "defects", label: "Eye defects" }]} />
      <div className="mt-3">
        {mode === "accommodation" && <Slider label="Distance of the object" value={distance} min={20} max={600} step={10} onChange={(v) => { touch(); setDistance(v); }} colour="var(--t-body)" format={(v) => (v >= 600 ? "6 m or more (far)" : `${v} cm`)} />}
        {mode === "pupil" && <Slider label="Brightness of the light" value={light} min={0} max={100} onChange={(v) => { touch(); setLight(v); }} colour="var(--t-body)" format={(v) => (v > 70 ? "bright" : v < 30 ? "dim" : "medium")} />}
        {mode === "defects" && (
          <div className="flex flex-wrap items-center gap-2">
            <Segmented colour="var(--t-body)" value={defect} onChange={(d) => { touch(); setDefect(d); setCorrected(false); }} options={[{ id: "normal", label: "Normal" }, { id: "myopia", label: "Short-sighted" }, { id: "hypermetropia", label: "Long-sighted" }, { id: "astigmatism", label: "Astigmatism" }, { id: "cataract", label: "Cataract" }]} />
            {defect !== "normal" && <button onClick={() => setCorrected((c) => !c)} aria-pressed={corrected} className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold">{corrected ? "✓ Corrected" : "Correct it"}</button>}
          </div>
        )}
      </div>
      <svg viewBox="0 0 400 220" className="diagram mx-auto mt-3 max-w-2xl rounded-2xl border border-line bg-bg" role="img" aria-label="Diagram of light rays entering the eye through the lens and focusing on the retina">
        <circle cx={250} cy={110} r={82} style={{ fill: "color-mix(in oklab, #38bdf8 8%, var(--surface))", stroke: "var(--text-muted)" }} strokeWidth={2} />
        <path d="M291,39A82,82 0 0,1 291,181" fill="none" stroke="#fb923c" strokeWidth={5} />
        {/* ciliary muscles and ligaments */}
        <ellipse cx={196} cy={110 - 52} rx={6} ry={9} fill="#a855f7" />
        <ellipse cx={196} cy={110 + 52} rx={6} ry={9} fill="#a855f7" />
        <line x1={199} y1={110 - 45} x2={204} y2={110 - 38 + fat * 6} stroke="#475569" strokeWidth={fat > 0.6 ? 1 : 2.4} strokeDasharray={fat > 0.6 ? "2 2" : undefined} />
        <line x1={199} y1={110 + 45} x2={204} y2={110 + 38 - fat * 6} stroke="#475569" strokeWidth={fat > 0.6 ? 1 : 2.4} strokeDasharray={fat > 0.6 ? "2 2" : undefined} />
        {/* iris */}
        <rect x={188} y={110 - 46} width={6} height={46 - pupil} fill="#1d4ed8" />
        <rect x={188} y={110 + pupil} width={6} height={46 - pupil} fill="#1d4ed8" />
        {/* lens */}
        <ellipse cx={206} cy={110} rx={lensRx} ry={34} fill={mode === "defects" && defect === "cataract" && !corrected ? "#d6d3d1" : "#bae6fd"} stroke="#0284c7" />
        {/* object and rays */}
        <text x={near && mode !== "pupil" ? 60 : 12} y={114} fontSize={20} aria-hidden>{mode === "pupil" ? (light > 50 ? "☀️" : "🌙") : "🌳"}</text>
        {[-pupil + 2, 0, pupil - 2].map((dy, i) => {
          const sx = near && mode !== "pupil" ? 80 : 30;
          const sy = 110 + (near ? dy * 1.5 : dy);
          const off = blur ? (i - 1) * 8 : 0;
          const pts = focus < 330
            ? `${sx},${sy} 206,${110 + dy} ${focus},${110 + off} 330,${110 + off - (dy * (330 - focus)) / (focus - 206)}`
            : `${sx},${sy} 206,${110 + dy} 330,${110 + off + dy * (1 - 124 / (focus - 206))}`;
          return <polyline key={i} points={pts} fill="none" stroke="#f59e0b" strokeWidth={1.6} opacity={0.4 + light / 170} />;
        })}
        {mode === "defects" && corrected && (defect === "myopia" || defect === "hypermetropia") && <path d={defect === "myopia" ? "M150,70C140,90 140,130 150,150L158,150C150,130 150,90 158,70Z" : "M150,70C160,90 160,130 150,150L144,150C152,130 152,90 144,70Z"} fill="#a5f3fc" stroke="#0e7490" />}
        <text x={330} y={205} textAnchor="middle" fontSize={10} className="muted">retina</text>
        <text x={206} y={205} textAnchor="middle" fontSize={10} className="muted">lens</text>
      </svg>
      <Explain colour="var(--t-body)">
        {mode === "accommodation" && (distance < 600
          ? <><strong>Near object:</strong> ciliary muscles <strong>contract</strong> → suspensory ligaments <strong>slacken</strong> → the lens becomes <strong>more convex (rounder)</strong> → light is refracted more and focused on the retina.</>
          : <><strong>Distant object:</strong> ciliary muscles <strong>relax</strong> → suspensory ligaments become <strong>taut (tight)</strong> → the lens is pulled <strong>flatter (less convex)</strong> → light is refracted less and focused on the retina.</>)}
        {mode === "pupil" && (light > 50
          ? <><strong>Bright light:</strong> the <strong>circular muscles</strong> of the iris contract and the radial muscles relax → the pupil <strong>gets smaller (constricts)</strong> → less light enters, protecting the retina.</>
          : <><strong>Dim light:</strong> the <strong>radial muscles</strong> of the iris contract and the circular muscles relax → the pupil <strong>dilates (widens)</strong> → more light enters so you can see.</>)}
        {mode === "defects" && ({
          normal: <>A normal eye focuses the image exactly on the retina.</>,
          myopia: corrected ? <>A <strong>concave (diverging) lens</strong> spreads the rays slightly so they focus on the retina.</> : <><strong>Short-sightedness (myopia):</strong> the eyeball is too long or the lens too convex, so distant objects focus <strong>in front of the retina</strong> and look blurred.</>,
          hypermetropia: corrected ? <>A <strong>convex (converging) lens</strong> bends the rays more so they focus on the retina.</> : <><strong>Long-sightedness (hypermetropia):</strong> the eyeball is too short or the lens too flat, so near objects focus <strong>behind the retina</strong>.</>,
          astigmatism: corrected ? <>Glasses with <strong>cylindrical lenses</strong> correct the uneven curve.</> : <><strong>Astigmatism:</strong> the cornea or lens is unevenly curved, so parts of the image are blurred.</>,
          cataract: corrected ? <>An operation replaces the cloudy lens with an artificial lens – a common, quick operation at state hospitals.</> : <><strong>Cataract:</strong> the lens becomes cloudy, so less light reaches the retina and vision is blurred. Common in older people and linked to diabetes and sunlight.</>,
        } as Record<Defect, React.ReactNode>)[defect]}
      </Explain>
    </WidgetFrame>
  );
}
