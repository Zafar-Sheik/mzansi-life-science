"use client";
import { Explain, useSaved, useToolUse } from "./sim-kit";
import { WidgetFrame } from "./widget-frame";

const SUBJECTS = ["Home Language", "First Additional Language", "Mathematics / Maths Literacy", "Life Sciences", "Elective 2", "Elective 3", "Life Orientation"] as const;

/** NSC achievement level (1–7) for a percentage – also the usual APS points. */
export const apsPoints = (pct: number) => (pct >= 80 ? 7 : pct >= 70 ? 6 : pct >= 60 ? 5 : pct >= 50 ? 4 : pct >= 40 ? 3 : pct >= 30 ? 2 : 1);

/**
 * APS calculator: type your marks and see your Admission Point Score (best six
 * subjects, Life Orientation excluded – the most common method) and the NSC
 * pass you are on track for. Marks stay on this device.
 */
export function ApsCalculator() {
  const touch = useToolUse();
  const [marks, setMarks] = useSaved<Record<string, number>>("aps", Object.fromEntries(SUBJECTS.map((s) => [s, 50])));
  const vals = SUBJECTS.map((s) => ({ s, pct: Math.max(0, Math.min(100, Number(marks[s] ?? 0))) }));
  const noLO = vals.filter((v) => v.s !== "Life Orientation");
  const aps = noLO.map((v) => apsPoints(v.pct)).sort((a, b) => b - a).slice(0, 6).reduce((a, b) => a + b, 0);
  const hl = vals[0].pct;
  const others = noLO.slice(1).map((v) => v.pct).sort((a, b) => b - a);
  const bachelor = hl >= 40 && others.filter((p) => p >= 50).length >= 4 && others.every((p) => p >= 30);
  const diploma = hl >= 40 && others.filter((p) => p >= 40).length >= 4 && others.every((p) => p >= 30);
  const higher = hl >= 40 && others.filter((p) => p >= 40).length >= 2 && others.filter((p) => p >= 30).length >= 5;
  const pass = bachelor ? "Bachelor's pass (degree studies)" : diploma ? "Diploma pass" : higher ? "Higher Certificate pass" : "Not yet a pass – keep pushing!";

  return (
    <WidgetFrame title="APS calculator" colour="var(--t-career)" instruction="Type your latest marks (%). Your marks are saved only on this device.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          {vals.map(({ s, pct }) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <span className="min-w-0 flex-1 font-semibold">{s}</span>
              <input type="number" inputMode="numeric" min={0} max={100} value={marks[s] ?? 0} onChange={(e) => { touch(); setMarks((m) => ({ ...m, [s]: Number(e.target.value) })); }} className="w-20 rounded-lg border-2 border-line bg-bg px-2 py-1 text-right font-mono outline-none focus:border-career" aria-label={`${s} percentage`} />
              <span className="w-8 rounded bg-surface-2 text-center font-mono text-xs font-bold" title="APS points / NSC level">{s === "Life Orientation" ? "–" : apsPoints(pct)}</span>
            </label>
          ))}
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl bg-career/10 p-4 text-center">
            <div className="text-sm text-muted">Your APS (best 6, no LO)</div>
            <div className="font-display text-5xl font-bold text-career">{aps}</div>
            <div className="text-xs text-muted">out of 42</div>
          </div>
          <div className="rounded-2xl bg-surface-2 p-4 text-sm"><div className="text-xs text-muted">On track for</div><div className="font-display text-lg font-bold">{pass}</div></div>
          <Explain colour="var(--t-career)">Each subject earns points from its NSC level: 80–100% = 7, 70–79% = 6, 60–69% = 5, 50–59% = 4, 40–49% = 3, 30–39% = 2. Many universities add up your best six subjects without Life Orientation, but <strong>every university calculates APS a little differently</strong> and many courses also need minimum marks in specific subjects (e.g. Life Sciences and Mathematics for health sciences). The pass levels shown are a simplified guide to the NSC rules – check with your school.</Explain>
        </div>
      </div>
    </WidgetFrame>
  );
}
